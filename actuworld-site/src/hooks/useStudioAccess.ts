import { useEffect, useState } from 'react';

export type StudioAccess = {
  /** Modérateur ou admin : seul profil autorisé à voir la page Rédaction. */
  moderator: boolean;
  /** Compte officiel de la rédaction (slug) ou lecteur du plan éditorial. */
  member: boolean;
  canEdit: boolean;
};

const NONE: StudioAccess = { moderator: false, member: false, canEdit: false };

/**
 * Droits Studio du compte connecté, lus via l'API (`GET /studio/access`).
 * `isLoading` reste vrai tant que la réponse n'est pas arrivée ; en cas
 * d'erreur réseau on retombe sur « aucun droit » (le lien Rédaction est
 * simplement masqué, la page reste protégée côté API).
 *
 * Les modules Supabase et API sont importés à la demande : ce hook est aussi
 * utilisé par la barre Studio, rendue depuis App.tsx, et un import statique
 * ferait entrer supabase-js (~200 ko) dans le bundle du site vitrine.
 */
export function useStudioAccess(enabled: boolean) {
  const [access, setAccess] = useState<StudioAccess>(NONE);
  const [isLoading, setIsLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setAccess(NONE);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    import('../lib/studio/api')
      .then(({ studioApi }) => studioApi.get<StudioAccess>('/studio/access'))
      .then((res) => {
        if (!cancelled) setAccess({ moderator: !!res.moderator, member: !!res.member, canEdit: !!res.canEdit });
      })
      .catch(() => {
        if (!cancelled) setAccess(NONE);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { access, isLoading };
}

/**
 * Variante pour la barre Studio (hors pages lazy) : détecte elle-même la
 * session, toujours par import dynamique.
 */
export function useStudioAccessFromSession() {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    import('../lib/studio/supabase').then(({ supabase }) => {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data }) => {
        if (!cancelled) setHasSession(!!data.session);
      });
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) setHasSession(!!session);
      });
      unsubscribe = () => data.subscription.unsubscribe();
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  return useStudioAccess(hasSession);
}
