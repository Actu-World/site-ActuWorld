import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ImageOff, Images, Lock, MapPin, Newspaper, RefreshCw } from 'lucide-react';
import { Section } from '../../components/Section';
import { PageMeta } from '../../components/PageMeta';
import { PostPreview } from '../../components/studio/PostPreview';
import { ArticlePreview } from '../../components/studio/ArticlePreview';
import { useLanguage } from '../../i18n/LanguageContext';
import { useStudioSession } from '../../hooks/useStudioSession';
import { journalImageUrl, resolveAvatarUrl } from '../../lib/studio/images';
import { STUDIO_THEME_BY_KEY } from '../../lib/studio/themes';
import {
  PLAN_STEPS, getEditorialPlan, hasText, imageCount, itemTitle,
  type PlanAccount, type PlanItem,
} from '../../lib/studio/redaction';
import type { PostDraftImage } from '../../types/post';

// Page « Rédaction » : le plan éditorial des comptes officiels, chaque contenu
// rendu comme dans l'app (aperçus du Studio). Ce qui n'est pas encore fourni
// (texte, image) est signalé tel quel. Lecture seule — le contenu vient du
// dépôt actuworld-seed-content via api/seed/sync-plan.ts.

// Règle d'une session (cf. SOMMAIRE.txt du dépôt de contenu)
const SESSION_RULE = { posts: 5, articles: 3, reunion: 2 };
const ARTICLE_ACCENT = '#0EA5E9';
const ACCOUNT_KEY = 'studio-redaction-account';

const shortName = (name: string | null) => (name ?? '').replace(/^Rédaction ActuWorld · /, '');

function readStored(): string | null {
  try { return localStorage.getItem(ACCOUNT_KEY); } catch { return null; }
}
function store(slug: string) {
  try { localStorage.setItem(ACCOUNT_KEY, slug); } catch { /* stockage indisponible */ }
}

/** Cartes au format de l'aperçu (une source par carte, comme le composer). */
function toPreviewCards(item: PlanItem): PostDraftImage[] {
  const cards = item.data.images ?? [];
  if (!cards.length) return [{ image_url: '', subject: '', description: '', back_description: '', source: null }];
  return cards.map((c) => ({
    image_url: c.image_url ?? '',
    subject: c.subject ?? '',
    description: c.description ?? '',
    back_description: c.back_description ?? '',
    source: c.sources?.[0] ? { url: c.sources[0].url, title: c.sources[0].title ?? c.sources[0].publisher ?? null } : null,
  }));
}

function StatusSteps({ status }: { status: string }) {
  const idx = Math.max(0, PLAN_STEPS.indexOf(status as (typeof PLAN_STEPS)[number]));
  return (
    <span className="inline-flex items-center gap-[3px]" title={status}>
      {PLAN_STEPS.map((step, i) => (
        <span key={step} className={`h-1 w-3.5 rounded-full ${i <= idx ? 'bg-aw-primary' : 'bg-aw-text/15'}`} />
      ))}
      <span className="ml-1.5 text-xs font-bold text-aw-primary">{status}</span>
    </span>
  );
}

function ItemCard({ item, onOpen }: { item: PlanItem; onOpen: () => void }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const d = item.data;
  const isPost = item.kind === 'post';
  const title = itemTitle(item);
  const written = hasText(item);
  const imgs = imageCount(item);
  const theme = d.primary_theme ? STUDIO_THEME_BY_KEY[d.primary_theme] : undefined;
  const visual = isPost ? d.images?.[0]?.image_url : d.cover_path ? journalImageUrl(d.cover_path) : null;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="card p-0 overflow-hidden text-left flex flex-col hover:ring-2 hover:ring-aw-primary/50 transition-shadow focus-visible:ring-2 focus-visible:ring-aw-primary"
    >
      <div className={`relative w-full ${isPost ? 'aspect-[3/4]' : 'aspect-[3/2]'} bg-neutral-800`}>
        {visual ? (
          <img src={visual} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white/45">
            <ImageOff className="w-7 h-7" />
            <span className="text-xs font-semibold">{t("Pas encore d'image", 'No image yet')}</span>
          </div>
        )}
        {isPost && (
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.85) 100%)' }} />
        )}
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-[0.8px] text-white"
          style={{ backgroundColor: isPost ? 'var(--aw-primary)' : ARTICLE_ACCENT }}
        >
          {isPost ? t('Dépêche', 'Dispatch') : t('Article', 'Article')}
        </span>
        {isPost && imgs.total > 1 && (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/55 text-white text-[11px] font-bold">
            <Images className="w-3 h-3" /> {imgs.total}
          </span>
        )}
        {isPost && (
          <p className={`absolute bottom-0 inset-x-0 px-3 pb-3 text-white font-black text-[15px] leading-5 line-clamp-3 ${written ? '' : 'italic opacity-70'}`}>
            {written ? title : t('Pas encore de texte', 'No text yet')}
          </p>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        {!isPost && (
          <p className={`body-semi leading-snug line-clamp-2 ${written ? '' : 'italic text-aw-muted'}`}>
            {written ? title : t('Pas encore de texte', 'No text yet')}
          </p>
        )}
        {!written && d.planned_subject && (
          <p className="text-xs text-aw-muted line-clamp-2">{t('Prévu', 'Planned')} : {d.planned_subject}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-aw-muted">
          {theme && (
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.color }} />
              {isEnglish ? theme.en : theme.fr}
            </span>
          )}
          {d.reunion && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-aw-primary">
              <MapPin className="w-3 h-3" /> Réunion
            </span>
          )}
          {imgs.total > 0 && imgs.ready < imgs.total && (
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {imgs.ready}/{imgs.total} {t('images', 'images')}
            </span>
          )}
        </div>
        <div className="mt-auto pt-1 flex items-center justify-between gap-2">
          <StatusSteps status={item.status} />
          <span className="font-mono text-[10.5px] text-aw-muted">{item.id}</span>
        </div>
      </div>
    </button>
  );
}

export default function StudioRedactionPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const { session, isLoading } = useStudioSession();

  const [accounts, setAccounts] = useState<PlanAccount[]>([]);
  const [items, setItems] = useState<PlanItem[]>([]);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'forbidden' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeSlug, setActiveSlug] = useState<string | null>(readStored());
  const [filter, setFilter] = useState<'all' | 'post' | 'article' | 'reunion'>('all');
  const [openItem, setOpenItem] = useState<PlanItem | null>(null);

  const load = () => {
    setLoadState('loading');
    getEditorialPlan()
      .then((res) => {
        setAccounts(res.accounts);
        setItems(res.items);
        setLoadState('ready');
      })
      .catch((err: Error) => {
        if (/interdit|forbidden/i.test(err.message)) setLoadState('forbidden');
        else { setErrorMsg(err.message); setLoadState('error'); }
      });
  };

  useEffect(() => {
    if (session) load();
  }, [session]);

  const countByAccount = useMemo(() => {
    const m = new Map<string, number>();
    items.forEach((it) => m.set(it.account_id, (m.get(it.account_id) ?? 0) + 1));
    return m;
  }, [items]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aw-bg flex items-center justify-center">
        <p className="text-aw-muted">{t('Connexion…', 'Signing in…')}</p>
      </div>
    );
  }
  if (!session) return <Navigate to="/studio" replace />;

  const account =
    accounts.find((a) => a.slug === activeSlug) ??
    accounts.find((a) => countByAccount.get(a.id)) ??
    accounts[0];
  const accountItems = account ? items.filter((it) => it.account_id === account.id) : [];
  const visible = accountItems.filter((it) =>
    filter === 'all' ? true : filter === 'reunion' ? !!it.data.reunion : it.kind === filter,
  );
  const sessions = [...new Set(accountItems.map((it) => it.session ?? '—'))].sort();
  const totals = accountItems.reduce(
    (acc, it) => {
      const img = imageCount(it);
      acc[it.kind] += 1;
      acc.images += img.total;
      acc.ready += img.ready;
      if (it.status === 'publié') acc.published += 1;
      return acc;
    },
    { post: 0, article: 0, images: 0, ready: 0, published: 0 },
  );
  const authorName = account?.display_name || account?.username || '';
  const avatarSrc = resolveAvatarUrl(account?.avatar_url);

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t('Studio — Rédaction', 'Studio — Newsroom')}
        description={t('Plan éditorial des comptes officiels ActuWorld.', 'Editorial plan of the official ActuWorld accounts.')}
        path="/studio/redaction"
      />

      <Section className="pt-10 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col gap-7">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
                {t('Rédaction', 'Newsroom')}
              </h1>
              <p className="text-aw-muted mt-1">
                {t('Les contenus des comptes officiels, tels qu’ils apparaîtront dans l’app.', 'Official accounts’ content, as it will look in the app.')}
              </p>
            </div>
            <button type="button" onClick={load} className="btn-outline inline-flex items-center text-sm">
              <RefreshCw className="w-4 h-4 mr-1.5" /> {t('Actualiser', 'Refresh')}
            </button>
          </header>

          {loadState === 'loading' && <p className="text-aw-muted">{t('Chargement du plan…', 'Loading the plan…')}</p>}

          {loadState === 'forbidden' && (
            <div className="card p-10 text-center">
              <Lock className="w-9 h-9 text-aw-muted mx-auto mb-3" />
              <p className="body-semi">{t('Cette page est réservée à la rédaction.', 'This page is reserved for the newsroom.')}</p>
            </div>
          )}

          {loadState === 'error' && (
            <div className="card p-6">
              <p className="body-semi mb-1">{t('Impossible de charger le plan.', 'Could not load the plan.')}</p>
              <p className="text-aw-muted text-sm">{errorMsg}</p>
            </div>
          )}

          {loadState === 'ready' && account && (
            <>
              <nav className="flex flex-wrap gap-2" aria-label={t('Comptes', 'Accounts')}>
                {accounts.map((a) => {
                  const active = a.slug === account.slug;
                  return (
                    <button
                      key={a.slug}
                      type="button"
                      aria-pressed={active}
                      onClick={() => { setActiveSlug(a.slug); store(a.slug); setFilter('all'); }}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-semibold transition-colors ${
                        active ? 'bg-aw-primary border-aw-primary text-on-primary' : 'border-aw hover:border-aw-primary'
                      }`}
                    >
                      {shortName(a.display_name) || a.username}
                      <span className={`min-w-[22px] px-1.5 rounded-full text-xs tabular-nums ${active ? 'bg-white/25' : 'bg-aw-surface text-aw-muted'}`}>
                        {countByAccount.get(a.id) ?? 0}
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="rounded-2xl bg-aw-surface p-5 flex flex-wrap gap-x-10 gap-y-4 items-start justify-between">
                <div className="min-w-0 max-w-xl">
                  <p className="text-lg font-bold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>{account.display_name}</p>
                  <p className="text-aw-muted text-sm font-mono">@{account.username}</p>
                  {account.bio && <p className="text-sm mt-2">{account.bio}</p>}
                </div>
                <dl className="grid grid-cols-4 gap-x-6 gap-y-1 tabular-nums">
                  {[
                    [totals.post, t('Dépêches', 'Dispatches')],
                    [totals.article, t('Articles', 'Articles')],
                    [`${totals.ready}/${totals.images}`, t('Images', 'Images')],
                    [totals.published, t('Publiés', 'Published')],
                  ].map(([value, label]) => (
                    <div key={String(label)}>
                      <dd className="text-2xl font-bold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>{value}</dd>
                      <dt className="text-[11px] uppercase tracking-wider text-aw-muted">{label}</dt>
                    </div>
                  ))}
                </dl>
              </div>

              {accountItems.length === 0 ? (
                <div className="card p-10 text-center text-aw-muted">
                  <Newspaper className="w-9 h-9 mx-auto mb-3" />
                  <p className="body-semi text-aw-text">{t('Rien de prévu pour ce compte pour l’instant.', 'Nothing planned for this account yet.')}</p>
                  <p className="text-sm mt-1">{t('Ses contenus apparaîtront ici dès qu’ils seront ajoutés au plan.', 'Its content will show up here once added to the plan.')}</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('Filtrer', 'Filter')}>
                    {([
                      ['all', t('Tout', 'All')],
                      ['post', t('Dépêches', 'Dispatches')],
                      ['article', t('Articles', 'Articles')],
                      ['reunion', 'Réunion'],
                    ] as const).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        aria-pressed={filter === key}
                        onClick={() => setFilter(key)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${
                          filter === key ? 'bg-aw-text text-aw-bg border-aw-text' : 'border-aw hover:border-aw-primary'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {sessions.map((s) => {
                    const all = accountItems.filter((it) => (it.session ?? '—') === s);
                    const shown = visible.filter((it) => (it.session ?? '—') === s);
                    if (!shown.length) return null;
                    const nPosts = all.filter((it) => it.kind === 'post').length;
                    const nArts = all.length - nPosts;
                    const nReu = all.filter((it) => it.data.reunion).length;
                    const rule = (n: number, target: number, label: string) => (
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${
                        n >= target ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                      }`}>
                        {n}/{target} {label}
                      </span>
                    );
                    return (
                      <section key={s} className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pb-2 border-b border-aw">
                          <h2 className="text-xl font-bold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
                            {t('Session', 'Session')} {s.replace(/^s0*/i, '')}
                          </h2>
                          <div className="flex flex-wrap gap-1.5">
                            {rule(nPosts, SESSION_RULE.posts, t('dépêches', 'dispatches'))}
                            {rule(nArts, SESSION_RULE.articles, t('articles', 'articles'))}
                            {rule(nReu, SESSION_RULE.reunion, 'Réunion')}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
                          {shown.map((it) => (
                            <ItemCard key={it.id} item={it} onOpen={() => setOpenItem(it)} />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>
      </Section>

      {openItem?.kind === 'post' && (
        <PostPreview
          cards={toPreviewCards(openItem)}
          tags={openItem.data.tags ?? []}
          authorName={authorName}
          authorExpertise={null}
          avatarSrc={avatarSrc}
          onClose={() => setOpenItem(null)}
          showMissing
        />
      )}
      {openItem?.kind === 'article' && (
        <ArticlePreview
          title={openItem.data.title ?? ''}
          dek={openItem.data.dek ?? ''}
          coverPath={openItem.data.cover_path ?? null}
          blocks={openItem.data.blocks ?? []}
          sources={openItem.data.sources ?? []}
          onClose={() => setOpenItem(null)}
          showMissing
        />
      )}
    </div>
  );
}
