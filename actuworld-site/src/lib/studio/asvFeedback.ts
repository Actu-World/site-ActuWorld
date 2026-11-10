/**
 * ASV 10.6 — retour à l'auteur dans le Studio : ce qu'ASV a lu comme SES ajouts
 * (avis, conclusion, connaissance perso), c'est-à-dire ce que ses sections
 * affirment sans leur source. Montré, jamais noté. Même règle que l'app et
 * l'API : seules les parties `mixed` comptent (un fait sourcé + un ajout).
 */
import type { AsvCheckData } from '../../types/journal';

export const MAX_AUTHOR_ADDITIONS = 3;

export function authorAdditions(data: AsvCheckData | null | undefined): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const card of data?.verification?.cards ?? []) {
    if (card?.card_kind !== 'mixed' || !Array.isArray(card.additions)) continue;
    for (const raw of card.additions) {
      const text = typeof raw === 'string' ? raw.replace(/\s+/g, ' ').trim() : '';
      const key = text.toLowerCase();
      if (!text || seen.has(key)) continue;
      seen.add(key);
      out.push(text);
      if (out.length >= MAX_AUTHOR_ADDITIONS) return out;
    }
  }
  return out;
}

export function isOpinionOnly(data: AsvCheckData | null | undefined): boolean {
  return data?.verification?.faithfulness?.opinion_only === true;
}

/** ASV 11.3 : aucune partie de faits, au moins une mixte confirmée : « Sources cohérentes, avis de l'auteur ». */
export function isOpinionSourced(data: AsvCheckData | null | undefined): boolean {
  return data?.verification?.faithfulness?.opinion_sourced === true;
}
