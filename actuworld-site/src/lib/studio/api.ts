import { supabase } from './supabase';
import { STUDIO_API_URL } from './config';

// Mini-client API du Studio : même contrat que l'apiClient mobile
// (Bearer JWT Supabase, refresh sur 401), sans retry/backoff — inutile sur
// une session d'écriture au clavier.

type StudioRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
};

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

function parseApiError(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const message = (payload as { error: unknown }).error;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return `Erreur réseau (${status})`;
}

async function request<T>(endpoint: string, options: StudioRequestOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;

  const doFetch = async (token: string | null) =>
    fetch(`${STUDIO_API_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

  let response = await doFetch(await getAccessToken());

  if (response.status === 401) {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      await supabase.auth.signOut();
      throw new Error('Session expirée, reconnecte-toi.');
    }
    response = await doFetch(await getAccessToken());
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(parseApiError(payload, response.status));
  }

  return (await response.json()) as T;
}

/** POST multipart (upload) : pas de Content-Type manuel, le navigateur pose le boundary. */
async function requestForm<T>(endpoint: string, formData: FormData): Promise<T> {
  const doFetch = async (token: string | null) =>
    fetch(`${STUDIO_API_URL}${endpoint}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

  let response = await doFetch(await getAccessToken());

  if (response.status === 401) {
    const { error } = await supabase.auth.refreshSession();
    if (error) {
      await supabase.auth.signOut();
      throw new Error('Session expirée, reconnecte-toi.');
    }
    response = await doFetch(await getAccessToken());
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(parseApiError(payload, response.status));
  }

  return (await response.json()) as T;
}

export const studioApi = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: 'POST', body }),
  postForm: <T>(endpoint: string, formData: FormData) => requestForm<T>(endpoint, formData),
  put: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: 'PUT', body }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};
