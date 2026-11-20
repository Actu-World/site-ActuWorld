import { useCallback, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { StudioDialog } from './StudioDialog';

/**
 * « Déjà publié » (20/11/2026) : le brouillon ouvert dans l'éditeur a été publié
 * depuis l'app ou un autre onglet du Studio. Il ne se modifie plus ; l'éditeur
 * repart d'une page vierge et le dit avec la fenêtre du Studio.
 */
export function useAlreadyPublishedNotice(kind: 'post' | 'article') {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  const dialog = (
    <StudioDialog
      open={open}
      onClose={close}
      title={t('Déjà publié', 'Already published')}
      icon={CheckCircle2}
      tone="success"
      description={kind === 'article'
        ? t('Cet article a déjà été publié, depuis l’app ou le Studio. Un article publié ne se modifie plus : l’éditeur repart d’une page vierge.',
            'This article has already been published, from the app or the Studio. A published article can no longer be edited: the editor starts again from a blank page.')
        : t('Cette dépêche a déjà été publiée, depuis l’app ou le Studio. Une dépêche publiée ne se modifie plus : l’éditeur repart d’une page vierge.',
            'This dispatch has already been published, from the app or the Studio. A published dispatch can no longer be edited: the editor starts again from a blank page.')}
      actions={<button type="button" className="btn-primary" onClick={close}>OK</button>}
    />
  );

  return { show, dialog };
}
