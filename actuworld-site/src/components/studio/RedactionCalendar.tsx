import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, CheckCircle2, ImageOff, MapPin } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { journalImageUrl } from '../../lib/studio/images';
import {
  REUNION_TZ, byScheduleDate, dayKey, formatDay, formatShort, formatTime, hasText, imageCount, itemTitle,
  type PlanAccount, type PlanItem,
} from '../../lib/studio/redaction';

// Vue « Calendrier » de la page Rédaction : tous les comptes, dans l'ordre de
// sortie de CALENDRIER-PUBLICATION.md (heure de Paris). Le prochain contenu à
// publier est mis en avant ; un contenu dont l'heure est passée sans qu'on le
// trouve dans l'app est « en retard ».

const ARTICLE_ACCENT = '#0EA5E9';
const TICK_MS = 60_000;

type Show = 'upcoming' | 'published' | 'all';
type State = 'published' | 'late' | 'next' | 'upcoming' | 'undated';

const shortName = (name: string | null) => (name ?? '').replace(/^Rédaction ActuWorld · /, '');

function stateOf(item: PlanItem, now: number, nextId: string | null): State {
  if (item.published) return 'published';
  if (!item.data.scheduled_at) return 'undated';
  if (Date.parse(item.data.scheduled_at) < now) return 'late';
  return item.id === nextId ? 'next' : 'upcoming';
}

/** « dans 3 h 20 » / « il y a 2 j » */
function relative(iso: string, now: number, isEnglish: boolean): string {
  const diff = Date.parse(iso) - now;
  const mins = Math.round(Math.abs(diff) / 60_000);
  const label = mins < 60
    ? `${mins} min`
    : mins < 48 * 60
      ? `${Math.floor(mins / 60)} h${mins % 60 ? ` ${String(mins % 60).padStart(2, '0')}` : ''}`
      : `${Math.round(mins / 1440)} ${isEnglish ? 'd' : 'j'}`;
  if (isEnglish) return diff >= 0 ? `in ${label}` : `${label} ago`;
  return diff >= 0 ? `dans ${label}` : `il y a ${label}`;
}

function Readiness({ item }: { item: PlanItem }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const imgs = imageCount(item);
  if (!hasText(item)) return <span className="font-semibold text-amber-600 dark:text-amber-400">{t('Pas de texte', 'No text')}</span>;
  if (imgs.ready < imgs.total) {
    return <span className="font-semibold text-amber-600 dark:text-amber-400">{imgs.ready}/{imgs.total} {t('images', 'images')}</span>;
  }
  return null;
}

function StateBadge({ item, state, now }: { item: PlanItem; state: State; now: number }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const base = 'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap';
  if (state === 'published' && item.published) {
    return (
      <span className={`${base} bg-emerald-500/15 text-emerald-700 dark:text-emerald-400`} title={item.published.at}>
        <CheckCircle2 className="w-3 h-3" /> {t('Publié', 'Published')} {formatShort(item.published.at, isEnglish)}
      </span>
    );
  }
  if (state === 'late' && item.data.scheduled_at) {
    return (
      <span className={`${base} bg-red-500/15 text-red-700 dark:text-red-400`}>
        <AlertTriangle className="w-3 h-3" /> {t('En retard', 'Late')} · {relative(item.data.scheduled_at, now, isEnglish)}
      </span>
    );
  }
  if (state === 'next') return <span className={`${base} bg-aw-primary text-on-primary`}>{t('Prochain', 'Next')}</span>;
  if (state === 'undated') return <span className={`${base} bg-aw-text/10 text-aw-muted`}>{t('Sans date', 'No date')}</span>;
  return null;
}

function Thumb({ item }: { item: PlanItem }) {
  const d = item.data;
  const src = item.kind === 'post' ? d.images?.[0]?.image_url : d.cover_path ? journalImageUrl(d.cover_path) : null;
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-lg bg-neutral-800 ${item.kind === 'post' ? 'w-11 h-[58px]' : 'w-[72px] h-12'}`}>
      {src ? <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        : <ImageOff className="absolute inset-0 m-auto w-4 h-4 text-white/45" />}
    </div>
  );
}

function Row({ item, account, state, now, onOpen }: {
  item: PlanItem; account?: PlanAccount; state: State; now: number; onOpen: () => void;
}) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const d = item.data;
  const isPost = item.kind === 'post';
  const timed = d.scheduled_at && d.scheduled_time !== false;
  const title = itemTitle(item) || d.planned_subject || item.id;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`w-full text-left flex items-center gap-3 sm:gap-4 px-3 py-2.5 rounded-xl border transition-colors hover:border-aw-primary focus-visible:ring-2 focus-visible:ring-aw-primary ${
        state === 'next' ? 'border-aw-primary bg-aw-primary/5' : 'border-aw'
      } ${state === 'published' ? 'opacity-70' : ''}`}
    >
      <div className="w-14 shrink-0 tabular-nums">
        {timed && d.scheduled_at ? (
          <>
            <p className="text-sm font-bold">{formatTime(d.scheduled_at, isEnglish)}</p>
            <p className="text-[10.5px] text-aw-muted" title={t('Heure de La Réunion', 'Réunion time')}>
              {formatTime(d.scheduled_at, isEnglish, REUNION_TZ)} {t('Réu.', 'Réu.')}
            </p>
          </>
        ) : (
          <p className="text-xs text-aw-muted">—</p>
        )}
      </div>
      <Thumb item={item} />
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span
            className="px-1.5 py-px rounded-md text-[10px] font-extrabold uppercase tracking-[0.6px] text-white"
            style={{ backgroundColor: isPost ? 'var(--aw-primary)' : ARTICLE_ACCENT }}
          >
            {isPost ? t('Dépêche', 'Dispatch') : 'Article'}
          </span>
          <span className="font-semibold">{shortName(account?.display_name ?? null) || account?.username}</span>
          {d.reunion && (
            <span className="inline-flex items-center gap-0.5 font-semibold text-aw-primary">
              <MapPin className="w-3 h-3" /> Réunion
            </span>
          )}
          <Readiness item={item} />
        </div>
        <p className="body-semi leading-snug line-clamp-2">{title}</p>
        {d.check_note && !item.published && (
          <p className="inline-flex items-start gap-1 text-xs text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{t('À relire la veille', 'Re-check the day before')} : {d.check_note}</span>
          </p>
        )}
      </div>
      <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
        <StateBadge item={item} state={state} now={now} />
        <span className="font-mono text-[10.5px] text-aw-muted">{item.id}</span>
      </div>
      <div className="sm:hidden shrink-0"><StateBadge item={item} state={state} now={now} /></div>
    </button>
  );
}

export function RedactionCalendar({ items, accounts, onOpen }: {
  items: PlanItem[]; accounts: PlanAccount[]; onOpen: (id: string) => void;
}) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [show, setShow] = useState<Show>('upcoming');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const accountById = useMemo(() => new Map(accounts.map((a) => [a.id, a])), [accounts]);
  const sorted = useMemo(() => [...items].sort(byScheduleDate), [items]);
  const next = sorted.find((it) => !it.published && it.data.scheduled_at && Date.parse(it.data.scheduled_at) >= now) ?? null;
  const late = sorted.filter((it) => !it.published && it.data.scheduled_at && Date.parse(it.data.scheduled_at) < now);
  const nPublished = sorted.filter((it) => it.published).length;
  const today = dayKey(now);
  const tomorrow = dayKey(now + 86_400_000);

  const shown = sorted.filter((it) => (show === 'all' ? true : show === 'published' ? !!it.published : !it.published));
  const days = new Map<string, PlanItem[]>();
  for (const it of shown) {
    const key = it.data.scheduled_at ? dayKey(it.data.scheduled_at) : '';
    days.set(key, [...(days.get(key) ?? []), it]);
  }
  const counts = (key: string) => {
    const all = sorted.filter((it) => (it.data.scheduled_at ? dayKey(it.data.scheduled_at) : '') === key);
    return { total: all.length, published: all.filter((it) => it.published).length };
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        {next ? (
          <button
            type="button"
            onClick={() => onOpen(next.id)}
            className="rounded-2xl bg-aw-surface p-4 sm:p-5 flex items-center gap-4 text-left hover:ring-2 hover:ring-aw-primary/50 focus-visible:ring-2 focus-visible:ring-aw-primary"
          >
            <Thumb item={next} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider font-bold text-aw-primary inline-flex items-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" />
                {t('Prochain à publier', 'Next to publish')} · {relative(next.data.scheduled_at!, now, isEnglish)}
              </p>
              <p className="text-lg font-bold leading-snug mt-1 line-clamp-2" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
                {itemTitle(next) || next.data.planned_subject}
              </p>
              <p className="text-sm text-aw-muted mt-0.5">
                {formatDay(dayKey(next.data.scheduled_at!), isEnglish)} · {formatTime(next.data.scheduled_at!, isEnglish)}
                {' '}({formatTime(next.data.scheduled_at!, isEnglish, REUNION_TZ)} {t('à La Réunion', 'in Réunion')})
                {' · '}{shortName(accountById.get(next.account_id)?.display_name ?? null)}
                {' · '}{next.kind === 'post' ? t('Dépêche', 'Dispatch') : 'Article'}
              </p>
            </div>
          </button>
        ) : (
          <div className="rounded-2xl bg-aw-surface p-5 text-aw-muted">
            {t('Plus rien de daté à venir au calendrier.', 'Nothing scheduled ahead.')}
          </div>
        )}
        <dl className="rounded-2xl bg-aw-surface p-5 grid grid-cols-3 gap-x-6 tabular-nums content-center">
          {[
            [nPublished, t('Publiés', 'Published'), ''],
            [late.length, t('En retard', 'Late'), late.length ? 'text-red-600 dark:text-red-400' : ''],
            [sorted.length - nPublished - late.length, t('À venir', 'Upcoming'), ''],
          ].map(([value, label, cls]) => (
            <div key={String(label)}>
              <dd className={`text-2xl font-bold ${cls}`} style={{ fontFamily: '"Platypi", Georgia, serif' }}>{value}</dd>
              <dt className="text-[11px] uppercase tracking-wider text-aw-muted">{label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('Afficher', 'Show')}>
        {([
          ['upcoming', t('À publier', 'To publish')],
          ['published', t('Publiés', 'Published')],
          ['all', t('Tout', 'All')],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={show === key}
            onClick={() => setShow(key)}
            className={`px-3 py-1.5 rounded-lg border text-sm font-semibold ${
              show === key ? 'bg-aw-text text-aw-bg border-aw-text' : 'border-aw hover:border-aw-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="text-aw-muted">
          {show === 'published' ? t('Rien de publié pour l’instant.', 'Nothing published yet.') : t('Tout est publié.', 'Everything is published.')}
        </p>
      )}

      {[...days.entries()].map(([key, list]) => {
        const c = key ? counts(key) : null;
        return (
          <section key={key || 'undated'} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pb-2 border-b border-aw">
              <h2 className="text-lg font-bold" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
                {key ? formatDay(key, isEnglish) : t('Sans date au calendrier', 'Not scheduled')}
              </h2>
              {key === today && <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-aw-primary text-on-primary">{t('Aujourd’hui', 'Today')}</span>}
              {key === tomorrow && <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-aw-text/10">{t('Demain', 'Tomorrow')}</span>}
              {c && (
                <span className="text-xs text-aw-muted tabular-nums">
                  {c.published}/{c.total} {t('publiés', 'published')}
                </span>
              )}
            </div>
            {list.map((it) => (
              <Row
                key={it.id}
                item={it}
                account={accountById.get(it.account_id)}
                state={stateOf(it, now, next?.id ?? null)}
                now={now}
                onOpen={() => onOpen(it.id)}
              />
            ))}
          </section>
        );
      })}
    </div>
  );
}
