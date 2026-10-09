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
import { PageWrapper, staggerContainer, fadeInUp } from "../components/animations";

/** Type de contenu partagé depuis l'app : détermine l'icône, le texte et le deep link. */
export type SharedContentKind = "post" | "journal" | "messages" | "user" | "tag";

/** Liens stores : à renseigner à la publication (null = bouton masqué). */
const STORE_URLS: { playStore: string | null; appStore: string | null } = {
  playStore: null,
  appStore: null
};

/**
 * Atterrissage des liens partagés (https://actuworld.fr/post/<id>, /journal/<id>…).
 * Avec l'app installée, Android/iOS interceptent l'URL avant le navigateur
 * (App Links / Universal Links) : cette page ne s'affiche que sans l'app, ou si
 * la vérification du domaine a échoué, d'où le bouton en actuworld:// qui
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
    <PageWrapper className="min-h-[80vh] bg-aw-bg text-aw-text flex items-center">
      <PageMeta
        title={CONTENT.metaTitle}
        description={t(
          "Ouvre ce contenu dans l'app ActuWorld\u00a0: l'actualité vérifiée, avec ses sources.",
          "Open this content in the ActuWorld app: verified news, with its sources."
        )}
        path={`/${CONTENT.path}`}
        noindex
      />
      <div className="max-w-6xl w-full mx-auto container-px py-20 md:py-28">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
          <motion.div
            variants={fadeInUp}
            className="w-14 h-14 rounded-[14px] bg-aw-success flex items-center justify-center mb-8"
            aria-hidden="true"
          >
            <Icon className="w-7 h-7 text-aw-primary" />
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.1]">
            {CONTENT.title}
          </motion.h1>
          <motion.p variants={fadeInUp} className="lead mt-5">
            {t(
              "ActuWorld est une app mobile\u00a0: publications, profils et conversations s'y lisent avec leurs sources et leur niveau de vérification.",
              "ActuWorld is a mobile app: posts, profiles and conversations are read there with their sources and verification level."
            )}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href={deepLink} className="btn-primary">
              <Smartphone className="w-[18px] h-[18px]" aria-hidden="true" />
              {t("Ouvrir dans l'app", "Open in the app")}
            </a>
            <Link to="/app" className="btn-link">
              {t("Découvrir l'app", "Discover the app")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.div>

          {hasStoreLinks ? (
            <motion.div variants={fadeInUp} className="mt-10 pt-8 border-t border-aw">
              <p className="text-[15px] text-aw-muted mb-4">
                {t("Pas encore l'app\u00a0? Installe-la\u00a0:", "Don't have the app yet? Install it:")}
              </p>
              <div className="flex flex-wrap gap-3">
                {STORE_URLS.playStore && (
                  <a href={STORE_URLS.playStore} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    Google Play
                  </a>
                )}
                {STORE_URLS.appStore && (
                  <a href={STORE_URLS.appStore} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    App Store
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.p variants={fadeInUp} className="mt-10 pt-8 border-t border-aw text-[15px] text-aw-muted">
              {t(
                "Pas encore l'app\u00a0? Elle arrive bientôt sur l'App Store et Google Play.",
                "Don't have the app yet? It's coming soon to the App Store and Google Play."
              )}{" "}
              <Link to="/#rejoindre" className="link">
                {t("Être prévenu de la sortie", "Get notified at launch")}
              </Link>
            </motion.p>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
