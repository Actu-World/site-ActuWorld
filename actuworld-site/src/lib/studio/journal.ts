import { studioApi } from './api';
import type { JournalBlock, JournalSource, StudioDraftRow } from '../../types/journal';

// Appels journal du Studio. Le Studio n'envoie JAMAIS status:'published' :
// la publication (et le déclenchement ASV) reste exclusivement dans l'app.

export type StudioDraftPayload = {
  title: string;
  dek: string | null;
  blocks: JournalBlock[];
  sources: JournalSource[];
  primary_theme: string | null;
};

/** Miroir de hasValidSource côté API : URL http/https non vide. */
export function isValidSourceUrl(url: string): boolean {
  return /^https?:\/\//i.test(url.trim());
}

/** Nettoie les sources pour l'envoi : URLs trimées, vides écartées, order_index recalculé. */
export function cleanSources(sources: JournalSource[]): JournalSource[] {
  return sources
    .filter((source) => source.url.trim().length > 0)
    .map((source, index) => ({
      url: source.url.trim(),
      title: source.title?.trim() || null,
      publisher: source.publisher?.trim() || null,
      published_at: source.published_at || null,
      order_index: index,
    }));
}

/** Écarte les blocs texte vides (un divider n'a pas de texte, il est toujours gardé). */
export function cleanBlocks(blocks: JournalBlock[]): JournalBlock[] {
  return blocks.filter((block) => block.type === 'divider' || 'uri' in block || block.text.trim().length > 0);
}

export function createDraft(payload: StudioDraftPayload): Promise<{ id: string }> {
  // `origin: 'web'` : ignoré par l'API tant que le Lot 3 n'est pas déployé,
  // puis alimente le badge « Reçu du web » dans l'app.
  return studioApi.post<{ id: string }>('/journal', { ...payload, status: 'draft', origin: 'web' });
}

export function updateDraft(id: string, payload: StudioDraftPayload): Promise<unknown> {
  // Pas de champ `status` : le brouillon reste un brouillon.
  return studioApi.put(`/journal/${id}`, payload);
}

export async function listMyDrafts(): Promise<StudioDraftRow[]> {
  const rows = await studioApi.get<StudioDraftRow[]>('/journal/my');
  return rows.filter((row) => row.status === 'draft');
}

export function deleteDraft(id: string): Promise<unknown> {
  return studioApi.delete(`/journal/${id}`);
}
