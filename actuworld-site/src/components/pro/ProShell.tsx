import type { ReactNode } from 'react';
import { Navigate, NavLink } from 'react-router-dom';
import { Loader2, Lock } from 'lucide-react';
import { PageMeta } from '../PageMeta';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStudioSession } from '../../hooks/useStudioSession';
import { useProAccess } from '../../hooks/useProAccess';
import type { ProAccess } from '../../lib/pro/types';
import { featuresOf } from '../../lib/pro/plan';

type Props = {
  title: string;
  path: string;
  /** Rendu une fois l'accès confirmé (membre ou modérateur). */
  children: (access: ProAccess) => ReactNode;
};

/**
 * Cadre des pages ASV Pro : session Supabase (la même que le Studio), accès
 * membre vérifié par l'API, sous-navigation. Sans session ou sans accès, retour
 * à /pro (connexion, ou page d'attente de la bêta).
 */
export function ProShell({ title, path, children }: Props) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { session, isLoading } = useStudioSession();
  const { access, isLoading: isAccessLoading } = useProAccess(!!session);

  if (!isLoading && !session) return <Navigate to="/pro" replace />;
  if (!isAccessLoading && session && access && !access.member) return <Navigate to="/pro" replace />;

  // Onglet réservé à une formule supérieure : il reste visible, avec un cadenas.
  const historyLocked = !!access && !featuresOf(access).history;
  const links = [
    { to: '/pro/verifier', label: t('Vérifier un texte', 'Check a text'), locked: false },
    { to: '/pro/app', label: t('À vérifier', 'To check'), locked: false },
    { to: '/pro/historique', label: t('Historique', 'History'), locked: historyLocked },
    { to: '/pro/sources', label: t('Éditeurs', 'Publishers'), locked: false },
    { to: '/pro/compte', label: t('Compte', 'Account'), locked: false },
  ];

  return (
    <div className="max-w-5xl mx-auto container-px py-8 sm:py-10">
      <PageMeta title={`${title} | ASV Pro`} description={t('ASV Pro : vérifier un texte et ses sources.', 'ASV Pro: check a text and its sources.')} path={path} noindex />
      <nav aria-label="ASV Pro" className="print:hidden flex gap-1 overflow-x-auto border-b border-aw mb-8 -mx-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${
                isActive ? 'border-aw-primary text-aw-primary' : 'border-transparent text-aw-muted hover:text-aw-text'
              }`
            }
          >
            {l.label}
            {l.locked && (
              <>
                <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">{t('(formule Pro)', '(Pro plan)')}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      {isLoading || isAccessLoading || !access ? (
        <div className="flex items-center gap-2 text-aw-muted py-16 justify-center" role="status">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          {t('Chargement…', 'Loading…')}
        </div>
      ) : (
        children(access)
      )}
    </div>
  );
}
