import { STUDIO_FORMATS, type StudioJournalFormat } from '../../lib/studio/formats';
import { useLanguage } from '../../i18n/LanguageContext';

// Format éditorial — pendant web du FormatSelector de l'app : quatre puces
// toujours visibles (un clic, pas de menu), « Info » présélectionné, phrase
// d'explication du format choisi en dessous.

interface FormatSelectProps {
  value: StudioJournalFormat;
  onChange: (format: StudioJournalFormat) => void;
}

export function FormatSelect({ value, onChange }: FormatSelectProps) {
  const { isEnglish } = useLanguage();
  const selected = STUDIO_FORMATS.find((f) => f.key === value) ?? STUDIO_FORMATS[0];

  return (
    <div>
      <span id="studio-format-label" className="body-semi text-aw-text block mb-2.5">
        Format
      </span>

      <div role="radiogroup" aria-labelledby="studio-format-label" className="flex flex-wrap gap-2">
        {STUDIO_FORMATS.map((f) => {
          const isActive = f.key === value;
          return (
            <button
              key={f.key}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(f.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                isActive ? '' : 'border-aw text-aw-muted hover:text-aw-text'
              }`}
              style={isActive ? {
                color: f.color,
                borderColor: `color-mix(in srgb, ${f.color} 70%, transparent)`,
                backgroundColor: `color-mix(in srgb, ${f.color} 12%, transparent)`,
              } : undefined}
            >
              <f.Icon className="w-4 h-4 shrink-0" />
              {isEnglish ? f.en : f.fr}
            </button>
          );
        })}
      </div>

      <p className="caption text-aw-muted mt-2">{isEnglish ? selected.descEn : selected.descFr}</p>
    </div>
  );
}
