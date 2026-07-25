import { useRef, useState } from 'react';
import { CheckCircle2, FileText, Loader2, Plus, Trash2, XCircle } from 'lucide-react';
import type { JournalSource } from '../../types/journal';
import {
  fetchUrlMetadata, isValidSourceUrl, MAX_SOURCES, SOURCE_TITLE_MAX, SOURCE_URL_MAX,
} from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Sources alignées sur le composer mobile : titre (optionnel) + URL, 2 max,
// source obligatoire pour publier (l'app l'exige, le brouillon peut attendre).
// L'éditeur (média) est auto-déduit du domaine à l'envoi — pas de champ dédié.
// Assistance à la saisie : au blur d'une URL valide, l'API vérifie que la page
// répond et pré-remplit le titre (og:title) s'il est vide.

interface SourceListEditorProps {
  sources: JournalSource[];
  onChange: (sources: JournalSource[]) => void;
}

type UrlCheck =
  | { state: 'loading' }
  | { state: 'ok'; titleFilled: boolean }
  | { state: 'dead'; status: number | null }
  | { state: 'unknown' };

const inputClass =
  'w-full rounded-lg border border-aw bg-aw-bg px-3 py-2.5 text-aw-text text-sm placeholder:text-aw-muted focus:outline-none focus:ring-2 focus:ring-aw-primary';

export function SourceListEditor({ sources, onChange }: SourceListEditorProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  // Résultats de vérification par URL (clé = URL, pas l'index : stable si
  // une ligne est supprimée). Best-effort : jamais bloquant pour l'envoi.
  const [checks, setChecks] = useState<Record<string, UrlCheck>>({});
  // Référence vers l'état courant des sources pour la mise à jour asynchrone du titre.
  const sourcesRef = useRef(sources);
  sourcesRef.current = sources;

  const replaceAt = (index: number, source: JournalSource) =>
    onChange(sources.map((current, i) => (i === index ? source : current)));

  const removeAt = (index: number) => {
    const next = sources.filter((_, i) => i !== index);
    // Comme dans l'app : on garde toujours au moins une ligne.
    onChange(next.length > 0 ? next : [{ url: '', title: '' }]);
  };

  const checkUrl = async (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || !isValidSourceUrl(trimmed) || checks[trimmed]) return;
    setChecks((prev) => ({ ...prev, [trimmed]: { state: 'loading' } }));
    try {
      const meta = await fetchUrlMetadata(trimmed);
      let titleFilled = false;
      if (meta.reachable && meta.title) {
        // Pré-remplit le titre si le créateur ne l'a pas déjà saisi.
        const current = sourcesRef.current;
        const target = current.findIndex((s) => s.url.trim() === trimmed && !s.title?.trim());
        if (target !== -1) {
          titleFilled = true;
          onChange(current.map((s, i) =>
            i === target ? { ...s, title: meta.title!.slice(0, SOURCE_TITLE_MAX) } : s
          ));
        }
      }
      setChecks((prev) => ({
        ...prev,
        [trimmed]: meta.reachable ? { state: 'ok', titleFilled } : { state: 'dead', status: meta.status },
      }));
    } catch {
      // API injoignable ou rate-limit : on n'affiche rien d'alarmant.
      setChecks((prev) => ({ ...prev, [trimmed]: { state: 'unknown' } }));
    }
  };

  const renderCheck = (url: string) => {
    const check = checks[url.trim()];
    if (!check || check.state === 'unknown') return null;
    if (check.state === 'loading') {
      return (
        <p className="text-aw-muted text-xs inline-flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> {t('Vérification de la page…', 'Checking the page…')}
        </p>
      );
    }
    if (check.state === 'ok') {
      return (
        <p className="text-aw-primary text-xs inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {check.titleFilled
            ? t('Page accessible — titre rempli automatiquement', 'Page reachable — title auto-filled')
            : t('Page accessible', 'Page reachable')}
        </p>
      );
    }
    return (
      <p className="text-red-500 text-xs inline-flex items-center gap-1.5">
        <XCircle className="w-3.5 h-3.5" />
        {t(
          `Cette page ne répond pas${check.status ? ` (${check.status})` : ''} — l'ASV ne pourra pas la vérifier.`,
          `This page does not respond${check.status ? ` (${check.status})` : ''} — ASV will not be able to verify it.`
        )}
      </p>
    );
  };

  return (
    <div className="border-t border-aw pt-4">
      <div className="flex items-center mb-2">
        <FileText className="w-4 h-4 text-aw-primary" />
        <h2 className="body-semi text-lg ml-2">{t('Sources', 'Sources')}</h2>
        <span className="text-red-500 ml-1.5" aria-hidden>*</span>
        {sources.length < MAX_SOURCES && (
          <button
            type="button"
            className="btn-outline inline-flex items-center text-sm ml-auto"
            onClick={() => onChange([...sources, { url: '', title: '' }])}
          >
            <Plus className="w-4 h-4 mr-1" /> {t('Ajouter', 'Add')}
          </button>
        )}
      </div>
      <p className="text-aw-muted text-sm mb-3">
        {t(
          "L'ASV vérifiera ces sources à la publication — vise l'article précis, pas la page d'accueil.",
          'ASV will verify these sources at publish time — link the exact article, not a homepage.'
        )}
      </p>

      <div className="space-y-3">
        {sources.map((source, index) => {
          const urlFilled = source.url.trim().length > 0;
          const urlInvalid = urlFilled && !isValidSourceUrl(source.url);
          return (
            <div key={index} className="border-t border-aw pt-3">
              <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-start">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={source.title ?? ''}
                    onChange={(e) => replaceAt(index, { ...source, title: e.target.value })}
                    placeholder={t('Titre de la source (optionnel)', 'Source title (optional)')}
                    maxLength={SOURCE_TITLE_MAX}
                    className={inputClass}
                  />
                  <input
                    type="url"
                    value={source.url}
                    onChange={(e) => replaceAt(index, { ...source, url: e.target.value })}
                    onBlur={() => void checkUrl(source.url)}
                    placeholder="https://..."
                    maxLength={SOURCE_URL_MAX}
                    className={`${inputClass} ${urlInvalid ? 'border-red-500 focus:ring-red-500' : ''}`}
                    aria-invalid={urlInvalid}
                  />
                  {urlInvalid && (
                    <p className="text-red-500 text-xs">
                      {t("L'URL doit commencer par http:// ou https://", 'URL must start with http:// or https://')}
                    </p>
                  )}
                  {!urlInvalid && renderCheck(source.url)}
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="p-2 rounded-lg bg-aw-surface text-red-500 hover:text-red-600"
                  aria-label={t('Supprimer la source', 'Delete source')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
