import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, Globe2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";

export default function NotFoundPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Animated 404 */}
          <motion.div variants={scaleUp} className="mb-8">
            <motion.div
              className="relative inline-block"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Globe animé */}
              <motion.div
                className="w-32 h-32 mx-auto rounded-3xl bg-aw-primary flex items-center justify-center mb-6"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Globe2 className="w-16 h-16 text-white" />
              </motion.div>

              {/* 404 Text */}
              <motion.h1
                className="text-8xl md:text-9xl font-bold gradient-text"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                404
              </motion.h1>
            </motion.div>
          </motion.div>

          {/* Message */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              {t("Page introuvable", "Page not found")}
            </h2>
            <p className="text-aw-muted text-lg max-w-md mx-auto">
              {t("Oups ! La page que vous recherchez semble avoir disparu dans le flux d'informations.", "Oops! The page you are looking for seems to have disappeared in the information flow.")}
            </p>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            variants={fadeInUp}
            className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8"
          >
            <Link
              to="/"
              className="card card-hover p-4 flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-aw-success flex items-center justify-center flex-shrink-0">
                <Home className="w-5 h-5 text-aw-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t("Accueil", "Home")}</div>
                <div className="text-xs text-aw-muted">{t("Retourner à l'accueil", "Go back to home")}</div>
              </div>
            </Link>

            <Link
              to="/app"
              className="card card-hover p-4 flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-aw-success flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-aw-primary" />
              </div>
              <div>
                <div className="font-semibold text-sm">{t("Explorer", "Explore")}</div>
                <div className="text-xs text-aw-muted">{t("Découvrir ActuWorld", "Discover ActuWorld")}</div>
              </div>
            </Link>
          </motion.div>

          {/* Back button */}
          <motion.div variants={fadeInUp}>
            <button
              onClick={() => window.history.back()}
              className="btn-outline inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Retour à la page précédente", "Back to previous page")}
            </button>
          </motion.div>

          {/* Fun fact */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 p-4 rounded-2xl bg-aw-surface"
          >
            <p className="text-sm text-aw-muted">
              <span className="text-aw-primary font-semibold">{t("Le saviez-vous ?", "Did you know?")}</span>{" "}
              {t("Sur ActuWorld, chaque information est sourcée et vérifiable. Pas de fake news, même pour les pages 404 !", "On ActuWorld, every piece of information is sourced and verifiable. No fake news, even on 404 pages!")}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
