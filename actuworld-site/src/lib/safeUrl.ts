/**
 * Filtre des URL saisies par les utilisateurs avant de les rendre en `href`.
 *
 * Seuls les schémas http(s) passent : `javascript:`, `data:`, `vbscript:`… sont
 * refusés (la CSP bloque déjà l'exécution, ceci est la seconde barrière). En cas
 * de refus, l'appelant affiche le texte sans lien.
 */
const HTTP_URL = /^https?:\/\//i;

export function safeHttpUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim() ?? '';
  if (!HTTP_URL.test(trimmed)) return null;
  try {
    const { protocol } = new URL(trimmed);
    return protocol === 'http:' || protocol === 'https:' ? trimmed : null;
  } catch {
    return null;
  }
}
