import { studioApi } from './api';
import type { JournalBlock, JournalSource, StudioDraftRow } from '../../types/journal';

// Appels journal du Studio. Le Studio n'envoie JAMAIS status:'published' :
// la publication (et le déclenchement ASV) reste exclusivement dans l'app.

// Limites IDENTIQUES au composer mobile (journal/compose.tsx) — même budget,
// même expérience, aucune troncature silencieuse côté app.
export const TITLE_MAX = 120;
export const DEK_MAX = 200;
export const BODY_MAX = 4000;
export const MAX_SOURCES = 2;
export const MAX_TAGS = 3;
export const SOURCE_URL_MAX = 2000;
export const SOURCE_TITLE_MAX = 150;

export type StudioDraftPayload = {
  title: string;
  dek: string | null;
  blocks: JournalBlock[];
  sources: JournalSource[];
  primary_theme: string | null;
  tags?: string[];
  cover_url: string | null;
};

/** Miroir de hasValidSource côté API : URL http/https non vide. */
export function isValidSourceUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

/** Éditeur d'une source déduit du domaine (même logique que le composer mobile). */
export function hostFromUrl(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

/**
 * Nettoie les sources pour l'envoi, comme le composer mobile : URLs trimées,
 * vides écartées, éditeur auto-déduit du domaine (alimente le scoring ASV de
 * diversité), order_index recalculé, plafond MAX_SOURCES.
 */
export function cleanSources(sources: JournalSource[]): JournalSource[] {
  return sources
    .map((source, index) => {
      const url = (source.url || '').trim();
      return {
        url,
        title: source.title?.trim() || null,
        publisher: source.publisher?.trim() || hostFromUrl(url),
        published_at: source.published_at ?? null,
        order_index: index,
      };
    })
    .filter((source) => source.url.length > 0)
    .slice(0, MAX_SOURCES);
}

/** Écarte les blocs texte vides (divider et blocs image toujours gardés). */
export function cleanBlocks(blocks: JournalBlock[]): JournalBlock[] {
  return blocks.filter((block) => block.type === 'divider' || 'uri' in block || block.text.trim().length > 0);
}

/** Longueur « corps » d'un bloc — même règle de budget que le composer mobile. */
export function blockBodyLen(block: JournalBlock): number {
  switch (block.type) {
    case 'heading':
    case 'paragraph':
    case 'quote':
      return block.text.length;
    case 'image_text':
      return block.text.length + (block.caption?.length ?? 0);
    case 'image':
      return block.caption?.length ?? 0;
    default:
      return 0; // divider
  }
}

export function createDraft(payload: StudioDraftPayload): Promise<{ id: string }> {
  // `origin: 'web'` alimente le badge « Reçu du web » dans l'app.
  return studioApi.post<{ id: string }>('/journal', { ...payload, status: 'draft', origin: 'web' });
}

export function updateDraft(id: string, payload: StudioDraftPayload): Promise<unknown> {
  // Pas de champ `status` : le brouillon reste un brouillon.
  return studioApi.put(`/journal/${id}`, payload);
}

/** Tous mes articles (brouillons + publiés), triés par updated_at desc côté API. */
export function listMyJournal(): Promise<StudioDraftRow[]> {
  return studioApi.get<StudioDraftRow[]>('/journal/my');
}

export function deleteDraft(id: string): Promise<unknown> {
  return studioApi.delete(`/journal/${id}`);
}

export type UrlMetadata = {
  reachable: boolean;
  status: number | null;
  title: string | null;
  siteName: string | null;
  publishedAt: string | null;
};

/** Métadonnées + accessibilité d'une URL de source (fetch côté API, hors CORS tiers). */
export function fetchUrlMetadata(url: string): Promise<UrlMetadata> {
  return studioApi.post<UrlMetadata>('/tools/url-metadata', { url });
}
