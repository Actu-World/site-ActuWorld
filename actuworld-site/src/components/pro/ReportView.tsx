import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ExternalLink, Loader2 } from 'lucide-react';
import type { ReportData } from '../../lib/pro/types';
import {
  alertWords, faithfulnessWords, publisherWords, reviewEmpty, reviewItems, sectionViews, stanceTone, stanceWords,
  reportSummary, TONE_COLOR, verdictTone, verdictWords, type Lang, type SectionView,
} from '../../lib/pro/report';

// ASV Pro — rendu d'un rapport, commun à la page privée (/pro/rapport/:id) et à
// la page partagée en lecture seule (/pro/r/:jeton, 3.8).

function ToneDot({ color }: { color: string }) {
  return <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />;
}

/**
 * `textScope` : les sources valent pour tout le texte (article). Sous un passage,
 * on ne montre alors que les sources qui en parlent (elles l'appuient ou le
 * contredisent) ; les autres sont rappelées une fois, en tête du rapport. En mode
 * « une source par passage », l'auteur a attaché ses sources lui-même : on les
 * montre toutes, y compris celle qui ne parle pas du passage.
 */
function Passage({ view, lang, textScope }: { view: SectionView; lang: Lang; textScope: boolean }) {
  const t = (fr: string, en: string) => (lang === 'en' ? en : fr);
  const lines = textScope
    ? view.lines.filter((line) => line.stance === 'supports' || line.stance === 'contradicts')
    : view.lines;
  return (
    <li id={`passage-${view.index + 1}`} className="card p-5 sm:p-6 break-inside-avoid scroll-mt-24">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-lg">{t('Passage', 'Passage')} {view.index + 1}</h3>
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <ToneDot color={TONE_COLOR[stanceTone(view.stance)]} />
          {stanceWords(view.stance, lang)}
        </span>
      </div>
      <p className="whitespace-pre-line leading-relaxed">
        {view.segments.map((seg, i) =>
          seg.added ? (
            <mark key={i} className="rounded px-0.5" style={{ backgroundColor: 'color-mix(in srgb, var(--aw-secondary) 45%, transparent)', color: 'inherit' }}>
              {seg.text}
            </mark>
          ) : (
            <span key={i}>{seg.text}</span>
          ),
        )}
      </p>
      {view.additions.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="body-semi">
            {view.partialRead
              ? t('Pas trouvé dans la partie lue de la source (le reste est réservé aux abonnés) :', 'Not found in the part of the source that was read (the rest is for subscribers):')
              : t("L'auteur ajoute, sans sa source :", 'The author adds, without a source:')}
          </p>
          <ul className="list-disc pl-5 text-aw-muted mt-1">
            {view.additions.map((a) => <li key={a}>« {a} »</li>)}
          </ul>
        </div>
      )}
      {view.details.length > 0 && (
        <div className="mt-4 text-sm">
          <p className="body-semi">
            {view.details.length > 1
              ? t('Points à vérifier (le reste du passage tient) :', 'Points to check (the rest of the passage holds):')
              : t('Un point à vérifier (le reste du passage tient) :', 'One point to check (the rest of the passage holds):')}
          </p>
          <ul className="list-disc pl-5 text-aw-muted mt-1 space-y-1">
            {view.details.map((d) => (
              <li key={d.cardText}>
                {t('Tu écris', 'You write')} « {d.cardText} ». {d.domain ?? t('La source', 'The source')} {t('dit', 'says')} : « {d.sourceQuote} »
              </li>
            ))}
          </ul>
        </div>
      )}
      <ul className="mt-5 space-y-4">
        {textScope && view.lines.length > 0 && lines.length === 0 && (
          <li className="text-sm text-aw-muted">
            {t('Aucune source du texte ne parle de ce passage.', 'None of the text’s sources covers this passage.')}
          </li>
        )}
        {view.lines.length === 0 && (
          <li className="text-sm text-aw-muted">
            {view.stance === 'none'
              ? t('Ce passage n’a pas de lien : ASV n’a rien à confronter. Ajoute une source si c’est un fait.', 'This passage has no link: ASV has nothing to check. Add a source if it is a fact.')
              : t('Pas de verdict pour ce passage.', 'No verdict for this passage.')}
          </li>
        )}
        {lines.map((line) => (
          <li key={line.url} className="border-t border-aw pt-4 text-sm">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <a href={line.url} target="_blank" rel="noopener noreferrer" className="link font-semibold inline-flex items-center gap-1">
                {line.domain}
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
              <span className="inline-flex items-center gap-1.5">
                <ToneDot color={TONE_COLOR[stanceTone(line.stance)]} />
                {stanceWords(line.stance, lang)}
              </span>
              {line.publisher && <span className="text-aw-muted">{line.publisher}</span>}
            </div>
            {line.state && <p className="text-aw-muted mt-1">{line.state}</p>}
            {line.claim && (
              <p className="mt-2"><span className="body-semi">{t('Le texte dit :', 'The text says:')}</span> « {line.claim} »</p>
            )}
            {line.quote && (
              <blockquote className="mt-2 pl-3 border-l-2" style={{ borderColor: TONE_COLOR[stanceTone(line.stance)] }}>
                <span className="body-semi">{t('La source dit :', 'The source says:')}</span> « {line.quote} »
              </blockquote>
            )}
            {line.explanation && <p className="text-aw-muted mt-2">{line.explanation}</p>}
            {line.reading && <p className="caption text-aw-muted mt-2">{line.reading}</p>}
          </li>
        ))}
      </ul>
    </li>
  );
}

type Props = {
  data: ReportData;
  lang: Lang;
  /** Boutons sous l'en-tête (exports, partage, relance…). */
  actions?: ReactNode;
  /** Mention au-dessus du titre (ex. rapport partagé en lecture seule). */
  banner?: ReactNode;
  /** Synthèse et « À reprendre avant publication » (formule Pro). Vrai par défaut. */
  showReview?: boolean;
};

export default function ReportView({ data, lang, actions, banner, showReview = true }: Props) {
  const t = (fr: string, en: string) => (lang === 'en' ? en : fr);
  const v = data.result?.verification;
  const opinionSourced = !!v?.faithfulness?.opinion_sourced;
  const pending = data.status === 'pending';
  const status = data.status === 'failed' && !v ? 'failed' : v?.status ?? (pending ? null : data.verdict_status);
  const tone = TONE_COLOR[verdictTone(status, opinionSourced)];
  const views = sectionViews(data.input, v?.cards, v?.sources_check, lang, v?.explanations_locale);
  // Sources pour tout le texte : listées une fois ici, avec leur état de lecture.
  const textScope = data.input.sources_scope === 'text';
  const textSources = textScope
    ? [...new Map(views.flatMap((view) => view.lines).map((line) => [line.url, line])).values()]
    : [];
  const alerts = (v?.alerts_i18n ?? []).map((a) => alertWords(a, lang)).filter((x): x is string => !!x);
  const review = v ? reviewItems(views, lang, v.advice) : [];
  const llmDown = data.result?.llm?.status && data.result.llm.status !== 'ok';
  const date = new Date(data.finished_at ?? data.created_at)
    .toLocaleString(lang === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <article className="space-y-6">
      <header className="card p-6 sm:p-8">
        {banner}
        <p className="caption text-aw-muted">{t('Rapport ASV', 'ASV report')} · {date}</p>
        <h1 className="text-2xl sm:text-3xl mt-2">{data.input.title}</h1>
        {pending && !v ? (
          <p className="mt-4 inline-flex items-center gap-2 text-aw-muted" role="status">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {t('Vérification en cours : lecture des sources, puis jugement passage par passage. Cela prend en général moins de deux minutes.',
              'Checking: reading the sources, then judging passage by passage. This usually takes under two minutes.')}
          </p>
        ) : (
          <>
            <p className="mt-4 inline-flex items-center gap-2 text-xl font-semibold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
              <ToneDot color={tone} />
              {verdictWords(status, lang, opinionSourced)}
            </p>
            {v && showReview && <p className="mt-2 text-aw-muted max-w-prose">{reportSummary(v, views, lang)}</p>}
            {pending && (
              <p className="mt-3 text-sm inline-flex items-center gap-2 text-aw-muted" role="status">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                {t('Résultat provisoire : une source est encore en cours d’évaluation, le rapport se met à jour seul.',
                  'Provisional result: a source is still being assessed, the report updates itself.')}
              </p>
            )}
          </>
        )}
        {v && !showReview && (
          <p className="mt-4 text-sm text-aw-muted">
            {t('La synthèse et la liste des points à reprendre avant publication font partie de la formule Pro. Le détail passage par passage est juste en dessous.',
              'The summary and the list of points to fix before publishing come with the Pro plan. The passage-by-passage detail is just below.')}
          </p>
        )}
        {v && showReview && (
          <section className="mt-6 rounded-xl border border-aw p-4 sm:p-5" aria-labelledby="pro-review">
            <h2 id="pro-review" className="text-base">{t('À reprendre avant publication', 'To fix before publishing')}</h2>
            {review.length === 0 ? (
              <p className="text-sm mt-2 inline-flex items-center gap-2"><ToneDot color={TONE_COLOR.green} />{reviewEmpty(lang)}</p>
            ) : (
              <ol className="mt-3 space-y-2 text-sm">
                {review.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1.5"><ToneDot color={TONE_COLOR[item.tone]} /></span>
                    <a href={`#passage-${item.passage}`} className="hover:underline">{item.text}</a>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
        {v && (
          <dl className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <dt className="text-aw-muted">{t('Qui publie les sources', 'Who publishes the sources')}</dt>
              <dd className="body-semi mt-1">{publisherWords(v.publisher, lang)}</dd>
            </div>
            <div>
              <dt className="text-aw-muted">{t('Fidélité aux sources', 'Faithfulness to sources')}</dt>
              <dd className="body-semi mt-1">{faithfulnessWords(v.faithfulness, lang)}</dd>
            </div>
          </dl>
        )}
        {(llmDown || alerts.length > 0) && (
          <ul className="mt-6 space-y-2 text-sm">
            {llmDown && (
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: TONE_COLOR.orange }} aria-hidden="true" />
                {t('Le modèle d’analyse était indisponible pendant cette vérification : relance-la plus tard.', 'The analysis model was unavailable during this check: run it again later.')}</li>
            )}
            {alerts.map((a) => (
              <li key={a} className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-aw-muted" aria-hidden="true" />{a}</li>
            ))}
          </ul>
        )}
        {actions && <div className="mt-6 print:hidden">{actions}</div>}
      </header>

      {v && textScope && textSources.length > 0 && (
        <section className="card p-5 sm:p-6" aria-labelledby="pro-text-sources">
          <h2 id="pro-text-sources" className="text-lg">{t('Sources du texte', 'Text sources')}</h2>
          <p className="text-sm text-aw-muted mt-1 max-w-prose">
            {t('Elles valent pour tout le texte. Sous chaque passage, seules celles qui en parlent sont rappelées.',
              'They apply to the whole text. Under each passage, only the ones that cover it are shown.')}
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {textSources.map((line) => (
              <li key={line.url}>
                <a href={line.url} target="_blank" rel="noopener noreferrer" className="link font-semibold inline-flex items-center gap-1">
                  {line.domain}
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
                {line.publisher && <span className="text-aw-muted ml-3">{line.publisher}</span>}
                {line.state && <p className="text-aw-muted mt-1">{line.state}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {v && (
        <ol className="space-y-5">
          {views.map((view) => <Passage key={view.index} view={view} lang={lang} textScope={textScope} />)}
        </ol>
      )}

      <p className="text-xs text-aw-muted max-w-prose">
        {t(
          'ASV mesure la transparence des éditeurs et la fidélité du texte à ses sources. Il ne dit pas si un contenu est vrai ou faux. Une source non lue n’est jamais comptée comme fausse.',
          'ASV measures how transparent publishers are and how faithful the text is to its sources. It does not say whether content is true or false. An unread source is never counted as false.',
        )}{' '}
        <Link to="/reco-src" className="link">{t('Comment ASV vérifie', 'How ASV checks')}</Link>
      </p>
    </article>
  );
}
