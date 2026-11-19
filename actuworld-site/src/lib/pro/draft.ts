// ASV Pro — brouillon de la page « Vérifier un texte ».
// Bornes identiques à l'API (utils/proInput.ts).

export const TITLE_MAX = 200;
export const SECTION_MAX = 1500;
/** Un article réel : jusqu'à 30 paragraphes ; seuls ceux qui ont un lien sont jugés. */
export const MAX_SECTIONS = 30;
export const MAX_SOURCES = 3;
/** RECO-SRC juge au plus 10 adresses distinctes par vérification. */
export const MAX_DISTINCT_SOURCES = 10;

/** Brouillon du formulaire « Vérifier un texte », gardé dans le navigateur. */
export const DRAFT_KEY = 'aw_pro_draft_v2';

export type DraftSection = { text: string; sources: string[] };
/**
 * `scope` : `passage` (défaut) = chaque passage a ses propres liens ; `text` = une
 * seule liste de sources (`sources`) pour tout le texte, comme un article.
 */
export type DraftScope = 'passage' | 'text';
export type Draft = { title: string; sections: DraftSection[]; scope?: DraftScope; sources?: string[] };

const validUrls = (list: string[]) => list.map((u) => u.trim()).filter(isUrl);

/** Adresses valides et distinctes que le brouillon enverra, selon son mode. */
export function draftSourceUrls(draft: Draft): string[] {
  const all = draft.scope === 'text' ? validUrls(draft.sources ?? []) : draft.sections.flatMap((s) => validUrls(s.sources));
  return [...new Set(all)];
}

export function isUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export type DraftProblem = { fr: string; en: string };

/** Ce qui empêche d'envoyer le brouillon, en mots (FR/EN). */
export function draftProblems(draft: Draft): DraftProblem[] {
  const list: DraftProblem[] = [];
  if (!draft.title.trim()) list.push({ fr: 'Donne un titre à ton texte.', en: 'Give your text a title.' });
  draft.sections.forEach((s, i) => {
    const n = i + 1;
    if (!s.text.trim()) list.push({ fr: `Passage ${n} : le texte est vide.`, en: `Passage ${n}: the text is empty.` });
    if (s.text.length > SECTION_MAX) list.push({ fr: `Passage ${n} : trop long.`, en: `Passage ${n}: too long.` });
    if (draft.scope !== 'text' && s.sources.some((u) => u.trim() && !isUrl(u))) {
      list.push({ fr: `Passage ${n} : une adresse n'est pas valide.`, en: `Passage ${n}: an address is not valid.` });
    }
  });
  if (draft.scope === 'text' && (draft.sources ?? []).some((u) => u.trim() && !isUrl(u))) {
    list.push({ fr: "Sources du texte : une adresse n'est pas valide.", en: 'Text sources: an address is not valid.' });
  }
  const distinct = draftSourceUrls(draft).length;
  if (distinct === 0) list.push({ fr: 'Ajoute au moins une source : sans lien, rien à confronter.', en: 'Add at least one source: without a link, nothing to check.' });
  if (distinct > MAX_DISTINCT_SOURCES) {
    list.push({
      fr: `${MAX_DISTINCT_SOURCES} sources différentes au plus (tu en as ${distinct}) : découpe ton texte en deux vérifications.`,
      en: `${MAX_DISTINCT_SOURCES} different sources at most (you have ${distinct}): split your text into two checks.`,
    });
  }
  return list;
}
