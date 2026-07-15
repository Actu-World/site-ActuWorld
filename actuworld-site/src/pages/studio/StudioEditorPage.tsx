import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, PenLine, Hammer, AlertTriangle } from 'lucide-react';
import { Section } from '../../components/Section';
import { H2 } from '../../components/H2';
import { PageMeta } from '../../components/PageMeta';
import { useLanguage } from '../../i18n/LanguageContext';
import { supabase } from '../../lib/studio/supabase';
import { studioApi } from '../../lib/studio/api';
import { useStudioSession } from '../../hooks/useStudioSession';

type StudioProfile = {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
} | null;

/** Erreur renvoyée par Supabase dans le hash (ex : lien expiré) — lue une seule fois au montage. */
function readAuthErrorFromHash(): string | null {
  const hash = window.location.hash;
  if (!hash.includes('error')) return null;
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  return params.get('error_description') ?? params.get('error');
}

export default function StudioEditorPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const { session, isLoading } = useStudioSession();
  const [profile, setProfile] = useState<StudioProfile>(null);
  const authError = useMemo(readAuthErrorFromHash, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    let isMounted = true;
    studioApi
      .get<StudioProfile>(`/profiles/id/${userId}`)
      .then((data) => {
        if (isMounted) setProfile(data);
      })
      .catch(() => {
        // Non bloquant : la page reste utilisable, on affiche l'email en secours.
      });
    return () => {
      isMounted = false;
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aw-bg flex items-center justify-center">
        <p className="text-aw-muted">{t('Connexion…', 'Signing in…')}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-aw-bg">
        <Section className="pt-24 pb-16">
          <div className="max-w-lg mx-auto text-center">
            {authError ? (
              <div className="card p-8" role="alert">
                <AlertTriangle className="w-8 h-8 text-aw-primary mx-auto mb-4" />
                <h2 className="body-semi text-lg mb-2">
                  {t('Lien invalide ou expiré', 'Invalid or expired link')}
                </h2>
                <p className="text-aw-muted text-sm mb-6">
                  {t(
                    'Ton lien de connexion a déjà été utilisé ou a expiré. Demande-en un nouveau.',
                    'Your sign-in link was already used or has expired. Request a new one.'
                  )}
                </p>
                <Link to="/studio" className="btn-primary inline-flex">
                  {t('Recevoir un nouveau lien', 'Get a new link')}
                </Link>
              </div>
            ) : (
              <Navigate to="/studio" replace />
            )}
          </div>
        </Section>
      </div>
    );
  }

  const displayName =
    profile?.display_name || profile?.username || session.user.email || '';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t('Studio — Éditeur', 'Studio — Editor')}
        description={t(
          "Éditeur web ActuWorld : écris ton article et envoie-le comme brouillon dans l'app.",
          'ActuWorld web editor: write your article and send it as a draft to the app.'
        )}
        path="/studio/editeur"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Barre de session */}
            <div className="card p-4 flex items-center justify-between gap-4 mb-10">
              <div className="flex items-center gap-3 min-w-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-aw-primary flex items-center justify-center shrink-0">
                    <PenLine className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="body-semi truncate">
                    {t('Connecté en tant que', 'Signed in as')} {displayName}
                  </p>
                  {profile?.username && (
                    <p className="text-aw-muted text-sm truncate">@{profile.username}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn-outline inline-flex items-center shrink-0"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t('Se déconnecter', 'Sign out')}
              </button>
            </div>

            <div className="text-center">
              <H2 kicker="Studio" center as="h1">
                {t("L'éditeur arrive ici", 'The editor lands here')}
              </H2>
            </div>

            {/* Placeholder Lot 2 : l'éditeur (titre, blocs, sources) prendra cette place. */}
            <div className="card p-10 text-center mt-8">
              <Hammer className="w-8 h-8 text-aw-primary mx-auto mb-4" />
              <p className="text-aw-muted max-w-md mx-auto">
                {t(
                  "Ta connexion fonctionne. La prochaine étape ajoute ici l'éditeur d'article : titre, texte structuré et sources, puis « Envoyer vers l'app ».",
                  'Your sign-in works. The next step adds the article editor here: title, structured text and sources, then “Send to the app”.'
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
