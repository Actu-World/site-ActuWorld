// ASV Pro 3.0.1 — coller un article tel quel : chaque paragraphe devient un
// passage, les liens du paragraphe sont ses sources. Fonctionne avec le HTML du
// presse-papiers (Google Docs, Word, CMS), le Markdown `[texte](lien)` et le texte
// brut avec adresses. Pur et testé (tests/pro-paste.test.ts).

import { MAX_SECTIONS, SECTION_MAX, type DraftSection } from './draft';

export const MAX_SOURCES_PER_PASSAGE = 3;

export type PasteResult = {
  title: string | null;
  sections: DraftSection[];
  /** Passages (numéros à partir de 1) qui avaient plus de 3 liens : seuls les 3 premiers sont gardés. */
  tooManyLinks: number[];
  /** Paragraphes au-delà de la limite de passages, non repris. */
  dropped: number;
};

const URL_RE = /\bhttps?:\/\/[^\s<>()"'«»]+[^\s<>()"'«».,;:!?]/gi;
const MD_LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
const BLOCKS = 'p, li, blockquote, h1, h2, h3, h4, h5, h6, pre, td';

/** Lien réel derrière un lien de redirection (Google Docs, Outlook) ; null si pas http(s). */
export function realHref(href: string | null | undefined): string | null {
  if (!href) return null;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (/(^|\.)google\.[a-z.]+$/.test(url.hostname) && url.pathname === '/url') {
    return realHref(url.searchParams.get('q') ?? url.searchParams.get('url'));
  }
  if (/safelinks\.protection\.outlook\.com$/.test(url.hostname)) return realHref(url.searchParams.get('url'));
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  return url.toString();
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();

/** Coupe un paragraphe trop long en morceaux ≤ SECTION_MAX, de préférence en fin de phrase. */
function chunk(text: string): string[] {
  if (text.length <= SECTION_MAX) return [text];
  const out: string[] = [];
  let rest = text;
  while (rest.length > SECTION_MAX) {
    const window = rest.slice(0, SECTION_MAX);
    const cut = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
    const at = cut > SECTION_MAX / 2 ? cut + 1 : SECTION_MAX;
    out.push(rest.slice(0, at).trim());
    rest = rest.slice(at).trim();
  }
  if (rest) out.push(rest);
  return out;
}

type Paragraph = { text: string; links: string[] };

function assemble(paragraphs: Paragraph[], title: string | null): PasteResult {
  const sections: DraftSection[] = [];
  const tooManyLinks: number[] = [];
  let total = 0;
  for (const p of paragraphs) {
    const links = [...new Set(p.links)];
    for (const piece of chunk(p.text)) {
      total += 1;
      if (sections.length >= MAX_SECTIONS) continue;
      if (links.length > MAX_SOURCES_PER_PASSAGE) tooManyLinks.push(sections.length + 1);
      sections.push({ text: piece, sources: links.slice(0, MAX_SOURCES_PER_PASSAGE) });
    }
  }
  return { title, sections, tooManyLinks, dropped: Math.max(total - MAX_SECTIONS, 0) };
}

/** HTML collé : un passage par bloc de texte ; les titres h1 donnent le titre, les autres sont ignorés. */
export function parsePastedHtml(html: string): PasteResult {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  let title: string | null = null;
  const paragraphs: Paragraph[] = [];
  // Un bloc contenu dans un autre bloc retenu (li > p) n'est compté qu'une fois.
  const blocks = Array.from(doc.body.querySelectorAll(BLOCKS)).filter((el) => !el.querySelector(BLOCKS));
  for (const el of blocks) {
    const text = clean(el.textContent ?? '');
    if (!text) continue;
    if (/^H[1-6]$/.test(el.tagName)) {
      if (el.tagName === 'H1' && !title) title = text.slice(0, 200);
      continue;
    }
    const links = Array.from(el.querySelectorAll('a[href]'))
      .map((a) => realHref(a.getAttribute('href')))
      .filter((u): u is string => !!u);
    paragraphs.push({ text, links });
  }
  if (paragraphs.length === 0) return parsePastedText(doc.body.textContent ?? '');
  return assemble(paragraphs, title);
}

/** Texte brut ou Markdown : paragraphes séparés par une ligne vide ; liens Markdown et adresses nues. */
export function parsePastedText(text: string): PasteResult {
  let title: string | null = null;
  const paragraphs: Paragraph[] = [];
  for (const block of text.split(/\n\s*\n/)) {
    const raw = block.trim();
    if (!raw) continue;
    const heading = raw.match(/^#{1,6}\s+(.+)$/);
    if (heading && !raw.includes('\n')) {
      if (raw.startsWith('# ') && !title) title = clean(heading[1]).slice(0, 200);
      continue;
    }
    const links: string[] = [];
    let body = raw.replace(MD_LINK_RE, (_m, label: string, url: string) => {
      const real = realHref(url);
      if (real) links.push(real);
      return label;
    });
    body = body.replace(URL_RE, (url) => {
      const real = realHref(url);
      if (real) links.push(real);
      return '';
    });
    const textOnly = clean(body.replace(/\(\s*\)/g, ''));
    if (textOnly) paragraphs.push({ text: textOnly, links });
  }
  return assemble(paragraphs, title);
}

/** Nombre d'adresses distinctes d'un brouillon (RECO-SRC en juge 10 au plus). */
export function distinctSources(sections: DraftSection[]): number {
  return new Set(sections.flatMap((s) => s.sources.map((u) => u.trim()).filter(Boolean))).size;
}
