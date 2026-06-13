import { useCallback, useEffect, useState } from "react";

export type Consent = "accepted" | "refused" | null;

const KEY = "actuworld-cookie-consent";
const EVENT = "aw-consent-change";

/** Lit le consentement courant depuis le localStorage. */
export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(KEY);
  return v === "accepted" || v === "refused" ? v : null;
}

function write(v: Consent) {
  if (typeof window === "undefined") return;
  if (v === null) localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, v);
  window.dispatchEvent(new Event(EVENT));
}

/** Enregistre le choix de l'utilisateur. */
export const setConsent = (v: "accepted" | "refused") => write(v);

/** Réinitialise le choix → la bannière réapparaît (retrait du consentement). */
export const resetConsent = () => write(null);

/** Hook réactif : suit le consentement et expose accept / refuse. */
export function useCookieConsent() {
  const [consent, setState] = useState<Consent>(getConsent);

  useEffect(() => {
    const sync = () => setState(getConsent());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const accept = useCallback(() => setConsent("accepted"), []);
  const refuse = useCallback(() => setConsent("refused"), []);

  return { consent, accept, refuse };
}
