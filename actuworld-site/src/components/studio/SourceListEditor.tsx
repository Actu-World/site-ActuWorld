import { FileText, Plus, Trash2 } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import { isValidSourceUrl, MAX_SOURCES, SOURCE_TITLE_MAX, SOURCE_URL_MAX } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Sources alignées sur le composer mobile : titre (optionnel) + URL, 2 max,
// source obligatoire pour publier (l'app l'exige, le brouillon peut attendre).
// L'éditeur (média) est auto-déduit du domaine à l'envoi — pas de champ dédié.

interface SourceListEditorProps {
  sources: JournalSource[];
  onChange: (sources: JournalSource[]) => void;
}

const inputClass =
  'w-full rounded-lg border border-aw bg-aw-bg px-3 py-2.5 text-aw-text text-sm placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

export function SourceListEditor({ sources, onChange }: SourceListEditorProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const replaceAt = (index: number, source: JournalSource) =>
    onChange(sources.map((current, i) => (i === index ? source : current)));

  const removeAt = (index: number) => {
    const next = sources.filter((_, i) => i !== index);
    // Comme dans l'app : on garde toujours au moins une ligne.
    onChange(next.length > 0 ? next : [{ url: '', title: '' }]);
  };

  return (
    <div className="border-t border-aw pt-4">
      <div className="flex items-center mb-2">
        <FileText className="w-4 h-4 text-aw-primary" />
        <h2 className="body-semi text-lg ml-2">{t('Sources', 'Sources')}</h2>
        <span className="text-red-500 ml-1.5" aria-hidden>*</span>
        {sources.length < MAX_SOURCES && (
          <button
            type="button"
            className="btn-outline inline-flex items-center text-sm ml-auto"
            onClick={() => onChange([...sources, { url: '', title: '' }])}
          >
            <Plus className="w-4 h-4 mr-1" /> {t('Ajouter', 'Add')}
          </button>
        )}
      </div>
      <p className="text-aw-muted text-sm mb-3">
        {t(
          "L'ASV vérifiera ces sources à la publication — vise l'article précis, pas la page d'accueil.",
          'ASV will verify these sources at publish time — link the exact article, not a homepage.'
        )}
      </p>

      <div className="space-y-3">
        {sources.map((source, index) => {
          const urlFilled = source.url.trim().length > 0;
          const urlInvalid = urlFilled && !isValidSourceUrl(source.url);
          return (
            <div key={index} className="border-t border-aw pt-3">
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={source.title ?? ''}
                    onChange={(e) => replaceAt(index, { ...source, title: e.target.value })}
                    placeholder={t('Titre de la source (optionnel)', 'Source title (optional)')}
                    maxLength={SOURCE_TITLE_MAX}
                    className={inputClass}
                  />
                  <input
                    type="url"
                    value={source.url}
                    onChange={(e) => replaceAt(index, { ...source, url: e.target.value })}
                    placeholder="https://..."
                    maxLength={SOURCE_URL_MAX}
                    className={`${inputClass} ${urlInvalid ? 'border-red-500 focus:ring-red-500' : ''}`}
                    aria-invalid={urlInvalid}
                  />
                  {urlInvalid && (
                    <p className="text-red-500 text-xs">
                      {t("L'URL doit commencer par http:// ou https://", 'URL must start with http:// or https://')}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="p-2 rounded-lg bg-aw-surface text-red-500 hover:text-red-600"
                  aria-label={t('Supprimer la source', 'Delete source')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
