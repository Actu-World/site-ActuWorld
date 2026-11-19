import { studioApi } from '../studio/api';
import type {
  ProAccess, ProImportDetail, ProImportSummary, ProInput, ProVerificationDetail, ProVerificationSummary, ReportData, UrlCredibility,
} from './types';

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

  /** 3.8 : crée (ou rend) le jeton du lien de lecture seule. */
  share: (id: string) =>
    studioApi.post<Envelope<{ token: string }>>(`/pro/verifications/${encodeURIComponent(id)}/share`).then((r) => r.data.token),

  unshare: (id: string) => studioApi.delete<{ success: boolean }>(`/pro/verifications/${encodeURIComponent(id)}/share`),

  /** Lecture publique, sans compte. */
  shared: (token: string) =>
    studioApi.get<Envelope<ReportData>>(`/pro/shared/${encodeURIComponent(token)}`).then((r) => r.data),

  /** Contenus envoyés par l'app : déposés sans rien lancer, vérifiés à la demande. */
  imports: {
    /** Dépose un contenu sans rien lancer ; rend l'identifiant de sa page « À vérifier ». */
    create: (input: ProInput, kind: 'post' | 'article') =>
      studioApi.post<Envelope<{ id: string }>>('/pro/imports', { ...input, kind }).then((r) => r.data.id),
    list: () => studioApi.get<Envelope<ProImportSummary[]>>('/pro/imports').then((r) => r.data),
    get: (id: string) =>
      studioApi.get<Envelope<ProImportDetail>>(`/pro/imports/${encodeURIComponent(id)}`).then((r) => r.data),
    /** Lance la vérification (compte dans le quota) et rend l'identifiant du rapport. */
    verify: (id: string) =>
      studioApi.post<Envelope<{ id: string }>>(`/pro/imports/${encodeURIComponent(id)}/verify`).then((r) => r.data.id),
    remove: (id: string) => studioApi.delete<{ success: boolean }>(`/pro/imports/${encodeURIComponent(id)}`),
  },

  checkUrls: (urls: string[]) =>
    studioApi.post<Envelope<UrlCredibility[]>>('/pro/urls', { urls }).then((r) => r.data),
};
