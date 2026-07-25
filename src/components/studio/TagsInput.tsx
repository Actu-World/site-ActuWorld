import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { MAX_TAGS } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Tags alignés sur le composer mobile : 3 max, virgule ou Entrée pour valider.

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ tags, onChange }: TagsInputProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [inputValue, setInputValue] = useState('');

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

  return (
    <div>
      <label htmlFor="studio-tags" className="text-aw-muted text-xs block mb-1.5">
        {t(`Tags (${MAX_TAGS} max) — Entrée ou virgule pour valider`, `Tags (max ${MAX_TAGS}) — Enter or comma to add`)}
      </label>
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-aw bg-aw-bg px-3 py-2 focus-within:ring-2 focus-within:ring-aw-primary">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-aw-surface border border-aw text-sm">
            #{tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((current) => current !== tag))}
              className="text-aw-muted hover:text-red-500"
              aria-label={t(`Retirer le tag ${tag}`, `Remove tag ${tag}`)}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        {tags.length < MAX_TAGS ? (
          <input
            id="studio-tags"
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { commit(inputValue); setInputValue(''); }}
            placeholder={tags.length === 0 ? t('actu, economie…', 'news, economy…') : ''}
            className="flex-1 min-w-[140px] bg-transparent text-sm text-aw-text placeholder:text-aw-muted focus:outline-none py-1"
          />
        ) : (
          <span className="text-aw-muted text-xs py-1">{t('Maximum atteint', 'Maximum reached')}</span>
        )}
      </div>
    </div>
  );
}
