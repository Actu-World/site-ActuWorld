import { ProShell } from '../../components/pro/ProShell';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import type { ProAccess } from '../../lib/pro/types';
import { planLabel } from '../../lib/pro/plan';

const CONTACT = 'mailto:actuworld.app@outlook.fr?subject=ASV%20Pro';

function Account({ access }: { access: ProAccess }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const plan = planLabel(access, t);
  const used = Math.min(access.used_this_month, access.quota);
  const ratio = access.quota ? used / access.quota : 1;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl sm:text-3xl">{t('Compte', 'Account')}</h1>
      <div className="card p-6 space-y-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <dt className="text-aw-muted">{t('Formule', 'Plan')}</dt>
          <dd className="font-semibold">{plan}</dd>
          {access.org_name && (
            <>
              <dt className="text-aw-muted">{t('Organisation', 'Organisation')}</dt>
              <dd className="font-semibold">{access.org_name}</dd>
            </>
          )}
          <dt className="text-aw-muted">{t('Ce mois-ci', 'This month')}</dt>
          <dd className="font-semibold tabular">
            {t(`${used} vérification(s) sur ${access.quota}`, `${used} check(s) out of ${access.quota}`)}
          </dd>
        </dl>
        <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={access.quota} aria-valuenow={used}
          aria-label={t('Vérifications utilisées ce mois-ci', 'Checks used this month')}>
          <div className="progress-bar-fill" style={{ width: `${Math.round(ratio * 100)}%` }} />
        </div>
        <p className="text-sm text-aw-muted">
          {t('Le compteur repart à zéro le 1er de chaque mois. Besoin de plus ? Écris-nous.', 'The counter resets on the 1st of each month. Need more? Write to us.')}
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={CONTACT} className="btn-outline btn-sm">{t('Nous écrire', 'Write to us')}</a>
          <button type="button" className="btn-outline btn-sm" onClick={() => supabase.auth.signOut()}>{t('Se déconnecter', 'Sign out')}</button>
        </div>
      </div>
      <div className="card p-6 text-sm text-aw-muted space-y-2">
        <p className="body-semi text-aw-text">{t('Tes textes', 'Your texts')}</p>
        <p>
          {t(
            'Les textes que tu vérifies restent privés : ils sont gardés dans ton historique jusqu’à ce que tu les supprimes, et la suppression est définitive. Rien n’est publié dans ActuWorld.',
            'The texts you check stay private: they are kept in your history until you delete them, and deletion is permanent. Nothing is published on ActuWorld.',
          )}
        </p>
        <p>
          {t(
            'Les explications détaillées du modèle sont pour l’instant en français ; le reste du rapport suit la langue du site.',
            'The model’s detailed explanations are in French for now; the rest of the report follows the site language.',
          )}
        </p>
      </div>
    </div>
  );
}

export default function ProAccountPage() {
  const { isEnglish } = useLanguage();
  return (
    <ProShell title={isEnglish ? 'Account' : 'Compte'} path="/pro/compte">
      {(access) => <Account access={access} />}
    </ProShell>
  );
}
