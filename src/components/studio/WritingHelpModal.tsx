import { useEffect } from 'react';
import { BookOpenCheck, Lightbulb, X } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import { PreflightChecklist } from './PreflightChecklist';
import { useLanguage } from '../../i18n/LanguageContext';

// Info article : ouverte depuis l'icône info de la barre d'outils.
// Contient la checklist « Prêt à publier ? » (live) + les règles du format —
// uniquement du factuel, pas de conseils de rédaction ni de scoring.

interface WritingHelpModalProps {
  title: string;
  bodyLength: number;
  primaryTheme: string;
  sources: JournalSource[];
  onClose: () => void;
}

export function WritingHelpModal({ title, bodyLength, primaryTheme, sources, onClose }: WritingHelpModalProps) {
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

  const rules: Array<[string, string]> = [
    [
      'Un article = un titre (120 caractères max), un chapeau optionnel (200 max) et un corps de 4000 caractères max.',
      'An article = a title (120 characters max), an optional dek (200 max) and a body of up to 4000 characters.',
    ],
    [
      'Une image de couverture optionnelle et des blocs libres : titres, paragraphes, citations, images, séparateurs.',
      'An optional cover image and free-form blocks: headings, paragraphs, quotes, images, dividers.',
    ],
    [
      '1 à 2 sources, avec une URL commençant par http:// ou https://. Au moins une source valide (obligatoire pour publier).',
      '1 to 2 sources, with a URL starting with http:// or https://. At least one valid source (required to publish).',
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
            {t("Les règles de l'article", 'Article rules')}
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-aw-muted hover:text-aw-text"
            aria-label={t('Fermer', 'Close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Checklist live sur l'article en cours */}
          <PreflightChecklist
            title={title}
            bodyLength={bodyLength}
            primaryTheme={primaryTheme}
            sources={sources}
          />

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
