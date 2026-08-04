import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import {
  Smartphone,
  Newspaper,
  BookOpen,
  MessagesSquare,
  User,
  Hash,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { PageMeta } from "../components/PageMeta";
import {
  PageWrapper,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";

/** Type de contenu partagé depuis l'app — détermine l'icône, le texte et le deep link. */
export type SharedContentKind = "post" | "journal" | "messages" | "user" | "tag";

/** Liens stores — à renseigner à la publication (null = bouton masqué). */
const STORE_URLS: { playStore: string | null; appStore: string | null } = {
  playStore: null,
  appStore: null
};

/**
 * Atterrissage des liens partagés (https://actuworld.fr/post/<id>, /journal/<id>…).
 * Avec l'app installée, Android/iOS interceptent l'URL avant le navigateur
 * (App Links / Universal Links) : cette page ne s'affiche que sans l'app, ou si
 * la vérification du domaine a échoué — d'où le bouton en actuworld:// qui
 * retente l'ouverture via le scheme natif.
 */
export default function OpenInAppPage({ kind }: { kind: SharedContentKind }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const params = useParams();
  const id = params.id ?? params.username ?? params.slug ?? "";

  const CONTENT = {
    post: {
      icon: Newspaper,
      path: `post/${id}`,
      title: t("Cette publication t'attend dans l'app", "This post is waiting for you in the app"),
      metaTitle: t("Publication partagée", "Shared post")
    },
    journal: {
      icon: BookOpen,
      path: `journal/${id}`,
      title: t("Cet article du journal t'attend dans l'app", "This journal article is waiting for you in the app"),
      metaTitle: t("Article partagé", "Shared article")
    },
    messages: {
      icon: MessagesSquare,
      path: `messages/${id}`,
      title: t("Cette conversation t'attend dans l'app", "This conversation is waiting for you in the app"),
      metaTitle: t("Conversation partagée", "Shared conversation")
    },
    user: {
      icon: User,
      path: `u/${id}`,
      title: t("Ce profil t'attend dans l'app", "This profile is waiting for you in the app"),
      metaTitle: t("Profil partagé", "Shared profile")
    },
    tag: {
      icon: Hash,
      path: `tag/${id}`,
      title: t("Ce thème t'attend dans l'app", "This topic is waiting for you in the app"),
      metaTitle: t("Thème partagé", "Shared topic")
    }
  }[kind];

  const Icon = CONTENT.icon;
  const deepLink = `actuworld://${CONTENT.path}`;
  const hasStoreLinks = Boolean(STORE_URLS.playStore || STORE_URLS.appStore);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text flex items-center justify-center">
      <PageMeta
        title={CONTENT.metaTitle}
        description={t(
          "Ouvre ce contenu dans l'app ActuWorld : l'actualité vérifiée, avec ses sources.",
          "Open this content in the ActuWorld app: verified news, with its sources."
        )}
        path={`/${CONTENT.path}`}
        noindex
      />
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={scaleUp} className="mb-8">
            <motion.div
              className="w-28 h-28 mx-auto rounded-3xl bg-aw-primary flex items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Icon className="w-14 h-14 text-white" />
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{CONTENT.title}</h1>
            <p className="text-aw-muted text-lg max-w-md mx-auto">
              {t(
                "ActuWorld est une app mobile : publications, profils et conversations se lisent dans l'app, avec leurs sources et leur niveau de vérification.",
                "ActuWorld is a mobile app: posts, profiles and conversations live in the app, with their sources and verification level."
              )}
            </p>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <a href={deepLink} className="btn-primary glow-hover inline-flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {t("Ouvrir dans l'app", "Open in the app")}
            </a>
            <Link to="/app" className="btn-outline inline-flex items-center gap-2">
              {t("Découvrir ActuWorld", "Discover ActuWorld")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {hasStoreLinks ? (
            <motion.div
              variants={fadeInUp}
              className="flex items-center justify-center gap-4"
            >
              {STORE_URLS.playStore && (
                <a
                  href={STORE_URLS.playStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Google Play
                </a>
              )}
              {STORE_URLS.appStore && (
                <a
                  href={STORE_URLS.appStore}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  App Store
                </a>
              )}
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="p-4 rounded-2xl bg-aw-surface max-w-md mx-auto">
              <p className="text-sm text-aw-muted">
                {t(
                  "Tu n'as pas encore l'app ? Elle arrive très bientôt sur Google Play et l'App Store.",
                  "Don't have the app yet? It's coming very soon to Google Play and the App Store."
                )}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
