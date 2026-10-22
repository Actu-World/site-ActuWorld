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
  /** Retouches faites dans le Studio, pas encore rapatriées dans les fichiers (pull-edits.ts). */
  edits?: PlanEdits | null;
  updated_at: string;
};

export type PlanEditEntry = { value: string; at: string; by: string };
/** Chemins : title | dek | cards.<i>.<champ> | blocks.<i>.<champ> */
export type PlanEdits = Record<string, PlanEditEntry>;

export type PlanAccount = {
  id: string;
  slug: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  interests: string[] | null;
};

export function getEditorialPlan(): Promise<{ accounts: PlanAccount[]; items: PlanItem[]; canEdit?: boolean }> {
  return studioApi.get('/studio/redaction');
}

/** Enregistre (ou annule avec value = null) la retouche d'un champ. */
export function saveEditorialEdit(id: string, path: string, value: string | null): Promise<{ edits: PlanEdits | null }> {
  return studioApi.patch(`/studio/redaction/items/${encodeURIComponent(id)}/edits`, { path, value });
}

/** Limites de l'app par champ retouchable (cf. CONSIGNES-REDACTION.md). */
export function editLimit(path: string, cardIndex?: number): number {
  if (path === 'title') return 120;
  if (path === 'dek') return 200;
  if (path.endsWith('.subject')) return 80;
  if (path.endsWith('.description') && !path.endsWith('back_description')) return 150;
  if (path.endsWith('.back_description')) return cardIndex === 0 ? 480 : 600;
  if (path.endsWith('.caption')) return 100;
  if (path.endsWith('.author')) return 120;
  return 4000;
}

const CREDIT_LINE_RE = /\s*Crédits photo : [^\n]*$/;
/** Verso sans la ligne « Crédits photo » ajoutée par la synchro. */
export const stripCredits = (text: string) => text.replace(CREDIT_LINE_RE, '').trim();
const creditLine = (text: string) => text.match(/Crédits photo : [^\n]*$/)?.[0] ?? null;

/** Contenu tel qu'affiché : données synchronisées + retouches en attente. */
export function withEdits(item: PlanItem): PlanItemData {
  const edits = item.edits;
  if (!edits || !Object.keys(edits).length) return item.data;
  const d: PlanItemData = {
    ...item.data,
    images: item.data.images?.map((c) => ({ ...c })),
    blocks: item.data.blocks?.map((b) => ({ ...b })) as JournalBlock[] | undefined,
  };
  for (const [path, e] of Object.entries(edits)) {
    const [group, idxStr, field] = path.split('.');
    if (group === 'title' || group === 'dek') { d[group] = e.value; continue; }
    const idx = Number(idxStr);
    if (group === 'cards' && d.images?.[idx]) {
      const card = d.images[idx] as Record<string, unknown>;
      if (field === 'back_description') {
        const line = creditLine(String(item.data.images?.[idx]?.back_description ?? ''));
        card[field] = line ? `${e.value.trim()}\n\n${line}` : e.value;
      } else card[field] = e.value;
    } else if (group === 'blocks' && d.blocks?.[idx]) {
      (d.blocks[idx] as Record<string, unknown>)[field] = e.value;
    }
  }
  return d;
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
/** Lit ET efface l'intention de retour : une redirection vers Rédaction ne se rejoue jamais. */
export function takeRedactionReturn(): boolean {
  const wanted = wantsRedactionReturn();
  if (wanted) clearRedactionReturn();
  return wanted;
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
