/**
 * ASV Pro 3.0.1 — coller un article tel quel (src/lib/pro/paste.ts).
 * Le collage HTML utilise DOMParser : fourni par jsdom si JSDOM_FROM pointe vers
 * un node_modules qui le contient (ex. APP-RS-8ActuWorld/frontend/package.json),
 * sinon ces tests-là sont ignorés. Voir l'en-tête de pro-report.test.ts pour lancer.
 */
import { createRequire } from 'node:module';
import { describe, it, expect, beforeAll } from 'vitest';
import { distinctSources, parsePastedHtml, parsePastedText, realHref } from '../src/lib/pro/paste';

let hasDom = typeof DOMParser !== 'undefined';
beforeAll(() => {
  if (hasDom || !process.env.JSDOM_FROM) return;
  try {
    const { JSDOM } = createRequire(process.env.JSDOM_FROM)('jsdom');
    (globalThis as { DOMParser?: unknown }).DOMParser = new JSDOM('').window.DOMParser;
    hasDom = true;
  } catch {
    hasDom = false;
  }
});

describe('texte brut et Markdown', () => {
  it('fait un passage par paragraphe et rattache les liens au leur', () => {
    const r = parsePastedText([
      '# Salaire minimum en Europe',
      '',
      'Cinq pays n’ont pas de salaire minimum légal, selon [EURES](https://eures.europa.eu/a).',
      '',
      'Un paragraphe de transition, sans lien.',
      '',
      'La directive ne fixe pas de niveau : https://eur-lex.europa.eu/b et https://eur-lex.europa.eu/b',
    ].join('\n'));
    expect(r.title).toBe('Salaire minimum en Europe');
    expect(r.sections).toEqual([
      { text: 'Cinq pays n’ont pas de salaire minimum légal, selon EURES.', sources: ['https://eures.europa.eu/a'] },
      { text: 'Un paragraphe de transition, sans lien.', sources: [] },
      { text: 'La directive ne fixe pas de niveau : et', sources: ['https://eur-lex.europa.eu/b'] },
    ]);
    expect(distinctSources(r.sections)).toBe(2);
  });

  it('garde 3 liens par passage et le signale', () => {
    const r = parsePastedText('Quatre liens : https://a.fr https://b.fr https://c.fr https://d.fr');
    expect(r.sections[0].sources).toHaveLength(3);
    expect(r.tooManyLinks).toEqual([1]);
  });

  it('coupe un paragraphe trop long en fin de phrase', () => {
    const r = parsePastedText('Une phrase assez longue pour remplir. '.repeat(60));
    expect(r.sections.length).toBeGreaterThan(1);
    expect(r.sections.every((s) => s.text.length <= 1500)).toBe(true);
    expect(r.sections[0].text.endsWith('.')).toBe(true);
  });

  it('ne garde que 30 passages et compte le reste', () => {
    const r = parsePastedText(Array.from({ length: 33 }, (_, i) => `Paragraphe ${i}.`).join('\n\n'));
    expect(r.sections).toHaveLength(30);
    expect(r.dropped).toBe(3);
  });
});

describe('liens de redirection', () => {
  it('retrouve le vrai lien derrière Google et Outlook, refuse le reste', () => {
    expect(realHref('https://www.google.com/url?q=https://www.insee.fr/x&sa=D')).toBe('https://www.insee.fr/x');
    expect(realHref('https://eur01.safelinks.protection.outlook.com/?url=https%3A%2F%2Flemonde.fr%2Fa')).toBe('https://lemonde.fr/a');
    expect(realHref('mailto:a@b.fr')).toBeNull();
    expect(realHref('javascript:alert(1)')).toBeNull();
  });
});

describe('HTML collé (Google Docs, CMS)', () => {
  it('prend le titre h1, ignore les intertitres, rattache les liens à leur paragraphe', ({ skip }) => {
    if (!hasDom) skip();
    const html = `
      <h1>Salaire minimum en Europe</h1>
      <p>Cinq pays n’ont pas de salaire minimum, selon <a href="https://www.google.com/url?q=https://eures.europa.eu/a">EURES</a>.</p>
      <h2>La directive</h2>
      <p>Un paragraphe sans lien.</p>
      <ul><li><p>Point de liste avec <a href="https://eur-lex.europa.eu/b">le résumé</a>.</p></li></ul>`;
    const r = parsePastedHtml(html);
    expect(r.title).toBe('Salaire minimum en Europe');
    expect(r.sections).toEqual([
      { text: 'Cinq pays n’ont pas de salaire minimum, selon EURES.', sources: ['https://eures.europa.eu/a'] },
      { text: 'Un paragraphe sans lien.', sources: [] },
      { text: 'Point de liste avec le résumé.', sources: ['https://eur-lex.europa.eu/b'] },
    ]);
  });
});
