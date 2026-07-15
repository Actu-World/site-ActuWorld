import { createClient } from '@supabase/supabase-js';
import { STUDIO_SUPABASE_URL, STUDIO_SUPABASE_PUBLISHABLE_KEY } from './config';

// Client Supabase AUTH UNIQUEMENT : le Studio ne lit/n'écrit jamais les tables
// en direct — toutes les données passent par l'API (api.actuworld.fr), qui
// centralise l'autorisation. detectSessionInUrl capte les tokens du magic link
// au retour sur /studio/editeur.
export const supabase = createClient(STUDIO_SUPABASE_URL, STUDIO_SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
