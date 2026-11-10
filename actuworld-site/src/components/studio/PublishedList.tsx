import { BadgeCheck, CircleDashed, CircleHelp, Newspaper, TriangleAlert } from 'lucide-react';
import type { StudioDraftRow } from '../../types/journal';
import { useLanguage } from '../../i18n/LanguageContext';
import { authorAdditions, isOpinionOnly } from '../../lib/studio/asvFeedback';

// Boucle de retour ASV (lecture seule) : le créateur qui travaille sur
// ordinateur voit le statut de vérification de ses derniers articles publiés
// sans reprendre son téléphone. Vocabulaire = échelle canonique ASV
// (source_check_status de journal_articles).

interface PublishedListProps {
  articles: StudioDraftRow[];
}

type StatusVisual = { label: [string, string]; className: string; icon: 'ok' | 'warn' | 'pending' | 'unknown' };

const STATUS_VISUALS: Record<string, StatusVisual> = {
  pending: { label: ['Vérification en cours', 'Verification in progress'], className: 'text-aw-muted', icon: 'pending' },
  verified: { label: ['Sources vérifiées', 'Sources verified'], className: 'text-aw-primary', icon: 'ok' },
  partially_true: { label: ['Partiellement vérifié', 'Partially verified'], className: 'text-amber-500', icon: 'warn' },
  context_missing: { label: ['Contexte manquant', 'Missing context'], className: 'text-amber-500', icon: 'warn' },
  unverifiable: { label: ['Invérifiable', 'Unverifiable'], className: 'text-aw-muted', icon: 'unknown' },
  misleading: { label: ['Signalé trompeur', 'Flagged misleading'], className: 'text-red-500', icon: 'warn' },
  failed: { label: ['Vérification échouée', 'Verification failed'], className: 'text-aw-muted', icon: 'unknown' },
};

function StatusIcon({ kind, className }: { kind: StatusVisual['icon']; className: string }) {
  const cls = `w-4 h-4 ${className}`;
  if (kind === 'ok') return <BadgeCheck className={cls} />;
  if (kind === 'warn') return <TriangleAlert className={cls} />;
  if (kind === 'pending') return <CircleDashed className={`${cls} animate-spin [animation-duration:3s]`} />;
  return <CircleHelp className={cls} />;
}

export function PublishedList({ articles }: PublishedListProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  if (articles.length === 0) return null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  return (
    <div className="mt-10">
      <h2 className="body-semi text-lg mb-1">{t('Publiés récemment', 'Recently published')}</h2>
      <p className="text-aw-muted text-sm mb-4">
        {t(
          'Statut de la vérification ASV de tes derniers articles.',
          'ASV verification status of your latest articles.'
        )}
      </p>
      <ul className="space-y-2">
        {articles.map((article) => {
          const visual = article.source_check_status ? STATUS_VISUALS[article.source_check_status] : undefined;
          // ASV 10.6 : ce qu'ASV a lu comme les ajouts de l'auteur, montré, jamais noté.
          const additions = authorAdditions(article.source_check_data);
          const opinionOnly = isOpinionOnly(article.source_check_data);
          return (
            <li key={article.id} className="card p-4 flex items-center gap-3">
              <Newspaper className="w-5 h-5 text-aw-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="body-semi truncate">{article.title}</p>
                <p className="text-aw-muted text-xs">
                  {t('Publié le', 'Published')} {formatDate(article.published_at ?? article.updated_at)}
                </p>
                {opinionOnly ? (
                  <p className="text-aw-muted text-xs mt-1">
                    {t(
                      "Tu donnes un avis : ASV n'a rien à confronter aux sources, et un avis n'est pas noté.",
                      'You give an opinion: ASV has nothing to check against the sources, and an opinion is not scored.'
                    )}
                  </p>
                ) : additions.length > 0 ? (
                  <p className="text-aw-muted text-xs mt-1">
                    {t('ASV a lu ceci comme ton avis, sans source : ', 'ASV read this as your opinion, without a source: ')}
                    {additions.map((a) => (isEnglish ? `“${a}”` : `« ${a} »`)).join(isEnglish ? ', ' : ', ')}
                    {t(". C'est montré aux lecteurs, pas noté.", '. It is shown to readers, not scored.')}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {visual ? (
                  <>
                    <StatusIcon kind={visual.icon} className={visual.className} />
                    <span className={`text-sm ${visual.className}`}>{t(visual.label[0], visual.label[1])}</span>
                  </>
                ) : (
                  <span className="text-aw-muted text-sm">—</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
