import { useCallback, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { DANGER_BUTTON, StudioDialog } from './StudioDialog';

type ConfirmAsk = {
  title: string;
  description: string;
  confirmLabel: string;
  resolve: (ok: boolean) => void;
};

/**
 * Confirmation de suppression dans la fenêtre du Studio (à la place de
 * `window.confirm`). `ask()` attend la réponse ; `dialog` est à rendre dans la page.
 */
export function useConfirmDelete() {
  const { isEnglish } = useLanguage();
  const [pending, setPending] = useState<ConfirmAsk | null>(null);

  const ask = useCallback(
    (title: string, description: string, confirmLabel?: string) =>
      new Promise<boolean>((resolve) => setPending({
        title, description, confirmLabel: confirmLabel ?? (isEnglish ? 'Delete' : 'Supprimer'), resolve,
      })),
    [isEnglish],
  );
  const answer = useCallback((ok: boolean) => {
    setPending((current) => {
      current?.resolve(ok);
      return null;
    });
  }, []);

  const dialog = (
    <StudioDialog
      open={!!pending}
      onClose={() => answer(false)}
      title={pending?.title ?? ''}
      description={pending?.description}
      icon={Trash2}
      tone="danger"
      actions={(
        <>
          <button type="button" className={DANGER_BUTTON} onClick={() => answer(true)}>
            <Trash2 className="w-4 h-4" aria-hidden="true" />{pending?.confirmLabel}
          </button>
          <button type="button" className="btn-link text-sm justify-center" onClick={() => answer(false)}>
            {isEnglish ? 'Cancel' : 'Annuler'}
          </button>
        </>
      )}
    />
  );

  return { ask, dialog };
}
