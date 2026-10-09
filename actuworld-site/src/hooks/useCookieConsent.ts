import { useCallback, useEffect, useState } from "react";

export type Consent = "accepted" | "refused" | null;

const KEY = "actuworld-cookie-consent";
const AT_KEY = "actuworld-cookie-consent-at";
/** Le choix est redemandé au bout de 13 mois (recommandation CNIL). */
const MAX_AGE_MS = 395 * 24 * 60 * 60 * 1000;
const EVENT = "aw-consent-change";

/** Lit le consentement courant depuis le localStorage. */
export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    if (v !== "accepted" && v !== "refused") return null;
    const at = Number(localStorage.getItem(AT_KEY));
    // Choix enregistré avant l'ajout de la date : on le date d'aujourd'hui
    if (!at) {
      localStorage.setItem(AT_KEY, String(Date.now()));
      return v;
    }
    if (Date.now() - at > MAX_AGE_MS) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(AT_KEY);
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

function write(v: Consent) {
  if (typeof window === "undefined") return;
  try {
    if (v === null) {
      localStorage.removeItem(KEY);
      localStorage.removeItem(AT_KEY);
    } else {
      localStorage.setItem(KEY, v);
      localStorage.setItem(AT_KEY, String(Date.now()));
    }
  } catch {
    /* stockage indisponible (navigation privée stricte) : le choix ne peut pas être retenu */
  }
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
