/**
 * ASV Pro (2.14) — logique du rapport (src/lib/pro). Hors de `src` : le site
 * compile `src` et n'a pas Vitest (l'installer échouait, erreur npm « edgesOut »
 * le 16/11). Lancé avec le Vitest de l'API et une config minimale :
 *   cd api-actuWorld/api
 *   (config minimale /tmp/v.mjs : un export par défaut dont test.include vaut
 *    le motif des fichiers .test.ts du dossier tests du site)
 *   ./node_modules/.bin/vitest run --root ../../SITE-Actuworld/actuworld-site --config /tmp/v.mjs
 */
import { describe, it, expect } from 'vitest';
import {
  cardAdditions, cardStance, faithfulnessWords, highlightAdditions, publisherWords, sectionViews,
  sourceLine, synthesis, toMarkdown, verdictTone, verdictWords,
} from '../src/lib/pro/report';
import { splitIntoSections } from '../src/lib/pro/draft';
import type { CardCheck, ProInput, ProVerificationDetail } from '../src/lib/pro/types';

const input: ProInput = {
  title: 'Salaire minimum',
  sections: [
    { text: 'Cinq pays de l’UE n’ont pas de salaire minimum légal.', sources: [{ url: 'https://eures.europa.eu/a' }] },
    { text: 'La directive de 2022 impose un salaire minimum unique.', sources: [{ url: 'https://eur-lex.europa.eu/b' }] },
    { text: 'C’est une bonne nouvelle. La directive date de 2022.', sources: [{ url: 'https://www.legifrance.gouv.fr/c' }] },
  ],
};

const cards: CardCheck[] = [
  { index: 0, stance: 'supports', card_kind: 'fact', sources: [{ url: 'https://eures.europa.eu/a', stance: 'supports', source_state: 'readable', source_quote: 'Danemark, Italie…', quote_grounded: true, explanation: 'Confirme.' }] },
  { index: 1, stance: 'contradicts', card_kind: 'fact', sources: [{ url: 'https://eur-lex.europa.eu/b', stance: 'contradicts', source_state: 'readable', card_claim: 'impose un salaire minimum unique', source_quote: 'ne fixe pas le niveau', quote_grounded: true }] },
  { index: 2, stance: 'unverifiable', card_kind: 'mixed', additions: ['C’est une bonne nouvelle.'], addition_spans: [[0, 25]], sources: [{ url: 'https://www.legifrance.gouv.fr/c', stance: 'unverifiable', source_state: 'blocked_403', source_quote: 'citation non lue', explanation: 'Illisible' }] },
];

describe('verdict', () => {
  it('parle en mots, jamais en chiffres, et colore selon la table Éditeur x Fidélité', () => {
    expect(verdictWords('misleading', 'fr')).toBe('Déforme ses sources');
    expect(verdictWords('partially_true', 'fr', true)).toBe("Sources cohérentes, avis de l'auteur");
    expect(verdictWords('verified', 'en')).toBe('Consistent sources');
    expect(verdictTone('misleading')).toBe('red');
    expect(verdictTone('unverifiable')).toBe('grey');
    expect(verdictTone('partially_true', true)).toBe('light');
  });
});

describe('sections', () => {
  it('montre la phrase démentie en face de la citation', () => {
    const line = sourceLine(cards[1].sources[0], [], 'fr');
    expect(line.claim).toBe('impose un salaire minimum unique');
    expect(line.quote).toBe('ne fixe pas le niveau');
  });

  it('ne montre ni citation ni explication pour une source non lue, mais dit pourquoi', () => {
    const line = sourceLine(cards[2].sources[0], [], 'fr');
    expect(line.quote).toBeNull();
    expect(line.explanation).toBeNull();
    expect(line.state).toBe('Accès refusé à la lecture automatique');
  });

  it("masque l'explication du modèle (en français) quand la page est en anglais", () => {
    expect(sourceLine(cards[0].sources[0], [], 'en').explanation).toBeNull();
    expect(sourceLine(cards[0].sources[0], [], 'fr').explanation).toBe('Confirme.');
  });

  it("surligne les ajouts de l'auteur seulement sur une carte mixte", () => {
    expect(highlightAdditions(input.sections[2].text, cards[2])).toEqual([
      { text: 'C’est une bonne nouvelle.', added: true },
      { text: ' La directive date de 2022.', added: false },
    ]);
    expect(highlightAdditions('abc', { ...cards[2], card_kind: 'fact' })).toEqual([{ text: 'abc', added: false }]);
    expect(cardAdditions(cards[2])).toEqual(['C’est une bonne nouvelle.']);
    expect(cardAdditions(cards[0])).toEqual([]);
  });

  it("classe une carte d'avis comme avis, sauf contradiction prouvée", () => {
    expect(cardStance({ index: 0, stance: 'supports', card_kind: 'opinion', sources: [] })).toBe('opinion');
    expect(cardStance({ index: 0, stance: 'contradicts', card_kind: 'opinion', sources: [] })).toBe('contradicts');
    expect(cardStance(undefined)).toBe('none');
  });

  it('résume en une phrase', () => {
    const views = sectionViews(input, cards, [], 'fr');
    expect(synthesis(views, 'fr')).toBe('1 section(s) sur 3 confirmée(s) par leurs sources, 1 contredite(s) par sa source, 1 source(s) non lue(s).');
  });
});

describe('notes', () => {
  it('Éditeur et Fidélité en mots, seuils de RECO-SRC', () => {
    expect(publisherWords({ score: 8, label: '', sources_evaluated: 3 }, 'fr')).toBe('Éditeurs identifiables');
    expect(publisherWords({ score: 5.5, label: 'Non applicable', sources_evaluated: 0 }, 'fr')).toBe('Non applicable (réseaux sociaux, vidéos)');
    expect(faithfulnessWords({ available: false, stance_counts: { unverifiable: 2 } }, 'fr')).toBe('Non établie : sources illisibles');
    expect(faithfulnessWords({ available: true, score: 9, stance_counts: { contradicts: 1 } }, 'fr')).toBe('Déforme ses sources');
  });
});

describe('export et découpe', () => {
  it('produit un Markdown complet et sans chiffre de note', () => {
    const detail = {
      id: 'v1', title: input.title, status: 'done', verdict_status: 'misleading', verdict_label: null, verdict_color: null,
      llm_status: 'ok', created_at: '2026-11-16T10:00:00Z', finished_at: '2026-11-16T10:01:00Z', reverify_count: 0, input,
      result: { verification: { status: 'misleading', cards, sources_check: [] } },
    } as ProVerificationDetail;
    const md = toMarkdown(detail, 'fr');
    expect(md).toContain('# Salaire minimum');
    expect(md).toContain('Déforme ses sources');
    expect(md).toContain('La source dit : « ne fixe pas le niveau »');
    expect(md).not.toMatch(/\/10/);
  });

  it("découpe un article en sections d'au plus 1 500 caractères avec ses sources", () => {
    const article = ['A'.repeat(900), 'B'.repeat(900), 'C'.repeat(100)].join('\n\n');
    const sections = splitIntoSections(article, ['https://a.fr']);
    expect(sections).toHaveLength(2);
    expect(sections.every((s) => s.text.length <= 1500 && s.sources[0] === 'https://a.fr')).toBe(true);
  });
});
