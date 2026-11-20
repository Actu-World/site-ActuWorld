import type { JournalBlock } from '../../types/journal';
import type { PlanItem, PlanItemData, PlanSource } from './redaction';

// Studio → ASV Pro (5.5) : vérifier un contenu AVANT de le publier.
//
// 20/11/2026 : le Studio envoie le brouillon TEL QU'IL EST (cartes d'une
// dépêche, ou blocs et sources d'un article). C'est l'API qui le découpe en
// passages, exactement comme à la publication (api/src/utils/proContent.ts),
// avec les mêmes règles que l'app ; ses refus (trop de sources, adresses
// invalides…) reviennent en mots. Ici, seulement le contrôle immédiat : un
// texte ET une source, sinon rien à confronter.

export type StudioCheckRequest = {
  kind: 'post' | 'article';
  locale: 'fr' | 'en';
  /** Titre affiché (« rapport précédent »). */
  title: string;
  content:
    | { title: string; cards: { subject: string; description: string; back_description: string; sources: { url: string; title?: string }[] }[] }
    | { title: string; blocks: JournalBlock[]; sources: { url: string; title?: string; publisher?: string }[] };
};

export type ProCheckBuild =
  | { ok: true; request: StudioCheckRequest }
  | { ok: false; fr: string; en: string };

const NOTHING_TO_CHECK = {
  ok: false as const,
  fr: 'Il faut un texte et au moins une source pour vérifier : rien à confronter.',
  en: 'A text and at least one source are needed: nothing to check.',
};

const clean = (s?: string | null) => (s ?? '').trim();

function toSources(list?: PlanSource[] | null): { url: string; title?: string; publisher?: string }[] {
  return (list ?? []).flatMap((s) => {
    const url = clean(s.url);
    if (!url) return [];
    return [{ url, ...(clean(s.title) ? { title: clean(s.title) } : {}), ...(clean(s.publisher) ? { publisher: clean(s.publisher) } : {}) }];
  });
}

/** Contenu du plan (retouches comprises) à vérifier, ou ce qui manque. */
export function buildPlanProCheck(item: PlanItem, data: PlanItemData, isEnglish: boolean): ProCheckBuild {
  return buildProCheck(item.kind, data, isEnglish);
}

/** Contenu en cours d'écriture dans un éditeur du Studio, à vérifier. */
export function buildProCheck(kind: 'post' | 'article', data: PlanItemData, isEnglish: boolean): ProCheckBuild {
  const locale = isEnglish ? 'en' : 'fr';

  if (kind === 'article') {
    const blocks = data.blocks ?? [];
    const sources = toSources(data.sources);
    const hasText = blocks.some((b) => b.type !== 'heading' && b.type !== 'divider'
      && (clean((b as { text?: string }).text) || clean((b as { caption?: string }).caption)));
    if (!hasText || sources.length === 0) return NOTHING_TO_CHECK;
    const title = clean(data.title) || clean(data.planned_subject);
    return { ok: true, request: { kind, locale, title, content: { title, blocks, sources } } };
  }

  const cards = (data.images ?? []).map((card) => ({
    subject: clean(card.subject),
    description: clean(card.description),
    back_description: clean(card.back_description),
    sources: toSources(card.sources).map(({ url, title }) => (title ? { url, title } : { url })),
  }));
  const hasText = cards.some((c) => c.subject || c.description || c.back_description);
  if (!hasText || !cards.some((c) => c.sources.length > 0)) return NOTHING_TO_CHECK;
  const first = cards.find((c) => c.subject || c.description);
  const title = first?.subject || first?.description || clean(data.planned_subject);
  return { ok: true, request: { kind, locale, title, content: { title, cards } } };
}
