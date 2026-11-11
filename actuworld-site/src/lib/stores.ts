/**
 * Fiches de l'app sur les stores (publiques depuis le 07/11 sur Google Play et le
 * 10/11 sur l'App Store). Les mêmes adresses sont codées en dur dans nginx.conf
 * (redirection serveur de /telecharger) : les changer aux deux endroits.
 */
export const STORE_URLS = {
  appStore: "https://apps.apple.com/fr/app/actuworld/id6798238132",
  playStore: "https://play.google.com/store/apps/details?id=com.x8max.actuworld"
} as const;

/** Adresse courte à donner partout (réseaux, affiches, QR code). */
export const DOWNLOAD_URL = "https://actuworld.fr/telecharger";

export type MobilePlatform = "ios" | "android";

/**
 * Plateforme mobile du visiteur, ou null sur ordinateur. Un iPad sous iPadOS
 * s'annonce comme un Mac : on le reconnaît à son écran tactile.
 */
export function detectMobilePlatform(): MobilePlatform | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return null;
}
