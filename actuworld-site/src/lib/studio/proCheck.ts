import type { ProInput, ProSectionInput, ProSourceInput } from '../pro/types';
import type { JournalBlock } from '../../types/journal';
import type { PlanItem, PlanItemData, PlanSource } from './redaction';

// Page « Rédaction » → ASV Pro (5.5) : vérifier un contenu du plan AVANT de le
// publier. Le découpage suit celui qu'ASV appliquera une fois le contenu publié
// (api/src/workers/sourceCheckPayload.ts), pour que le rapport annonce le verdict
// de l'app : une dépêche = une section par carte (sujet, recto, verso) avec les
// sources de la carte ; un article = une section par intertitre, chacune avec les
// sources de l'article (`sources_scope: 'text'` : elles valent pour tout le texte).
// Bornes = celles de l'API (api/src/utils/proInput.ts).

const TITLE_MAX = 200;
const SECTION_MAX = 1500;
const MAX_SECTIONS = 30;
const MAX_SOURCES_PER_SECTION = 3;
const MAX_DISTINCT_URLS = 10;
const SOURCE_TITLE_MAX = 150;

export type ProCheckBuild =
  | { ok: true; input: ProInput }
  | { ok: false; fr: string; en: string };

const clean = (s?: string | null) => (s ?? '').trim();

function toSource(src: PlanSource): ProSourceInput | null {
  const url = clean(src.url);
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  } catch {
    return null;
  }
  const title = clean(src.title ?? src.publisher).slice(0, SOURCE_TITLE_MAX);
  return title ? { url, title } : { url };
}

function toSources(list?: PlanSource[] | null): ProSourceInput[] {
  const seen = new Set<string>();
  return (list ?? []).flatMap((s) => {
    const src = toSource(s);
    if (!src || seen.has(src.url)) return [];
    seen.add(src.url);
    return [src];
  });
}

function postSections(d: PlanItemData): ProSectionInput[] {
  return (d.images ?? []).flatMap((card) => {
    const text = [card.subject, card.description, card.back_description]
      .map(clean).filter(Boolean).join('\n').slice(0, SECTION_MAX);
    return text ? [{ text, sources: toSources(card.sources) }] : [];
  });
}

/** Texte vérifiable d'un bloc d'article (mêmes règles que l'API). */
function blockText(block: JournalBlock): { text: string; isHeading: boolean } | null {
  switch (block.type) {
    case 'heading':
      return clean(block.text) ? { text: clean(block.text), isHeading: true } : null;
    case 'quote':
      return clean(block.text)
        ? { text: `« ${clean(block.text)} »${clean(block.author) ? ` (${clean(block.author)})` : ''}`, isHeading: false }
        : null;
    case 'paragraph':
      return clean(block.text) ? { text: clean(block.text), isHeading: false } : null;
    case 'image':
    case 'image_text': {
      const text = [block.type === 'image_text' ? clean(block.text) : '', clean(block.caption)].filter(Boolean).join('\n');
      return text ? { text, isHeading: false } : null;
    }
    default:
      return null;
  }
}

/** Paragraphes d'une section en morceaux ≤ SECTION_MAX, intertitre répété en tête. */
function chunk(heading: string | null, parts: string[]): string[] {
  const render = (ps: string[]) => [heading, ...ps].filter(Boolean).join('\n').slice(0, SECTION_MAX);
  const chunks: string[] = [];
  let current: string[] = [];
  for (const part of parts) {
    if (current.length > 0 && [heading, ...current, part].filter(Boolean).join('\n').length > SECTION_MAX) {
      chunks.push(render(current));
      current = [];
    }
    current = [...current, part];
  }
  if (current.length > 0) chunks.push(render(current));
  return chunks;
}

function articleSections(d: PlanItemData, sources: ProSourceInput[]): ProSectionInput[] {
  const groups: { heading: string | null; parts: string[] }[] = [{ heading: null, parts: [] }];
  for (const block of d.blocks ?? []) {
    const bt = blockText(block);
    if (!bt) continue;
    if (bt.isHeading) groups.push({ heading: bt.text, parts: [] });
    else groups[groups.length - 1].parts.push(bt.text);
  }
  return groups
    .filter((g) => g.parts.length > 0)
    .flatMap((g) => chunk(g.heading, g.parts))
    .map((text) => ({ text, sources }));
}

/**
 * Le contenu du plan (retouches comprises) tel qu'ASV Pro le recevra, ou la
 * raison, en mots, pour laquelle il ne peut pas partir.
 */
export function buildPlanProCheck(item: PlanItem, data: PlanItemData, isEnglish: boolean): ProCheckBuild {
  const isArticle = item.kind === 'article';
  const articleSources = isArticle ? toSources(data.sources) : [];
  if (isArticle && articleSources.length > MAX_SOURCES_PER_SECTION) {
    return {
      ok: false,
      fr: `Cet article cite ${articleSources.length} sources : ASV Pro en accepte ${MAX_SOURCES_PER_SECTION} par passage pour l'instant.`,
      en: `This article cites ${articleSources.length} sources: ASV Pro accepts ${MAX_SOURCES_PER_SECTION} per passage for now.`,
    };
  }
  const sections = (isArticle ? articleSections(data, articleSources) : postSections(data))
    .slice(0, MAX_SECTIONS)
    .map((s) => ({ ...s, sources: s.sources.slice(0, MAX_SOURCES_PER_SECTION) }));

  const distinct = new Set(sections.flatMap((s) => s.sources.map((src) => src.url)));
  if (distinct.size === 0) {
    return { ok: false, fr: 'Aucune source avec un texte : rien à confronter.', en: 'No source next to a text: nothing to check.' };
  }
  if (distinct.size > MAX_DISTINCT_URLS) {
    return {
      ok: false,
      fr: `${distinct.size} sources différentes : ASV Pro en juge ${MAX_DISTINCT_URLS} au plus par vérification.`,
      en: `${distinct.size} different sources: ASV Pro checks ${MAX_DISTINCT_URLS} at most per check.`,
    };
  }

  const firstCard = (data.images ?? []).find((c) => clean(c.subject) || clean(c.description));
  const title = (isArticle
    ? clean(data.title)
    : clean(firstCard?.subject) || clean(firstCard?.description)) || clean(data.planned_subject);
  return {
    ok: true,
    input: {
      title: title.slice(0, TITLE_MAX) || 'Sans titre',
      sections,
      locale: isEnglish ? 'en' : 'fr',
      ...(isArticle ? { sources_scope: 'text' as const } : {}),
    },
  };
}
