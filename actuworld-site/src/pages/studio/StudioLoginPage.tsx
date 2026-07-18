import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, PenLine, Smartphone, ShieldCheck } from 'lucide-react';
import { Section } from '../../components/Section';
import { H2 } from '../../components/H2';
import { PageMeta } from '../../components/PageMeta';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import { useStudioSession } from '../../hooks/useStudioSession';
import { QrPairingCard } from '../../components/studio/QrPairingCard';

type SendState = 'idle' | 'sending' | 'sent' | 'error';

export default function StudioLoginPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const { session, isLoading } = useStudioSession();
  // Le pairing QR n'est monté que sur écran large : `hidden` CSS masquerait le
  // composant mais le laisserait poller l'API pour rien depuis un mobile.
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  );
  const [email, setEmail] = useState('');
  const [sendState, setSendState] = useState<SendState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isLoading && session) {
    return <Navigate to="/studio/editeur" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || sendState === 'sending') return;

    setSendState('sending');
    setErrorMessage('');

    // URL de retour CANONIQUE : quelle que soit la variante visitée (www ou non),
    // on renvoie toujours vers actuworld.fr — une seule entrée d'allowlist Supabase
    // à maintenir, et pas de retombée silencieuse sur la Site URL si la variante
    // manque. L'origine locale est conservée pour le dev (localhost).
    const redirectBase = window.location.hostname.endsWith('actuworld.fr')
      ? 'https://actuworld.fr'
      : window.location.origin;

    const { error } = await supabase.auth.signInWithOtp({
      email: trimmedEmail,
      options: {
        emailRedirectTo: `${redirectBase}/studio/editeur`,
        // Le Studio connecte des créateurs existants, il ne crée pas de comptes.
        shouldCreateUser: false,
      },
    });

    if (error) {
      const isUnknownAccount = /signup|otp_disabled/i.test(`${error.message} ${error.code ?? ''}`);
      setErrorMessage(
        isUnknownAccount
          ? t(
              "Aucun compte ActuWorld n'existe avec cet email. Crée d'abord ton compte dans l'app.",
              'No ActuWorld account exists with this email. Create your account in the app first.'
            )
          : t(
              "L'envoi du lien a échoué. Réessaie dans quelques instants.",
              'Sending the link failed. Please try again shortly.'
            )
      );
      setSendState('error');
      return;
    }

    setSendState('sent');
  };

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t('Studio — Écrire sur ordinateur', 'Studio — Write on desktop')}
        description={t(
          "Connecte-toi à ton compte ActuWorld pour écrire tes articles au clavier et les envoyer comme brouillons dans l'app.",
          'Sign in to your ActuWorld account to write your articles on desktop and send them as drafts to the app.'
        )}
        path="/studio"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-aw-primary flex items-center justify-center mb-4">
                <PenLine className="w-7 h-7 text-white" />
              </div>
              <H2 kicker="Studio" center as="h1">
                {t('Écrire sur ordinateur', 'Write on desktop')}
              </H2>
              <p className="text-aw-muted mt-3">
                {t(
                  "Rédige ton article au clavier, il arrivera en brouillon dans l'app — la publication et la vérification des sources restent sur mobile.",
                  'Write your article on your keyboard; it lands as a draft in the app — publishing and source verification stay on mobile.'
                )}
              </p>
            </div>

            {/* Pairing QR : pertinent uniquement sur un écran d'ordinateur
                (sur téléphone, on est déjà dans l'app ou à un tap de l'être). */}
            {isDesktop && (
            <div className="hidden md:block">
              <QrPairingCard />
              <div className="flex items-center gap-3 my-6" aria-hidden="true">
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--aw-border)' }} />
                <span className="text-aw-muted text-xs uppercase tracking-wide">
                  {t('ou par email', 'or by email')}
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--aw-border)' }} />
              </div>
            </div>
            )}

            {sendState === 'sent' ? (
              <div className="card p-8 text-center" role="status">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-aw-primary" />
                </div>
                <h3 className="body-semi text-lg mb-2">{t('Lien envoyé !', 'Link sent!')}</h3>
                <p className="text-aw-muted text-sm">
                  {t(
                    `Ouvre l'email envoyé à ${email.trim()} et clique sur le lien de connexion. Tu peux fermer cet onglet.`,
                    `Open the email sent to ${email.trim()} and click the sign-in link. You can close this tab.`
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setSendState('idle')}
                  className="btn-outline mt-6"
                >
                  {t('Utiliser un autre email', 'Use another email')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card p-8">
                <label htmlFor="studio-email" className="body-semi block mb-2">
                  {t('Email de ton compte ActuWorld', 'Your ActuWorld account email')}
                </label>
                <input
                  id="studio-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={t('toi@exemple.fr', 'you@example.com')}
                  className="w-full rounded-xl border border-aw bg-aw-bg px-4 py-3 text-aw-text placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary"
                />

                {errorMessage && (
                  <p className="text-red-500 text-sm mt-3" role="alert">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sendState === 'sending'}
                  className="btn-primary w-full mt-5 inline-flex items-center justify-center disabled:opacity-60"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {sendState === 'sending'
                    ? t('Envoi en cours…', 'Sending…')
                    : t('Recevoir mon lien de connexion', 'Email me a sign-in link')}
                </button>

                <p className="text-aw-muted text-xs mt-4 text-center">
                  {t(
                    'Pas de mot de passe : tu reçois un lien magique valable une seule fois.',
                    'No password: you receive a one-time magic link.'
                  )}
                </p>
              </form>
            )}

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <div className="card p-4 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-aw-primary shrink-0 mt-0.5" />
                <p className="text-aw-muted text-sm">
                  {t(
                    "La publication finale se fait toujours dans l'app, après relecture.",
                    'Final publishing always happens in the app, after review.'
                  )}
                </p>
              </div>
              <div className="card p-4 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-aw-primary shrink-0 mt-0.5" />
                <p className="text-aw-muted text-sm">
                  {t(
                    "L'ASV vérifie tes sources au moment de la publication, comme aujourd'hui.",
                    'ASV verifies your sources at publish time, as it does today.'
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
