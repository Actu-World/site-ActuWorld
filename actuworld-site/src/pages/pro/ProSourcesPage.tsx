import { useState } from 'react';
import type { FormEvent } from 'react';
import { Download, Loader2, Search } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import { ProUpsell } from '../../components/pro/ProUpsell';
import { featuresOf } from '../../lib/pro/plan';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import type { UrlCredibility } from '../../lib/pro/types';
import { domainOf, reliabilityWords, TONE_COLOR, type Lang } from '../../lib/pro/report';

const MAX_URLS = 10;
const SOCIAL = /(^|\.)(x\.com|twitter\.com|facebook\.com|instagram\.com|tiktok\.com|youtube\.com|youtu\.be|linkedin\.com)$/i;

function tone(score: number) {
  if (score >= 8) return TONE_COLOR.green;
  if (score >= 6) return TONE_COLOR.light;
  if (score >= 4) return TONE_COLOR.orange;
  return TONE_COLOR.red;
}

function csvCell(value: unknown): string {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function Sources() {
  const { isEnglish } = useLanguage();
  const lang: Lang = isEnglish ? 'en' : 'fr';
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [raw, setRaw] = useState('');
  const [rows, setRows] = useState<UrlCredibility[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const urls = raw.split(/\s+/).map((u) => u.trim()).filter(Boolean);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!urls.length || urls.length > MAX_URLS || busy) return;
    setBusy(true);
    setError(null);
    try {
      const data = await proApi.checkUrls(urls);
      setRows([...data].sort((a, b) => b.score - a.score));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const exportCsv = () => {
    const header = ['url', 'domaine', 'fiabilite', 'raisons', 'accessible', 'https', 'age_jours'];
    const lines = rows.map((r) => [r.url, r.domain, reliabilityWords(r.score, lang), (r.s1_reasons ?? []).join(' | '), r.accessible, r.https, r.domain_age_days ?? ''].map(csvCell).join(';'));
    const url = URL.createObjectURL(new Blob(['﻿' + [header.join(';'), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asv-editeurs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl">{t('Qui publie ?', 'Who publishes?')}</h1>
        <p className="text-aw-muted mt-1 max-w-prose">
          {t(
            "Colle jusqu'à 10 adresses : ASV dit pour chacune si son éditeur est identifiable et transparent (registres de presse, mentions légales, ancienneté, sécurité). Cela ne compte pas dans ton quota.",
            'Paste up to 10 addresses: ASV tells you for each whether its publisher is identifiable and transparent (press registers, legal notice, age, security). This does not count towards your quota.',
          )}
        </p>
      </div>
      <form onSubmit={submit} className="card p-5 space-y-3">
        <textarea className="field min-h-[140px]" value={raw} onChange={(e) => setRaw(e.target.value)}
          aria-label={t('Adresses à analyser', 'Addresses to analyse')} placeholder={'https://\nhttps://'} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary btn-sm" disabled={busy || !urls.length || urls.length > MAX_URLS}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Search className="w-4 h-4" aria-hidden="true" />}
            {t('Analyser', 'Analyse')}
          </button>
          <span className={`text-sm tabular ${urls.length > MAX_URLS ? 'text-red-600' : 'text-aw-muted'}`}>{urls.length} / {MAX_URLS}</span>
          {busy && <span className="text-sm text-aw-muted">{t('Un domaine jamais vu peut prendre une minute.', 'A never-seen domain can take a minute.')}</span>}
        </div>
        {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      </form>

      {rows.length > 0 && (
        <>
          <div className="flex justify-end">
            <button type="button" className="btn-outline btn-sm" onClick={exportCsv}><Download className="w-4 h-4" aria-hidden="true" />CSV</button>
          </div>
          <ul className="space-y-3">
            {rows.map((r) => {
              const social = SOCIAL.test(domainOf(r.url));
              return (
                <li key={r.url} className="card p-4 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="link font-semibold">{r.domain}</a>
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      {!social && <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tone(r.score) }} aria-hidden="true" />}
                      {social ? t('Non applicable : réseau social ou vidéo', 'Not applicable: social network or video') : reliabilityWords(r.score, lang)}
                    </span>
                  </div>
                  {!social && (r.s1_reasons ?? []).length > 0 && (
                    <ul className="list-disc pl-5 text-aw-muted mt-2">
                      {(r.s1_reasons ?? []).map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>
                  )}
                  <p className="text-aw-muted mt-2">
                    {[
                      r.accessible ? t('Page accessible', 'Page reachable') : t('Page inaccessible', 'Page unreachable'),
                      r.https ? 'HTTPS' : t('Connexion non sécurisée', 'Insecure connection'),
                      r.domain_age_days ? t(`Domaine créé il y a ${Math.floor(r.domain_age_days / 365)} an(s)`, `Domain created ${Math.floor(r.domain_age_days / 365)} year(s) ago`) : null,
                    ].filter(Boolean).join(' · ')}
                  </p>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default function ProSourcesPage() {
  const { isEnglish } = useLanguage();
  return (
    <ProShell title={isEnglish ? 'Who publishes?' : 'Qui publie ?'} path="/pro/sources">
      {(access) => (featuresOf(access).publishers ? <Sources /> : (
        <ProUpsell
          title={isEnglish ? 'Publisher analysis comes with the Pro plan' : "L'analyse des éditeurs fait partie de la formule Pro"}
          description={isEnglish
            ? 'With Discovery, each report already says who publishes your sources. Pro lets you rate any address on its own, before you even write.'
            : 'En Découverte, chaque rapport dit déjà qui publie tes sources. Pro permet de noter n’importe quelle adresse à part, avant même d’écrire.'}
        />
      ))}
    </ProShell>
  );
}
