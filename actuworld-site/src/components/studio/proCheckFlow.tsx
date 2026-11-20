import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { ProCheckTile } from '../asv/AsvTile';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { buildProCheck, type StudioCheckRequest } from '../../lib/studio/proCheck';
import {
  completeProCheck, loadProChecks, removeProCheck, saveProCheck, subscribeProChecks, type StoredProCheck,
} from '../../lib/studio/proCheckStore';
import type { ProAccess } from '../../lib/pro/types';
import type { PlanItemData } from '../../lib/studio/redaction';
import { StudioDialog } from './StudioDialog';

// Studio → ASV Pro : « vérifier avant de publier », le même parcours que dans
// l'app. Tout se passe dans l'éditeur : confirmation avec le quota du mois,
// analyse, puis le rapport par-dessus la page. On corrige ensuite dans
// l'éditeur, puis on envoie en brouillon ou on publie comme d'habitude. Rien
// n'est vérifié ni compté avant le clic de confirmation.
//
// 20/11/2026 (comme l'app) :
// - « Continuer en fond » ferme la fenêtre d'attente SANS annuler : la
//   vérification est partie et comptée, le Studio continue de la suivre et
//   prévient quand le rapport est prêt.
// - Le rapport est gardé dans le navigateur, rattaché à SON brouillon : fermer
//   le rapport, quitter la page ou recharger ne le perd pas. Le lien le rouvre
//   tant que le texte n'a pas changé, sinon il propose de revérifier (avec le
//   rapport précédent de ce brouillon). Une analyse en cours reprend au retour.

type Kind = 'post' | 'article';

const POLL_MS = 3000;
const POLL_MAX_MS = 4 * 60 * 1000;
/** Analyse lancée il y a plus longtemps, sans rapport : on ne la suit plus (elle reste dans ASV Pro). */
const RESUME_MAX_AGE_MS = 30 * 60 * 1000;
/** Rapport déjà prêt dès la première lecture (fini pendant qu'on était ailleurs) : pas de fenêtre. */
const QUICK_MS = 1500;

/** Fenêtre affichée. La vérification elle-même vit à part (`running`, `history`). */
type Phase =
  | { step: 'closed' }
  | { step: 'message'; text: string }
  | { step: 'confirm'; input: StudioCheckRequest; access: ProAccess | null; loadingAccess: boolean }
  | { step: 'running' }
  | { step: 'ready'; id: string }
  | { step: 'report'; id: string };

export type ProCheckStatus = 'idle' | 'running' | 'ready';

type Context = {
  /** Compte connecté : les rapports sont rangés avec lui. */
  userId: string | null | undefined;
  /** Brouillon serveur en cours, ou null (éditeur pas encore enregistré). */
  draftId: string | null;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Vérification du contenu en cours d'écriture. `isChecked()` dit si le contenu
 * tel qu'il est à l'écran a déjà un rapport (ou une analyse en cours).
 */
export function useProCheck(kind: Kind, getData: () => PlanItemData, { userId, draftId }: Context) {
  const { isEnglish } = useLanguage();
  const [phase, setPhase] = useState<Phase>({ step: 'closed' });
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [history, setHistory] = useState<StoredProCheck[]>([]);
  // Contenu de l'analyse en cours : « vérifié » pour la confirmation de publication.
  const runningKeyRef = useRef<string | null>(null);
  // Page quittée : le suivi s'arrête ici et reprend au retour. Fermer une
  // fenêtre ne l'arrête PAS.
  const runRef = useRef(0);
  useEffect(() => () => { runRef.current += 1; }, []);
  const draftIdRef = useRef(draftId);
  draftIdRef.current = draftId;

  const currentInput = useCallback((): StudioCheckRequest | null => {
    const built = buildProCheck(kind, getData(), isEnglish);
    return built.ok ? built.request : null;
  }, [kind, getData, isEnglish]);

  const close = useCallback(() => setPhase({ step: 'closed' }), []);

  /** Suit une analyse jusqu'au rapport ; fenêtre d'attente fermée → on prévient. */
  const follow = useCallback(async (entry: StoredProCheck, resumed: boolean) => {
    if (!userId) return;
    const token = (runRef.current += 1);
    const startedAt = Date.now();
    runningKeyRef.current = entry.key;
    setRunning(true);
    const finish = (next: Phase) => setPhase((p) => {
      if (p.step === 'running') return next;
      if (p.step === 'closed') return next.step === 'report' ? { step: 'ready', id: next.id } : next;
      return p; // une autre fenêtre est ouverte : on ne l'écrase pas
    });
    const stop = () => { setRunning(false); runningKeyRef.current = null; };
    try {
      while (Date.now() - startedAt < POLL_MAX_MS) {
        if (runRef.current !== token) return; // page quittée : reprise au retour
        const detail = await proApi.get(entry.verificationId);
        if (runRef.current !== token) return;
        if (detail.status !== 'pending') {
          stop();
          const stored = completeProCheck(userId, entry.verificationId, detail);
          // Fini pendant qu'on était ailleurs, ou rapport d'un autre brouillon
          // que celui à l'écran : il attend sur son brouillon, sans fenêtre.
          const silent = resumed && Date.now() - startedAt < QUICK_MS;
          if (stored && !silent && stored.draftId === draftIdRef.current) {
            finish({ step: 'report', id: entry.verificationId });
          }
          return;
        }
        await wait(POLL_MS);
      }
      stop();
      // Trop long : l'entrée reste, le suivi reprendra au prochain passage.
      if (!resumed) {
        finish({
          step: 'message',
          text: isEnglish
            ? 'The analysis is taking longer than expected. You will find the report in ASV Pro, and here when you come back.'
            : "L'analyse prend plus de temps que prévu. Tu retrouveras le rapport dans ASV Pro, et ici en revenant.",
        });
      }
    } catch (e) {
      if (runRef.current !== token) return;
      stop();
      if (!resumed) {
        finish({ step: 'message', text: (e as Error).message || (isEnglish ? 'ASV Pro did not answer, try again.' : "ASV Pro n'a pas répondu, réessaie.") });
      }
    }
  }, [userId, isEnglish]);

  // Rapports gardés, et reprise d'une analyse en cours au retour sur la page.
  useEffect(() => {
    if (!userId) return;
    const entries = loadProChecks(userId, kind);
    setHistory(entries);
    const pending = entries.find((e) => !e.detail);
    if (pending && Date.now() - pending.at < RESUME_MAX_AGE_MS) void follow(pending, true);
    return subscribeProChecks(() => setHistory(loadProChecks(userId, kind)));
  }, [userId, kind, follow]);

  // Rapports de CE brouillon seulement.
  const done = history.filter((e) => !!e.detail && e.draftId === draftId);
  const input = done.length > 0 || running ? currentInput() : null;
  const key = input ? JSON.stringify(input) : null;
  const match = key ? done.find((e) => e.key === key) ?? null : null;
  const latest = done[0] ?? null;
  const status: ProCheckStatus = running ? 'running' : match ? 'ready' : 'idle';

  const isChecked = useCallback(() => {
    const value = currentInput();
    if (!value) return false;
    const k = JSON.stringify(value);
    return runningKeyRef.current === k || done.some((e) => e.key === k);
  }, [currentInput, done]);

  /** Lien : analyse en cours → attente ; rapport à jour → le rapport ; sinon la confirmation. */
  const run = useCallback(async () => {
    if (running) {
      setPhase({ step: 'running' });
      return;
    }
    const built = buildProCheck(kind, getData(), isEnglish);
    if (!built.ok) {
      setError(isEnglish ? built.en : built.fr);
      return;
    }
    setError(null);
    if (match && match.key === JSON.stringify(built.request)) {
      setPhase({ step: 'report', id: match.verificationId });
      return;
    }
    setPhase({ step: 'confirm', input: built.request, access: null, loadingAccess: true });
    try {
      const access = await proApi.access();
      setPhase((p) => (p.step === 'confirm' ? { ...p, access, loadingAccess: false } : p));
    } catch {
      setPhase((p) => (p.step === 'confirm' ? { ...p, loadingAccess: false } : p));
    }
  }, [running, kind, getData, isEnglish, match]);

  const start = useCallback(async (value: StudioCheckRequest, access: ProAccess | null) => {
    if (!userId) return;
    setRunning(true);
    runningKeyRef.current = JSON.stringify(value);
    setPhase({ step: 'running' });
    try {
      // Refus de l'API (trop de sources, adresse invalide…) : message en mots plus bas.
      const importId = await proApi.imports.create(value);
      const { id, reused } = await proApi.imports.launch(importId);
      const entry: StoredProCheck = {
        kind,
        draftId: draftIdRef.current,
        key: JSON.stringify(value),
        title: value.title,
        verificationId: id,
        access,
        counted: !reused,
        at: Date.now(),
      };
      // Gardée AVANT d'attendre : si on quitte la page, le suivi reprend au retour.
      saveProCheck(userId, entry);
      await follow(entry, false);
    } catch (e) {
      setRunning(false);
      runningKeyRef.current = null;
      setPhase((p) => (p.step === 'running' || p.step === 'closed'
        ? { step: 'message', text: (e as Error).message || (isEnglish ? 'ASV Pro did not answer, try again.' : "ASV Pro n'a pas répondu, réessaie.") }
        : p));
    }
  }, [userId, kind, follow, isEnglish]);

  const shown = phase.step === 'report' ? done.find((e) => e.verificationId === phase.id) ?? null : null;

  /** Un rapport échoué sans résultat ne s'affiche pas : on le dit et on l'oublie. */
  useEffect(() => {
    if (!userId || !shown?.detail || shown.detail.result) return;
    removeProCheck(userId, shown.verificationId);
    setPhase({ step: 'message', text: isEnglish ? 'The check did not complete. Try again in a moment.' : "La vérification n'a pas abouti. Réessaie dans un instant." });
  }, [userId, shown, isEnglish]);

  return {
    run, start, close, setPhase, phase, busy: running, error, isChecked, status, latest, shown,
  };
}


export type PublishChoice = 'publish' | 'check' | 'cancel';
type Ask = { title: string; article: boolean; checked: boolean; resolve: (choice: PublishChoice) => void };

/**
 * Confirmation avant « Publier ». Si les sources n'ont pas été vérifiées, elle le
 * dit et propose de le faire d'abord, sans rien bloquer. `ask()` attend le choix ;
 * `dialog` est à rendre dans la page.
 */
export function usePublishConfirm() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [pending, setPending] = useState<Ask | null>(null);

  const ask = useCallback(
    (title: string, article: boolean, checked: boolean) =>
      new Promise<PublishChoice>((resolve) => setPending({ title, article, checked, resolve })),
    [],
  );
  const answer = useCallback((choice: PublishChoice) => {
    setPending((current) => {
      current?.resolve(choice);
      return null;
    });
  }, []);

  const dialog = (
    <StudioDialog
      open={!!pending}
      onClose={() => answer('cancel')}
      title={pending ? t(`Publier « ${pending.title} » ?`, `Publish “${pending.title}”?`) : ''}
      icon={Globe}
      description={pending?.article
        ? t('L’article sera visible par tout le monde dans l’app. Une fois publié, il ne se modifie plus.',
            'The article will be visible to everyone in the app. Once published, it can no longer be edited.')
        : t('La dépêche sera visible par tout le monde dans l’app. Une fois publiée, elle ne se modifie plus.',
            'The dispatch will be visible to everyone in the app. Once published, it can no longer be edited.')}
      actions={pending && (
        <>
          {!pending.checked && (
            <button type="button" className="btn-primary" onClick={() => answer('check')}>
              {t('Vérifier d’abord', 'Check first')}
            </button>
          )}
          <button type="button" className={pending.checked ? 'btn-primary' : 'btn-outline'} onClick={() => answer('publish')}>
            <Globe className="w-4 h-4" aria-hidden="true" />{pending.checked ? t('Publier', 'Publish') : t('Publier quand même', 'Publish anyway')}
          </button>
          <button type="button" className="btn-link text-sm justify-center" onClick={() => answer('cancel')}>{t('Annuler', 'Cancel')}</button>
        </>
      )}
    >
      {pending && (pending.checked ? (
        <p className="text-sm inline-flex items-start gap-2 text-left">
          <span className="mt-0.5 shrink-0" aria-hidden="true"><ProCheckTile status="ready" /></span>
          {t('Tu as envoyé ce contenu à la vérification. La vérification ASV se relancera à la publication.',
            'You sent this content for checking. ASV will run again on publication.')}
        </p>
      ) : (
        <p className="text-sm rounded-xl border border-aw p-3">
          {t('Tu n’as pas encore vérifié tes sources. Tu peux le faire maintenant, avant que le contenu soit en ligne.',
            'You have not checked your sources yet. You can do it now, before the content goes online.')}
        </p>
      ))}
    </StudioDialog>
  );

  return { ask, dialog };
}
