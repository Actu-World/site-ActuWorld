import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { MAX_TAGS } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Tags — pendant web du ThemeTagsField de l'app : en-tête « Tags » + compteur,
// champ underline éditorial (icône pricetag + bouton « + » en pastille verte),
// puis chips arrondies au fond vert (badge), comme le composer mobile.
// 3 max, virgule ou Entrée pour valider.

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ tags, onChange }: TagsInputProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [inputValue, setInputValue] = useState('');

  const canAdd = !!inputValue.trim() && tags.length < MAX_TAGS;

  const commit = (raw: string) => {
    const tag = raw.replace(/\s+/g, ' ').trim();
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;
    onChange([...tags, tag]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit(inputValue);
      setInputValue('');
    } else if (event.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handleChange = (value: string) => {
    if (value.endsWith(',')) {
      commit(value.slice(0, -1));
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const add = () => { commit(inputValue); setInputValue(''); };

  return (
    <div>
      {/* En-tête : libellé + compteur (comme l'app) */}
      <div className="flex items-center mb-1.5">
        <label htmlFor="studio-tags" className="body-semi text-aw-text">{t('Tags', 'Tags')}</label>
        <span className="ml-auto caption text-aw-text/55">{tags.length}/{MAX_TAGS}</span>
      </div>

      {/* Champ underline éditorial */}
      {tags.length < MAX_TAGS ? (
        <div className="flex items-center gap-2 py-2 border-b border-aw">
          <Tag className="w-4 h-4 text-aw-muted shrink-0" />
          <input
            id="studio-tags"
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={add}
            placeholder={t('actu, économie…', 'news, economy…')}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-aw-text placeholder:text-aw-muted focus:outline-none py-0.5"
            autoCapitalize="none"
            autoCorrect="off"
          />
          <button
            type="button"
            onClick={add}
            disabled={!canAdd}
            aria-label={t('Ajouter le tag', 'Add tag')}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40"
            style={{ backgroundColor: 'color-mix(in srgb, var(--aw-primary) 12%, transparent)' }}
          >
            <Plus className="w-[18px] h-[18px] text-aw-primary" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 py-2 border-b border-aw">
          <Tag className="w-4 h-4 text-aw-muted shrink-0" />
          <span className="caption text-aw-muted py-0.5">{t('Maximum atteint', 'Maximum reached')}</span>
        </div>
      )}

      {/* Chips arrondies, fond vert (badge de l'app) */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-lg border border-aw bg-aw-success caption text-aw-text"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(tags.filter((current) => current !== tag))}
                className="text-aw-text/60 hover:text-red-500 transition-colors"
                aria-label={t(`Retirer le tag ${tag}`, `Remove tag ${tag}`)}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="caption text-aw-text/55 mt-2">
        {t('Entrée ou virgule pour valider.', 'Enter or comma to add.')}
      </p>
    </div>
  );
}
