import { STUDIO_API_URL } from './config';
import { supabase } from './supabase';

// Connexion par QR code (type WhatsApp Web) :
//   start  → l'API renvoie { code, poll_token, expires_in } ; le `code` part
//            dans le QR, le `poll_token` reste dans cet onglet (anti QR-jacking :
//            photographier le QR ne permet pas de récupérer la session).
//   status → poll jusqu'à approbation par l'app ; le token_hash est livré UNE
//            SEULE FOIS puis échangé contre une session via verifyOtp.

/** Préfixe versionné du payload QR, reconnu par le scanner de l'app. */
export const QR_PAYLOAD_PREFIX = 'awstudio1:';

export interface PairingStart {
  code: string;
  pollToken: string;
  expiresInSeconds: number;
}

async function postJson<T>(endpoint: string, body: unknown): Promise<{ status: number; payload: T | null }> {
  const response = await fetch(`${STUDIO_API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = (await response.json().catch(() => null)) as T | null;
  return { status: response.status, payload };
}

export async function startPairing(): Promise<PairingStart> {
  const { status, payload } = await postJson<{ data?: { code: string; poll_token: string; expires_in: number } }>(
    '/auth/pair/start',
    {}
  );
  if (status !== 200 || !payload?.data) {
    throw new Error(`pair/start a répondu ${status}`);
  }
  return {
    code: payload.data.code,
    pollToken: payload.data.poll_token,
    expiresInSeconds: payload.data.expires_in,
  };
}

export type PairingPoll =
  | { status: 'pending' }
  | { status: 'approved'; tokenHash: string }
  | { status: 'expired' };

export async function pollPairing(pollToken: string): Promise<PairingPoll> {
  const { status, payload } = await postJson<{ data?: { status: string; token_hash?: string } }>(
    '/auth/pair/status',
    { poll_token: pollToken }
  );
  if (status === 404) return { status: 'expired' };
  if (status !== 200 || !payload?.data) {
    throw new Error(`pair/status a répondu ${status}`);
  }
  if (payload.data.status === 'approved' && payload.data.token_hash) {
    return { status: 'approved', tokenHash: payload.data.token_hash };
  }
  return { status: 'pending' };
}

/** Échange le token_hash (magic link généré côté API) contre une session Supabase. */
export async function exchangeTokenHash(tokenHash: string): Promise<void> {
  const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'magiclink' });
  if (error) throw new Error(error.message);
}
