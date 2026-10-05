// Format éditorial d'un article — miroir de
// APP-RS-8ActuWorld/frontend/lib/journal/formats.ts (garder synchronisé) et de
// la contrainte SQL journal_articles_format_check. Le thème dit DE QUOI parle
// l'article, le format dit QUEL GENRE de texte c'est.

import type { LucideIcon } from 'lucide-react';
import { Newspaper, Search, Lightbulb, MessageCircle } from 'lucide-react';

export type StudioJournalFormat = 'info' | 'enquete' | 'analyse' | 'opinion';

export type StudioFormatConfig = {
  key: StudioJournalFormat;
  fr: string;
  en: string;
  descFr: string;
  descEn: string;
  color: string;
  Icon: LucideIcon;
};

export const DEFAULT_STUDIO_FORMAT: StudioJournalFormat = 'info';

// Mêmes icônes que l'app : journal = info, loupe = enquête, ampoule = analyse,
// bulle de parole = opinion.
export const STUDIO_FORMATS: StudioFormatConfig[] = [
  { key: 'info', fr: 'Info', en: 'News', descFr: 'Faits rapportés et sourcés', descEn: 'Reported, sourced facts', color: '#0ea5e9', Icon: Newspaper },
  { key: 'enquete', fr: 'Enquête', en: 'Investigation', descFr: 'Investigation approfondie, sources multiples', descEn: 'In-depth reporting, multiple sources', color: '#f97316', Icon: Search },
  { key: 'analyse', fr: 'Analyse', en: 'Analysis', descFr: 'Décryptage et mise en perspective', descEn: 'Explainer and context', color: '#8b5cf6', Icon: Lightbulb },
  { key: 'opinion', fr: 'Opinion', en: 'Opinion', descFr: 'Point de vue personnel de l’auteur', descEn: 'The author’s personal view', color: '#f59e0b', Icon: MessageCircle },
];

/** Format valide (retombe sur « info » pour une valeur absente ou inconnue). */
export function normalizeStudioFormat(raw: string | null | undefined): StudioJournalFormat {
  return STUDIO_FORMATS.some((f) => f.key === raw) ? (raw as StudioJournalFormat) : DEFAULT_STUDIO_FORMAT;
}
