// Crédit des images (Docs/app/CREDITS-IMAGES-TACHES.md §2.3) — miroir de
// frontend/lib/imageCredit.ts pour les aperçus du Studio.

export type ImageCreditKind = 'own' | 'illustration' | 'external';

export const IMAGE_CREDIT_KINDS: readonly ImageCreditKind[] = ['own', 'illustration', 'external'];
export const IMAGE_CREDIT_MAX = 200;
export const IMAGE_CREDIT_URL_MAX = 500;

export type ImageCreditFields = {
  credit_kind?: ImageCreditKind | string | null;
  credit?: string | null;
  credit_url?: string | null;
};

/** Modification émise par l'éditeur de crédit (kind strictement typé). */
export type ImageCreditPatch = {
  credit_kind?: ImageCreditKind | null;
  credit?: string;
  credit_url?: string;
};

/** Vrai quand l'auteur a déclaré une origine (la checklist compte les images créditées). */
export function hasImageCredit(c: ImageCreditFields | null | undefined): boolean {
  return !!c?.credit_kind;
}

/** Légende affichée sous une image, ou null s'il n'y a rien à montrer. */
export function formatImageCredit(
  c: ImageCreditFields | null | undefined,
  opts: { authorHandle?: string | null; isEnglish?: boolean } = {},
): string | null {
  if (!c) return null;
  const en = !!opts.isEnglish;
  const text = c.credit?.trim() || '';
  const kind = c.credit_kind ?? null;
  const photo = en ? 'Photo: ' : 'Photo : ';
  if (kind === 'own') {
    const handle = opts.authorHandle?.trim().replace(/^@/, '');
    if (handle) return `${photo}@${handle}`;
    if (text) return `${photo}${text}`;
    return en ? 'Photo by the author' : 'Photo de l’auteur';
  }
  if (kind === 'illustration') {
    return text ? `${en ? 'Illustration: ' : 'Illustration : '}${text}` : 'Illustration';
  }
  return text ? `${photo}${text}` : null;
}

/** URL cliquable seulement si http(s). */
export function creditLinkUrl(c: ImageCreditFields | null | undefined): string | null {
  const url = c?.credit_url?.trim();
  return url && /^https?:\/\//i.test(url) ? url : null;
}
