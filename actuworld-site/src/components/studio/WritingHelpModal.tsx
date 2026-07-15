import { useEffect } from 'react';
import { BookOpenCheck, Lightbulb, X } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import { PreflightChecklist } from './PreflightChecklist';
import { useLanguage } from '../../i18n/LanguageContext';

// Aide à l'écriture : ouverte depuis l'icône info de la barre d'outils.
// Contient la checklist « Prêt à publier ? » (live) + des conseils de
// rédaction alignés sur ce que l'ASV valorise.

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

  const tips: Array<[string, string]> = [
    [
      'Structure : un chapeau qui résume, des titres de section toutes les 3-4 idées, des paragraphes courts.',
      'Structure: a dek that summarizes, section headings every 3-4 ideas, short paragraphs.',
    ],
    [
      "Sources : vise l'article précis (pas la page d'accueil), et privilégie les sources primaires — étude, rapport, communiqué — quand elles existent.",
      'Sources: link the exact article (not a homepage), and prefer primary sources — study, report, statement — when they exist.',
    ],
    [
      "Deux médias différents valent mieux que deux articles du même média : l'ASV valorise la diversité des sources.",
      'Two different outlets beat two articles from the same outlet: ASV rewards source diversity.',
    ],
    [
      "Reste fidèle à tes sources : l'ASV compare ce que tu écris à ce qu'elles disent réellement (note de fidélité).",
      'Stay faithful to your sources: ASV compares what you write to what they actually say (faithfulness score).',
    ],
    [
      'Titre factuel plutôt que sensationnel : le sensationnalisme pèse négativement dans le score.',
      'Factual title over sensational: sensationalism weighs negatively in the score.',
    ],
    [
      "Relis dans l'Aperçu mobile avant d'envoyer : c'est exactement ce que verront les lecteurs.",
      'Proofread in the mobile Preview before sending: it is exactly what readers will see.',
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
            {t('Bien écrire ton article', 'Writing a great article')}
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

          {/* Conseils de rédaction */}
          <div>
            <p className="body-semi text-sm mb-2 inline-flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-aw-primary" />
              {t('Conseils', 'Tips')}
            </p>
            <ul className="space-y-2">
              {tips.map(([fr, en], index) => (
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
