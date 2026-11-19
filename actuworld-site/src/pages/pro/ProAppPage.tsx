import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileText, Loader2, Newspaper, PencilLine, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { DRAFT_KEY, type Draft } from '../../lib/pro/draft';
import { featuresOf } from '../../lib/pro/plan';
import type { ProAccess, ProImportDetail, ProImportSummary, ProSourceInput } from '../../lib/pro/types';

/**
 * « Depuis l'app » : les contenus (dépêches, articles) envoyés par l'app.
 * L'app ENVOIE, le site DEMANDE : rien n'est vérifié ni compté dans le quota
 * tant que l'utilisateur n'a pas cliqué « Vérifier ce contenu ».
 */

const sourceUrl = (s: ProSourceInput | string) => (typeof s === 'string' ? s : s.url);
const sourceTitle = (s: ProSourceInput | string) => (typeof s === 'string' ? '' : s.title ?? '');

function host(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function useT() {
  const { isEnglish } = useLanguage();
  return { isEnglish, t: (fr: string, en: string) => (isEnglish ? en : fr) };
}

function KindLabel({ kind }: { kind: string }) {
  const { t } = useT();
  const Icon = kind === 'article' ? FileText : Newspaper;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-aw-muted">
      <Icon className="w-4 h-4" aria-hidden="true" />
      {kind === 'article' ? t('Article', 'Article') : t('Dépêche', 'Brief')}
    </span>
  );
}

/** Compteur du mois, tel qu'il sera après ce clic. */
function QuotaLine({ access }: { access: ProAccess }) {
  const { t } = useT();
  const left = Math.max(0, access.quota - access.used_this_month);
  return (
    <p className="text-sm text-aw-muted" role="status">
      {left > 0
        ? t(`Il te reste ${left} vérification(s) sur ${access.quota} ce mois-ci. Celle-ci en utilisera une.`,
            `You have ${left} check(s) left out of ${access.quota} this month. This one will use one.`)
        : t(`Tu as utilisé tes ${access.quota} vérifications du mois. Le compteur repart le 1er.`,
            `You have used your ${access.quota} checks this month. The counter resets on the 1st.`)}
    </p>
  );
}

function ImportDetail({ id, access }: { id: string; access: ProAccess }) {
  const { t } = useT();
  const navigate = useNavigate();
  const features = featuresOf(access);
  const [detail, setDetail] = useState<ProImportDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDetail(null);
    setError(null);
    proApi.imports.get(id).then(setDetail).catch((e: Error) => setError(e.message));
  }, [id]);

  if (error && !detail) {
    return (
      <div className="card p-8 text-center">
        <p className="body-semi">{error}</p>
        <Link to="/pro/app" className="btn-outline btn-sm mt-5">{t("Retour à « Depuis l'app »", 'Back to “From the app”')}</Link>
      </div>
    );
  }
  if (!detail) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-aw-muted" role="status">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        <p className="text-sm">{t('Ouverture de ton contenu…', 'Opening your content…')}</p>
      </div>
    );
  }

  const sections = detail.input.sections ?? [];
  const noQuota = access.used_this_month >= access.quota;

  const verify = async () => {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      navigate(`/pro/rapport/${await proApi.imports.verify(detail.id)}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  };

  // Formule Pro : le contenu part dans le formulaire libre, où il se retouche.
  const edit = () => {
    const draft: Draft = {
      title: detail.input.title,
      sections: sections.map((s) => ({ text: s.text, sources: s.sources.length ? s.sources.map(sourceUrl) : [''] })),
    };
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch { /* stockage indisponible : le formulaire s'ouvrira vide */ }
    navigate('/pro/verifier');
  };

  return (
    <article className="space-y-6">
      <header className="card p-6 sm:p-8 space-y-4">
        <KindLabel kind={detail.kind} />
        <h1 className="text-2xl sm:text-3xl">{detail.input.title}</h1>
        {detail.verification_id ? (
          <>
            <p className="text-sm text-aw-muted">
              {t('Ce contenu a déjà son rapport. Le rouvrir ne compte pas dans ton quota.',
                'This content already has its report. Reopening it does not count towards your quota.')}
            </p>
            <Link to={`/pro/rapport/${detail.verification_id}`} className="btn-primary inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />{t('Voir le rapport', 'See the report')}
            </Link>
          </>
        ) : (
          <>
            <p className="text-aw-muted max-w-prose">
              {t('Voici ton contenu tel qu’ASV le lira : chaque passage est confronté à ses propres sources. Rien n’est publié, et rien n’est compté tant que tu n’as pas lancé la vérification.',
                'Here is your content as ASV will read it: each passage is checked against its own sources. Nothing is published, and nothing is counted until you start the check.')}
            </p>
            <QuotaLine access={access} />
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary inline-flex items-center gap-2" disabled={busy || noQuota} onClick={verify}>
                {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <ShieldCheck className="w-4 h-4" aria-hidden="true" />}
                {t('Vérifier ce contenu', 'Check this content')}
              </button>
              {features.edit && (
                <button type="button" className="btn-outline inline-flex items-center gap-2" disabled={busy} onClick={edit}>
                  <PencilLine className="w-4 h-4" aria-hidden="true" />{t('Retoucher avant de vérifier', 'Edit before checking')}
                </button>
              )}
            </div>
            {noQuota && (
              <p className="text-sm">
                <Link to="/tarifs" className="font-semibold text-aw-primary hover:underline">{t('Voir les formules', 'See the plans')}</Link>
              </p>
            )}
            {!features.edit && (
              <p className="text-sm text-aw-muted">
                {t('Une correction à faire ? Modifie ton brouillon dans l’app, puis renvoie-le. Retoucher le texte ici fait partie de la formule Pro.',
                  'Something to fix? Edit your draft in the app, then send it again. Editing the text here comes with the Pro plan.')}
              </p>
            )}
          </>
        )}
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      </header>

      <ol className="space-y-4">
        {sections.map((section, i) => (
          <li key={i} className="card p-5 sm:p-6">
            <p className="caption text-aw-muted">{t(`Passage ${i + 1}`, `Passage ${i + 1}`)}</p>
            <p className="mt-2 whitespace-pre-line max-w-prose">{section.text}</p>
            {section.sources.length > 0 ? (
              <ul className="mt-4 space-y-1.5 text-sm">
                {section.sources.map((s, j) => (
                  <li key={j} className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-aw-muted">{t('Source', 'Source')}</span>
                    <a href={sourceUrl(s)} target="_blank" rel="noopener noreferrer" className="link break-all">
                      {sourceTitle(s) || host(sourceUrl(s))}
                    </a>
                    {sourceTitle(s) && <span className="text-aw-muted">{host(sourceUrl(s))}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-aw-muted">{t('Pas de source sur ce passage : il ne sera pas confronté.', 'No source on this passage: it will not be checked.')}</p>
            )}
          </li>
        ))}
      </ol>
    </article>
  );
}

function ImportList() {
  const { isEnglish, t } = useT();
  const [items, setItems] = useState<ProImportSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    proApi.imports.list().then(setItems).catch((e: Error) => setError(e.message));
  }, []);
  useEffect(load, [load]);

  const remove = async (id: string) => {
    try {
      await proApi.imports.remove(id);
      setItems((prev) => (prev ? prev.filter((it) => it.id !== id) : prev));
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t("Depuis l'app", 'From the app')}</h1>
        <p className="text-aw-muted mt-2 max-w-prose">
          {t('Les dépêches et les articles que tu envoies depuis l’app avec « Vérifier mes sources ». Tu décides ici de lancer la vérification : c’est à ce moment-là qu’elle compte dans ton quota.',
            'The briefs and articles you send from the app with “Check my sources”. You decide here when to start the check: that is when it counts towards your quota.')}
        </p>
      </div>
      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      {!items && !error && (
        <div className="flex justify-center py-10 text-aw-muted" role="status"><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /></div>
      )}
      {items && items.length === 0 && (
        <div className="card p-8 text-center text-aw-muted">
          <Smartphone className="w-6 h-6 mx-auto" aria-hidden="true" />
          <p className="mt-3 max-w-md mx-auto">
            {t('Rien pour le moment. Dans l’app, ouvre un brouillon et appuie sur « Vérifier mes sources avant de publier » : il arrivera ici.',
              'Nothing yet. In the app, open a draft and tap “Check my sources before publishing”: it will show up here.')}
          </p>
        </div>
      )}
      <ul className="space-y-3">
        {(items ?? []).map((it) => (
          <li key={it.id} className="card p-4 flex flex-wrap items-center justify-between gap-3">
            <Link to={`/pro/app/${it.id}`} className="min-w-0 flex-1 hover:underline">
              <span className="font-semibold block truncate">{it.title}</span>
              <span className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                <KindLabel kind={it.kind} />
                <time dateTime={it.created_at} className="text-sm text-aw-muted tabular">
                  {new Date(it.created_at).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </span>
            </Link>
            <span className="flex items-center gap-2 shrink-0">
              {it.verification_id ? (
                <Link to={`/pro/rapport/${it.verification_id}`} className="btn-outline btn-sm">{t('Voir le rapport', 'See the report')}</Link>
              ) : (
                <Link to={`/pro/app/${it.id}`} className="btn-primary btn-sm">{t('À vérifier', 'To check')}</Link>
              )}
              <button type="button" className="btn-outline btn-sm" onClick={() => remove(it.id)}
                aria-label={t(`Retirer « ${it.title} »`, `Remove “${it.title}”`)}>
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProAppPage() {
  const { id } = useParams();
  const { isEnglish } = useLanguage();
  return (
    <ProShell title={isEnglish ? 'From the app' : "Depuis l'app"} path={id ? `/pro/app/${id}` : '/pro/app'}>
      {(access) => (id ? <ImportDetail id={id} access={access} /> : <ImportList />)}
    </ProShell>
  );
}
