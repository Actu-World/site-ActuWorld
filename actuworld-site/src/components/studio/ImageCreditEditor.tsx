import { Camera, ExternalLink, Globe, Palette } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  IMAGE_CREDIT_MAX, IMAGE_CREDIT_URL_MAX, type ImageCreditFields, type ImageCreditKind, type ImageCreditPatch,
} from '../../lib/studio/imageCredit';
import { safeHttpUrl } from '../../lib/safeUrl';

// Bloc « Crédit de l'image » du Studio — miroir de ImageCreditFields de l'app
// (Docs/app/CREDITS-IMAGES-TACHES.md §2) : trois puces, puis texte + lien quand
// l'image ne vient pas de l'auteur. Jamais bloquant : rien de coché par défaut,
// « Trouvée ailleurs » sans texte n'affiche qu'un rappel.

interface ImageCreditEditorProps {
  value: ImageCreditFields;
  onChange: (patch: ImageCreditPatch) => void;
  /** Variante serrée (vignette d'un bloc img+texte). */
  compact?: boolean;
}

const inputClass =
  'w-full rounded-lg border border-aw bg-aw-bg px-3 py-2 text-aw-text text-sm placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

export function ImageCreditEditor({ value, onChange, compact = false }: ImageCreditEditorProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const kind = (value.credit_kind ?? null) as ImageCreditKind | null;
  const text = value.credit ?? '';
  const url = value.credit_url ?? '';
  const needsText = kind === 'illustration' || kind === 'external';
  const missingText = kind === 'external' && !text.trim();
  const href = safeHttpUrl(url.trim());

  const kinds: Array<{ key: ImageCreditKind; icon: typeof Camera; fr: string; en: string }> = [
    { key: 'own', icon: Camera, fr: 'Ma photo', en: 'My photo' },
    { key: 'illustration', icon: Palette, fr: 'Illustration ou capture', en: 'Illustration or screenshot' },
    { key: 'external', icon: Globe, fr: 'Trouvée ailleurs', en: 'Found elsewhere' },
  ];

  return (
    <div className={compact ? 'mt-2 space-y-1.5' : 'mt-3 space-y-2'}>
      <div className="flex items-center gap-2">
        <span className={`font-bold text-aw-primary/80 ${compact ? 'text-[11px]' : 'text-xs'}`}>
          {t('Crédit de l’image', 'Image credit')}
        </span>
        <span className="text-aw-muted text-[11px]">{t('facultatif', 'optional')}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {kinds.map(({ key, icon: Icon, fr, en }) => {
          const active = kind === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ credit_kind: active ? null : key })}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                active
                  ? 'border-aw-primary bg-aw-primary/10 text-aw-primary font-bold'
                  : 'border-aw text-aw-muted hover:border-aw-primary/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t(fr, en)}
            </button>
          );
        })}
      </div>
      {needsText && (
        <>
          <input
            type="text"
            value={text}
            maxLength={IMAGE_CREDIT_MAX}
            onChange={(e) => onChange({ credit: e.target.value })}
            placeholder={t(
              'Auteur, licence (ex : Thierry Caro, CC BY-SA 4.0)',
              'Author, licence (e.g. Thierry Caro, CC BY-SA 4.0)',
            )}
            className={inputClass}
          />
          <div className="relative">
            <input
              type="url"
              value={url}
              maxLength={IMAGE_CREDIT_URL_MAX}
              onChange={(e) => onChange({ credit_url: e.target.value })}
              placeholder={t('Lien de la page d’origine (facultatif)', 'Link to the original page (optional)')}
              className={`${inputClass} ${href ? 'pr-9' : ''}`}
            />
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-2.5 top-2.5 text-aw-primary"
                aria-label={t('Ouvrir la page', 'Open the page')}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </>
      )}
      {missingText && (
        <p className="text-amber-600 text-[11px]">{t('Dis d’où vient l’image.', 'Say where the image comes from.')}</p>
      )}
    </div>
  );
}
