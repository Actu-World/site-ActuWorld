import { useCallback, useEffect, useState } from 'react';
import type { ProAccess } from '../lib/pro/types';

/**
 * Droits ASV Pro du compte connecté (`GET /pro/access`). `access` reste null
 * tant que la réponse n'est pas arrivée ou en cas d'erreur (`error` rempli).
 * Module API importé à la demande, comme useStudioAccess, pour garder
 * supabase-js hors du bundle du site vitrine.
 */
export function useProAccess(enabled: boolean) {
  const [access, setAccess] = useState<ProAccess | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const refresh = useCallback(() => setTick((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setAccess(null);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    import('../lib/pro/api')
      .then(({ proApi }) => proApi.access())
      .then((res) => {
        if (!cancelled) {
          setAccess(res);
          setError(null);
        }
      })
      .catch((e: Error) => {
        if (!cancelled) {
          setAccess(null);
          setError(e.message);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled, tick]);

  return { access, isLoading, error, refresh };
}
