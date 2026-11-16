import { studioApi } from '../studio/api';
import type { ProAccess, ProInput, ProVerificationDetail, ProVerificationSummary, UrlCredibility } from './types';

// ASV Pro — appels à /api/pro. Même client que le Studio (jeton Supabase,
// renouvellement sur 401) ; les lectures renvoient `{ data }`.

type Envelope<T> = { data: T };

export const proApi = {
  access: () => studioApi.get<Envelope<ProAccess>>('/pro/access').then((r) => r.data),

  create: (input: ProInput) =>
    studioApi.post<Envelope<{ id: string }>>('/pro/verifications', input).then((r) => r.data.id),

  get: (id: string) =>
    studioApi.get<Envelope<ProVerificationDetail>>(`/pro/verifications/${encodeURIComponent(id)}`).then((r) => r.data),

  list: (before?: string, limit = 20) => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (before) params.set('before', before);
    return studioApi.get<Envelope<ProVerificationSummary[]>>(`/pro/verifications?${params}`).then((r) => r.data);
  },

  remove: (id: string) => studioApi.delete<{ success: boolean }>(`/pro/verifications/${encodeURIComponent(id)}`),

  rerun: (id: string) =>
    studioApi.post<Envelope<{ id: string }>>(`/pro/verifications/${encodeURIComponent(id)}/rerun`).then((r) => r.data.id),

  checkUrls: (urls: string[]) =>
    studioApi.post<Envelope<UrlCredibility[]>>('/pro/urls', { urls }).then((r) => r.data),
};
