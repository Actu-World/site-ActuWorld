// Les 18 thèmes canoniques de l'app (clés = ThemeKey de
// APP-RS-8ActuWorld/frontend/lib/explore/themes.ts — garder synchronisé).
// Couleurs + icônes repris tels quels de l'app pour un rendu identique au
// composer mobile (puce colorée + feuille illustrée). Les icônes Ionicons de
// l'app sont mappées vers leur équivalent lucide-react (utilisé sur le site).

import type { LucideIcon } from 'lucide-react';
import {
  Earth, BookOpen, FlaskConical, Laptop, Search, Globe, Banknote, Gavel,
  Brush, Library, Film, Gamepad2, Utensils, Plane, Leaf, Users, Stethoscope,
  Trophy,
} from 'lucide-react';

export type StudioThemeKey =
  | 'geographie' | 'histoire' | 'sciences' | 'technologie' | 'investigation'
  | 'politique' | 'economie' | 'justice' | 'arts' | 'litterature'
  | 'cinema' | 'gaming' | 'gastronomie' | 'voyage' | 'environnement'
  | 'societe' | 'sante' | 'sport';

export type StudioTheme = {
  key: StudioThemeKey;
  fr: string;
  en: string;
  color: string;
  Icon: LucideIcon;
  descFr: string;
  descEn: string;
};

export const STUDIO_THEMES: StudioTheme[] = [
  { key: 'geographie', fr: 'Géographie & Territoires', en: 'Geography & Territories', color: '#10b981', Icon: Earth, descFr: 'Lieux, cartes, villes, frontières, urbanisme', descEn: 'Places, maps, cities, borders, urbanism' },
  { key: 'histoire', fr: 'Histoire', en: 'History', color: '#8b5cf6', Icon: BookOpen, descFr: 'Événements passés, personnages, civilisations, patrimoine', descEn: 'Past events, figures, civilizations, heritage' },
  { key: 'sciences', fr: 'Sciences', en: 'Science', color: '#3b82f6', Icon: FlaskConical, descFr: 'Physique, chimie, biologie, mathématiques, recherche', descEn: 'Physics, chemistry, biology, mathematics, research' },
  { key: 'technologie', fr: 'Technologie & Innovation', en: 'Technology & Innovation', color: '#06b6d4', Icon: Laptop, descFr: 'Informatique, IA, startups, numérique, gadgets', descEn: 'Computing, AI, startups, digital, gadgets' },
  { key: 'investigation', fr: 'Investigation & Journalisme', en: 'Investigation & Journalism', color: '#f97316', Icon: Search, descFr: 'Enquêtes, analyses, fact-checking, scandales', descEn: 'Investigations, analyses, fact-checking, scandals' },
  { key: 'politique', fr: 'Politique', en: 'Politics', color: '#ef4444', Icon: Globe, descFr: 'Élections, gouvernements, géopolitique, partis', descEn: 'Elections, governments, geopolitics, parties' },
  { key: 'economie', fr: 'Économie & Finance', en: 'Economy & Finance', color: '#ea580c', Icon: Banknote, descFr: 'Marchés, entreprises, business, cryptos, travail', descEn: 'Markets, companies, business, crypto, work' },
  { key: 'justice', fr: 'Justice & Droit', en: 'Justice & Law', color: '#6366f1', Icon: Gavel, descFr: 'Procès, lois, droits, tribunaux, réglementation', descEn: 'Trials, laws, rights, courts, regulation' },
  { key: 'arts', fr: 'Arts & Culture', en: 'Arts & Culture', color: '#ec4899', Icon: Brush, descFr: 'Peinture, musique, expositions, création, patrimoine', descEn: 'Painting, music, exhibitions, creation, heritage' },
  { key: 'litterature', fr: 'Littérature & Philosophie', en: 'Literature & Philosophy', color: '#a855f7', Icon: Library, descFr: 'Livres, auteurs, idées, pensée, essais', descEn: 'Books, authors, ideas, thought, essays' },
  { key: 'cinema', fr: 'Cinéma & Divertissement', en: 'Film & Entertainment', color: '#db2777', Icon: Film, descFr: 'Films, séries, festivals, streaming, acteurs', descEn: 'Films, series, festivals, streaming, actors' },
  { key: 'gaming', fr: 'Gaming & Esport', en: 'Gaming & Esports', color: '#9333ea', Icon: Gamepad2, descFr: 'Jeux vidéo, compétitions, studios, culture geek', descEn: 'Video games, competitions, studios, geek culture' },
  { key: 'gastronomie', fr: 'Gastronomie & Cuisine', en: 'Food & Cooking', color: '#f59e0b', Icon: Utensils, descFr: 'Recettes, restaurants, produits, chefs, terroir', descEn: 'Recipes, restaurants, produce, chefs, terroir' },
  { key: 'voyage', fr: 'Voyage & Tourisme', en: 'Travel & Tourism', color: '#0ea5e9', Icon: Plane, descFr: 'Destinations, aventures, cultures, transports', descEn: 'Destinations, adventures, cultures, transport' },
  { key: 'environnement', fr: 'Environnement & Climat', en: 'Environment & Climate', color: '#84cc16', Icon: Leaf, descFr: 'Climat, biodiversité, énergie, écologie', descEn: 'Climate, biodiversity, energy, ecology' },
  { key: 'societe', fr: 'Société & Social', en: 'Society & Social Issues', color: '#14b8a6', Icon: Users, descFr: 'Faits de société, débats, modes de vie, éducation', descEn: 'Social issues, debates, lifestyles, education' },
  { key: 'sante', fr: 'Santé & Médecine', en: 'Health & Medicine', color: '#f87171', Icon: Stethoscope, descFr: 'Médecine, prévention, bien-être, recherche médicale', descEn: 'Medicine, prevention, wellbeing, medical research' },
  { key: 'sport', fr: 'Sport', en: 'Sports', color: '#a3e635', Icon: Trophy, descFr: 'Compétitions, athlètes, résultats, disciplines', descEn: 'Competitions, athletes, results, disciplines' },
];

/** Accès direct par clé (ex. pour l'aperçu). */
export const STUDIO_THEME_BY_KEY: Record<string, StudioTheme> = Object.fromEntries(
  STUDIO_THEMES.map((th) => [th.key, th]),
);
