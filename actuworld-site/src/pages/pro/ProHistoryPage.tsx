import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import { ProUpsell } from '../../components/pro/ProUpsell';
import { featuresOf } from '../../lib/pro/plan';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import type { ProVerificationSummary } from '../../lib/pro/types';
import { TONE_COLOR, verdictTone, verdictWords, type Lang, type Tone } from '../../lib/pro/report';

const PAGE = 20;
type Filter = 'all' | Tone;

function History() {
  const { isEnglish } = useLanguage();
  const lang: Lang = isEnglish ? 'en' : 'fr';
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [items, setItems] = useState<ProVerificationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  const loadMore = async (before?: string) => {
    setLoading(true);
    try {
      const page = await proApi.list(before, PAGE);
      setItems((prev) => (before ? [...prev, ...page] : page));
      setHasMore(page.length === PAGE);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  const toneOf = (it: ProVerificationSummary): Tone =>
    it.status === 'pending' ? 'grey' : verdictTone(it.status === 'failed' && !it.verdict_status ? 'failed' : it.verdict_status);
  const shown = useMemo(() => (filter === 'all' ? items : items.filter((it) => toneOf(it) === filter)), [items, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('Tout', 'All') },
    { key: 'green', label: t('Cohérentes', 'Consistent') },
    { key: 'light', label: t('Acceptables', 'Acceptable') },
    { key: 'orange', label: t('À vérifier', 'To check') },
    { key: 'red', label: t('Contredites', 'Contradicted') },
    { key: 'grey', label: t('Non vérifiables', 'Not verifiable') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl">{t('Historique', 'History')}</h1>
        <Link to="/pro/verifier" className="btn-primary btn-sm">{t('Nouvelle vérification', 'New check')}</Link>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t('Filtrer par verdict', 'Filter by verdict')}>
        {filters.map((f) => (
          <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}
            className={`badge ${filter === f.key ? 'badge-primary' : 'text-aw-muted border border-aw'}`}>
            {f.key !== 'all' && <span className="inline-block w-2 h-2 rounded-sm" style={{ backgroundColor: TONE_COLOR[f.key] }} aria-hidden="true" />}
            {f.label}
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      {!loading && items.length === 0 && !error && (
        <div className="card p-8 text-center text-aw-muted">
          {t('Aucune vérification pour le moment.', 'No checks yet.')}{' '}
          <Link to="/pro/verifier" className="link">{t('Vérifie ton premier texte', 'Check your first text')}</Link>
        </div>
      )}
      <ul className="space-y-3">
        {shown.map((it) => (
          <li key={it.id}>
            <Link to={`/pro/rapport/${it.id}`} className="card card-hover p-4 flex flex-wrap items-center justify-between gap-3">
              <span className="font-semibold min-w-0 truncate">{it.title}</span>
              <span className="flex items-center gap-4 text-sm text-aw-muted shrink-0">
                <span className="inline-flex items-center gap-1.5 text-aw-text">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: TONE_COLOR[toneOf(it)] }} aria-hidden="true" />
                  {it.status === 'pending' ? t('En cours', 'In progress') : verdictWords(it.status === 'failed' && !it.verdict_status ? 'failed' : it.verdict_status, lang)}
                </span>
                <time dateTime={it.created_at} className="tabular">
                  {new Date(it.created_at).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {loading && <div className="flex justify-center py-6 text-aw-muted" role="status"><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /></div>}
      {!loading && hasMore && (
        <button type="button" className="btn-outline btn-sm" onClick={() => loadMore(items[items.length - 1]?.created_at)}>
          {t('Afficher plus', 'Show more')}
        </button>
      )}
    </div>
  );
}

export default function ProHistoryPage() {
  const { isEnglish } = useLanguage();
  return (
    <ProShell title={isEnglish ? 'History' : 'Historique'} path="/pro/historique">
      {(access) => (featuresOf(access).history ? <History /> : (
        <ProUpsell
          title={isEnglish ? 'History comes with the Pro plan' : "L'historique fait partie de la formule Pro"}
          description={isEnglish
            ? 'With Discovery, each report opens when you run it. Pro keeps all your reports, with export and read-only sharing.'
            : 'En Découverte, chaque rapport s’ouvre au moment où tu le lances. Pro garde tous tes rapports, avec l’export et le partage en lecture seule.'}
        />
      ))}
    </ProShell>
  );
}
