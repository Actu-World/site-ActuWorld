// Types journal du Studio — copie conforme de la source de vérité :
// APP-RS-8ActuWorld/frontend/types/journal.ts (garder synchronisé à la main,
// pas de package partagé en V1). Le Studio ne CRÉE que des blocs texte
// (heading/paragraph/quote/divider) mais doit pouvoir relire des brouillons
// contenant des images.

export type JournalBlock =
  | { type: 'heading'; text: string; level?: 1 | 2 | 3 }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; uri: string; caption?: string; width?: number; height?: number }
  | { type: 'image_text'; uri: string; caption?: string; text: string; align?: 'left' | 'right' }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'divider' };

export type JournalSource = {
  url: string;
  title?: string | null;
  publisher?: string | null;
  published_at?: string | null; // ISO
  order_index?: number | null;
};

/** Ligne renvoyée par GET /journal/my (select * sur journal_articles). */
export type StudioDraftRow = {
  id: string;
  title: string;
  dek: string | null;
  status: 'draft' | 'published';
  blocks: JournalBlock[] | null;
  sources: JournalSource[] | null;
  primary_theme: string | null;
  tags: string[] | null;
  cover_url: string | null;
  origin?: 'app' | 'web' | null; // colonne ajoutée au Lot 3
  created_at: string;
  updated_at: string;
};
