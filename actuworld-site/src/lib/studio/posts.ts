import { studioApi } from './api';
import type { PostDraftPayload, PostDraftRow } from '../../types/post';

// Brouillons de posts rapides — table dédiée post_drafts côté API.
// La publication (validation 1 source/image + ASV) reste dans l'app.

// Limites IDENTIQUES au composer mobile (features/postComposer).
export const MAX_POST_IMAGES = 4;
export const POST_SUBJECT_MAX = 80;      // titre de carte (3 lignes sur la cover)
export const POST_DESC_MAX = 150;        // excerpt court
export const POST_BACK_DESC_MAX = 600;   // description longue (dos de carte)
export const POST_SOURCE_URL_MAX = 2000;
export const POST_SOURCE_TITLE_MAX = 100;

export function listMyPostDrafts(): Promise<PostDraftRow[]> {
  return studioApi.get<PostDraftRow[]>('/posts/drafts');
}

export function createPostDraft(payload: PostDraftPayload): Promise<{ id: string }> {
  return studioApi.post<{ id: string }>('/posts/drafts', { payload, origin: 'web' });
}

export function updatePostDraft(id: string, payload: PostDraftPayload): Promise<unknown> {
  return studioApi.put(`/posts/drafts/${id}`, { payload });
}

export function deletePostDraft(id: string): Promise<unknown> {
  return studioApi.delete(`/posts/drafts/${id}`);
}

/** Titre lisible d'un brouillon de post (sujet de la carte 1). */
export function postDraftTitle(payload: PostDraftPayload): string {
  return payload.images?.[0]?.subject?.trim() || '';
}
