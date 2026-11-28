// ASV Pro — ce que dit un rapport, en mots (FR/EN), à partir de la réponse brute
// de RECO-SRC. Même vocabulaire et mêmes règles que la fiche de l'app
// (APP-RS frontend/lib/verification : cards.ts, notesLabels.ts, locales) :
// jamais de chiffre nu comme verdict, jamais « vrai / faux ».

import type {
  Alert, CardCheck, CardKind, CardSource, FaithfulnessNote, ProInput, ProSectionInput,
  PublisherNote, ReportData, SourceCheck, Stance, Verification,
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
    default: return pick(lang, 'Sans lien : rien à confronter', 'No link: nothing to check');
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

export type DetailView = { cardText: string; sourceQuote: string; domain: string | null };

/** Écarts de détail du passage (date, chiffre) : les mots de l'auteur, la phrase de la source en face. */
export function cardDetails(card: CardCheck | undefined): DetailView[] {
  if (!card || !Array.isArray(card.details)) return [];
  return card.details
    .filter((d) => d && typeof d.card_text === 'string' && typeof d.source_quote === 'string' && d.card_text.trim() && d.source_quote.trim())
    .slice(0, MAX_ADDITIONS)
    .map((d) => ({ cardText: d.card_text.trim(), sourceQuote: d.source_quote.trim(), domain: d.source_url ? domainOf(d.source_url) : null }));
}

export function detailWords(d: DetailView, lang: Lang): string {
  const source = d.domain ?? pick(lang, 'la source', 'the source');
  return pick(lang,
    `tu écris « ${d.cardText} », ${source} dit « ${d.sourceQuote} ». Vérifie ce point.`,
    `you write “${d.cardText}”, ${source} says “${d.sourceQuote}”. Check this point.`);
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

/** 3.5 : « Lue via une copie archivée (archive.org), 4 560 caractères, le 16 nov. à 17:30 ». */
export function readingWords(src: CardSource, lang: Lang): string | null {
  const method = src.read_method ?? '';
  if (!method || method === 'aucune' || !src.read_chars) return null;
  const how = method.includes('openalex+pdf')
    ? pick(lang, "Revue fermée à la lecture : version en accès libre de l'article lue", 'Journal closed to reading: open-access version of the article read')
    : method.includes('openalex')
    ? pick(lang, "Revue fermée à la lecture : notice de l'article lue dans un index public (OpenAlex)", 'Journal closed to reading: article record read from a public index (OpenAlex)')
    : method.includes('wayback')
    ? pick(lang, 'Lue via une copie archivée (archive.org)', 'Read from an archived copy (archive.org)')
    : method.includes('ocr') ? pick(lang, 'PDF scanné, transcrit', 'Scanned PDF, transcribed')
    : method.includes('pdf') ? pick(lang, 'PDF lu', 'PDF read')
    : method.includes('legifrance') ? pick(lang, 'Texte officiel lu (Légifrance)', 'Official text read (Légifrance)')
    : method.includes('headless') ? pick(lang, 'Lue dans un navigateur', 'Read in a browser')
    : pick(lang, 'Page lue', 'Page read');
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  const chars = pick(lang, `${src.read_chars.toLocaleString(locale)} caractères`, `${src.read_chars.toLocaleString(locale)} characters`);
  const when = src.read_at
    ? new Date(src.read_at).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
    : null;
  const read = [how, chars, when && pick(lang, `le ${when}`, `on ${when}`)].filter(Boolean).join(', ');
  // La page présente un ouvrage (résumé d'article savant, fiche de livre, notice) : dire que
  // c'est elle qui a été lue, pas l'ouvrage.
  if (src.presentation_only) {
    return pick(lang,
      `${read}. Cette page présente l'ouvrage (résumé ou fiche) : son contenu n'a pas été lu.`,
      `${read}. This page presents the work (abstract or listing): its content was not read.`);
  }
  // Plafond de lecture atteint : dire que la suite de la page n'a pas été lue.
  return src.read_truncated
    ? pick(lang,
      `${read}. Page très longue : seul le début a été lu, la suite n'a pas été vérifiée.`,
      `${read}. Very long page: only the beginning was read, the rest was not checked.`)
    : read;
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
  reading: string | null;
  /** 3.3 : conseil RECO-SRC pour cette source. */
  advice: Alert | null;
};

export function sourceLine(src: CardSource, checks: SourceCheck[], lang: Lang, explanationsLocale = 'fr'): SourceLine {
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
    // 3.1 : affichée seulement si le modèle l'a écrite dans la langue du lecteur.
    explanation: explanationsLocale === lang && read && src.explanation ? src.explanation : null,
    publisher,
    reading: readingWords(src, lang),
    advice: src.advice ?? null,
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

export type UnfoundView = { value: string; cardText: string };

/** Chiffres du passage que les sources lues ne donnent pas (contrôle sans modèle). */
export function cardUnfoundNumbers(card: CardCheck | undefined): UnfoundView[] {
  if (!card || !Array.isArray(card.unfound_numbers)) return [];
  return card.unfound_numbers
    .filter((n) => n && typeof n.value === 'string' && typeof n.card_text === 'string' && n.value.trim() && n.card_text.trim())
    .slice(0, MAX_ADDITIONS)
    .map((n) => ({ value: n.value.trim(), cardText: n.card_text.trim() }));
}

export function unfoundWords(n: UnfoundView, lang: Lang): string {
  return pick(lang,
    `« ${n.value} » n'a pas été retrouvé dans les sources lues (« ${n.cardText} »). Vérifie ce chiffre ou ajoute la source qui le donne.`,
    `“${n.value}” was not found in the sources that were read (“${n.cardText}”). Check this figure or add the source that gives it.`);
}

export type SectionView = {
  index: number;
  input: ProSectionInput;
  stance: StanceKey;
  segments: Segment[];
  additions: string[];
  /** Écarts de détail : montrés pour guider, sans effet sur le verdict du passage. */
  details: DetailView[];
  /** Chiffres non retrouvés dans les sources lues : montrés pour guider, sans effet sur le verdict. */
  unfound: UnfoundView[];
  /** 3.10 : une source n'a été lue qu'en partie (abonnés) ; un « ajout » peut être dans la partie non lue. */
  partialRead: boolean;
  lines: SourceLine[];
  /** 3.3 : conseils RECO-SRC pour le passage entier. */
  cardAdvice: Alert[];
};

const isPartial = (state?: string | null) => state === 'paywall' || state === 'paywall_partial';

export function sectionViews(
  input: ProInput, cards: CardCheck[] | undefined, checks: SourceCheck[] | undefined, lang: Lang, explanationsLocale = 'fr',
): SectionView[] {
  return input.sections.map((section, index) => {
    const card = (cards ?? []).find((c) => c.index === index);
    return {
      index,
      input: section,
      stance: section.sources.length === 0 ? 'none' : cardStance(card),
      segments: highlightAdditions(section.text, card),
      additions: cardAdditions(card),
      details: cardDetails(card),
      unfound: cardUnfoundNumbers(card),
      partialRead: (card?.sources ?? []).some((s) => isPartial(s.source_state)),
      lines: (card?.sources ?? []).map((s) => sourceLine(s, checks ?? [], lang, explanationsLocale)),
      cardAdvice: card?.advice ?? [],
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
  // Mêmes paliers et mêmes mots que le libellé affiché sous chaque source
  // (RECO-SRC `asv/labels.py` : 8 / 6 / 4 / 2). Avec les anciens paliers
  // (7,5 / 5,5 / 3,5), une seule source « Transparent » donnait un en-tête
  // « partiellement identifiables » : l'en-tête contredisait la ligne du dessous.
  if (note.score >= 8) return pick(lang, 'Éditeurs très transparents', 'Very transparent publishers');
  if (note.score >= 6) return pick(lang, 'Éditeurs transparents', 'Transparent publishers');
  if (note.score >= 4) return pick(lang, 'Éditeurs partiellement transparents', 'Partially transparent publishers');
  if (note.score >= 2) return pick(lang, 'Éditeurs faiblement transparents', 'Weakly transparent publishers');
  return pick(lang, 'Éditeurs opaques', 'Opaque publishers');
}

export function faithfulnessWords(note: FaithfulnessNote | undefined, lang: Lang): string {
  if (!note || !note.available) {
    if (note?.opinion_only) return pick(lang, "Avis de l'auteur", "Author's opinion");
    // 3.9 : RECO-SRC sépare les sources illisibles de celles lues sans le fait.
    const unreadable = note?.unreadable_count ?? 0;
    const notFound = note?.not_found_count ?? 0;
    if (notFound > 0 && unreadable === 0) {
      return pick(lang, 'Non établie : les sources lues ne contiennent pas ces faits', 'Not established: the sources read do not contain these facts');
    }
    if (notFound > 0) return pick(lang, 'Non établie : sources illisibles ou sans ces faits', 'Not established: sources unreadable or without these facts');
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

// ── Synthèse en une phrase (RECO-SRC 3.2 : api/asv_app/summary.py) ─────────────

const UNREADABLE_REASON: Record<string, [string, string]> = {
  paywall: ['accès réservé', 'restricted access'],
  blocked_403: ['accès refusé', 'access denied'],
  timeout: ['délai dépassé', 'timed out'],
  js_only: ['page illisible sans navigateur', 'page unreadable without a browser'],
  too_short: ['page presque vide', 'almost empty page'],
  unsupported_type: ['format non pris en charge', 'unsupported format'],
  pdf_no_text: ['PDF sans texte', 'PDF without text'],
};

/** Un fragment de la synthèse RECO-SRC en mots ; null si le code est inconnu. */
export function summaryFragment(frag: Alert, lang: Lang): string | null {
  const n = Number(frag.params?.n ?? 0);
  const of = Number(frag.params?.of ?? 0);
  const one = n <= 1;
  const fr = lang !== 'en';
  switch (frag.code) {
    case 'no_sources':
      return pick(lang, 'aucune source : rien à confronter au texte', 'no sources: nothing to check the text against');
    case 'opinion_only':
      return pick(lang, "avis de l'auteur : rien à confronter aux sources", "author's opinion: nothing to check against the sources");
    case 'outage':
      return frag.params?.kind === 'timeout'
        ? pick(lang, "vérification interrompue (délai dépassé) : rien n'a été jugé", 'verification interrupted (timed out): nothing was assessed')
        : pick(lang, "analyse des sources interrompue (modèle indisponible) : rien n'a été jugé", 'source analysis interrupted (model unavailable): nothing was assessed');
    case 'confirmed':
      if (n === 0) return pick(lang, `aucun des ${of} passages confirmé par ses sources`, `none of the ${of} passages confirmed by its sources`);
      return fr
        ? `${n} ${one ? 'passage' : 'passages'} sur ${of} ${one ? 'confirmé par ses sources' : 'confirmés par leurs sources'}`
        : `${n} of ${of} ${of === 1 ? 'passage' : 'passages'} confirmed by ${one ? 'its' : 'their'} sources`;
    case 'sources_confirmed':
      return fr
        ? `${n} ${one ? 'source' : 'sources'} sur ${of} ${one ? 'confirme' : 'confirment'} le texte`
        : `${n} of ${of} ${of === 1 ? 'source confirms' : 'sources confirm'} the text`;
    case 'contradicted':
      return fr
        ? `${n} ${one ? 'passage contredit par sa source' : 'passages contredits par leurs sources'}`
        : `${n} ${one ? 'passage contradicted by its source' : 'passages contradicted by their sources'}`;
    case 'sources_contradicted':
      return fr ? `${n} ${one ? 'source contredit' : 'sources contredisent'} le texte` : `${n} ${one ? 'source contradicts' : 'sources contradict'} the text`;
    case 'off_topic':
      return fr
        ? `${n} ${one ? 'passage dont la source est hors sujet' : 'passages dont la source est hors sujet'}`
        : `${n} ${one ? 'passage whose source is off topic' : 'passages whose source is off topic'}`;
    case 'fact_not_found':
      return fr
        ? `${n} ${one ? 'fait absent de la source lue' : 'faits absents des sources lues'}`
        : `${n} ${one ? 'fact missing from the source read' : 'facts missing from the sources read'}`;
    case 'unreadable': {
      const reason = UNREADABLE_REASON[String(frag.params?.reason ?? '')];
      const words = fr ? `${n} ${one ? 'source illisible' : 'sources illisibles'}` : `${n} unreadable ${one ? 'source' : 'sources'}`;
      return reason ? `${words} (${pick(lang, reason[0], reason[1])})` : words;
    }
    case 'dead_link':
      return fr ? `${n} ${one ? 'lien mort' : 'liens morts'}` : `${n} dead ${one ? 'link' : 'links'}`;
    case 'partly_read':
      return fr
        ? `${n} ${one ? 'source lue en partie' : 'sources lues en partie'} (accès réservé)`
        : `${n} ${one ? 'source' : 'sources'} partly read (restricted access)`;
    case 'not_analyzed':
      return fr
        ? `${n} ${one ? 'source non analysée' : 'sources non analysées'} (modèle indisponible)`
        : `${n} ${one ? 'source' : 'sources'} not analysed (model unavailable)`;
    case 'opinion':
      // Un passage « mixte » est compté ici ET dans `confirmed` : « avis de l'auteur
      // sur 1 passage » après « 1 passage sur 1 confirmé » se lisait comme une contradiction.
      return fr
        ? `une part d'avis de l'auteur dans ${n} ${one ? 'passage' : 'passages'}`
        : `some author's opinion in ${n} ${one ? 'passage' : 'passages'}`;
    case 'unlinked':
      return fr ? `${n} ${one ? 'passage sans lien' : 'passages sans lien'}` : `${n} ${one ? 'passage' : 'passages'} without a link`;
    case 'not_judged':
      return fr
        ? `${n} ${one ? 'passage non jugé' : 'passages non jugés'} (trop de sources)`
        : `${n} ${one ? 'passage' : 'passages'} not assessed (too many sources)`;
    case 'no_contradiction':
      return pick(lang, 'aucune contradiction', 'no contradiction');
    default:
      return null;
  }
}

function sentenceOf(parts: string[]): string {
  if (!parts.length) return '';
  const sentence = parts.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

/** Synthèse du rapport : celle de RECO-SRC si présente, sinon la phrase locale
 *  (rapports enregistrés avant la 3.2). */
export function reportSummary(v: Verification | undefined, views: SectionView[], lang: Lang): string {
  const frags = v?.summary_i18n ?? [];
  if (frags.length) {
    const parts = frags.map((f) => summaryFragment(f, lang));
    if (parts.every((p): p is string => !!p)) return sentenceOf(parts);
    if (lang === 'fr' && v?.summary) return v.summary; // code inconnu : la phrase française de RECO-SRC
  }
  return synthesis(views, lang);
}

/** Phrase locale d'avant la 3.2, pour les rapports qui n'ont pas `summary_i18n`. */
export function synthesis(views: SectionView[], lang: Lang): string {
  const linked = views.filter((v) => v.stance !== 'none');
  const unlinked = views.length - linked.length;
  const count = (k: StanceKey) => linked.filter((v) => v.stance === k).length;
  const confirmed = count('supports');
  const contradicted = count('contradicts');
  const opinions = count('opinion');
  const unread = views.flatMap((v) => v.lines).filter((l) => l.state).length;
  const parts: string[] = [];
  parts.push(lang === 'en'
    ? `${confirmed} of ${linked.length} linked passage(s) confirmed by their sources`
    : `${confirmed} passage(s) sur ${linked.length} avec lien confirmé(s) par leurs sources`);
  parts.push(contradicted
    ? pick(lang, `${contradicted} contredit(s) par sa source`, `${contradicted} contradicted by its source`)
    : pick(lang, 'aucune contradiction', 'no contradiction'));
  if (opinions) parts.push(pick(lang, `une part d'avis de l'auteur dans ${opinions} passage(s)`, `some author's opinion in ${opinions} passage(s)`));
  if (unread) parts.push(pick(lang, `${unread} source(s) non lue(s) ou lue(s) en partie`, `${unread} source(s) not read or partly read`));
  if (unlinked) parts.push(pick(lang, `${unlinked} passage(s) sans lien`, `${unlinked} passage(s) without a link`));
  const sentence = parts.join(', ');
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
}

// ── « À reprendre avant publication » (3.0.4) ──────────────────────────────────

/** `passage` = 0 pour un conseil sur le texte entier. */
export type ReviewItem = { passage: number; text: string; tone: Tone };

// ── Conseils d'action RECO-SRC (3.3 : api/asv_app/advice.py) ──────────────────

type AdviceText = { text: string; tone: Tone };

/** Un conseil sur une source d'un passage, en mots ; null si le code est inconnu. */
export function sourceAdviceWords(advice: Alert, domain: string, lang: Lang): AdviceText | null {
  switch (advice.code) {
    case 'fix_or_quote': return { tone: 'red', text: pick(lang,
      `${domain} dit le contraire. Corrige le passage ou reprends la phrase exacte de la source.`,
      `${domain} says the opposite. Correct the passage or use the source's exact wording.`) };
    case 'dead_link': return { tone: 'grey', text: pick(lang,
      `le lien vers ${domain} est mort. Remplace la source.`,
      `the link to ${domain} is dead. Replace the source.`) };
    case 'cite_original_post': return { tone: 'orange', text: pick(lang,
      `${domain} est un réseau social ou une vidéo. Cite la publication d'origine si elle existe.`,
      `${domain} is a social network or a video. Cite the original publication if there is one.`) };
    case 'protected_source': return { tone: 'grey', text: pick(lang,
      `${domain} refuse la lecture automatique. Joins une copie archivée ou une autre source.`,
      `${domain} refuses automatic reading. Add an archived copy or another source.`) };
    case 'unreadable_source': {
      const state = (stateWords(String(advice.params?.reason ?? ''), lang) ?? pick(lang, 'lecture impossible', 'could not be read')).toLowerCase();
      return { tone: 'grey', text: pick(lang,
        `${domain} n'a pas pu être lue (${state}). Ajoute la page d'origine ou une copie archivée.`,
        `${domain} could not be read (${state}). Add the original page or an archived copy.`) };
    }
    case 'check_paywalled_part': return { tone: 'grey', text: pick(lang,
      `${domain} n'a été lue qu'en partie (abonnés). Vérifie toi-même la partie réservée.`,
      `${domain} was only partly read (subscribers). Check the paywalled part yourself.`) };
    case 'cite_passage_of_work': return { tone: 'grey', text: pick(lang,
      `${domain} présente l'ouvrage, pas son contenu : ce passage n'a pas pu y être vérifié. Ta source n'est pas en cause. Cite la page ou le passage, ou joins une version en accès libre.`,
      `${domain} presents the work, not its content: this passage could not be checked against it. Your source is not at fault. Cite the page or the passage, or add an open-access version.`) };
    case 'off_topic_source': return { tone: 'orange', text: pick(lang,
      `${domain} ne traite pas de ce passage. Remplace-la par une source qui en parle.`,
      `${domain} does not cover this passage. Replace it with a source that does.`) };
    case 'fact_not_in_source': return { tone: 'orange', text: pick(lang,
      `${domain} ne contient pas ce fait. Précise d'où il vient ou ajoute la source qui le dit.`,
      `${domain} does not contain this fact. Say where it comes from or add the source that states it.`) };
    default: return null;
  }
}

/** Un conseil sur un passage entier ; null si le code est inconnu. */
export function cardAdviceWords(advice: Alert, lang: Lang): AdviceText | null {
  if (advice.code !== 'flag_opinion') return null;
  const quote = String(advice.params?.text ?? '');
  return { tone: 'grey', text: pick(lang,
    `« ${quote} » n'est pas dans ta source. Si c'est ton analyse, signale-la comme telle ; si c'est un fait, ajoute la source qui le dit.`,
    `“${quote}” is not in your source. If it is your own analysis, flag it as such; if it is a fact, add the source that states it.`) };
}

/** Un conseil sur le texte entier ; null si le code est inconnu. */
export function contentAdviceWords(advice: Alert, lang: Lang): AdviceText | null {
  const n = Number(advice.params?.n ?? 0);
  switch (advice.code) {
    case 'add_sources': return { tone: 'grey', text: pick(lang,
      "Ajoute tes sources : sans lien, il n'y a rien à confronter.",
      'Add your sources: without links, there is nothing to check against.') };
    case 'link_cited_sources': return { tone: 'orange', text: n > 1
      ? pick(lang, `Le texte cite ${n} sources sans leur lien. Ajoute le lien de chacune.`, `The text cites ${n} sources without their link. Add a link for each.`)
      : pick(lang, 'Le texte cite une source sans son lien. Ajoute-le.', 'The text cites a source without its link. Add it.') };
    default: return null;
  }
}

/** « À reprendre » à partir des conseils RECO-SRC (rapports d'après la 3.3). */
function reviewFromAdvice(views: SectionView[], content: Alert[], lang: Lang): ReviewItem[] {
  const items: ReviewItem[] = [];
  for (const a of content) {
    const w = contentAdviceWords(a, lang);
    if (w) items.push({ passage: 0, ...w });
  }
  for (const v of views) {
    const n = v.index + 1;
    const prefix = (text: string) => pick(lang, `Passage ${n} : ${text}`, `Passage ${n}: ${text}`);
    for (const line of v.lines) {
      const w = line.advice && sourceAdviceWords(line.advice, line.domain, lang);
      if (w) items.push({ passage: n, tone: w.tone, text: prefix(w.text) });
    }
    for (const a of v.cardAdvice) {
      const w = cardAdviceWords(a, lang);
      if (w) items.push({ passage: n, tone: w.tone, text: prefix(w.text) });
    }
    for (const d of v.details) items.push({ passage: n, tone: 'orange', text: prefix(detailWords(d, lang)) });
    for (const u of v.unfound) items.push({ passage: n, tone: 'grey', text: prefix(unfoundWords(u, lang)) });
  }
  return items;
}

/** Une action par point à reprendre, en mots, dans l'ordre du texte. Vide = rien à reprendre.
 *  `contentAdvice` présent (même vide) = rapport d'après la 3.3 : conseils de RECO-SRC ;
 *  absent = ancien rapport, conseils déduits ici des verdicts. */
export function reviewItems(views: SectionView[], lang: Lang, contentAdvice?: Alert[]): ReviewItem[] {
  if (contentAdvice) return reviewFromAdvice(views, contentAdvice, lang);
  const items: ReviewItem[] = [];
  for (const v of views) {
    const n = v.index + 1;
    const p = (fr: string, en: string) => pick(lang, `Passage ${n} : ${fr}`, `Passage ${n}: ${en}`);
    for (const line of v.lines) {
      if (line.stance === 'contradicts') {
        items.push({ passage: n, tone: 'red', text: p(
          `${line.domain} dit le contraire. Corrige le passage ou reprends la phrase exacte de la source.`,
          `${line.domain} says the opposite. Correct the passage or use the source's exact wording.`) });
      } else if (line.state && !/abonn|subscriber/i.test(line.state)) {
        items.push({ passage: n, tone: 'grey', text: p(
          `${line.domain} n'a pas pu être lue (${line.state.toLowerCase()}). Ajoute la page d'origine ou une copie archivée.`,
          `${line.domain} could not be read (${line.state.toLowerCase()}). Add the original page or an archived copy.`) });
      } else if (line.state) {
        items.push({ passage: n, tone: 'grey', text: p(
          `${line.domain} n'a été lue qu'en partie (abonnés). Vérifie toi-même la partie réservée.`,
          `${line.domain} was only partly read (subscribers). Check the paywalled part yourself.`) });
      } else if (line.stance === 'unrelated') {
        items.push({ passage: n, tone: 'orange', text: p(
          `${line.domain} ne traite pas de ce passage. Remplace-la par une source qui en parle.`,
          `${line.domain} does not cover this passage. Replace it with a source that does.`) });
      } else if (line.stance === 'unverifiable') {
        items.push({ passage: n, tone: 'orange', text: p(
          `${line.domain} ne contient pas ce fait. Précise d'où il vient ou ajoute la source qui le dit.`,
          `${line.domain} does not contain this fact. Say where it comes from or add the source that states it.`) });
      }
    }
    if (v.additions.length && !v.partialRead) {
      items.push({ passage: n, tone: 'grey', text: p(
        `une partie est ton analyse (« ${v.additions[0]} »). Signale-la comme telle si c'est voulu.`,
        `part of it is your own analysis (“${v.additions[0]}”). Flag it as such if intended.`) });
    }
    for (const d of v.details) items.push({ passage: n, tone: 'orange', text: p(detailWords(d, lang), detailWords(d, lang)) });
    for (const u of v.unfound) items.push({ passage: n, tone: 'grey', text: p(unfoundWords(u, 'fr'), unfoundWords(u, 'en')) });
  }
  return items;
}

export function reviewEmpty(lang: Lang): string {
  return pick(lang, 'Rien à reprendre côté sources.', 'Nothing to fix on the sourcing side.');
}

// ── Export Markdown ───────────────────────────────────────────────────────────

export function toMarkdown(detail: ReportData, lang: Lang): string {
  const v = detail.result?.verification;
  const views = sectionViews(detail.input, v?.cards, v?.sources_check, lang, v?.explanations_locale);
  const date = new Date(detail.finished_at ?? detail.created_at).toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR');
  const lines: string[] = [
    `# ${detail.input.title}`,
    '',
    `**${pick(lang, 'Verdict ASV', 'ASV verdict')}** : ${verdictWords(v?.status ?? detail.verdict_status, lang, !!v?.faithfulness?.opinion_sourced)}`,
    '',
    reportSummary(v, views, lang),
    '',
    `- ${pick(lang, 'Qui publie', 'Who publishes')} : ${publisherWords(v?.publisher, lang)}`,
    `- ${pick(lang, 'Fidélité aux sources', 'Faithfulness to sources')} : ${faithfulnessWords(v?.faithfulness, lang)}`,
    `- ${pick(lang, 'Rapport du', 'Report of')} ${date}`,
    '',
    `## ${pick(lang, 'À reprendre avant publication', 'To fix before publishing')}`,
    '',
  ];
  const review = reviewItems(views, lang, v?.advice);
  if (review.length) for (const item of review) lines.push(`- ${item.text}`);
  else lines.push(reviewEmpty(lang));
  lines.push('');
  for (const view of views) {
    lines.push(`## ${pick(lang, 'Passage', 'Passage')} ${view.index + 1} : ${stanceWords(view.stance, lang)}`, '', `> ${view.input.text.replace(/\n/g, '\n> ')}`, '');
    for (const line of view.lines) {
      lines.push(`- **${line.domain}** : ${stanceWords(line.stance, lang)}${line.state ? ` (${line.state})` : ''}${line.publisher ? `. ${line.publisher}` : ''}`);
      if (line.claim) lines.push(`  - ${pick(lang, 'Le texte dit', 'The text says')} : « ${line.claim} »`);
      if (line.quote) lines.push(`  - ${pick(lang, 'La source dit', 'The source says')} : « ${line.quote} »`);
      if (line.explanation) lines.push(`  - ${line.explanation}`);
      if (line.reading) lines.push(`  - ${line.reading}`);
      lines.push(`  - ${line.url}`);
    }
    const addLabel = view.partialRead
      ? pick(lang, 'Pas trouvé dans la partie lue de la source', 'Not found in the part of the source that was read')
      : pick(lang, "L'auteur ajoute, sans sa source", 'The author adds, without a source');
    for (const addition of view.additions) lines.push(`- ${addLabel} : « ${addition} »`);
    for (const d of view.details) lines.push(`- ${pick(lang, 'Point à vérifier', 'Point to check')} : ${detailWords(d, lang)}`);
    for (const u of view.unfound) lines.push(`- ${pick(lang, 'Chiffre non retrouvé', 'Figure not found')} : ${unfoundWords(u, lang)}`);
    lines.push('');
  }
  lines.push('---', pick(lang,
    'ASV mesure la transparence des éditeurs et la fidélité du texte à ses sources. Il ne dit pas si un contenu est vrai ou faux.',
    'ASV measures how transparent publishers are and how faithful the text is to its sources. It does not say whether content is true or false.'));
  return lines.join('\n');
}
