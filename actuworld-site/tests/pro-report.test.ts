/**
 * ASV Pro (2.14) — logique du rapport (src/lib/pro). Hors de `src` : le site
 * compile `src` et n'a pas Vitest (l'installer échouait, erreur npm « edgesOut »
 * le 16/11). Lancé avec le Vitest de l'API et une config minimale :
 *   cd api-actuWorld/api
 *   (config minimale /tmp/v.mjs : un export par défaut dont test.include vaut
 *    le motif des fichiers .test.ts du dossier tests du site)
 *   JSDOM_FROM=<chemin de APP-RS-8ActuWorld/frontend/package.json> \n *     ./node_modules/.bin/vitest run --root ../../SITE-Actuworld/actuworld-site --config /tmp/v.mjs
 *   (JSDOM_FROM fournit DOMParser au test du collage HTML, sinon il est ignoré)
 */
import { describe, it, expect } from 'vitest';
import {
  cardAdditions, cardStance, faithfulnessWords, highlightAdditions, publisherWords, reviewItems, sectionViews,
  sourceLine, synthesis, toMarkdown, verdictTone, verdictWords,
} from '../src/lib/pro/report';
import { draftProblems } from '../src/lib/pro/draft';
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
    expect(synthesis(views, 'fr')).toBe('1 passage(s) sur 3 avec lien confirmé(s) par leurs sources, 1 contredit(s) par sa source, 1 source(s) non lue(s) ou lue(s) en partie.');
  });

  it('compte à part les passages sans lien, jamais jugés', () => {
    const withIntro: ProInput = { ...input, sections: [{ text: 'Intro sans lien.', sources: [] }, ...input.sections] };
    const shifted = cards.map((c) => ({ ...c, index: c.index + 1 }));
    const views = sectionViews(withIntro, shifted, [], 'fr');
    expect(views[0].stance).toBe('none');
    expect(synthesis(views, 'fr')).toContain('1 passage(s) sans lien');
  });

  it('liste ce qu’il faut reprendre avant publication, dans l’ordre du texte', () => {
    const items = reviewItems(sectionViews(input, cards, [], 'fr'), 'fr');
    expect(items.map((i) => [i.passage, i.tone])).toEqual([[2, 'red'], [3, 'grey'], [3, 'grey']]);
    expect(items[0].text).toBe('Passage 2 : eur-lex.europa.eu dit le contraire. Corrige le passage ou reprends la phrase exacte de la source.');
    expect(items[1].text).toContain("legifrance.gouv.fr n'a pas pu être lue (accès refusé à la lecture automatique)");
    expect(items[2].text).toContain('ton analyse (« C’est une bonne nouvelle. »)');
  });

  it('sur une source lue en partie, ne présente pas la phrase comme un ajout de l’auteur (3.10)', () => {
    const paywalled: CardCheck[] = [cards[0], cards[1], {
      ...cards[2], sources: [{ url: 'https://www.letemps.ch/c', stance: 'supports', source_state: 'paywall_partial' }],
    }];
    const views = sectionViews(input, paywalled, [], 'fr');
    expect(views[2].partialRead).toBe(true);
    const items = reviewItems(views, 'fr');
    expect(items.some((i) => i.text.includes('ton analyse'))).toBe(false);
    expect(items.some((i) => i.text.includes("lue qu'en partie (abonnés)"))).toBe(true);
  });

  it('ne trouve rien à reprendre quand tout est confirmé', () => {
    const views = sectionViews({ ...input, sections: [input.sections[0]] }, [cards[0]], [], 'fr');
    expect(reviewItems(views, 'fr')).toEqual([]);
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
    expect(md).toContain('## À reprendre avant publication');
    expect(md).toContain('## Passage 2 : La source dit le contraire');
    expect(md).not.toMatch(/\/10/);
  });

  it('accepte un passage sans lien, refuse un texte sans aucune source ou à plus de 10 sources', () => {
    expect(draftProblems({ title: 'T', sections: [{ text: 'Intro', sources: [''] }, { text: 'Fait', sources: ['https://a.fr'] }] })).toEqual([]);
    expect(draftProblems({ title: 'T', sections: [{ text: 'Intro', sources: [''] }] })[0].fr).toContain('au moins une source');
    const many = Array.from({ length: 11 }, (_, i) => ({ text: 'Fait', sources: [`https://s${i}.fr`] }));
    expect(draftProblems({ title: 'T', sections: many })[0].fr).toContain('10 sources différentes au plus');
  });
});
