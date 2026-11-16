import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Loader2, Download, Printer, RotateCcw, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import type { ProVerificationDetail } from '../../lib/pro/types';
import {
  alertWords, faithfulnessWords, publisherWords, reviewEmpty, reviewItems, sectionViews, stanceTone, stanceWords,
  synthesis, toMarkdown, TONE_COLOR, verdictTone, verdictWords, type Lang, type SectionView,
} from '../../lib/pro/report';

const POLL_MS = 3000;

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function slug(title: string): string {
  return title.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'rapport';
}

function ToneDot({ color }: { color: string }) {
  return <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />;
}

function Section({ view, lang }: { view: SectionView; lang: Lang }) {
  const t = (fr: string, en: string) => (lang === 'en' ? en : fr);
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
      <ul className="mt-5 space-y-4">
        {view.lines.length === 0 && (
          <li className="text-sm text-aw-muted">
            {view.stance === 'none'
              ? t('Ce passage n’a pas de lien : ASV n’a rien à confronter. Ajoute une source si c’est un fait.', 'This passage has no link: ASV has nothing to check. Add a source if it is a fact.')
              : t('Pas de verdict pour ce passage.', 'No verdict for this passage.')}
          </li>
        )}
        {view.lines.map((line) => (
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
          </li>
        ))}
      </ul>
    </li>
  );
}

function Report({ id }: { id: string }) {
  const { isEnglish } = useLanguage();
  const lang: Lang = isEnglish ? 'en' : 'fr';
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ProVerificationDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => proApi.get(id).then(setDetail).catch((e: Error) => setError(e.message)), [id]);

  useEffect(() => {
    setDetail(null);
    setError(null);
    load();
  }, [load]);

  useEffect(() => {
    if (detail?.status !== 'pending') return;
    const timer = setTimeout(load, POLL_MS);
    return () => clearTimeout(timer);
  }, [detail, load]);

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="body-semi">{error}</p>
        <Link to="/pro/historique" className="btn-outline btn-sm mt-5">{t("Retour à l'historique", 'Back to history')}</Link>
      </div>
    );
  }
  if (!detail) {
    return <div className="flex justify-center py-16 text-aw-muted" role="status"><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /></div>;
  }

  const v = detail.result?.verification;
  const opinionSourced = !!v?.faithfulness?.opinion_sourced;
  const pending = detail.status === 'pending';
  const status = detail.status === 'failed' && !v ? 'failed' : v?.status ?? (pending ? null : detail.verdict_status);
  const tone = TONE_COLOR[verdictTone(status, opinionSourced)];
  const views = sectionViews(detail.input, v?.cards, v?.sources_check, lang, v?.explanations_locale);
  const alerts = (v?.alerts_i18n ?? []).map((a) => alertWords(a, lang)).filter((x): x is string => !!x);
  const review = v ? reviewItems(views, lang) : [];
  const llmDown = detail.result?.llm?.status && detail.result.llm.status !== 'ok';
  const date = new Date(detail.finished_at ?? detail.created_at).toLocaleString(isEnglish ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  const rerun = async () => {
    setBusy(true);
    try {
      navigate(`/pro/rapport/${await proApi.rerun(detail.id)}`);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const remove = async () => {
    setBusy(true);
    try {
      await proApi.remove(detail.id);
      navigate('/pro/historique');
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <article className="space-y-6">
      <header className="card p-6 sm:p-8">
        <p className="caption text-aw-muted">{t('Rapport ASV', 'ASV report')} · {date}</p>
        <h1 className="text-2xl sm:text-3xl mt-2">{detail.input.title}</h1>
        {pending && !v ? (
          <p className="mt-4 inline-flex items-center gap-2 text-aw-muted" role="status">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {t('Vérification en cours : lecture des sources, puis jugement section par section. Cela prend en général moins de deux minutes.',
              'Checking: reading the sources, then judging section by section. This usually takes under two minutes.')}
          </p>
        ) : (
          <>
            <p className="mt-4 inline-flex items-center gap-2 text-xl font-semibold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
              <ToneDot color={tone} />
              {verdictWords(status, lang, opinionSourced)}
            </p>
            {v && <p className="mt-2 text-aw-muted max-w-prose">{synthesis(views, lang)}</p>}
            {pending && (
              <p className="mt-3 text-sm inline-flex items-center gap-2 text-aw-muted" role="status">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                {t('Résultat provisoire : une source est encore en cours d’évaluation, le rapport se met à jour seul.',
                  'Provisional result: a source is still being assessed, the report updates itself.')}
              </p>
            )}
          </>
        )}
        {v && (
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
        <div className="flex flex-wrap gap-2 mt-6 print:hidden">
          <button type="button" className="btn-outline btn-sm" disabled={!v} onClick={() => download(`asv-${slug(detail.input.title)}.md`, toMarkdown(detail, lang), 'text/markdown;charset=utf-8')}>
            <Download className="w-4 h-4" aria-hidden="true" />Markdown
          </button>
          <button type="button" className="btn-outline btn-sm" disabled={!v} onClick={() => download(`asv-${slug(detail.input.title)}.json`, JSON.stringify({ input: detail.input, result: detail.result }, null, 2), 'application/json')}>
            <Download className="w-4 h-4" aria-hidden="true" />JSON
          </button>
          <button type="button" className="btn-outline btn-sm" disabled={!v} onClick={() => window.print()}>
            <Printer className="w-4 h-4" aria-hidden="true" />{t('Imprimer ou PDF', 'Print or PDF')}
          </button>
          <button type="button" className="btn-outline btn-sm" disabled={busy || pending} onClick={rerun}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" />{t('Relancer', 'Run again')}
          </button>
          {confirmDelete ? (
            <span className="inline-flex items-center gap-2">
              <button type="button" className="btn-primary btn-sm" disabled={busy} onClick={remove}>{t('Supprimer pour de bon', 'Delete for good')}</button>
              <button type="button" className="btn-outline btn-sm" onClick={() => setConfirmDelete(false)}>{t('Annuler', 'Cancel')}</button>
            </span>
          ) : (
            <button type="button" className="btn-outline btn-sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="w-4 h-4" aria-hidden="true" />{t('Supprimer', 'Delete')}
            </button>
          )}
        </div>
      </header>

      {v && (
        <ol className="space-y-5">
          {views.map((view) => <Section key={view.index} view={view} lang={lang} />)}
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

export default function ProReportPage() {
  const { id = '' } = useParams();
  const { isEnglish } = useLanguage();
  return (
    <ProShell title={isEnglish ? 'Report' : 'Rapport'} path={`/pro/rapport/${id}`}>
      {() => <Report id={id} />}
    </ProShell>
  );
}
