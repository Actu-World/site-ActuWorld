/**
 * Provenance des inscriptions à la liste d'attente.
 *
 * Les liens de campagne portent `?src=ig` (court, pour les bios) ou les UTM
 * classiques (`utm_source`, `utm_campaign`). On les capte à l'arrivée sur
 * n'importe quelle page et on les garde pour la session : un visiteur arrivé
 * par Instagram sur /app puis inscrit plus tard reste attribué à Instagram.
 *
 * Valeur envoyée à l'API (colonne `waitlist_emails.source`, 40 car. max) :
 *   `<formulaire>` ou `<formulaire>:<src>` ou `<formulaire>:<src>:<campagne>`
 *   ex. `site_home`, `liste`, `liste:ig`, `site_home:li:annonce-date`
 */

const STORAGE_KEY = "aw_waitlist_src";

/** Noms longs ramenés à un code court, pour des stats lisibles. */
const ALIASES: Record<string, string> = {
  instagram: "ig",
  insta: "ig",
  facebook: "fb",
  linkedin: "li",
  twitter: "x",
  tiktok: "tt",
  newsletter: "mail",
  email: "mail",
};

export type WaitlistForm = "site_home" | "liste";

function clean(value: string | null, max: number): string {
  if (!value) return "";
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max);
}

/** À appeler à chaque changement d'URL ; ne fait rien sans paramètre de campagne. */
export function captureWaitlistSource(search: string): void {
  const params = new URLSearchParams(search);
  const rawSrc = clean(params.get("src") || params.get("utm_source"), 12);
  if (!rawSrc) return;
  const src = ALIASES[rawSrc] ?? rawSrc;
  const campaign = clean(params.get("utm_campaign"), 16);
  try {
    sessionStorage.setItem(STORAGE_KEY, campaign ? `${src}:${campaign}` : src);
  } catch {
    // Stockage indisponible (navigation privée stricte) : pas d'attribution, pas grave.
  }
}

export function waitlistSource(form: WaitlistForm): string {
  let tag = "";
  try {
    tag = sessionStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    tag = "";
  }
  return tag ? `${form}:${tag}` : form;
}
