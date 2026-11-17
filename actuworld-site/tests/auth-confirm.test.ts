/**
 * Lien de connexion par email (/auth/confirm) : la destination après connexion
 * vient d'une liste fermée, jamais de l'URL telle quelle (pas de redirection ouverte).
 * Lancé comme les autres tests du site (voir tests/pro-report.test.ts).
 */
import { describe, it, expect } from 'vitest';
import { safeNext } from '../src/pages/AuthConfirmPage';

describe('safeNext', () => {
  it('accepte les deux destinations prévues', () => {
    expect(safeNext('/pro')).toBe('/pro');
    expect(safeNext('/studio/editeur')).toBe('/studio/editeur');
  });

  it('renvoie au Studio pour tout le reste', () => {
    for (const raw of [null, '', 'https://evil.example/pro', '//evil.example', '/pro/../admin', '/PRO']) {
      expect(safeNext(raw)).toBe('/studio/editeur');
    }
  });
});
