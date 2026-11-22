import { ProShell } from '../../components/pro/ProShell';
import { useLanguage } from '../../i18n/LanguageContext';
import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { supabase } from '../../lib/studio/supabase';
import { STUDIO_API_URL } from '../../lib/studio/config';
import { useStudioSession } from '../../hooks/useStudioSession';
import type { ProAccess } from '../../lib/pro/types';
import { planLabel } from '../../lib/pro/plan';

const CONTACT = 'mailto:contact@actuworld.fr?subject=ASV%20Pro';

/**
 * Un compte créé sur le site n'a pas de mot de passe (connexion par lien). Pour
 * entrer dans l'app, on en définit un : même mail que « mot de passe oublié ».
 */
function AppPassword() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { session } = useStudioSession();
  const email = session?.user?.email ?? '';
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const send = async () => {
    if (!email || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch(`${STUDIO_API_URL}/auth/lostpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, lang: isEnglish ? 'en' : 'fr' }),
      });
      setState(res.ok ? 'sent' : 'error');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="card p-6 text-sm space-y-3">
      <p className="body-semi text-aw-text">{t("Utiliser ce compte dans l'app", 'Use this account in the app')}</p>
      <p className="text-aw-muted">
        {t(
          'Ici, tu te connectes par lien, sans mot de passe. L’app ActuWorld, elle, en demande un : définis-le en un clic, avec la même adresse.',
          'Here you sign in with a link, no password. The ActuWorld app asks for one: set it in one click, with the same address.',
        )}
      </p>
      {state === 'sent' ? (
        <p role="status">
          {t(`Mail envoyé à ${email}. Ouvre-le pour choisir ton mot de passe.`, `Email sent to ${email}. Open it to choose your password.`)}
        </p>
      ) : (
        <button type="button" className="btn-outline btn-sm inline-flex items-center gap-2" disabled={!email || state === 'sending'} onClick={send}>
          <KeyRound className="w-4 h-4" aria-hidden="true" />
          {state === 'sending' ? t('Envoi en cours…', 'Sending…') : t('Définir ou changer mon mot de passe', 'Set or change my password')}
        </button>
      )}
      {state === 'error' && (
        <p className="text-red-600" role="alert">
          {t("L'envoi a échoué. Réessaie dans quelques minutes.", 'Sending failed. Try again in a few minutes.')}
        </p>
      )}
    </div>
  );
}

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
      <AppPassword />
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
