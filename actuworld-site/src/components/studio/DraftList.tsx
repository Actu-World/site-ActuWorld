import { FileText, Pencil, Trash2 } from 'lucide-react';
import type { StudioDraftRow } from '../../types/journal';
import { useLanguage } from '../../i18n/LanguageContext';

interface DraftListProps {
  drafts: StudioDraftRow[];
  isLoading: boolean;
  loadError: string | null;
  busyDraftId: string | null;
  onResume: (draft: StudioDraftRow) => void;
  onDelete: (draft: StudioDraftRow) => void;
}

export function DraftList({ drafts, isLoading, loadError, busyDraftId, onResume, onDelete }: DraftListProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  if (isLoading) {
    return <p className="text-aw-muted text-sm">{t('Chargement des brouillons…', 'Loading drafts…')}</p>;
  }

  if (loadError) {
    return <p className="text-aw-muted text-sm">{loadError}</p>;
  }

  if (drafts.length === 0) {
    return (
      <p className="text-aw-muted text-sm">
        {t('Aucun brouillon pour le moment.', 'No drafts yet.')}
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {drafts.map((draft) => {
        const isBusy = busyDraftId === draft.id;
        return (
          <li key={draft.id} className="card p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-5 h-5 text-aw-primary shrink-0" />
              <div className="min-w-0">
                <p className="body-semi truncate">{draft.title || t('(Sans titre)', '(Untitled)')}</p>
                <p className="text-aw-muted text-xs">
                  {t('Modifié le', 'Updated')} {formatDate(draft.updated_at)}
                  {draft.origin === 'web' && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-aw-success text-aw-primary">Web</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onResume(draft)}
                disabled={isBusy}
                className="btn-outline inline-flex items-center text-sm disabled:opacity-50"
              >
                <Pencil className="w-4 h-4 mr-1.5" /> {t('Reprendre', 'Resume')}
              </button>
              <button
                type="button"
                onClick={() => onDelete(draft)}
                disabled={isBusy}
                className="p-2 rounded-lg text-aw-muted hover:text-red-500 disabled:opacity-50"
                aria-label={t('Supprimer le brouillon', 'Delete draft')}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
