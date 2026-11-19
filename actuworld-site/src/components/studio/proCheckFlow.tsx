import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { buildProCheck } from '../../lib/studio/proCheck';
import ReportView from '../pro/ReportView';
import { featuresOf } from '../../lib/pro/plan';
import type { ProAccess, ProInput, ProVerificationDetail } from '../../lib/pro/types';
import type { PlanItemData } from '../../lib/studio/redaction';

// Studio → ASV Pro : « vérifier avant de publier », le même parcours que dans
// l'app. Tout se passe dans l'éditeur : confirmation avec le quota du mois,
// analyse, puis le rapport par-dessus la page. On corrige ensuite dans
// l'éditeur, puis on envoie en brouillon ou on publie comme d'habitude. Rien
// n'est vérifié ni compté avant le clic de confirmation.

type Kind = 'post' | 'article';

const POLL_MS = 3000;
const POLL_MAX_MS = 4 * 60 * 1000;

type Phase =
  | { step: 'closed' }
  | { step: 'confirm'; input: ProInput; access: ProAccess | null; loadingAccess: boolean }
  | { step: 'running' }
  | { step: 'report'; detail: ProVerificationDetail; access: ProAccess | null; counted: boolean };

/**
 * Vérification du contenu en cours d'écriture. `isChecked()` dit si le contenu
 * tel qu'il est à l'écran a déjà été vérifié (il change dès qu'on retouche le
 * texte ou une source).
 */
export function useProCheck(kind: Kind, getData: () => PlanItemData) {
  const { isEnglish } = useLanguage();
  const [phase, setPhase] = useState<Phase>({ step: 'closed' });
  const [error, setError] = useState<string | null>(null);
  const checkedKeyRef = useRef<string | null>(null);
  // Attente abandonnée (fenêtre fermée, page quittée) : la relecture s'arrête.
  const runRef = useRef(0);
  useEffect(() => () => { runRef.current += 1; }, []);

  const currentKey = useCallback(() => {
    const built = buildProCheck(kind, getData(), isEnglish);
    return built.ok ? JSON.stringify(built.input) : null;
  }, [kind, getData, isEnglish]);

  const isChecked = useCallback(() => {
    const key = currentKey();
    return !!key && key === checkedKeyRef.current;
  }, [currentKey]);

  const close = useCallback(() => {
    runRef.current += 1;
    setPhase({ step: 'closed' });
  }, []);

  /** Ouvre la confirmation (ou dit ce qui manque pour vérifier). */
  const run = useCallback(async () => {
    const built = buildProCheck(kind, getData(), isEnglish);
    if (!built.ok) {
      setError(isEnglish ? built.en : built.fr);
      return;
    }
    setError(null);
    setPhase({ step: 'confirm', input: built.input, access: null, loadingAccess: true });
    try {
      const access = await proApi.access();
      setPhase((p) => (p.step === 'confirm' ? { ...p, access, loadingAccess: false } : p));
    } catch {
      setPhase((p) => (p.step === 'confirm' ? { ...p, loadingAccess: false } : p));
    }
  }, [kind, getData, isEnglish]);

  const start = useCallback(async (input: ProInput, access: ProAccess | null) => {
    const token = (runRef.current += 1);
    setPhase({ step: 'running' });
    try {
      const importId = await proApi.imports.create(input, kind);
      const { id, reused } = await proApi.imports.launch(importId);
      checkedKeyRef.current = JSON.stringify(input);
      const started = Date.now();
      while (Date.now() - started < POLL_MAX_MS) {
        if (runRef.current !== token) return;
        const detail = await proApi.get(id);
        if (detail.status !== 'pending') {
          if (runRef.current !== token) return;
          setPhase({ step: 'report', detail, access, counted: !reused });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_MS));
      }
      setError(isEnglish
        ? 'The analysis is taking longer than expected. You will find the report in ASV Pro.'
        : "L'analyse prend plus de temps que prévu. Tu retrouveras le rapport dans ASV Pro.");
      setPhase({ step: 'closed' });
    } catch (e) {
      if (runRef.current !== token) return;
      setError((e as Error).message || (isEnglish ? 'ASV Pro did not answer, try again.' : "ASV Pro n'a pas répondu, réessaie."));
      setPhase({ step: 'closed' });
    }
  }, [kind, isEnglish]);

  return { run, start, close, phase, busy: phase.step === 'running', error, isChecked };
}

const PLAN_NAMES: Record<string, [string, string]> = {
  discovery: ['Découverte', 'Discovery'], beta: ['Bêta', 'Beta'], pro: ['Pro', 'Pro'],
  team: ['Rédaction', 'Newsroom'], staff: ['Équipe ActuWorld', 'ActuWorld team'],
};

/** Fenêtres de la vérification : confirmation, analyse en cours, rapport. */
function ProCheckDialogs({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { phase, close } = check;
  if (phase.step === 'closed') return null;

  if (phase.step === 'report') {
    const { detail, access, counted } = phase;
    const features = access ? featuresOf(access) : null;
    const used = access ? Math.min(access.quota, access.used_this_month + (counted ? 1 : 0)) : null;
    const plan = PLAN_NAMES[access?.plan ?? ''];
    return (
      <div className="fixed inset-0 z-[70] overflow-y-auto bg-aw-bg text-left" role="dialog" aria-modal="true" aria-label={t('Rapport ASV', 'ASV report')}>
        <div className="max-w-5xl mx-auto container-px py-6 sm:py-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-aw-muted max-w-prose">
              {t('Rien n’est publié. Ferme ce rapport pour corriger ton texte, puis envoie-le en brouillon ou publie-le.',
                'Nothing is published. Close this report to fix your text, then send it as a draft or publish it.')}
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
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="pro-check-title">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="card relative w-full max-w-md p-6 space-y-4 text-center">
        {confirm ? (
          <>
            <ShieldCheck className="w-6 h-6 mx-auto text-aw-primary" aria-hidden="true" />
            <h2 id="pro-check-title" className="text-xl">{t('Vérifier mes sources', 'Check my sources')}</h2>
            <p className="text-sm text-aw-muted">
              {t('ASV lit chaque source et la confronte à ton texte, passage par passage. Rien n’est publié.',
                'ASV reads each source and checks it against your text, passage by passage. Nothing is published.')}
            </p>
            {!confirm.loadingAccess && (
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
            <div className="flex flex-col gap-2">
              <button type="button" className="btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
                disabled={confirm.loadingAccess || left === 0}
                onClick={() => void check.start(confirm.input, confirm.access)}>
                {confirm.loadingAccess ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="w-4 h-4" aria-hidden="true" />}
                {t('Vérifier', 'Check')}
              </button>
              <button type="button" className="btn-link text-sm" onClick={close}>{t('Annuler', 'Cancel')}</button>
            </div>
          </>
        ) : (
          <div role="status" className="space-y-4">
            <Loader2 className="w-6 h-6 mx-auto animate-spin text-aw-muted" aria-hidden="true" />
            <h2 id="pro-check-title" className="text-xl">{t('Analyse en cours', 'Analysis in progress')}</h2>
            <p className="text-sm text-aw-muted">
              {t('ASV lit tes sources, puis juge chaque passage. Cela prend en général moins de deux minutes.',
                'ASV reads your sources, then judges each passage. This usually takes under two minutes.')}
            </p>
            <button type="button" className="btn-link text-sm" onClick={close}>{t('Ne plus attendre', 'Stop waiting')}</button>
          </div>
        )}
      </div>
    </div>
  );
}

/** Lien « Vérifier mes sources avant de publier », à poser près de Publier. */
export function ProCheckLink({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  return (
    <div className="mt-4 text-center">
      <button type="button" onClick={() => void check.run()} disabled={check.busy}
        className="btn-link text-sm inline-flex items-center gap-1.5 disabled:opacity-60">
        {check.busy
          ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          : <ShieldCheck className="w-4 h-4" aria-hidden="true" />}
        {t('Vérifier mes sources avant de publier', 'Check my sources before publishing')}
      </button>
      <p className="text-aw-muted text-xs mt-1">
        {t('Le rapport s’affiche ici, par-dessus l’éditeur. Rien n’est publié, et rien n’est compté avant ta confirmation.',
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

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') answer('cancel'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending, answer]);

  const dialog = pending ? (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="publish-confirm-title">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label={t('Annuler', 'Cancel')} onClick={() => answer('cancel')} />
      <div className="card relative w-full max-w-md p-6 space-y-4">
        <h2 id="publish-confirm-title" className="text-xl">{t(`Publier « ${pending.title} » ?`, `Publish “${pending.title}”?`)}</h2>
        <p className="text-sm text-aw-muted">
          {pending.article
            ? t('L’article sera visible par tout le monde dans l’app. Une fois publié, il ne se modifie plus.',
                'The article will be visible to everyone in the app. Once published, it can no longer be edited.')
            : t('La dépêche sera visible par tout le monde dans l’app. Une fois publiée, elle ne se modifie plus.',
                'The dispatch will be visible to everyone in the app. Once published, it can no longer be edited.')}
        </p>
        {pending.checked ? (
          <p className="text-sm inline-flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-aw-primary" aria-hidden="true" />
            {t('Tu as envoyé ce contenu à la vérification. La vérification ASV se relancera à la publication.',
              'You sent this content for checking. ASV will run again on publication.')}
          </p>
        ) : (
          <p className="text-sm rounded-xl border border-aw p-3">
            {t('Tu n’as pas encore vérifié tes sources. Tu peux le faire maintenant, avant que le contenu soit en ligne.',
              'You have not checked your sources yet. You can do it now, before the content goes online.')}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {!pending.checked && (
            <button type="button" className="btn-primary inline-flex items-center justify-center gap-2" onClick={() => answer('check')}>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />{t('Vérifier d’abord', 'Check first')}
            </button>
          )}
          <button type="button" className={`${pending.checked ? 'btn-primary' : 'btn-outline'} inline-flex items-center justify-center gap-2`} onClick={() => answer('publish')}>
            <Globe className="w-4 h-4" aria-hidden="true" />{pending.checked ? t('Publier', 'Publish') : t('Publier quand même', 'Publish anyway')}
          </button>
          <button type="button" className="btn-link text-sm" onClick={() => answer('cancel')}>{t('Annuler', 'Cancel')}</button>
        </div>
      </div>
    </div>
  ) : null;

  return { ask, dialog };
}
