import type { JournalBlock, JournalSource } from '../../types/journal';

// Autosauvegarde locale de l'éditeur : évite de perdre un article en cours si
// la session expire ou si l'onglet se ferme. Un seul brouillon local par
// utilisateur (le brouillon « officiel » vit côté Supabase après envoi).

export type StudioLocalDraft = {
  editingDraftId: string | null;
  title: string;
  dek: string;
  primaryTheme: string;
  tags?: string[];
  coverPath?: string | null;
  blocks: JournalBlock[];
  sources: JournalSource[];
  savedAt: string;
};

const keyFor = (userId: string) => `aw-studio-draft:${userId}`;

export function loadLocalDraft(userId: string): StudioLocalDraft | null {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StudioLocalDraft;
    if (typeof parsed?.title !== 'string' || !Array.isArray(parsed?.blocks)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveLocalDraft(userId: string, draft: Omit<StudioLocalDraft, 'savedAt'>): void {
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify({ ...draft, savedAt: new Date().toISOString() }));
  } catch {
    // Stockage plein/indisponible : l'autosauvegarde est best-effort.
  }
}

export function clearLocalDraft(userId: string): void {
  try {
    localStorage.removeItem(keyFor(userId));
  } catch {
    // ignore
  }
}
