import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { ArrowRight, Smartphone } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, staggerContainer, fadeInUp } from "../components/animations";
import { DOWNLOAD_URL, STORE_URLS, detectMobilePlatform } from "../lib/stores";

/**
 * actuworld.fr/telecharger : lien à envoyer à la main (associations, écoles…)
 * avant le lancement public du 1er décembre. Volontairement absent du menu, des
 * pages et du sitemap, et noindex : le site public annonce la date, il ne
 * propose pas encore de télécharger. Sur téléphone, nginx
 * redirige déjà vers le bon store avant même la page (voir nginx.conf) ; la page
 * reprend la main pour l'iPad (il s'annonce comme un Mac) et, sur ordinateur,
 * propose les deux stores et un QR code à scanner avec le téléphone.
 */
export default function DownloadPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [platform] = useState(detectMobilePlatform);

  useEffect(() => {
    if (platform === "ios") window.location.replace(STORE_URLS.appStore);
    else if (platform === "android") window.location.replace(STORE_URLS.playStore);
  }, [platform]);

  return (
    <PageWrapper className="min-h-[80vh] bg-aw-bg text-aw-text flex items-center">
      <PageMeta
        title={t("Télécharger l'app", "Download the app")}
        description={t(
          "Télécharge ActuWorld gratuitement sur l'App Store et Google Play : l'actualité avec ses sources, vérifiée par ASV.",
          "Download ActuWorld for free on the App Store and Google Play: news with its sources, checked by ASV."
        )}
        path="/telecharger"
        noindex
      />
      <div className="max-w-6xl w-full mx-auto container-px py-16 md:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center"
        >
          <div className="max-w-xl">
            <motion.div
              variants={fadeInUp}
              className="w-14 h-14 rounded-[14px] bg-aw-success flex items-center justify-center mb-8"
              aria-hidden="true"
            >
              <Smartphone className="w-7 h-7 text-aw-primary" />
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.1]">
              {platform
                ? t("Direction le store…", "Taking you to the store…")
                : t("Télécharge ActuWorld", "Download ActuWorld")}
            </motion.h1>
            <motion.p variants={fadeInUp} className="lead mt-5">
              {t(
                "L'app est gratuite sur l'App Store et Google Play. Chaque publication y montre ses sources et son niveau de vérification.",
                "The app is free on the App Store and Google Play. Every post shows its sources and its verification level."
              )}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-3">
              <a href={STORE_URLS.appStore} className="btn-primary">
                App Store
              </a>
              <a href={STORE_URLS.playStore} className="btn-primary">
                Google Play
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8">
              <Link to="/app" className="btn-link">
                {t("Découvrir l'app", "Discover the app")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>

          {!platform && (
            <motion.div variants={fadeInUp} className="hidden md:block text-center">
              <div className="mx-auto w-fit rounded-2xl bg-white p-4 border border-aw">
                <QRCodeSVG
                  value={DOWNLOAD_URL}
                  size={180}
                  marginSize={0}
                  aria-label={t("QR code de téléchargement de l'app", "App download QR code")}
                />
              </div>
              <p className="text-[15px] text-aw-muted mt-4 max-w-[220px] mx-auto">
                {t("Scanne avec ton téléphone pour installer l'app.", "Scan with your phone to install the app.")}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  );
}
