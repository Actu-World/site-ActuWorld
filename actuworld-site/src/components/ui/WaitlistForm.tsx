import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, Loader2, Sparkles, Instagram } from "lucide-react";

interface WaitlistFormProps {
  variant?: "inline" | "card";
  className?: string;
}

export const WaitlistForm = ({ variant = "card", className = "" }: WaitlistFormProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMessage("Veuillez entrer une adresse email valide");
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
              placeholder="Votre adresse email"
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
                Inscrit !
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Rejoindre la beta
              </>
            )}
          </motion.button>
        </form>

        {/* Instagram link */}
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-aw-muted">Suivez-nous sur</span>
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
        <h3 className="text-xl font-bold mb-2">Rejoignez la communauté</h3>
        <p className="text-aw-muted text-sm">
          Soyez parmi les premiers à explorer ActuWorld et à faire partie de la révolution de l'information.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="w-16 h-16 text-aw-accent mx-auto mb-4" />
            </motion.div>
            <h4 className="text-lg font-semibold text-aw-text mb-2">
              Merci pour votre inscription !
            </h4>
            <p className="text-aw-muted text-sm">
              Nous vous contacterons dès le lancement de la beta.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-aw-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="Votre adresse email"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border bg-aw-bg text-aw-text placeholder:text-aw-muted focus:outline-none focus:ring-2 transition-all ${
                  status === "error"
                    ? "border-red-500 focus:ring-red-500"
                    : "border-aw focus:ring-aw-accent"
                }`}
                disabled={status === "loading"}
              />
            </div>

            <AnimatePresence>
              {status === "error" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm"
                >
                  {errorMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary w-full disabled:opacity-70"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "loading" ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Rejoindre la beta
                </>
              )}
            </motion.button>

            <p className="text-xs text-aw-muted text-center">
              Pas de spam. Confidentialité garantie. Vous pouvez vous désinscrire à tout moment.
            </p>
          </motion.form>
        )}
      </AnimatePresence>

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
            <div className="text-sm font-semibold text-aw-text">Suivez-nous sur Instagram</div>
            <div className="text-xs text-aw-muted">@actuworld8</div>
          </div>
        </motion.a>
      </div>
    </motion.div>
  );
};
