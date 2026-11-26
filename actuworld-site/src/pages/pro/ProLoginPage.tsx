import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Loader2, Mail, ShieldCheck, Quote, FileSearch } from 'lucide-react';
import { Section } from '../../components/Section';
import { H2 } from '../../components/H2';
import { PageMeta } from '../../components/PageMeta';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import { STUDIO_API_URL } from '../../lib/studio/config';
import { useStudioSession } from '../../hooks/useStudioSession';
import { useProAccess } from '../../hooks/useProAccess';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

// URL de retour du lien magique : constante en prod (une seule entrée d'allowlist
// Supabase), origine locale seulement pour le serveur de dev.
const PRO_MAGIC_LINK_REDIRECT = import.meta.env.DEV ? `${window.location.origin}/pro` : 'https://actuworld.fr/pro';
const CONTACT = 'mailto:contact@actuworld.fr?subject=ASV%20Pro%20%3A%20demande%20d%27acc%C3%A8s';

/**
 * Entrée d'ASV Pro : connexion par lien magique (même compte et même session
 * que le Studio), puis redirection vers « Vérifier un texte » pour les membres,
 * ou page d'attente de la bêta pour les autres.
 */
export default function ProLoginPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { session, isLoading } = useStudioSession();
  const { access, isLoading: isAccessLoading, error: accessError } = useProAccess(!!session);
  const [email, setEmail] = useState('');
  // Deux entrées : se connecter (compte existant) ou créer un compte ici, sans l'app.
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [penName, setPenName] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [website, setWebsite] = useState(''); // champ piège anti-robots, invisible
  const [sendState, setSendState] = useState<SendState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (session && access?.member) return <Navigate to="/pro/verifier" replace />;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || sendState === 'sending') return;
    setSendState('sending');
    setErrorMessage('');
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: PRO_MAGIC_LINK_REDIRECT, shouldCreateUser: false },
    });
    if (error) {
      const unknown = /signup|otp_disabled/i.test(`${error.message} ${error.code ?? ''}`);
      setErrorMessage(
        unknown
          ? t("Aucun compte ActuWorld n'existe avec cet email. Tu peux en créer un ici, juste en dessous.", 'No ActuWorld account exists with this email. You can create one here, just below.')
          : t("L'envoi du lien a échoué. Réessaie dans quelques instants.", 'Sending the link failed. Please try again shortly.'),
      );
      setSendState('error');
      return;
    }
    setSendState('sent');
  };

  // Création de compte : l'API crée le compte ActuWorld (formule Découverte) et
  // envoie le lien. La réponse est la même si l'adresse a déjà un compte.
  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    if (sendState === 'sending') return;
    setSendState('sending');
    setErrorMessage('');
    try {
      const res = await fetch(`${STUDIO_API_URL}/auth/pro-signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          display_name: penName.trim(),
          age_confirmed: ageConfirmed,
          locale: isEnglish ? 'en' : 'fr',
          website,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string; message?: string } | null;
        setErrorMessage(
          res.status === 429
            ? t('Trop de demandes en peu de temps. Réessaie dans quelques minutes.', 'Too many requests. Try again in a few minutes.')
            : payload?.error || payload?.message || t("La création du compte a échoué. Réessaie dans quelques instants.", 'Account creation failed. Please try again shortly.'),
        );
        setSendState('error');
        return;
      }
      setSendState('sent');
    } catch {
      setErrorMessage(t('Le service ne répond pas. Vérifie ta connexion et réessaie.', 'The service is not responding. Check your connection and try again.'));
      setSendState('error');
    }
  };
  const canSignup = penName.trim().length >= 2 && !!email.trim() && ageConfirmed;
  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setErrorMessage('');
    setSendState('idle');
  };

  const busy = isLoading || (!!session && isAccessLoading);

  return (
    <div>
      <PageMeta
        title="ASV Pro"
        description={t(
          'ASV Pro : vérifie un texte et ses sources avant de publier. Ce que chaque source dit vraiment, citation à l’appui.',
          'ASV Pro: check a text and its sources before publishing. What each source really says, with the quote.',
        )}
        path="/pro"
      />
      <Section className="pt-14 pb-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <H2 kicker="ASV Pro" center as="h1">
              {t('Ce que tes sources disent vraiment', 'What your sources really say')}
            </H2>
            <p className="text-aw-muted mt-3">
              {t(
                "Colle ton texte et tes sources. ASV lit chaque source en entier et te dit, passage par passage, si elle confirme ce que tu écris, citation à l'appui.",
                'Paste your text and your sources. ASV reads each source in full and tells you, section by section, whether it confirms what you write, with the quote.',
              )}
            </p>
          </div>

          {busy ? (
            <div className="flex items-center justify-center gap-2 text-aw-muted py-10" role="status">
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              {t('Chargement…', 'Loading…')}
            </div>
          ) : session ? (
            <div className="card p-8 text-center" role="status">
              <h3 className="body-semi text-lg mb-2">
                {accessError ? t('Accès impossible à vérifier', 'Access could not be checked') : t('ASV Pro est en bêta', 'ASV Pro is in beta')}
              </h3>
              <p className="text-aw-muted text-sm">
                {accessError
                  ? t('Le service ne répond pas pour le moment. Réessaie dans quelques instants.', 'The service is not responding right now. Please try again shortly.')
                  : t(
                      "Ton compte n'a pas encore accès à ASV Pro. La bêta est ouverte sur invitation aux rédactions, journalistes et enseignants : écris-nous pour en faire partie.",
                      'Your account does not have access to ASV Pro yet. The beta is open by invitation to newsrooms, journalists and teachers: write to us to join.',
                    )}
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                <a href={CONTACT} className="btn-primary btn-sm">{t('Demander un accès', 'Request access')}</a>
                <button type="button" onClick={() => supabase.auth.signOut()} className="btn-outline btn-sm">
                  {t('Se déconnecter', 'Sign out')}
                </button>
              </div>
            </div>
          ) : sendState === 'sent' ? (
            <div className="card p-8 text-center" role="status">
              <Mail className="w-6 h-6 text-aw-primary mx-auto mb-3" aria-hidden="true" />
              <h3 className="body-semi text-lg mb-2">{t('Lien envoyé', 'Link sent')}</h3>
              <p className="text-aw-muted text-sm">
                {mode === 'signup'
                  ? t(
                    `Ouvre l'email envoyé à ${email.trim()} et clique sur le bouton : il confirme ton adresse et ouvre ASV Pro.`,
                    `Open the email sent to ${email.trim()} and click the button: it confirms your address and opens ASV Pro.`,
                  )
                  : t(
                    `Ouvre l'email envoyé à ${email.trim()} et clique sur le lien de connexion.`,
                    `Open the email sent to ${email.trim()} and click the sign-in link.`,
                  )}
              </p>
              <p className="text-aw-muted text-sm mt-3">
                {t(
                  "Pas reçu d'ici une minute ? Regarde dans tes courriers indésirables. S'il y est, déplace-le dans ta boîte de réception avant de cliquer : certaines messageries bloquent les liens de ce dossier.",
                  'Nothing after a minute? Check your junk or spam folder. If it is there, move it to your inbox before clicking: some mail apps block links in that folder.',
                )}
              </p>
              <button type="button" onClick={() => setSendState('idle')} className="btn-outline btn-sm mt-6">
                {t('Utiliser un autre email', 'Use another email')}
              </button>
            </div>
          ) : (
            <div className="card p-8">
              <div className="flex gap-2 mb-6" role="group" aria-label={t('Connexion ou création de compte', 'Sign in or create an account')}>
                <button type="button" aria-pressed={mode === 'login'} onClick={() => switchMode('login')}
                  className={`badge ${mode === 'login' ? 'badge-primary' : 'text-aw-muted border border-aw'}`}>
                  {t("J'ai un compte", 'I have an account')}
                </button>
                <button type="button" aria-pressed={mode === 'signup'} onClick={() => switchMode('signup')}
                  className={`badge ${mode === 'signup' ? 'badge-primary' : 'text-aw-muted border border-aw'}`}>
                  {t('Créer un compte', 'Create an account')}
                </button>
              </div>

              {mode === 'login' ? (
                <form onSubmit={handleSubmit}>
                  <label htmlFor="pro-email" className="body-semi block mb-2">
                    {t('Email de ton compte ActuWorld', 'Your ActuWorld account email')}
                  </label>
                  <input
                    id="pro-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('toi@redaction.fr', 'you@newsroom.com')}
                    className="field"
                  />
                  {errorMessage && <p className="text-red-600 text-sm mt-3" role="alert">{errorMessage}</p>}
                  <button type="submit" disabled={sendState === 'sending'} className="btn-primary w-full mt-5">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                    {sendState === 'sending' ? t('Envoi en cours…', 'Sending…') : t('Recevoir mon lien de connexion', 'Email me a sign-in link')}
                  </button>
                  <p className="text-aw-muted text-xs mt-4 text-center">
                    {t('Pas de mot de passe : tu reçois un lien valable une seule fois.', 'No password: you receive a one-time link.')}
                  </p>
                </form>
              ) : (
                <form onSubmit={handleSignup}>
                  <p className="text-aw-muted text-sm mb-5">
                    {t(
                      'Un compte suffit pour utiliser ASV Pro, sans installer l’app ni rien publier. Tu commences avec la formule Découverte : 5 vérifications par mois, gratuites.',
                      'An account is all you need to use ASV Pro, without installing the app or publishing anything. You start on the Discovery plan: 5 free checks per month.',
                    )}
                  </p>
                  <label htmlFor="pro-signup-name" className="body-semi block mb-2">{t('Ton nom', 'Your name')}</label>
                  <input
                    id="pro-signup-name"
                    type="text"
                    required
                    minLength={2}
                    maxLength={40}
                    autoComplete="name"
                    value={penName}
                    onChange={(e) => setPenName(e.target.value)}
                    placeholder={t('Ton nom, ou celui de ta rédaction ou de ton établissement', 'Your name, or your newsroom’s or school’s')}
                    className="field"
                  />
                  <label htmlFor="pro-signup-email" className="body-semi block mb-2 mt-4">{t('Email', 'Email')}</label>
                  <input
                    id="pro-signup-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('toi@redaction.fr', 'you@newsroom.com')}
                    className="field"
                  />
                  {/* Champ piège : invisible et hors tabulation, seuls les robots le remplissent. */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="pro-signup-website">Website</label>
                    <input id="pro-signup-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <label className="flex items-start gap-3 mt-5 text-sm cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={ageConfirmed} onChange={(e) => setAgeConfirmed(e.target.checked)} />
                    <span>
                      {t("J'ai 15 ans ou plus, et j'accepte les ", 'I am 15 or older, and I accept the ')}
                      <Link to="/terms" className="link">{t("conditions d'utilisation", 'terms of use')}</Link>
                      {t(' et la ', ' and the ')}
                      <Link to="/privacy" className="link">{t('politique de confidentialité', 'privacy policy')}</Link>.
                    </span>
                  </label>
                  {errorMessage && <p className="text-red-600 text-sm mt-3" role="alert">{errorMessage}</p>}
                  <button type="submit" disabled={!canSignup || sendState === 'sending'} className="btn-primary w-full mt-5 disabled:opacity-60">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                    {sendState === 'sending' ? t('Création en cours…', 'Creating…') : t('Créer mon compte', 'Create my account')}
                  </button>
                  <p className="text-aw-muted text-xs mt-4 text-center">
                    {t('Pas de mot de passe : tu reçois un lien pour confirmer ton adresse. Si tu utilises un jour l’app ActuWorld, le même compte y fonctionne et ce nom y sera ta signature.',
                      'No password: you receive a link to confirm your address. If you ever use the ActuWorld app, the same account works there and this name will be your byline.')}
                  </p>
                </form>
              )}
            </div>
          )}

          <ul className="grid gap-3 mt-8">
            {[
              { icon: Quote, text: t('Pour chaque passage, la phrase exacte de la source qui la confirme ou la contredit.', 'For each section, the exact sentence of the source that confirms or contradicts it.') },
              { icon: FileSearch, text: t('Les sources lues en entier : pages, PDF officiels, copies archivées. Ce qui n’a pas pu être lu est dit, jamais compté comme faux.', 'Sources read in full: pages, official PDFs, archived copies. What could not be read is said, never counted as false.') },
              { icon: ShieldCheck, text: t("ASV ne dit pas « vrai » ou « faux » : il montre ce que disent les sources et ce que l'auteur ajoute.", "ASV does not say “true” or “false”: it shows what the sources say and what the author adds.") },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="card p-4 flex items-start gap-3">
                <Icon className="w-5 h-5 text-aw-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-aw-muted text-sm">{text}</p>
              </li>
            ))}
          </ul>
          <p className="text-center text-sm text-aw-muted mt-6">
            <Link to="/reco-src" className="link">{t('Comment ASV vérifie', 'How ASV checks')}</Link>
            <span aria-hidden="true"> · </span>
            <Link to="/tarifs" className="link">{t('Voir les formules', 'See the plans')}</Link>
          </p>
        </div>
      </Section>
    </div>
  );
}
