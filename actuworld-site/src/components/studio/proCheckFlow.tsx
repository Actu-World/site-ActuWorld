import { useCallback, useEffect, useRef, useState } from 'react';
import { Globe, Loader2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { buildProCheck } from '../../lib/studio/proCheck';
import type { PlanItemData } from '../../lib/studio/redaction';

// Studio → ASV Pro : « vérifier avant de publier », le même parcours que dans
// l'app. Le contenu est DÉPOSÉ dans « À vérifier » (/pro/app) et sa page s'ouvre
// dans un nouvel onglet : l'auteur y voit son quota et décide de lancer la
// vérification. Rien n'est vérifié ni compté ici.

type Kind = 'post' | 'article';

/**
 * Dépôt du contenu en cours dans « À vérifier ». `isChecked()` dit si le contenu
 * tel qu'il est à l'écran a déjà été déposé (il change dès qu'on retouche le texte
 * ou une source).
 */
export function useProCheck(kind: Kind, getData: () => PlanItemData) {
  const { isEnglish } = useLanguage();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentKeyRef = useRef<string | null>(null);

  const currentKey = useCallback(() => {
    const built = buildProCheck(kind, getData(), isEnglish);
    return built.ok ? JSON.stringify(built.input) : null;
  }, [kind, getData, isEnglish]);

  const isChecked = useCallback(() => {
    const key = currentKey();
    return !!key && key === sentKeyRef.current;
  }, [currentKey]);

  const run = useCallback(async () => {
    if (busy) return;
    const built = buildProCheck(kind, getData(), isEnglish);
    if (!built.ok) {
      setError(isEnglish ? built.en : built.fr);
      return;
    }
    setError(null);
    setBusy(true);
    // L'onglet s'ouvre avant l'appel, sinon le navigateur le bloque comme pop-up.
    const tab = window.open('', '_blank');
    try {
      const id = await proApi.imports.create(built.input, kind);
      sentKeyRef.current = JSON.stringify(built.input);
      const url = `/pro/app/${encodeURIComponent(id)}`;
      if (tab) tab.location.href = url;
      else window.location.assign(url);
    } catch (e) {
      tab?.close();
      setError((e as Error).message || (isEnglish ? 'ASV Pro did not answer, try again.' : "ASV Pro n'a pas répondu, réessaie."));
    } finally {
      setBusy(false);
    }
  }, [busy, kind, getData, isEnglish]);

  return { run, busy, error, isChecked };
}

/** Lien « Vérifier mes sources avant de publier », à poser près de Publier. */
export function ProCheckLink({ check }: { check: ReturnType<typeof useProCheck> }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  return (
    <div className="mt-4 text-center">
      <button type="button" onClick={() => void check.run()} disabled={check.busy}
        className="btn-link text-sm inline-flex items-center gap-1.5 disabled:opacity-60">
        {check.busy
          ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          : <ShieldCheck className="w-4 h-4" aria-hidden="true" />}
        {t('Vérifier mes sources avant de publier', 'Check my sources before publishing')}
      </button>
      <p className="text-aw-muted text-xs mt-1">
        {t('La page de vérification s’ouvre dans un nouvel onglet. Rien n’est publié, et rien n’est compté avant ton clic.',
          'The check page opens in a new tab. Nothing is published, and nothing is counted before you click.')}
      </p>
      {check.error && <p className="text-red-500 text-sm mt-2" role="alert">{check.error}</p>}
    </div>
  );
}

export type PublishChoice = 'publish' | 'check' | 'cancel';
type Ask = { title: string; article: boolean; checked: boolean; resolve: (choice: PublishChoice) => void };

/**
 * Confirmation avant « Publier ». Si les sources n'ont pas été vérifiées, elle le
 * dit et propose de le faire d'abord, sans rien bloquer. `ask()` attend le choix ;
 * `dialog` est à rendre dans la page.
 */
export function usePublishConfirm() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [pending, setPending] = useState<Ask | null>(null);

  const ask = useCallback(
    (title: string, article: boolean, checked: boolean) =>
      new Promise<PublishChoice>((resolve) => setPending({ title, article, checked, resolve })),
    [],
  );
  const answer = useCallback((choice: PublishChoice) => {
    setPending((current) => {
      current?.resolve(choice);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!pending) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') answer('cancel'); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pending, answer]);

  const dialog = pending ? (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="publish-confirm-title">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label={t('Annuler', 'Cancel')} onClick={() => answer('cancel')} />
      <div className="card relative w-full max-w-md p-6 space-y-4">
        <h2 id="publish-confirm-title" className="text-xl">{t(`Publier « ${pending.title} » ?`, `Publish “${pending.title}”?`)}</h2>
        <p className="text-sm text-aw-muted">
          {pending.article
            ? t('L’article sera visible par tout le monde dans l’app. Une fois publié, il ne se modifie plus.',
                'The article will be visible to everyone in the app. Once published, it can no longer be edited.')
            : t('La dépêche sera visible par tout le monde dans l’app. Une fois publiée, elle ne se modifie plus.',
                'The dispatch will be visible to everyone in the app. Once published, it can no longer be edited.')}
        </p>
        {pending.checked ? (
          <p className="text-sm inline-flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-aw-primary" aria-hidden="true" />
            {t('Tu as envoyé ce contenu à la vérification. La vérification ASV se relancera à la publication.',
              'You sent this content for checking. ASV will run again on publication.')}
          </p>
        ) : (
          <p className="text-sm rounded-xl border border-aw p-3">
            {t('Tu n’as pas encore vérifié tes sources. Tu peux le faire maintenant, avant que le contenu soit en ligne.',
              'You have not checked your sources yet. You can do it now, before the content goes online.')}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {!pending.checked && (
            <button type="button" className="btn-primary inline-flex items-center justify-center gap-2" onClick={() => answer('check')}>
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />{t('Vérifier d’abord', 'Check first')}
            </button>
          )}
          <button type="button" className={`${pending.checked ? 'btn-primary' : 'btn-outline'} inline-flex items-center justify-center gap-2`} onClick={() => answer('publish')}>
            <Globe className="w-4 h-4" aria-hidden="true" />{pending.checked ? t('Publier', 'Publish') : t('Publier quand même', 'Publish anyway')}
          </button>
          <button type="button" className="btn-link text-sm" onClick={() => answer('cancel')}>{t('Annuler', 'Cancel')}</button>
        </div>
      </div>
    </div>
  ) : null;

  return { ask, dialog };
}
