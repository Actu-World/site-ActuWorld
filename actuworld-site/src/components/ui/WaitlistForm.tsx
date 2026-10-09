import { useId, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { STUDIO_API_URL } from "../../lib/studio/config";

interface WaitlistFormProps {
  className?: string;
  /** Variante sur fond sombre (panneau vert) */
  tone?: "default" | "dark";
}

/**
 * Inscription à l'alerte de sortie sur les stores.
 * Réutilise l'endpoint `/waitlist/join` (source `site_home`, inchangée pour le suivi).
 */
export const WaitlistForm = ({ className = "", tone = "default" }: WaitlistFormProps) => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const inputId = useId();
  const msgId = useId();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "invalid">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setStatus("invalid");
      document.getElementById(inputId)?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch(`${STUDIO_API_URL}/waitlist/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, locale: isEnglish ? "en" : "fr", source: "site_home" }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const dark = tone === "dark";
  const hasError = status === "invalid" || status === "error";

  if (status === "success") {
    return (
      <p
        className={`flex items-center gap-3 text-[17px] font-semibold ${dark ? "text-white" : "text-aw-text"} ${className}`}
        role="status"
      >
        <CheckCircle2 className={`w-6 h-6 shrink-0 ${dark ? "text-[#A8D5BA]" : "text-aw-primary"}`} aria-hidden="true" />
        {t("C'est noté. On t'écrit dès la sortie.", "Got it. We'll email you at launch.")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={className}>
      <label htmlFor={inputId} className={`block text-sm font-semibold mb-2 ${dark ? "text-white/90" : "text-aw-text"}`}>
        {t("Ton adresse e-mail", "Your email address")}
      </label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id={inputId}
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (hasError) setStatus("idle");
          }}
          placeholder={t("prenom@exemple.fr…", "name@example.com…")}
          aria-invalid={hasError || undefined}
          aria-describedby={msgId}
          className={`field flex-1 ${dark ? "!bg-white/95 !text-[#1B3528] !border-transparent" : ""}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={dark ? "btn-primary !bg-[#A8D5BA] !text-[#0F1512] hover:!bg-white" : "btn-primary"}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              {t("Envoi…", "Sending…")}
            </>
          ) : (
            t("Me prévenir", "Notify me")
          )}
        </button>
      </div>
      <p id={msgId} aria-live="polite" className={`mt-2 text-sm min-h-[1.25rem] ${hasError ? (dark ? "text-[#FFB4A8]" : "text-red-700 dark:text-red-400") : dark ? "text-white/70" : "text-aw-muted"}`}>
        {status === "invalid"
          ? t("Cette adresse ne semble pas valide. Vérifie-la et réessaie.", "This address doesn't look valid. Check it and try again.")
          : status === "error"
            ? t("L'inscription n'a pas abouti. Réessaie dans un instant.", "Sign-up didn't go through. Try again in a moment.")
            : t("On t'écrit dès que l'app sort sur les stores.", "We'll email you as soon as the app is on the stores.")}
      </p>
    </form>
  );
};
