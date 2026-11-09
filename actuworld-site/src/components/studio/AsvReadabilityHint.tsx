import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { fetchSourceReadability, isValidSourceUrl, type SourceReadability } from '../../lib/studio/journal';
import { readabilityNotice } from '../../lib/studio/readability';
import { useLanguage } from '../../i18n/LanguageContext';

// ASV 7.7 — sous une URL de source : ASV pourra-t-il la lire à la vérification ?
// (même lecture que la vérification, navigateur compris, côté serveur). Jamais
// bloquant ; rien d'affiché si le service ne répond pas.

const DEBOUNCE_MS = 1200;
// Une URL déjà vérifiée ne repart pas au serveur (route limitée à 10 appels/min).
const cache = new Map<string, SourceReadability>();

export function AsvReadabilityHint({ url }: { url: string }) {
  const { isEnglish } = useLanguage();
  const [target, setTarget] = useState<string | null>(null);
  const [state, setState] = useState<{ checking: boolean; result: SourceReadability | null }>({ checking: false, result: null });

  useEffect(() => {
    const trimmed = url.trim();
    const id = setTimeout(() => setTarget(trimmed && isValidSourceUrl(trimmed) ? trimmed : null), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [url]);

  useEffect(() => {
    if (!target) {
      setState({ checking: false, result: null });
      return;
    }
    const hit = cache.get(target);
    if (hit) {
      setState({ checking: false, result: hit });
      return;
    }
    let cancelled = false;
    setState({ checking: true, result: null });
    fetchSourceReadability(target)
      .then((result) => {
        if (result) cache.set(target, result);
        if (!cancelled) setState({ checking: false, result });
      })
      .catch(() => {
        if (!cancelled) setState({ checking: false, result: null });
      });
    return () => {
      cancelled = true;
    };
  }, [target]);

  if (state.checking) {
    return (
      <p className="text-aw-muted text-xs inline-flex items-center gap-1.5" aria-live="polite">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {isEnglish ? 'ASV is checking it can read this source…' : "L'ASV vérifie qu'il peut lire cette source…"}
      </p>
    );
  }
  const notice = readabilityNotice(state.result);
  if (!notice) return null;
  const color = notice.tone === 'ok' ? 'text-aw-primary' : notice.tone === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-aw-muted';
  const Icon = notice.tone === 'ok' ? CheckCircle2 : notice.tone === 'warning' ? AlertTriangle : Info;
  return (
    <p className={`${color} text-xs inline-flex items-start gap-1.5`} aria-live="polite">
      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
      <span>{isEnglish ? notice.en : notice.fr}</span>
    </p>
  );
}
