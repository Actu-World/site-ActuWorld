import { useEffect } from 'react';
import { BookOpenCheck, CheckCircle2, Circle, Lightbulb, X } from 'lucide-react';
import type { PostDraftImage } from '../../types/post';
import { isValidSourceUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Info dépêche : pendant du WritingHelpModal de l'article. Checklist live
// (mêmes règles que la publication dans l'app) + règles du format cartes —
// uniquement du factuel, pas de conseils de rédaction ni de scoring.

interface PostHelpModalProps {
  cards: PostDraftImage[];
  primaryTheme: string;
  onClose: () => void;
}

export function PostHelpModal({ cards, primaryTheme, onClose }: PostHelpModalProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const filled = cards.filter((c) =>
    !!c.image_url || !!c.subject?.trim() || !!c.description?.trim() ||
    !!c.back_description?.trim() || !!c.source?.url?.trim());

  const checks: Array<{ ok: boolean; fr: string; en: string }> = [
    {
      ok: filled.length > 0 && filled.every((c) => !!c.image_url),
      fr: 'Une image par carte (obligatoire)',
      en: 'One image per card (required)',
    },
    {
      ok: !!filled[0]?.subject?.trim(),
      fr: 'Un sujet sur la carte 1 (obligatoire — c\'est le titre de la dépêche)',
      en: 'A subject on card 1 (required — it is the dispatch title)',
    },
    {
      ok: filled.every((c) => !!c.description?.trim()),
      fr: 'Un excerpt court par carte (obligatoire)',
      en: 'A short excerpt per card (required)',
    },
    {
      ok: filled.length > 0 && filled.every((c) => !!c.source?.url?.trim() && isValidSourceUrl(c.source.url)),
      fr: 'Au moins une source valide par carte (obligatoire pour publier)',
      en: 'At least one valid source per card (required to publish)',
    },
    {
      ok: !!primaryTheme,
      fr: 'Un thème principal choisi',
      en: 'A main theme selected',
    },
  ];

  const rules: Array<[string, string]> = [
    [
      'Une dépêche = 1 à 4 cartes visuelles. La carte 1 porte le titre.',
      'A dispatch = 1 to 4 visual cards. Card 1 carries the title.',
    ],
    [
      'Par carte : sujet (80 caractères max), excerpt court (150 max), description longue optionnelle (600 max) et une source.',
      'Per card: subject (80 characters max), short excerpt (150 max), optional long description (600 max) and a source.',
    ],
    [
      "Le recto affiche l'image, le sujet et l'excerpt ; la description longue et la source sont au dos de la carte.",
      'The front shows the image, subject and excerpt; the long description and source are on the back of the card.',
    ],
    [
      "Le brouillon s'envoie dans l'app ; la publication et la vérification des sources se font depuis l'app.",
      'The draft is sent to the app; publishing and source verification happen from the app.',
    ],
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      role="dialog"
      aria-label={t("Aide à l'écriture", 'Writing help')}
      onClick={onClose}
    >
      <div
        className="bg-aw-bg text-aw-text rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-aw"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-aw sticky top-0 bg-aw-bg">
          <h2 className="body-semi inline-flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-aw-primary" />
            {t('Les règles de la dépêche', 'Dispatch rules')}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-aw-muted hover:text-aw-text"
            aria-label={t('Fermer', 'Close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Checklist live sur le post en cours */}
          <div>
            <p className="body-semi text-sm mb-2">{t('Prêt à publier ?', 'Ready to publish?')}</p>
            <ul className="space-y-1.5">
              {checks.map((check, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  {check.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-aw-primary shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-aw-muted shrink-0 mt-0.5" />
                  )}
                  <span className={check.ok ? 'text-aw-text' : 'text-aw-muted'}>{t(check.fr, check.en)}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Règles du format */}
          <div>
            <p className="body-semi text-sm mb-2 inline-flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-aw-primary" />
              {t('À savoir', 'Good to know')}
            </p>
            <ul className="space-y-2">
              {rules.map(([fr, en], index) => (
                <li key={index} className="text-sm text-aw-muted leading-relaxed pl-3 border-l-2 border-aw">
                  {t(fr, en)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
