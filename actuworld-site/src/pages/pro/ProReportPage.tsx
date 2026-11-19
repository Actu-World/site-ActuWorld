import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, Copy, Download, Link2, Link2Off, Loader2, Printer, RotateCcw, Trash2 } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import ReportView from '../../components/pro/ReportView';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { download, slug } from '../../lib/pro/files';
import { toMarkdown, type Lang } from '../../lib/pro/report';
import type { ProVerificationDetail } from '../../lib/pro/types';

const POLL_MS = 3000;

/** 3.8 — lien de lecture seule : créer, copier, retirer. */
function ShareBlock({ detail, onChange }: { detail: ProVerificationDetail; onChange: (token: string | null) => void }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const url = detail.share_token ? `${window.location.origin}/pro/r/${detail.share_token}` : null;

  const run = async (fn: () => Promise<string | null>) => {
    setBusy(true);
    setError(null);
    try {
      onChange(await fn());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t('Copie impossible : sélectionne le lien à la main.', 'Copy failed: select the link by hand.'));
    }
  };

  if (detail.status === 'pending') return null;
  return (
    <div className="mt-4 text-sm space-y-2">
      {url ? (
        <>
          <p className="text-aw-muted">
            {t('Toute personne qui a ce lien peut lire ce rapport, sans compte. Retire-le quand tu veux : il ne répondra plus.',
              'Anyone with this link can read this report, without an account. Remove it whenever you want: it will stop working.')}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            <input readOnly value={url} className="field py-2 text-sm flex-1 min-w-0" aria-label={t('Lien de partage', 'Share link')} onFocus={(e) => e.target.select()} />
            <button type="button" className="btn-outline btn-sm" onClick={copy}>
              {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
              {copied ? t('Copié', 'Copied') : t('Copier', 'Copy')}
            </button>
            <button type="button" className="btn-outline btn-sm" disabled={busy} onClick={() => run(async () => { await proApi.unshare(detail.id); return null; })}>
              <Link2Off className="w-4 h-4" aria-hidden="true" />{t('Retirer le lien', 'Remove link')}
            </button>
          </div>
        </>
      ) : (
        <button type="button" className="btn-outline btn-sm" disabled={busy} onClick={() => run(() => proApi.share(detail.id))}>
          <Link2 className="w-4 h-4" aria-hidden="true" />{t('Partager en lecture seule', 'Share read-only')}
        </button>
      )}
      {error && <p className="text-red-600" role="alert">{error}</p>}
    </div>
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
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-aw-muted" role="status">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        <p className="text-sm">{t('Ouverture du rapport…', 'Opening the report…')}</p>
      </div>
    );
  }

  const ready = !!detail.result?.verification;
  const pending = detail.status === 'pending';

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

  const actions = (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-outline btn-sm" disabled={!ready} onClick={() => download(`asv-${slug(detail.input.title)}.md`, toMarkdown(detail, lang), 'text/markdown;charset=utf-8')}>
          <Download className="w-4 h-4" aria-hidden="true" />Markdown
        </button>
        <button type="button" className="btn-outline btn-sm" disabled={!ready} onClick={() => download(`asv-${slug(detail.input.title)}.json`, JSON.stringify({ input: detail.input, result: detail.result }, null, 2), 'application/json')}>
          <Download className="w-4 h-4" aria-hidden="true" />JSON
        </button>
        <button type="button" className="btn-outline btn-sm" disabled={!ready} onClick={() => window.print()}>
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
      <ShareBlock detail={detail} onChange={(token) => setDetail((d) => (d ? { ...d, share_token: token } : d))} />
    </>
  );

  return <ReportView data={detail} lang={lang} actions={actions} />;
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
