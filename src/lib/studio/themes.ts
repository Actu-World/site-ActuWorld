// Les 18 thèmes canoniques de l'app (clés = ThemeKey de
// APP-RS-8ActuWorld/frontend/lib/explore/themes.ts — garder synchronisé).

export type StudioThemeKey =
  | 'geographie' | 'histoire' | 'sciences' | 'technologie' | 'investigation'
  | 'politique' | 'economie' | 'justice' | 'arts' | 'litterature'
  | 'cinema' | 'gaming' | 'gastronomie' | 'voyage' | 'environnement'
  | 'societe' | 'sante' | 'sport';

export const STUDIO_THEMES: Array<{ key: StudioThemeKey; fr: string; en: string }> = [
  { key: 'geographie', fr: 'Géographie & Territoires', en: 'Geography & Territories' },
  { key: 'histoire', fr: 'Histoire', en: 'History' },
  { key: 'sciences', fr: 'Sciences', en: 'Science' },
  { key: 'technologie', fr: 'Technologie & Innovation', en: 'Technology & Innovation' },
  { key: 'investigation', fr: 'Investigation & Journalisme', en: 'Investigation & Journalism' },
  { key: 'politique', fr: 'Politique', en: 'Politics' },
  { key: 'economie', fr: 'Économie & Finance', en: 'Economy & Finance' },
  { key: 'justice', fr: 'Justice & Droit', en: 'Justice & Law' },
  { key: 'arts', fr: 'Arts & Culture', en: 'Arts & Culture' },
  { key: 'litterature', fr: 'Littérature & Philosophie', en: 'Literature & Philosophy' },
  { key: 'cinema', fr: 'Cinéma & Divertissement', en: 'Film & Entertainment' },
  { key: 'gaming', fr: 'Gaming & Esport', en: 'Gaming & Esports' },
  { key: 'gastronomie', fr: 'Gastronomie & Cuisine', en: 'Food & Cooking' },
  { key: 'voyage', fr: 'Voyage & Tourisme', en: 'Travel & Tourism' },
  { key: 'environnement', fr: 'Environnement & Climat', en: 'Environment & Climate' },
  { key: 'societe', fr: 'Société & Social', en: 'Society & Social Issues' },
  { key: 'sante', fr: 'Santé & Médecine', en: 'Health & Medicine' },
  { key: 'sport', fr: 'Sport', en: 'Sports' },
];
