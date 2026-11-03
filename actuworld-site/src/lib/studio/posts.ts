import { studioApi } from './api';
import type { PostDraftImage, PostDraftPayload, PostDraftRow } from '../../types/post';

// Brouillons de dépêches — table dédiée post_drafts côté API — et publication
// directe (POST /posts, même appel que le composer mobile : validation + ASV).

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

const POST_IMAGE_BUCKET = 'post-images';

/**
 * Chemin nu d'une image du bucket post-images (miroir de toStoragePath de l'app) :
 * la base stocke toujours un chemin, l'URL publique est reconstruite au rendu.
 */
function postImagePath(url: string): string {
  const marker = `/${POST_IMAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (!/^https?:\/\//i.test(url) || idx === -1) return url;
  const after = url.slice(idx + marker.length).split('?')[0].split('#')[0];
  try {
    return decodeURIComponent(after);
  } catch {
    return after;
  }
}

/** Crédit envoyé à l'API : rien sans origine, ni texte ni lien pour « Ma photo » (comme l'app). */
function creditPayload(img: PostDraftImage) {
  const kind = img.credit_kind ?? null;
  if (!kind) return { credit_kind: null, credit: null, credit_url: null };
  const url = (img.credit_url ?? '').trim();
  return {
    credit_kind: kind,
    credit: kind === 'own' ? null : (img.credit?.trim() || null),
    credit_url: kind === 'own' ? null : (/^https?:\/\//i.test(url) ? url : null),
  };
}

/**
 * Publie une dépêche : titre = sujet de la carte 1, tldr = son excerpt, body = son
 * dos (comme usePostComposer de l'app). Le brouillon serveur éventuel est
 * supprimé ensuite, best-effort : un brouillon fantôme vaut mieux qu'un doublon.
 */
export async function publishPost(draftId: string | null, payload: PostDraftPayload): Promise<{ id: string }> {
  const images = payload.images;
  const first = images[0];
  const created = await studioApi.post<{ id: string }>('/posts', {
    title: first.subject?.trim() ?? '',
    body: first.back_description?.trim() || null,
    tldr: first.description?.trim() || null,
    tags: payload.tags?.length ? payload.tags : null,
    primary_theme: payload.primary_theme || null,
    visibility: 'public',
    images: images.map((img) => ({
      image_url: postImagePath(img.image_url),
      subject: img.subject?.trim() || null,
      description: img.description?.trim() || null,
      back_description: img.back_description?.trim() || null,
      takeaways: [],
      sources: img.source?.url?.trim()
        ? [{ url: img.source.url.trim(), title: img.source.title?.trim() || null, order_index: 0 }]
        : [],
      ...creditPayload(img),
    })),
  });
  if (draftId) deletePostDraft(draftId).catch(() => { /* best-effort */ });
  return created;
}
