import { useEffect } from 'react';
import { BookOpenCheck, CheckCircle2, Circle, Lightbulb, X } from 'lucide-react';
import type { PostDraftImage } from '../../types/post';
import { isValidSourceUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Aide à l'écriture de la dépêche : pendant du WritingHelpModal de l'article.
// Checklist live (mêmes règles que la publication dans l'app : image + sujet
// carte 1 + une source par carte) + conseils adaptés au format cartes.

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
      fr: 'Chaque carte a son image (au moins une carte)',
      en: 'Each card has its image (at least one card)',
    },
    {
      ok: !!filled[0]?.subject?.trim(),
      fr: 'La carte 1 a un sujet — c\'est le titre de la dépêche',
      en: 'Card 1 has a subject — it is the dispatch title',
    },
    {
      ok: filled.every((c) => !!c.description?.trim()),
      fr: 'Chaque carte a son excerpt court (lu sur l\'image)',
      en: 'Each card has its short excerpt (read on the image)',
    },
    {
      ok: filled.length > 0 && filled.every((c) => !!c.source?.url?.trim() && isValidSourceUrl(c.source.url)),
      fr: 'Chaque carte a une source valide (requise pour publier)',
      en: 'Each card has a valid source (required to publish)',
    },
    {
      ok: !!primaryTheme,
      fr: 'Un thème principal est choisi',
      en: 'A main theme is chosen',
    },
  ];

  const tips: Array<[string, string]> = [
    [
      'Une idée par carte : le sujet et l\'excerpt court se lisent sur l\'image, la description longue au dos de la carte.',
      'One idea per card: the subject and short excerpt are read on the image, the long description on the back of the card.',
    ],
    [
      'Le sujet de la carte 1 est le titre de la dépêche : factuel et direct plutôt que sensationnel — le sensationnalisme pèse négativement dans le score ASV.',
      'Card 1\'s subject is the dispatch title: factual and direct over sensational — sensationalism weighs negatively in the ASV score.',
    ],
    [
      'Choisis des images nettes au format portrait (3:4) : la carte occupe tout l\'écran dans le feed.',
      'Pick sharp portrait (3:4) images: the card fills the whole screen in the feed.',
    ],
    [
      "Sources : vise l'article précis (pas la page d'accueil), et privilégie les sources primaires — étude, rapport, communiqué — quand elles existent.",
      'Sources: link the exact article (not a homepage), and prefer primary sources — study, report, statement — when they exist.',
    ],
    [
      "Des médias différents entre les cartes valent mieux qu'un seul média partout : l'ASV valorise la diversité des sources.",
      'Different outlets across cards beat one outlet everywhere: ASV rewards source diversity.',
    ],
    [
      "Vérifie le rendu dans l'Aperçu : recto (image + titre) et verso (description + source), carte par carte.",
      'Check the result in the Preview: front (image + title) and back (description + source), card by card.',
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
            {t('Bien composer ta dépêche', 'Composing a great dispatch')}
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

          {/* Conseils de composition */}
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
