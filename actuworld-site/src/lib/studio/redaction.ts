import { studioApi } from './api';
import type { JournalBlock, JournalSource } from '../../types/journal';

// Plan éditorial des comptes officiels (page Studio « Rédaction »).
// Alimenté par api/seed/sync-plan.ts depuis le dépôt actuworld-seed-content.

export type PlanSource = { url: string; title?: string | null; publisher?: string | null; published_at?: string | null };

export type PlanCard = {
  image_url: string | null;
  image_brief?: string | null;
  subject?: string | null;
  description?: string | null;
  back_description?: string | null;
  sources?: PlanSource[];
  credit?: string | null;
};

export type PlanItemData = {
  planned_subject?: string;
  planned_sources?: string;
  primary_theme?: string | null;
  tags?: string[];
  reunion?: boolean;
  // dépêche
  images?: PlanCard[];
  // article
  title?: string | null;
  dek?: string | null;
  cover_path?: string | null;
  cover_brief?: string | null;
  format?: string | null;
  blocks?: JournalBlock[];
  sources?: JournalSource[];
};

export type PlanItem = {
  id: string;
  account_id: string;
  session: string | null;
  kind: 'post' | 'article';
  status: string;
  position: number;
  data: PlanItemData;
  updated_at: string;
};

export type PlanAccount = {
  id: string;
  slug: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
};

export function getEditorialPlan(): Promise<{ accounts: PlanAccount[]; items: PlanItem[] }> {
  return studioApi.get('/studio/redaction');
}

// Retour vers la page Rédaction après le lien magique (qui atterrit toujours sur
// /studio/editeur, seule URL de retour autorisée côté Supabase).
const NEXT_KEY = 'studio-next';

export function rememberRedactionReturn(): void {
  try { localStorage.setItem(NEXT_KEY, 'redaction'); } catch { /* stockage indisponible */ }
}
export function wantsRedactionReturn(): boolean {
  try { return localStorage.getItem(NEXT_KEY) === 'redaction'; } catch { return false; }
}
export function clearRedactionReturn(): void {
  try { localStorage.removeItem(NEXT_KEY); } catch { /* stockage indisponible */ }
}

export const PLAN_STEPS =['proposé', 'validé', 'rédigé', 'images', 'brouillon', 'publié'] as const;

/** Une dépêche ou un article a-t-il du texte rédigé ? */
export function hasText(item: PlanItem): boolean {
  const d = item.data;
  if (item.kind === 'article') return !!d.title?.trim() || (d.blocks ?? []).some((b) => 'text' in b && b.text?.trim());
  return (d.images ?? []).some((c) => c.subject?.trim() || c.description?.trim());
}

/** Nombre d'images attendues / fournies. */
export function imageCount(item: PlanItem): { total: number; ready: number } {
  if (item.kind === 'article') return { total: 1, ready: item.data.cover_path ? 1 : 0 };
  const cards = item.data.images ?? [];
  return { total: cards.length, ready: cards.filter((c) => c.image_url).length };
}

export function itemTitle(item: PlanItem): string {
  const d = item.data;
  return (item.kind === 'article' ? d.title : d.images?.[0]?.subject)?.trim() || d.planned_subject?.split(' — ')[0]?.trim() || '';
}
