import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2, Sparkles, Instagram } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

interface WaitlistFormProps {
  variant?: "inline" | "card";
  className?: string;
}

export const WaitlistForm = ({ variant = "card", className = "" }: WaitlistFormProps) => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }

    setStatus("loading");

    // Simulation d'envoi (à remplacer par une vraie API)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Succès simulé
    setStatus("success");
    setEmail("");

    // Reset après 5 secondes
    setTimeout(() => {
      setStatus("idle");
    }, 5000);
  };

  if (variant === "inline") {
    return (
      <div className={`space-y-4 ${className}`}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aw-muted" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("Votre adresse email", "Your email address")}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-aw bg-aw-bg text-aw-text placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-accent transition-all"
              disabled={status === "loading" || status === "success"}
            />
          </div>
          <motion.button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="btn-primary whitespace-nowrap disabled:opacity-70"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : status === "success" ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                {t("Inscrit !", "Joined!")}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                {t("Rejoindre la beta", "Join the beta")}
              </>
            )}
          </motion.button>
        </form>

        {/* Instagram link */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-aw-muted">{t("Suivez-nous sur", "Follow us on")}</span>
          <motion.a
            href="https://instagram.com/actuworld8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-aw-primary font-medium hover:underline"
            whileHover={{ scale: 1.05 }}
          >
            <Instagram className="w-4 h-4" />
            @actuworld8
          </motion.a>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`card p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-center mb-6">
        <motion.div
          className="w-14 h-14 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Mail className="w-7 h-7 text-aw-primary" />
        </motion.div>
        <h3 className="text-xl font-bold mb-2">{t("Rejoignez la communauté", "Join the community")}</h3>
        <p className="text-aw-muted text-sm">
          {t("Soyez parmi les premiers à explorer ActuWorld et à faire partie de la révolution de l'information.", "Be among the first to explore ActuWorld and be part of the information revolution.")}
        </p>
      </div>

      <div className="text-center">
        <motion.a
          href="mailto:actuworld.app@outlook.fr?subject=Rejoindre la beta ActuWorld"
          className="btn-primary w-full inline-flex items-center justify-center"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {t("Rejoindre la beta", "Join the beta")}
        </motion.a>
      </div>

      {/* Instagram */}
      <div className="mt-6 pt-6 border-t border-aw">
        <motion.a
          href="https://instagram.com/actuworld8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-aw-text">{t("Suivez-nous sur Instagram", "Follow us on Instagram")}</div>
            <div className="text-xs text-aw-muted">@actuworld8</div>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
};
