import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { buildProCheck } from '../../lib/studio/proCheck';
import {
  completeProCheck, loadProChecks, removeProCheck, saveProCheck, subscribeProChecks, type StoredProCheck,
} from '../../lib/studio/proCheckStore';
import ReportView from '../pro/ReportView';
import { featuresOf } from '../../lib/pro/plan';
import type { ProAccess, ProInput } from '../../lib/pro/types';
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
  | { step: 'confirm'; input: ProInput; access: ProAccess | null; loadingAccess: boolean }
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

  const currentInput = useCallback((): ProInput | null => {
    const built = buildProCheck(kind, getData(), isEnglish);
    return built.ok ? built.input : null;
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
    if (match && match.key === JSON.stringify(built.input)) {
      setPhase({ step: 'report', id: match.verificationId });
      return;
    }
    setPhase({ step: 'confirm', input: built.input, access: null, loadingAccess: true });
    try {
      const access = await proApi.access();
      setPhase((p) => (p.step === 'confirm' ? { ...p, access, loadingAccess: false } : p));
    } catch {
      setPhase((p) => (p.step === 'confirm' ? { ...p, loadingAccess: false } : p));
    }
  }, [running, kind, getData, isEnglish, match]);

  const start = useCallback(async (value: ProInput, access: ProAccess | null) => {
    if (!userId) return;
    setRunning(true);
    runningKeyRef.current = JSON.stringify(value);
    setPhase({ step: 'running' });
    try {
      const importId = await proApi.imports.create(value, kind);
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

const PLAN_NAMES: Record<string, [string, string]> = {
  discovery: ['Découverte', 'Discovery'], beta: ['Bêta', 'Beta'], pro: ['Pro', 'Pro'],
  team: ['Rédaction', 'Newsroom'], staff: ['Équipe ActuWorld', 'ActuWorld team'],
};

const shortTitle = (title: string) => {
  const clean = title.trim();
  return clean.length > 40 ? `${clean.slice(0, 39).trimEnd()}…` : clean;
};

/** Fenêtres de la vérification : confirmation, analyse en cours, rapport prêt, rapport. */
function ProCheckDialogs({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { phase, close, setPhase, shown, latest } = check;

  if (phase.step === 'report') {
    if (!shown?.detail?.result) return null;
    const { detail, access, counted } = shown;
    const features = access ? featuresOf(access) : null;
    const used = access ? Math.min(access.quota, access.used_this_month + (counted ? 1 : 0)) : null;
    const plan = PLAN_NAMES[access?.plan ?? ''];
    return (
      <div className="fixed inset-0 z-[70] overflow-y-auto bg-aw-bg text-left" role="dialog" aria-modal="true" aria-label={t('Rapport ASV', 'ASV report')}>
        <div className="max-w-5xl mx-auto container-px py-6 sm:py-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-aw-muted max-w-prose">
              {t('Rien n’est publié. Ferme ce rapport pour corriger ton texte : le lien « Revoir le rapport ASV » le rouvre tant que tu n’as rien changé.',
                'Nothing is published. Close this report to fix your text: the “View the ASV report again” link reopens it as long as you have not changed anything.')}
            </p>
            <button type="button" className="btn-primary btn-sm" onClick={close}>{t("Revenir à l'éditeur", 'Back to the editor')}</button>
          </div>
          <ReportView data={detail} lang={isEnglish ? 'en' : 'fr'} showReview={features ? features.review : true} />
          <div className="card p-5 text-sm space-y-2">
            {access && used !== null && (
              <p>
                {plan
                  ? t(`Formule ${plan[0]} : ${used} vérification(s) utilisée(s) sur ${access.quota} ce mois-ci.`,
                      `${plan[1]} plan: ${used} check(s) used out of ${access.quota} this month.`)
                  : t(`${used} vérification(s) utilisée(s) sur ${access.quota} ce mois-ci.`, `${used} check(s) used out of ${access.quota} this month.`)}
              </p>
            )}
            {access?.plan === 'discovery' && (
              <p className="text-aw-muted">
                {t('Avec la formule Pro : 100 vérifications par mois, la synthèse des points à reprendre et l’historique de tes rapports.',
                  'With the Pro plan: 100 checks per month, a summary of what to fix, and the history of your reports.')}{' '}
                <a href="/tarifs" target="_blank" rel="noopener noreferrer" className="link">{t('Voir les formules', 'See the plans')}</a>
              </p>
            )}
            <p>
              <a href={`/pro/rapport/${encodeURIComponent(detail.id)}`} target="_blank" rel="noopener noreferrer" className="link">
                {t('Ouvrir ce rapport dans ASV Pro', 'Open this report in ASV Pro')}
              </a>
            </p>
            <button type="button" className="btn-outline btn-sm" onClick={close}>{t("Revenir à l'éditeur", 'Back to the editor')}</button>
          </div>
        </div>
      </div>
    );
  }

  const confirm = phase.step === 'confirm' ? phase : null;
  const left = confirm?.access ? Math.max(0, confirm.access.quota - confirm.access.used_this_month) : null;
  const cancel = (
    <button type="button" className="btn-link text-sm justify-center" onClick={close}>{t('Annuler', 'Cancel')}</button>
  );

  return (
    <>
      <StudioDialog
        open={!!confirm}
        onClose={close}
        title={t('Vérifier mes sources', 'Check my sources')}
        icon={ShieldCheck}
        description={t('ASV lit chaque source et la confronte à ton texte, passage par passage. Rien n’est publié.',
          'ASV reads each source and checks it against your text, passage by passage. Nothing is published.')}
        actions={confirm && (
          <>
            <button type="button" className="btn-primary disabled:opacity-60"
              disabled={confirm.loadingAccess || left === 0}
              onClick={() => void check.start(confirm.input, confirm.access)}>
              {confirm.loadingAccess ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="w-4 h-4" aria-hidden="true" />}
              {t('Vérifier', 'Check')}
            </button>
            {cancel}
          </>
        )}
      >
        {confirm && !confirm.loadingAccess && (
          <p className="text-sm" role="status">
            {left === null
              ? t('Cette vérification comptera dans ton quota du mois.', 'This check will count towards your monthly quota.')
              : left > 0
                ? t(`Il te reste ${left} vérification(s) sur ${confirm.access!.quota} ce mois-ci. Celle-ci en utilisera une.`,
                    `You have ${left} check(s) left out of ${confirm.access!.quota} this month. This one will use one.`)
                : t(`Tu as utilisé tes ${confirm.access!.quota} vérifications du mois. Le compteur repart le 1er.`,
                    `You have used your ${confirm.access!.quota} checks this month. The counter resets on the 1st.`)}
          </p>
        )}
        {/* Texte modifié depuis le dernier rapport de ce brouillon : il reste consultable. */}
        {confirm && latest && (
          <button type="button" className="link text-sm" onClick={() => setPhase({ step: 'report', id: latest.verificationId })}>
            {latest.title.trim()
              ? t(`Revoir le rapport précédent (« ${shortTitle(latest.title)} »)`, `View the previous report (“${shortTitle(latest.title)}”)`)
              : t('Revoir le rapport précédent', 'View the previous report')}
          </button>
        )}
      </StudioDialog>

      <StudioDialog
        open={phase.step === 'running'}
        title={t('Analyse en cours', 'Analysis in progress')}
        icon={Loader2}
        iconSpin
        description={t('ASV lit tes sources, puis juge chaque passage. Cela prend en général moins de deux minutes. Tu peux continuer à écrire : on te prévient quand le rapport est prêt.',
          'ASV reads your sources, then judges each passage. This usually takes under two minutes. You can keep writing: we’ll let you know when the report is ready.')}
        actions={(
          <button type="button" className="btn-outline" onClick={close}>{t('Continuer en fond', 'Keep going in the background')}</button>
        )}
      />

      <StudioDialog
        open={phase.step === 'ready'}
        onClose={close}
        title={t('Ton rapport ASV est prêt', 'Your ASV report is ready')}
        icon={ShieldCheck}
        tone="success"
        description={t('La vérification de tes sources est terminée.', 'The check of your sources is done.')}
        actions={(
          <>
            <button type="button" className="btn-primary"
              onClick={() => setPhase((p) => (p.step === 'ready' ? { step: 'report', id: p.id } : p))}>
              {t('Voir le rapport', 'View the report')}
            </button>
            <button type="button" className="btn-link text-sm justify-center" onClick={close}>{t('Plus tard', 'Later')}</button>
          </>
        )}
      />

      <StudioDialog
        open={phase.step === 'message'}
        onClose={close}
        title={t('Vérifier mes sources', 'Check my sources')}
        icon={ShieldCheck}
        tone="warning"
        description={phase.step === 'message' ? phase.text : ''}
        actions={<button type="button" className="btn-primary" onClick={close}>OK</button>}
      />
    </>
  );
}

/** Lien « Vérifier mes sources avant de publier », à poser près de Publier. */
export function ProCheckLink({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const label = check.status === 'running'
    ? t('Vérification en cours…', 'Check in progress…')
    : check.status === 'ready'
      ? t('Revoir le rapport ASV', 'View the ASV report again')
      : t('Vérifier mes sources avant de publier', 'Check my sources before publishing');
  return (
    <div className="mt-4 text-center">
      <button type="button" onClick={() => void check.run()}
        className="btn-link text-sm inline-flex items-center gap-1.5">
        {check.status === 'running'
          ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          : <ShieldCheck className={`w-4 h-4 ${check.status === 'ready' ? 'fill-current' : ''}`} aria-hidden="true" />}
        {label}
      </button>
      <p className="text-aw-muted text-xs mt-1">
        {check.status === 'ready'
          ? t('Le rapport de ce brouillon est gardé : il se rouvre tant que tu ne changes ni le texte ni les sources.',
              'This draft’s report is kept: it reopens as long as you change neither the text nor the sources.')
          : t('Le rapport s’affiche ici, par-dessus l’éditeur. Rien n’est publié, et rien n’est compté avant ta confirmation.',
              'The report shows here, over the editor. Nothing is published, and nothing is counted before you confirm.')}
      </p>
      {check.error && <p className="text-red-500 text-sm mt-2" role="alert">{check.error}</p>}
      <ProCheckDialogs check={check} />
    </div>
  );
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
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />{t('Vérifier d’abord', 'Check first')}
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
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-aw-primary" aria-hidden="true" />
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
