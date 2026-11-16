// ASV Pro — ce que dit un rapport, en mots (FR/EN), à partir de la réponse brute
// de RECO-SRC. Même vocabulaire et mêmes règles que la fiche de l'app
// (APP-RS frontend/lib/verification : cards.ts, notesLabels.ts, locales) :
// jamais de chiffre nu comme verdict, jamais « vrai / faux ».

import type {
  Alert, CardCheck, CardKind, CardSource, FaithfulnessNote, ProInput, ProSectionInput,
  ProVerificationDetail, PublisherNote, SourceCheck, Stance,
} from './types';

export type Lang = 'fr' | 'en';
export type Tone = 'green' | 'light' | 'orange' | 'red' | 'grey';
export type StanceKey = Stance | 'none' | 'opinion';

const pick = (lang: Lang, fr: string, en: string) => (lang === 'en' ? en : fr);

// ── Verdict global (table Éditeur x Fidélité, RECO-SRC 4.3 et 11.3) ────────────

export function verdictWords(status: string | null | undefined, lang: Lang, opinionSourced = false): string {
  if (opinionSourced && status === 'partially_true') {
    return pick(lang, "Sources cohérentes, avis de l'auteur", "Consistent sources, author's opinion");
  }
  switch (status) {
    case 'verified': return pick(lang, 'Sources cohérentes', 'Consistent sources');
    case 'partially_true': return pick(lang, 'Sources acceptables', 'Acceptable sources');
    case 'context_missing': return pick(lang, 'À vérifier', 'To be checked');
    case 'misleading': return pick(lang, 'Déforme ses sources', 'Distorts its sources');
    case 'failed': return pick(lang, 'Vérification indisponible', 'Verification unavailable');
    case 'unverifiable': return pick(lang, 'Non vérifiable', 'Not verifiable');
    default: return pick(lang, 'Vérification en cours', 'Verification in progress');
  }
}

export function verdictTone(status: string | null | undefined, opinionSourced = false): Tone {
  if (opinionSourced && status === 'partially_true') return 'light';
  switch (status) {
    case 'verified': return 'green';
    case 'partially_true': return 'light';
    case 'context_missing': return 'orange';
    case 'misleading': return 'red';
    default: return 'grey';
  }
}

/** Couleurs du feu ASV (DESIGN.md : réservées aux verdicts). */
export const TONE_COLOR: Record<Tone, string> = {
  green: '#16a34a',
  light: '#65a30d',
  orange: '#f59e0b',
  red: '#dc2626',
  grey: '#6b7280',
};

// ── Par section : verdict de la carte et de chacune de ses sources ─────────────

const STANCES: Stance[] = ['supports', 'contradicts', 'unrelated', 'unverifiable'];
const KINDS: CardKind[] = ['fact', 'opinion', 'mixed'];
const MAX_ADDITIONS = 3;

export function stanceWords(key: StanceKey, lang: Lang): string {
  switch (key) {
    case 'supports': return pick(lang, 'Confirmée par la source', 'Confirmed by the source');
    case 'contradicts': return pick(lang, 'La source dit le contraire', 'The source says the opposite');
    case 'unrelated': return pick(lang, 'Source hors sujet', 'Off-topic source');
    case 'unverifiable': return pick(lang, 'Non vérifiable', 'Not verifiable');
    case 'opinion': return pick(lang, "Avis de l'auteur, non vérifié", "Author's opinion, not verified");
    default: return pick(lang, 'Sans source', 'No source');
  }
}

export function stanceTone(key: StanceKey): Tone {
  if (key === 'supports') return 'green';
  if (key === 'contradicts') return 'red';
  if (key === 'unrelated') return 'orange';
  return 'grey';
}

export function stateWords(state: string | null | undefined, lang: Lang): string | null {
  switch (state) {
    case null: case undefined: case 'readable': return null;
    case 'not_found': return pick(lang, 'Lien mort', 'Dead link');
    case 'blocked_403': return pick(lang, 'Accès refusé à la lecture automatique', 'Automatic reading refused');
    case 'timeout': return pick(lang, 'Délai de lecture dépassé', 'Reading timed out');
    case 'unsupported_type': return pick(lang, 'Format non lisible (vidéo, réseau social)', 'Unreadable format (video, social network)');
    case 'too_short': return pick(lang, "Page sans texte d'article", 'Page without article text');
    case 'pdf_no_text': return pick(lang, 'PDF scanné, sans texte lisible', 'Scanned PDF, no readable text');
    case 'paywall': case 'paywall_partial': return pick(lang, 'Article réservé aux abonnés, lu en partie', 'Subscriber-only article, partly read');
    default: return pick(lang, 'Lecture impossible', 'Could not be read');
  }
}

export function cardKind(card: CardCheck | undefined): CardKind | null {
  return card && KINDS.includes(card.card_kind as CardKind) ? (card.card_kind as CardKind) : null;
}

export function cardStance(card: CardCheck | undefined): StanceKey {
  if (!card) return 'none';
  const stance = STANCES.includes(card.stance as Stance) ? (card.stance as Stance) : 'none';
  if (cardKind(card) === 'opinion' && stance !== 'contradicts' && stance !== 'none') return 'opinion';
  return stance;
}

/** « L'auteur ajoute » : seulement sur une carte mixte (mesure 10.2 de l'app). */
export function cardAdditions(card: CardCheck | undefined): string[] {
  if (!card || cardKind(card) !== 'mixed' || !Array.isArray(card.additions)) return [];
  return card.additions.map((a) => (typeof a === 'string' ? a.trim() : '')).filter(Boolean).slice(0, MAX_ADDITIONS);
}

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function isRead(state?: string | null): boolean {
  return !state || state === 'readable' || state === 'paywall' || state === 'paywall_partial';
}

export function reliabilityWords(score: number, lang: Lang): string {
  if (score >= 8) return pick(lang, 'Fiable', 'Reliable');
  if (score >= 6) return pick(lang, 'Plutôt fiable', 'Fairly reliable');
  if (score >= 4) return pick(lang, 'Moyennement fiable', 'Moderately reliable');
  return pick(lang, 'Peu fiable', 'Not very reliable');
}

export type SourceLine = {
  url: string;
  domain: string;
  stance: StanceKey;
  state: string | null;
  claim: string | null;
  quote: string | null;
  explanation: string | null;
  publisher: string | null;
};

export function sourceLine(src: CardSource, checks: SourceCheck[], lang: Lang): SourceLine {
  const stance: StanceKey = STANCES.includes(src.stance as Stance) ? (src.stance as Stance) : 'unverifiable';
  const read = isRead(src.source_state);
  const quote = src.source_quote?.trim();
  const claim = src.card_claim?.trim();
  const check = checks.find((c) => c.url === src.url) ?? checks.find((c) => domainOf(c.url) === domainOf(src.url));
  const publisher = check
    ? [check.transparency_label || reliabilityWords(check.credibility_score, lang), check.category_label].filter(Boolean).join(' · ')
    : null;
  return {
    url: src.url,
    domain: domainOf(src.url),
    stance,
    state: read && src.source_state !== 'paywall' && src.source_state !== 'paywall_partial' ? null : stateWords(src.source_state, lang),
    claim: stance === 'contradicts' && claim ? claim : null,
    quote: read && quote && src.quote_grounded !== false ? quote : null,
    // Le modèle explique en français (tâche 3.1 à venir) : masqué en anglais.
    explanation: lang === 'fr' && read && src.explanation ? src.explanation : null,
    publisher,
  };
}

export type Segment = { text: string; added: boolean };

/** Texte de la section découpé pour surligner les ajouts de l'auteur (positions RECO-SRC 11.2). */
export function highlightAdditions(text: string, card: CardCheck | undefined): Segment[] {
  if (!card || cardKind(card) !== 'mixed' || !Array.isArray(card.addition_spans)) return [{ text, added: false }];
  const spans = card.addition_spans
    .filter((s): s is [number, number] => Array.isArray(s) && s[0] >= 0 && s[1] > s[0] && s[1] <= text.length)
    .sort((a, b) => a[0] - b[0]);
  const out: Segment[] = [];
  let cursor = 0;
  for (const [start, end] of spans) {
    if (start < cursor) continue;
    if (start > cursor) out.push({ text: text.slice(cursor, start), added: false });
    out.push({ text: text.slice(start, end), added: true });
    cursor = end;
  }
  if (cursor < text.length) out.push({ text: text.slice(cursor), added: false });
  return out.length ? out : [{ text, added: false }];
}

export type SectionView = {
  index: number;
  input: ProSectionInput;
  stance: StanceKey;
  segments: Segment[];
  additions: string[];
  lines: SourceLine[];
};

export function sectionViews(input: ProInput, cards: CardCheck[] | undefined, checks: SourceCheck[] | undefined, lang: Lang): SectionView[] {
  return input.sections.map((section, index) => {
    const card = (cards ?? []).find((c) => c.index === index);
    return {
      index,
      input: section,
      stance: cardStance(card),
      segments: highlightAdditions(section.text, card),
      additions: cardAdditions(card),
      lines: (card?.sources ?? []).map((s) => sourceLine(s, checks ?? [], lang)),
    };
  });
}

// ── Notes Éditeur et Fidélité, en mots (seuils RECO-SRC) ───────────────────────

export function publisherWords(note: PublisherNote | undefined, lang: Lang): string {
  if (!note || (note.sources_evaluated ?? 0) <= 0) {
    if ((note?.label ?? '').startsWith('Non applicable')) {
      return pick(lang, 'Non applicable (réseaux sociaux, vidéos)', 'Not applicable (social networks, videos)');
    }
    return pick(lang, 'Aucune source évaluée', 'No source assessed');
  }
  if (note.score >= 7.5) return pick(lang, 'Éditeurs identifiables', 'Identifiable publishers');
  if (note.score >= 5.5) return pick(lang, 'Éditeurs partiellement identifiables', 'Partially identifiable publishers');
  if (note.score >= 3.5) return pick(lang, 'Éditeurs peu identifiables', 'Barely identifiable publishers');
  return pick(lang, 'Éditeurs opaques', 'Opaque publishers');
}

export function faithfulnessWords(note: FaithfulnessNote | undefined, lang: Lang): string {
  if (!note || !note.available) {
    if (note?.opinion_only) return pick(lang, "Avis de l'auteur", "Author's opinion");
    if ((note?.stance_counts?.unverifiable ?? 0) > 0) return pick(lang, 'Non établie : sources illisibles', 'Not established: unreadable sources');
    return pick(lang, 'Non vérifiée', 'Not verified');
  }
  if ((note.stance_counts?.contradicts ?? 0) > 0) return pick(lang, 'Déforme ses sources', 'Distorts its sources');
  if (note.opinion_sourced) return pick(lang, "Sources cohérentes, avis de l'auteur", "Consistent sources, author's opinion");
  const score = note.score ?? 0;
  if (score >= 7.5) return pick(lang, 'Fidèle à ses sources', 'Faithful to its sources');
  if (score >= 5) return pick(lang, 'Globalement fidèle', 'Mostly faithful');
  return pick(lang, 'Fidélité insuffisante', 'Insufficient faithfulness');
}

// ── Alertes (codes RECO-SRC, mêmes textes que l'app) ──────────────────────────

/** Alertes déjà dites ailleurs dans le rapport (par source) : pas répétées. */
const ALERTS_SHOWN_PER_SOURCE = new Set(['source_contradicts', 'source_unreadable', 'source_dead_link', 'source_off_topic']);

export function alertWords(alert: Alert, lang: Lang): string | null {
  if (ALERTS_SHOWN_PER_SOURCE.has(alert.code)) return null;
  const count = Number(alert.params?.count ?? 0);
  const domain = String(alert.params?.domain ?? '');
  switch (alert.code) {
    case 'no_sources': return pick(lang, 'Aucune source fournie', 'No sources provided');
    case 'sources_inaccessible': return pick(lang, `${count} source(s) inaccessible(s)`, `${count} inaccessible source(s)`);
    case 'sources_http': return pick(lang, `${count} source(s) non sécurisée(s) (HTTP)`, `${count} insecure source(s) (HTTP)`);
    case 'sources_low_credibility': return pick(lang, `${count} source(s) peu fiable(s)`, `${count} low-credibility source(s)`);
    case 'ghost_sources': return pick(lang, `${count} affirmation(s) citant une source introuvable`, `${count} claim(s) citing an untraceable source`);
    case 'low_diversity': return pick(lang, 'Faible diversité des sources', 'Low source diversity');
    case 'sources_disagree': return pick(lang, `Les sources ne concordent pas : ${domain}`, `The sources disagree: ${domain}`);
    case 'verification_timeout': return pick(lang, 'Vérification interrompue (délai dépassé)', 'Verification interrupted (timed out)');
    case 'llm_unavailable': return pick(lang, 'Analyse des sources suspendue (service indisponible).', 'Source analysis paused (service unavailable).');
    default: return null;
  }
}

// ── Synthèse en une phrase (en attendant la phrase RECO-SRC, tâche 3.2) ────────

export function synthesis(views: SectionView[], lang: Lang): string {
  const n = views.length;
  const count = (k: StanceKey) => views.filter((v) => v.stance === k).length;
  const confirmed = count('supports');
  const contradicted = count('contradicts');
  const opinions = count('opinion');
  const unreadable = views.flatMap((v) => v.lines).filter((l) => l.state).length;
  const parts: string[] = [];
  parts.push(lang === 'en'
    ? `${confirmed} of ${n} section(s) confirmed by their sources`
    : `${confirmed} section(s) sur ${n} confirmée(s) par leurs sources`);
  if (contradicted) parts.push(pick(lang, `${contradicted} contredite(s) par sa source`, `${contradicted} contradicted by its source`));
  else parts.push(pick(lang, 'aucune contradiction', 'no contradiction'));
  if (opinions) parts.push(pick(lang, `avis de l'auteur sur ${opinions} section(s)`, `author's opinion on ${opinions} section(s)`));
  if (unreadable) parts.push(pick(lang, `${unreadable} source(s) non lue(s)`, `${unreadable} source(s) not read`));
  const sentence = parts.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

// ── Export Markdown ───────────────────────────────────────────────────────────

export function toMarkdown(detail: ProVerificationDetail, lang: Lang): string {
  const v = detail.result?.verification;
  const views = sectionViews(detail.input, v?.cards, v?.sources_check, lang);
  const date = new Date(detail.finished_at ?? detail.created_at).toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR');
  const lines: string[] = [
    `# ${detail.input.title}`,
    '',
    `**${pick(lang, 'Verdict ASV', 'ASV verdict')}** : ${verdictWords(v?.status ?? detail.verdict_status, lang, !!v?.faithfulness?.opinion_sourced)}`,
    '',
    synthesis(views, lang),
    '',
    `- ${pick(lang, 'Qui publie', 'Who publishes')} : ${publisherWords(v?.publisher, lang)}`,
    `- ${pick(lang, 'Fidélité aux sources', 'Faithfulness to sources')} : ${faithfulnessWords(v?.faithfulness, lang)}`,
    `- ${pick(lang, 'Rapport du', 'Report of')} ${date}`,
    '',
  ];
  for (const view of views) {
    lines.push(`## ${pick(lang, 'Section', 'Section')} ${view.index + 1} : ${stanceWords(view.stance, lang)}`, '', `> ${view.input.text.replace(/\n/g, '\n> ')}`, '');
    for (const line of view.lines) {
      lines.push(`- **${line.domain}** : ${stanceWords(line.stance, lang)}${line.state ? ` (${line.state})` : ''}${line.publisher ? `. ${line.publisher}` : ''}`);
      if (line.claim) lines.push(`  - ${pick(lang, 'Le texte dit', 'The text says')} : « ${line.claim} »`);
      if (line.quote) lines.push(`  - ${pick(lang, 'La source dit', 'The source says')} : « ${line.quote} »`);
      if (line.explanation) lines.push(`  - ${line.explanation}`);
      lines.push(`  - ${line.url}`);
    }
    for (const addition of view.additions) lines.push(`- ${pick(lang, "L'auteur ajoute, sans sa source", 'The author adds, without a source')} : « ${addition} »`);
    lines.push('');
  }
  lines.push('---', pick(lang,
    'ASV mesure la transparence des éditeurs et la fidélité du texte à ses sources. Il ne dit pas si un contenu est vrai ou faux.',
    'ASV measures how transparent publishers are and how faithful the text is to its sources. It does not say whether content is true or false.'));
  return lines.join('\n');
}
