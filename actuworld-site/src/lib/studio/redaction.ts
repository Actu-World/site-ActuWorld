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
  credit_kind?: 'own' | 'illustration' | 'external' | string | null;
  credit?: string | null;
  credit_url?: string | null;
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
  cover_credit_kind?: 'own' | 'illustration' | 'external' | string | null;
  cover_credit?: string | null;
  cover_credit_url?: string | null;
  format?: string | null;
  blocks?: JournalBlock[];
  sources?: JournalSource[];
  // calendrier (CALENDRIER-PUBLICATION.md)
  /** Sortie prévue (instant ISO, posé en heure de Paris). */
  scheduled_at?: string | null;
  /** false : seule la date est fixée (contenu « gardé pour plus tard »). */
  scheduled_time?: boolean;
  /** À relire la veille : l'info peut bouger. */
  check_note?: string | null;
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
  /** Dépêche ou article du même titre publié par le compte (détecté par l'API). */
  published?: { id: string; at: string } | null;
  updated_at: string;
};

export type PlanEditEntry = { value: string; at: string; by: string };
/** Chemins : title | dek | cover_credit | cards.<i>.<champ> | blocks.<i>.<champ> */
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

export type EditorialPlan = { accounts: PlanAccount[]; items: PlanItem[]; canEdit?: boolean };

export function getEditorialPlan(): Promise<EditorialPlan> {
  return studioApi.get('/studio/redaction');
}

// Cache mémoire du plan : la page Rédaction est démontée à chaque navigation et
// la session Supabase change d'objet à chaque rafraîchissement de jeton. Sans
// cache, chaque retour sur la page relançait « Chargement du plan… ». Le cache
// vit le temps de l'onglet ; il est invalidé après un envoi ou une publication
// depuis l'éditeur, et remplacé par « Actualiser » ou une retouche.
let planCache: { plan: EditorialPlan; userId: string; at: number } | null = null;

export function readEditorialPlanCache(userId: string): EditorialPlan | null {
  return planCache && planCache.userId === userId ? planCache.plan : null;
}
export function writeEditorialPlanCache(userId: string, plan: EditorialPlan): void {
  planCache = { plan, userId, at: Date.now() };
}
/** À appeler après un envoi ou une publication : le prochain passage sur Rédaction recharge. */
export function invalidateEditorialPlanCache(): void {
  planCache = null;
}

/** Enregistre (ou annule avec value = null) la retouche d'un champ. */
export function saveEditorialEdit(id: string, path: string, value: string | null): Promise<{ edits: PlanEdits | null }> {
  return studioApi.patch(`/studio/redaction/items/${encodeURIComponent(id)}/edits`, { path, value });
}

/** Limites de l'app par champ retouchable (cf. CONSIGNES-REDACTION.md). */
export function editLimit(path: string): number {
  if (path === 'title') return 120;
  if (path === 'dek') return 200;
  if (path === 'cover_credit' || path.endsWith('.credit')) return 200;
  if (path.endsWith('.subject')) return 80;
  if (path.endsWith('.description') && !path.endsWith('back_description')) return 150;
  if (path.endsWith('.back_description')) return 600;
  if (path.endsWith('.caption')) return 100;
  if (path.endsWith('.author')) return 120;
  return 4000;
}

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
    if (group === 'title' || group === 'dek' || group === 'cover_credit') { d[group] = e.value; continue; }
    const idx = Number(idxStr);
    if (group === 'cards' && d.images?.[idx]) {
      (d.images[idx] as Record<string, unknown>)[field] = e.value;
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

export const PLAN_STEPS = ['proposé', 'validé', 'rédigé', 'images', 'brouillon', 'publié'] as const;

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

/** Statut affiché : « publié » dès que l'API a trouvé le contenu dans l'app. */
export function effectiveStatus(item: PlanItem): string {
  return item.published ? 'publié' : item.status;
}

// Le calendrier est tenu en heure de Paris ; la rédaction lit aussi l'heure de La Réunion.
export const PARIS_TZ = 'Europe/Paris';
export const REUNION_TZ = 'Indian/Reunion';

/** Jour (AAAA-MM-JJ) d'un instant, dans un fuseau. */
export function dayKey(iso: string | number, timeZone = PARIS_TZ): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(iso));
}

/** « 7h30 » (fr) / « 7:30 » (en). */
export function formatTime(iso: string, isEnglish: boolean, timeZone = PARIS_TZ): string {
  const parts = new Intl.DateTimeFormat('fr-FR', { timeZone, hour: 'numeric', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso));
  const h = parts.find((p) => p.type === 'hour')?.value ?? '';
  const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
  return isEnglish ? `${h}:${m}` : `${h}h${m}`;
}

/** « Mardi 10 novembre » à partir d'un jour AAAA-MM-JJ. */
export function formatDay(key: string, isEnglish: boolean): string {
  const [y, m, d] = key.split('-').map(Number);
  const s = new Intl.DateTimeFormat(isEnglish ? 'en-GB' : 'fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(y, m - 1, d)));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** « 10 nov. 7h30 » : date courte d'une sortie prévue ou d'une publication. */
export function formatShort(iso: string, isEnglish: boolean, withTime = true): string {
  const date = new Intl.DateTimeFormat(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', timeZone: PARIS_TZ }).format(new Date(iso));
  return withTime ? `${date} ${formatTime(iso, isEnglish)}` : date;
}

/** Contenus du plan dans l'ordre de sortie ; les contenus sans date à la fin. */
export function byScheduleDate(a: PlanItem, b: PlanItem): number {
  const x = a.data.scheduled_at ?? '';
  const y = b.data.scheduled_at ?? '';
  if (x !== y) return !x ? 1 : !y ? -1 : x.localeCompare(y);
  return a.id.localeCompare(b.id);
}
