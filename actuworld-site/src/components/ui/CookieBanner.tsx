import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useLanguage } from "../../i18n/LanguageContext";

/**
 * Bandeau de consentement cookies (RGPD).
 * Apparaît tant qu'aucun choix n'a été fait. Google Analytics n'est chargé
 * qu'après « Accepter » (voir useGoogleAnalytics).
 */
export const CookieBanner: React.FC = () => {
  const { consent, accept, refuse } = useCookieConsent();
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  // Évite que la bannière soit figée dans le HTML pré-rendu / mismatch d'hydratation
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const show = mounted && consent === null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label={t("Gestion des cookies", "Cookie settings")}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-50 bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 md:inset-x-auto md:right-6 md:max-w-md"
        >
          {/* Refuser et Accepter ont le même style : poids visuel égal (CNIL) */}
          <div className="border border-aw-strong bg-aw-bg p-4 sm:p-5 rounded-[var(--aw-radius-card)]" style={{ boxShadow: "var(--aw-shadow-lg)" }}>
            <div className="flex items-start gap-3">
              <span className="hidden sm:flex w-9 h-9 rounded-[10px] bg-aw-success items-center justify-center shrink-0" aria-hidden="true">
                <Cookie className="w-5 h-5 text-aw-primary" />
              </span>
              <div>
                <p className="font-semibold text-aw-text mb-0.5 sm:mb-1">
                  {t("On respecte ta vie privée", "We respect your privacy")}
                </p>
                <p className="text-sm text-aw-muted leading-relaxed">
                  {t(
                    "Nous utilisons des cookies de mesure d'audience (Google Analytics) uniquement avec ton accord. ",
                    "We use analytics cookies (Google Analytics) only with your consent. "
                  )}
                  {/* Phrase secondaire masquée sur téléphone : la bannière y reste compacte */}
                  <span className="hidden sm:inline">
                    {t("La lecture du site reste possible sans. ", "You can browse the site without them. ")}
                  </span>
                  <Link to="/privacy" className="link">
                    {t("En savoir plus", "Learn more")}
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex gap-3">
              <button type="button" onClick={refuse} className="btn-outline btn-sm flex-1">
                {t("Refuser", "Decline")}
              </button>
              <button type="button" onClick={accept} className="btn-outline btn-sm flex-1">
                {t("Accepter", "Accept")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
