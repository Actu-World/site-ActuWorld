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
};

export type ProSourceInput = { url: string; title?: string };
export type ProSectionInput = { text: string; sources: ProSourceInput[] };
export type ProInput = { title: string; sections: ProSectionInput[]; locale?: 'fr' | 'en' | 'es' | 'zh' };

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
};

export type CardCheck = {
  index: number;
  stance?: Stance | null;
  sources: CardSource[];
  card_kind?: CardKind | null;
  additions?: string[];
  addition_spans?: Array<[number, number] | null>;
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
};

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
