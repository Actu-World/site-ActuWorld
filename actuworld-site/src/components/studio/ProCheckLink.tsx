// Lien « Vérifier mes sources avant de publier » des éditeurs du Studio, et
// ses fenêtres (confirmation avec le quota, analyse en cours, rapport prêt,
// rapport). L'état vient de useProCheck (proCheckFlow.tsx) : ce fichier ne fait
// que l'afficher (un fichier de composants, un fichier de hooks).
import { useEffect, useState } from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { ProCheckTile } from '../asv/AsvTile';
import { useLanguage } from '../../i18n/LanguageContext';
import ReportView from '../pro/ReportView';
import { featuresOf } from '../../lib/pro/plan';
import { StudioDialog } from './StudioDialog';
import { REPORT_DOCK_QUERY, type useProCheck } from './proCheckFlow';

const PLAN_NAMES: Record<string, [string, string]> = {
  discovery: ['Découverte', 'Discovery'], beta: ['Bêta', 'Beta'], pro: ['Pro', 'Pro'],
  team: ['Rédaction', 'Newsroom'], staff: ['Équipe ActuWorld', 'ActuWorld team'],
};

const shortTitle = (title: string) => {
  const clean = title.trim();
  return clean.length > 40 ? `${clean.slice(0, 39).trimEnd()}…` : clean;
};

/** Vrai sur écran large : le rapport est un panneau à droite de l'éditeur. */
function useReportDocked(): boolean {
  const [docked, setDocked] = useState(() => window.matchMedia(REPORT_DOCK_QUERY).matches);
  useEffect(() => {
    const media = window.matchMedia(REPORT_DOCK_QUERY);
    const onChange = () => setDocked(media.matches);
    onChange();
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return docked;
}

/** Fenêtres de la vérification : confirmation, analyse en cours, rapport prêt, rapport. */
function ProCheckDialogs({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { phase, close, setPhase, shown, latest } = check;
  const docked = useReportDocked();

  if (phase.step === 'report') {
    if (!shown?.detail?.result) return null;
    const { detail, access, counted } = shown;
    const features = access ? featuresOf(access) : null;
    const used = access ? Math.min(access.quota, access.used_this_month + (counted ? 1 : 0)) : null;
    const plan = PLAN_NAMES[access?.plan ?? ''];
    const checkedAt = new Date(detail.finished_at ?? detail.created_at)
      .toLocaleTimeString(isEnglish ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
    return (
      // Écran étroit : par-dessus l'éditeur. Écran large : panneau à droite, sous
      // la barre du Studio ; la page lui laisse sa place (REPORT_DOCK_PADDING).
      <div
        className="fixed inset-0 z-[70] overflow-y-auto bg-aw-bg text-left lg:inset-auto lg:top-16 lg:right-0 lg:bottom-0 lg:z-30 lg:w-[24rem] xl:w-[30rem] 2xl:w-[36rem] lg:border-l lg:border-aw"
        role={docked ? 'complementary' : 'dialog'}
        aria-modal={docked ? undefined : true}
        aria-label={t('Rapport ASV', 'ASV report')}
      >
        <div className="max-w-5xl mx-auto container-px lg:px-5 py-6 sm:py-8 lg:py-5 space-y-6 lg:space-y-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm text-aw-muted max-w-prose">
              {docked
                ? t(`Rien n’est publié. Corrige ton texte à gauche : ce rapport reste ouvert. Il vaut pour le texte vérifié à ${checkedAt}.`,
                    `Nothing is published. Fix your text on the left: this report stays open. It covers the text checked at ${checkedAt}.`)
                : t('Rien n’est publié. Ferme ce rapport pour corriger ton texte : le lien « Revoir le rapport ASV » le rouvre tant que tu n’as rien changé.',
                    'Nothing is published. Close this report to fix your text: the “View the ASV report again” link reopens it as long as you have not changed anything.')}
            </p>
            {docked ? (
              <button type="button" className="btn-outline btn-sm shrink-0" onClick={close}
                aria-label={t('Fermer le rapport', 'Close the report')} title={t('Fermer le rapport', 'Close the report')}>
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button type="button" className="btn-primary btn-sm shrink-0" onClick={close}>{t("Revenir à l'éditeur", 'Back to the editor')}</button>
            )}
          </div>
          {check.stale && (
            <div className="rounded-xl border border-aw p-4 text-sm space-y-2" role="status">
              <p>{t('Tu as modifié le texte ou les sources depuis ce rapport.', 'You have changed the text or the sources since this report.')}</p>
              <button type="button" className="btn-outline btn-sm" onClick={() => void check.run()}>
                {t('Vérifier la nouvelle version', 'Check the new version')}
              </button>
            </div>
          )}
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
            <button type="button" className="btn-outline btn-sm" onClick={close}>
              {docked ? t('Fermer le rapport', 'Close the report') : t("Revenir à l'éditeur", 'Back to the editor')}
            </button>
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
        iconNode={<ProCheckTile status="ready" />}
        description={t('ASV lit chaque source et la confronte à ton texte, passage par passage. Rien n’est publié.',
          'ASV reads each source and checks it against your text, passage by passage. Nothing is published.')}
        actions={confirm && (
          <>
            <button type="button" className="btn-primary disabled:opacity-60"
              disabled={confirm.loadingAccess || left === 0}
              onClick={() => void check.start(confirm.input, confirm.access)}>
              {confirm.loadingAccess && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
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
        iconNode={<ProCheckTile status="running" />}
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
        iconNode={<ProCheckTile status="ready" />}
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
        icon={AlertCircle}
        tone="warning"
        description={phase.step === 'message' ? phase.text : ''}
        actions={<button type="button" className="btn-primary" onClick={close}>OK</button>}
      />
    </>
  );
}

/** Lien « Vérifier mes sources avant de publier », à poser juste au-dessus de Publier. */
export function ProCheckLink({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const label = check.status === 'running'
    ? t('Vérification en cours…', 'Check in progress…')
    : check.status === 'ready'
      ? t('Revoir le rapport ASV', 'View the ASV report again')
      : t('Vérifier mes sources avant de publier', 'Check my sources before publishing');
  return (
    <div className="mb-4 text-center">
      <button type="button" onClick={() => void check.run()}
        className="btn-link text-sm inline-flex items-center gap-2">
        {/* Tuile ASV de l'app : contour + jauge vide, traits qui chargent pendant
            l'analyse, puis tuile pleine quand le rapport est prêt (jauge = verdict). */}
        <span aria-hidden="true" className="inline-flex"><ProCheckTile status={check.status} /></span>
        {label}
      </button>
      <p className="text-aw-muted text-xs mt-1">
        {check.status === 'ready'
          ? t('Le rapport de ce brouillon est gardé : il se rouvre tant que tu ne changes ni le texte ni les sources.',
              'This draft’s report is kept: it reopens as long as you change neither the text nor the sources.')
          : t('Le rapport s’affiche ici, à côté de l’éditeur sur grand écran. Rien n’est publié, et rien n’est compté avant ta confirmation.',
              'The report shows here, next to the editor on a large screen. Nothing is published, and nothing is counted before you confirm.')}
      </p>
      {check.error && <p className="text-red-500 text-sm mt-2" role="alert">{check.error}</p>}
      <ProCheckDialogs check={check} />
    </div>
  );
}
