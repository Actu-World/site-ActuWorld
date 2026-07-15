import { Link2, Plus, Trash2 } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import { isValidSourceUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

interface SourceListEditorProps {
  sources: JournalSource[];
  onChange: (sources: JournalSource[]) => void;
}

const inputClass =
  'w-full rounded-xl border border-aw bg-aw-bg px-3 py-2.5 text-aw-text text-sm placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

export function SourceListEditor({ sources, onChange }: SourceListEditorProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const replaceAt = (index: number, source: JournalSource) =>
    onChange(sources.map((current, i) => (i === index ? source : current)));

  const removeAt = (index: number) => onChange(sources.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <p className="text-aw-muted text-sm">
        {t(
          "Ce sont ces sources que l'ASV vérifiera à la publication. Une URL complète (https://…) par source — article précis plutôt que page d'accueil.",
          'These are the sources ASV will verify at publish time. One full URL (https://…) per source — the exact article rather than a homepage.'
        )}
      </p>

      {sources.map((source, index) => {
        const urlFilled = source.url.trim().length > 0;
        const urlInvalid = urlFilled && !isValidSourceUrl(source.url);
        return (
          <div key={index} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-aw-muted text-xs uppercase tracking-wide inline-flex items-center">
                <Link2 className="w-3.5 h-3.5 mr-1.5" /> {t('Source', 'Source')} {index + 1}
              </span>
              <button type="button" onClick={() => removeAt(index)}
                className="p-1.5 rounded-lg text-aw-muted hover:text-red-500"
                aria-label={t('Supprimer la source', 'Delete source')}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <input
                  type="url"
                  value={source.url}
                  onChange={(e) => replaceAt(index, { ...source, url: e.target.value })}
                  placeholder="https://…"
                  className={`${inputClass} ${urlInvalid ? 'border-red-500 focus:ring-red-500' : ''}`}
                  aria-invalid={urlInvalid}
                />
                {urlInvalid && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("L'URL doit commencer par http:// ou https://", 'URL must start with http:// or https://')}
                  </p>
                )}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={source.title ?? ''}
                  onChange={(e) => replaceAt(index, { ...source, title: e.target.value })}
                  placeholder={t("Titre de l'article (optionnel)", 'Article title (optional)')}
                  className={inputClass}
                />
                <input
                  type="text"
                  value={source.publisher ?? ''}
                  onChange={(e) => replaceAt(index, { ...source, publisher: e.target.value })}
                  placeholder={t('Éditeur / média (optionnel)', 'Publisher / outlet (optional)')}
                  className={inputClass}
                />
              </div>
              <div className="sm:w-1/2">
                <label className="text-aw-muted text-xs block mb-1">
                  {t('Date de publication de la source (optionnel)', 'Source publication date (optional)')}
                </label>
                <input
                  type="date"
                  value={source.published_at ? source.published_at.slice(0, 10) : ''}
                  onChange={(e) =>
                    replaceAt(index, { ...source, published_at: e.target.value || null })
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className="btn-outline inline-flex items-center text-sm"
        onClick={() => onChange([...sources, { url: '', title: '', publisher: '', published_at: null }])}
      >
        <Plus className="w-4 h-4 mr-1.5" /> {t('Ajouter une source', 'Add a source')}
      </button>
    </div>
  );
}
