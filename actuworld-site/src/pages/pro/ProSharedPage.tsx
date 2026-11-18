import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, Eye, Loader2, Printer } from 'lucide-react';
import { PageMeta } from '../../components/PageMeta';
import ReportView from '../../components/pro/ReportView';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import { download, slug } from '../../lib/pro/files';
import { toMarkdown, type Lang } from '../../lib/pro/report';
import type { ReportData } from '../../lib/pro/types';

const POLL_MS = 3000;

/**
 * ASV Pro 3.8 — rapport partagé en lecture seule (/pro/r/:jeton), sans compte.
 * Ni auteur, ni action : lecture, export Markdown, impression. Non indexé.
 */
export default function ProSharedPage() {
  const { token = '' } = useParams();
  const { isEnglish } = useLanguage();
  const lang: Lang = isEnglish ? 'en' : 'fr';
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [data, setData] = useState<ReportData | null>(null);
  const [missing, setMissing] = useState(false);

  // Un rapport ouvert depuis l'app arrive ici pendant sa vérification : on relit
  // toutes les 3 s tant qu'il est en cours (comme la page privée du rapport).
  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = () => {
      proApi.shared(token)
        .then((d) => {
          if (cancelled) return;
          setData(d);
          if (d.status === 'pending') timer = setTimeout(load, POLL_MS);
        })
        .catch(() => { if (!cancelled) setMissing(true); });
    };
    load();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto container-px py-8 sm:py-10">
      <PageMeta
        title={data ? `${data.input.title} | ${t('Rapport ASV', 'ASV report')}` : t('Rapport ASV', 'ASV report')}
        description={t('Rapport ASV partagé en lecture seule.', 'ASV report shared read-only.')}
        path={`/pro/r/${token}`}
        noindex
      />
      {missing ? (
        <div className="card p-8 text-center max-w-lg mx-auto">
          <p className="body-semi">{t('Ce rapport n’est pas disponible.', 'This report is not available.')}</p>
          <p className="text-sm text-aw-muted mt-2">
            {t('Le lien a peut-être été retiré par son auteur.', 'The link may have been removed by its author.')}
          </p>
          <Link to="/pro" className="btn-outline btn-sm mt-5">{t('Découvrir ASV Pro', 'Discover ASV Pro')}</Link>
        </div>
      ) : !data ? (
        <div className="flex justify-center py-16 text-aw-muted" role="status"><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /></div>
      ) : (
        <ReportView
          data={data}
          lang={lang}
          banner={(
            <p className="badge badge-primary mb-4 print:hidden">
              <Eye className="w-4 h-4" aria-hidden="true" />
              {t('Rapport partagé en lecture seule', 'Report shared read-only')}
            </p>
          )}
          actions={(
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-outline btn-sm" onClick={() => download(`asv-${slug(data.input.title)}.md`, toMarkdown(data, lang), 'text/markdown;charset=utf-8')}>
                <Download className="w-4 h-4" aria-hidden="true" />Markdown
              </button>
              <button type="button" className="btn-outline btn-sm" onClick={() => window.print()}>
                <Printer className="w-4 h-4" aria-hidden="true" />{t('Imprimer ou PDF', 'Print or PDF')}
              </button>
              <Link to="/pro" className="btn-link text-sm ml-auto">{t('Vérifier tes propres textes avec ASV Pro', 'Check your own texts with ASV Pro')}</Link>
            </div>
          )}
        />
      )}
    </div>
  );
}
