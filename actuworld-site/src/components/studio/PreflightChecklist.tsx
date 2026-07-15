import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import { hostFromUrl, isValidSourceUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// « Pré-vol ASV » : traduit les règles connues du scoring en conseils AVANT
// l'envoi — heuristiques locales uniquement, aucun calcul de vérification
// (l'ASV reste seul juge à la publication).

interface PreflightChecklistProps {
  title: string;
  bodyLength: number;
  primaryTheme: string;
  sources: JournalSource[];
}

type CheckItem = {
  ok: boolean;
  required?: boolean;
  fr: string;
  en: string;
};

/** URL d'article précis (un chemin), pas une simple page d'accueil. */
function isDeepUrl(url: string): boolean {
  try {
    return new URL(url).pathname.replace(/\/+$/, '').length > 1;
  } catch {
    return false;
  }
}

export function PreflightChecklist({ title, bodyLength, primaryTheme, sources }: PreflightChecklistProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const validSources = sources.filter((s) => isValidSourceUrl(s.url));
  const distinctPublishers = new Set(
    validSources.map((s) => hostFromUrl(s.url)).filter(Boolean)
  ).size;

  const items: CheckItem[] = [
    {
      ok: validSources.length >= 1,
      required: true,
      fr: 'Au moins une source valide (obligatoire pour publier)',
      en: 'At least one valid source (required to publish)',
    },
    {
      ok: distinctPublishers >= 2,
      fr: "Deux médias différents — la diversité des sources améliore le score ASV",
      en: 'Two different outlets — source diversity improves the ASV score',
    },
    {
      ok: validSources.length > 0 && validSources.every((s) => isDeepUrl(s.url)),
      fr: "Des articles précis, pas des pages d'accueil",
      en: 'Exact articles, not homepages',
    },
    {
      ok: primaryTheme !== '',
      fr: 'Thème principal choisi',
      en: 'Main theme selected',
    },
    {
      ok: bodyLength >= 300,
      fr: 'Corps développé (au moins 300 caractères)',
      en: 'Substantial body (at least 300 characters)',
    },
    {
      ok: title.trim().length > 0 && title.trim().length <= 80,
      fr: 'Titre renseigné et concis (≤ 80 caractères)',
      en: 'Title present and concise (≤ 80 characters)',
    },
  ];

  const okCount = items.filter((i) => i.ok).length;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-4 h-4 text-aw-primary" />
        <h2 className="body-semi">{t('Prêt à publier ?', 'Ready to publish?')}</h2>
        <span className="text-aw-muted text-xs ml-auto">{okCount}/{items.length}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            {item.ok ? (
              <CheckCircle2 className="w-4 h-4 text-aw-primary shrink-0 mt-0.5" />
            ) : (
              <Circle className={`w-4 h-4 shrink-0 mt-0.5 ${item.required ? 'text-red-500' : 'text-aw-muted'}`} />
            )}
            <span className={item.ok ? 'text-aw-muted line-through decoration-transparent' : item.required ? 'text-aw-text' : 'text-aw-muted'}>
              {t(item.fr, item.en)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-aw-muted text-xs mt-3">
        {t(
          "Conseils indicatifs : la vérification ASV réelle se fait à la publication, dans l'app.",
          'Indicative tips: the real ASV verification runs at publish time, in the app.'
        )}
      </p>
    </div>
  );
}
