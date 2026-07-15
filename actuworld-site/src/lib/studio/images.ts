import { studioApi } from './api';
import { STUDIO_SUPABASE_URL } from './config';

// Images du Studio : mêmes règles que l'app mobile (redimension 1920px max,
// JPEG qualité 0.8, bucket `journal`, chemin `userId/...`). L'upload passe par
// l'API (POST /storage/upload/image) — jamais par supabase-js directement.

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 0.8;

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Compression d'image impossible dans ce navigateur.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression d'image échouée."))),
      'image/jpeg',
      JPEG_QUALITY
    );
  });
}

/** Upload une image de journal, renvoie le CHEMIN storage (convention app : les blocs stockent le path). */
export async function uploadJournalImage(file: File): Promise<string> {
  const blob = await compressImage(file);
  const formData = new FormData();
  formData.append('file', blob, `journal-${Date.now()}.jpg`);
  formData.append('bucket', 'journal');
  const result = await studioApi.postForm<{ path: string }>('/storage/upload/image', formData);
  return result.path;
}

function storagePublicUrl(path: string, bucket: string): string {
  if (/^https?:\/\//i.test(path)) return path; // déjà absolue
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  return `${STUDIO_SUPABASE_URL}/storage/v1/object/public/${bucket}/${encoded}`;
}

/** URL publique d'une image du bucket journal (accepte un path ou une URL déjà absolue). */
export function journalImageUrl(path: string): string {
  return storagePublicUrl(path, 'journal');
}

/**
 * URL d'avatar prête pour <img> — miroir de utils/avatar.ts de l'app :
 * path storage → bucket `avatars`, + cache-busting `?v=` basé sur
 * avatar_updated_at (le fichier garde le même chemin quand la photo change).
 */
export function resolveAvatarUrl(
  pathOrUrl?: string | null,
  avatarUpdatedAt?: string | null
): string | null {
  if (!pathOrUrl) return null;
  let url = storagePublicUrl(pathOrUrl, 'avatars');
  if (avatarUpdatedAt) {
    const version = new Date(avatarUpdatedAt).getTime();
    if (!Number.isNaN(version)) {
      url += `${url.includes('?') ? '&' : '?'}v=${version}`;
    }
  }
  return url;
}

/** Initiales pour l'avatar de secours (2 lettres max), comme dans l'app. */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '•';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}
