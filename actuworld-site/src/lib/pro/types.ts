// ASV Pro — types partagés par les pages /pro (réponses de l'API /api/pro).
// Le résultat d'une vérification est la réponse brute de RECO-SRC : seuls les
// champs affichés sont typés ici.

export type ProAccess = {
  member: boolean;
  moderator: boolean;
  plan: string | null;
  org_name: string | null;
  quota: number;
  used_this_month: number;
  /** Ce que la formule ouvre au-delà du rapport (absent sur une API plus ancienne). */
  features?: ProFeatures;
};

export type ProFeatures = {
  history: boolean;
  export: boolean;
  share: boolean;
  review: boolean;
  /** Retoucher sur le site un contenu envoyé par l'app (absent sur une API plus ancienne). */
  edit?: boolean;
};

/** Contenu (dépêche, article) envoyé par l'app, en attente de vérification ou déjà vérifié. */
export type ProImportSummary = {
  id: string;
  kind: 'post' | 'article' | string;
  title: string;
  verification_id: string | null;
  created_at: string;
};
export type ProImportDetail = ProImportSummary & { input: ProInput };

export type ProSourceInput = { url: string; title?: string };
export type ProSectionInput = { text: string; sources: ProSourceInput[] };
export type ProInput = {
  title: string;
  sections: ProSectionInput[];
  locale?: 'fr' | 'en' | 'es' | 'zh';
  /** `text` : les sources valent pour tout le texte (article). Absent : une source par passage. */
  sources_scope?: 'text';
};

export type ProStatus = 'pending' | 'done' | 'failed';

export type ProVerificationSummary = {
  id: string;
  title: string;
  status: ProStatus;
  verdict_status: string | null;
  verdict_label: string | null;
  verdict_color: string | null;
  llm_status: string | null;
  created_at: string;
  finished_at: string | null;
};

export type CardKind = 'fact' | 'opinion' | 'mixed';
export type Stance = 'supports' | 'contradicts' | 'unrelated' | 'unverifiable';

/** Écart de détail (RECO-SRC, 18/11) : une date ou un chiffre que la source donne autrement.
 *  À montrer pour guider l'auteur ; ne change pas le verdict. */
export type DetailGap = {
  card_text: string;
  source_quote: string;
  source_url?: string | null;
  span?: [number, number] | null;
};

export type CardSource = {
  url: string;
  stance?: Stance | null;
  source_state?: string | null;
  source_quote?: string | null;
  quote_grounded?: boolean | null;
  card_claim?: string | null;
  explanation?: string;
  card_kind?: CardKind | null;
  additions?: string[];
  /** 3.5 : comment et quand la source a été lue. */
  read_method?: string | null;
  read_chars?: number | null;
  read_at?: string | null;
  /** 3.3 : que faire de cette source (code RECO-SRC, api/asv_app/advice.py). */
  advice?: Alert | null;
};

export type CardCheck = {
  index: number;
  stance?: Stance | null;
  sources: CardSource[];
  card_kind?: CardKind | null;
  additions?: string[];
  addition_spans?: Array<[number, number] | null>;
  details?: DetailGap[];
  /** 3.3 : conseils pour le passage entier (l'auteur ajoute son analyse). */
  advice?: Alert[];
};

export type SourceCheck = {
  url: string;
  domain: string;
  credibility_score: number;
  accessible: boolean;
  https: boolean;
  category_label?: string | null;
  transparency_label?: string | null;
  domain_age_days?: number | null;
  in_registry?: boolean | null;
};

export type PublisherNote = {
  score: number;
  label: string;
  sources_evaluated: number;
  weakest_score?: number | null;
};

export type FaithfulnessNote = {
  available: boolean;
  score?: number | null;
  stance_counts?: Record<string, number>;
  opinion_only?: boolean;
  opinion_sourced?: boolean;
  /** 3.9 : sources non lues, et sources lues qui ne contiennent pas le fait. */
  unreadable_count?: number;
  not_found_count?: number;
};

export type Alert = { code: string; params?: Record<string, unknown> };

export type Verification = {
  status: string;
  app_label?: string;
  app_label_color?: string;
  publisher?: PublisherNote;
  faithfulness?: FaithfulnessNote;
  sources_check?: SourceCheck[];
  alerts_i18n?: Alert[];
  cards?: CardCheck[];
  /** 3.1 : langue dans laquelle le modèle a écrit ses explications. */
  explanations_locale?: string;
  /** 3.2 : synthèse calculée par RECO-SRC, en fragments à traduire (et en français). */
  summary?: string;
  summary_i18n?: Alert[];
  /** 3.3 : conseils pour le texte entier (aucune source, source citée sans lien). */
  advice?: Alert[];
};

export type VerificationResult = {
  verification?: Verification;
  enrichment_pending?: boolean;
  llm?: { status?: string; detail?: string | null } | null;
};

export type ProVerificationDetail = ProVerificationSummary & {
  input: ProInput;
  result: VerificationResult | null;
  reverify_count: number;
  /** 3.8 : jeton du lien de lecture seule, null si non partagé. */
  share_token?: string | null;
};

/** Ce qu'il faut pour afficher un rapport (privé ou partagé en lecture seule). */
export type ReportData = Pick<ProVerificationDetail, 'input' | 'result' | 'status' | 'verdict_status' | 'created_at' | 'finished_at'>;

export type UrlCredibility = {
  url: string;
  domain: string;
  score: number;
  level: string;
  reason: string;
  accessible: boolean;
  status_code: number | null;
  https: boolean;
  domain_age_days?: number | null;
  has_about_page?: boolean | null;
  has_contact_info?: boolean | null;
  has_legal_notice?: boolean | null;
  s1_label?: string | null;
  s1_reasons?: string[] | null;
  warnings?: string[];
};
