// Normalisation des tags — miroir de APP-RS-8ActuWorld/frontend/lib/tags.ts
// (garder synchronisé) : un tag saisi dans le Studio est identique à celui
// saisi dans l'app.

/** « # » de tête retirés, espaces compactés, première lettre en majuscule. */
export function normalizeTag(value: string): string {
  const tag = value.replace(/^\s*#+/, '').replace(/\s+/g, ' ').trim();
  return tag.charAt(0).toLocaleUpperCase('fr') + tag.slice(1);
}

/** Le tag est-il déjà présent ? (insensible à la casse : « sport » = « Sport »). */
export function hasTag(tags: string[], tag: string): boolean {
  const needle = tag.toLocaleLowerCase('fr');
  return tags.some((t) => t.toLocaleLowerCase('fr') === needle);
}
