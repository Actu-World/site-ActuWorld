import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

type Props = {
  /** Ce qui est réservé, en une phrase. */
  title: string;
  description: string;
  /** Version compacte, sur une ligne, à glisser dans une page. */
  compact?: boolean;
};

/** Fonction réservée à la formule Pro : on le dit, et on montre où voir les formules. */
export function ProUpsell({ title, description, compact = false }: Props) {
  const { isEnglish } = useLanguage();
  const cta = isEnglish ? 'See the plans' : 'Voir les formules';

  if (compact) {
    return (
      <p className="text-sm text-aw-muted inline-flex flex-wrap items-center gap-x-2 gap-y-1">
        <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>{title}</span>
        <Link to="/tarifs" className="font-semibold text-aw-primary hover:underline">{cta}</Link>
      </p>
    );
  }
  return (
    <div className="card p-8 text-center max-w-xl mx-auto">
      <Lock className="w-6 h-6 mx-auto text-aw-muted" aria-hidden="true" />
      <h1 className="text-xl sm:text-2xl mt-4">{title}</h1>
      <p className="text-aw-muted text-sm mt-2">{description}</p>
      <Link to="/tarifs" className="btn-primary mt-6 inline-flex">{cta}</Link>
    </div>
  );
}
