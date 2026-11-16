// ASV Pro — découpe d'un article collé en sections (page « Vérifier un texte »).
// Bornes identiques à l'API (utils/proInput.ts).

export const SECTION_MAX = 1500;
export const MAX_SECTIONS = 10;

export type DraftSection = { text: string; sources: string[] };

/** Découpe un article collé en sections : paragraphes regroupés jusqu'à 1 500 car. */
export function splitIntoSections(article: string, sources: string[]): DraftSection[] {
  const paragraphs = article.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const out: DraftSection[] = [];
  let current = '';
  for (const p of paragraphs) {
    const piece = p.slice(0, SECTION_MAX);
    if (current && (current + '\n\n' + piece).length > SECTION_MAX) {
      out.push({ text: current, sources: [...sources] });
      current = piece;
    } else {
      current = current ? `${current}\n\n${piece}` : piece;
    }
  }
  if (current) out.push({ text: current, sources: [...sources] });
  return out.slice(0, MAX_SECTIONS);
}

