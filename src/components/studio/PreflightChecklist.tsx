import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import { isValidSourceUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Checklist factuelle avant envoi : uniquement les règles du produit
// (obligatoire / renseigné), pas de conseils ni de scoring.

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

export function PreflightChecklist({ title, bodyLength, primaryTheme, sources }: PreflightChecklistProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const validSources = sources.filter((s) => isValidSourceUrl(s.url));

  const items: CheckItem[] = [
    {
      ok: title.trim().length > 0,
      required: true,
      fr: 'Un titre (obligatoire pour envoyer)',
      en: 'A title (required to send)',
    },
    {
      ok: validSources.length >= 1,
      required: true,
      fr: 'Au moins une source valide (obligatoire pour publier)',
      en: 'At least one valid source (required to publish)',
    },
    {
      ok: bodyLength > 0,
      fr: 'Un corps de texte rédigé',
      en: 'A written body',
    },
    {
      ok: primaryTheme !== '',
      fr: 'Un thème principal choisi',
      en: 'A main theme selected',
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
          "La publication et la vérification des sources se font depuis l'app.",
          'Publishing and source verification happen from the app.'
        )}
      </p>
    </div>
  );
}
