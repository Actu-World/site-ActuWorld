// Configuration du Studio (éditeur web créateurs).
// Les trois valeurs sont PUBLIQUES par design (déjà embarquées dans le bundle de
// l'app mobile) : les défauts prod ci-dessous permettent un build sans config.
// Surcharge possible via .env local (voir .env.example) pour pointer le dev.

const env = import.meta.env;

export const STUDIO_SUPABASE_URL: string =
  env.VITE_SUPABASE_URL || 'https://upxwtqgbayappfzrhots.supabase.co';

export const STUDIO_SUPABASE_PUBLISHABLE_KEY: string =
  env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_PJya9t0-Mn-mR68jGdZweg_d855Qinx';

export const STUDIO_API_URL: string =
  env.VITE_API_URL || 'https://api.actuworld.fr/api';
