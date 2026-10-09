import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, staggerContainer, fadeInUp } from "../components/animations";

export default function NotFoundPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-[80vh] bg-aw-bg text-aw-text flex items-center">
      <PageMeta
        title={t("Page introuvable", "Page not found")}
        description={t("Cette page n'existe pas ou a été déplacée.", "This page doesn't exist or has moved.")}
        path="/404"
        noindex
      />
      <div className="max-w-6xl w-full mx-auto container-px py-16 md:py-28">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
          <motion.p variants={fadeInUp} className="eyebrow mb-5 tabular">
            {t("Erreur 404", "Error 404")}
          </motion.p>
          <motion.h1 variants={fadeInUp} className="display">
            {t("Cette page n'a pas de source.", "This page has no source.")}
          </motion.h1>
          <motion.p variants={fadeInUp} className="lead mt-6">
            {t(
              "Le lien est peut-être incomplet, ou la page a été déplacée. Reprends depuis l'accueil.",
              "The link may be incomplete, or the page has moved. Start again from the home page."
            )}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/" className="btn-primary">
              {t("Retour à l'accueil", "Back to home")}
            </Link>
            <button type="button" onClick={() => window.history.back()} className="btn-link">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              {t("Page précédente", "Previous page")}
            </button>
          </motion.div>

          <motion.nav
            variants={fadeInUp}
            aria-label={t("Pages utiles", "Useful pages")}
            className="mt-14 pt-8 border-t border-aw"
          >
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
              {[
                { to: "/app", label: t("Découvrir l'app", "Discover the app") },
                { to: "/reco-src", label: t("Comment ASV vérifie", "How ASV verifies") },
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="btn-link">
                    {l.label}
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
