import type { ProAccess, ProVerificationDetail } from '../pro/types';

// Rapports « vérifier avant de publier » du Studio, gardés dans le navigateur
// (20/11/2026, même règle que l'app). Quitter la page, recharger ou fermer la
// fenêtre ne fait pas perdre la vérification : le rapport (et l'analyse encore
// en cours) est rangé avec le compte qui l'a lancé, et rattaché à SON
// brouillon. Un brouillon ne montre jamais le rapport d'un autre.

export type ProCheckKind = 'post' | 'article';

export type StoredProCheck = {
  kind: ProCheckKind;
  /** Brouillon serveur, ou null pour l'éditeur pas encore enregistré. */
  draftId: string | null;
  /** Contenu vérifié (JSON de l'entrée ASV) : le rapport vaut pour ce texte exact. */
  key: string;
  title: string;
  verificationId: string;
  access: ProAccess | null;
  counted: boolean;
  /** Lancement (ms). */
  at: number;
  /** Absent : analyse encore en cours. */
  detail?: ProVerificationDetail;
};

/** Au-delà, les plus anciens partent (ils restent dans ASV Pro). */
const MAX_ENTRIES = 8;
const keyFor = (userId: string) => `aw-studio-pro-checks:${userId}`;

const listeners = new Set<() => void>();

/** Prévient à chaque changement ; rend la fonction de désabonnement. */
export function subscribeProChecks(listener: () => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function read(userId: string): StoredProCheck[] {
  try {
    const raw = localStorage.getItem(keyFor(userId));
    const parsed = raw ? (JSON.parse(raw) as unknown) : null;
    return Array.isArray(parsed) ? (parsed as StoredProCheck[]) : [];
  } catch {
    return [];
  }
}

function write(userId: string, entries: StoredProCheck[]): StoredProCheck[] {
  const kept = [...entries].sort((a, b) => b.at - a.at).slice(0, MAX_ENTRIES);
  try {
    localStorage.setItem(keyFor(userId), JSON.stringify(kept));
  } catch {
    // Stockage plein ou indisponible : le rapport reste dans ASV Pro.
  }
  listeners.forEach((listener) => listener());
  return kept;
}

export function loadProChecks(userId: string, kind: ProCheckKind): StoredProCheck[] {
  return read(userId).filter((e) => e.kind === kind);
}

/** Ajoute ou remplace (même rapport). */
export function saveProCheck(userId: string, entry: StoredProCheck): void {
  write(userId, [entry, ...read(userId).filter((e) => e.verificationId !== entry.verificationId)]);
}

/**
 * Range le rapport arrivé sur l'analyse telle qu'elle est MAINTENANT (le
 * brouillon a pu être enregistré entre-temps). Rend l'entrée, ou null si elle
 * a été oubliée (brouillon publié ou supprimé pendant l'analyse).
 */
export function completeProCheck(userId: string, verificationId: string, detail: ProVerificationDetail): StoredProCheck | null {
  const all = read(userId);
  const found = all.find((e) => e.verificationId === verificationId);
  if (!found) return null;
  const done = { ...found, detail };
  write(userId, all.map((e) => (e.verificationId === verificationId ? done : e)));
  return done;
}

export function removeProCheck(userId: string, verificationId: string): void {
  write(userId, read(userId).filter((e) => e.verificationId !== verificationId));
}

/** Le brouillon reçoit son identifiant (première sauvegarde) : ses rapports le suivent. */
export function moveProChecks(userId: string, kind: ProCheckKind, from: string | null, to: string): void {
  if (from === to) return;
  const all = read(userId);
  if (!all.some((e) => e.kind === kind && e.draftId === from)) return;
  write(userId, all.map((e) => (e.kind === kind && e.draftId === from ? { ...e, draftId: to } : e)));
}

/** Brouillon publié, supprimé ou éditeur vidé : ses rapports n'ont plus lieu d'être ici. */
export function forgetProChecks(userId: string, kind: ProCheckKind, draftId: string | null): void {
  const all = read(userId);
  if (!all.some((e) => e.kind === kind && e.draftId === draftId)) return;
  write(userId, all.filter((e) => !(e.kind === kind && e.draftId === draftId)));
}
