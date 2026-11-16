import { useEffect, useState } from 'react';
import type { ClipboardEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardPaste, Link2Off, Loader2, Plus, Send, Trash2 } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import { AsvReadabilityHint } from '../../components/studio/AsvReadabilityHint';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import type { ProAccess, ProInput } from '../../lib/pro/types';
import {
  draftProblems, isUrl, MAX_DISTINCT_SOURCES, MAX_SECTIONS, MAX_SOURCES, SECTION_MAX, TITLE_MAX,
  type Draft, type DraftSection,
} from '../../lib/pro/draft';
import { distinctSources, parsePastedHtml, parsePastedText, type PasteResult } from '../../lib/pro/paste';

const DRAFT_KEY = 'aw_pro_draft_v2';

const emptySection = (): DraftSection => ({ text: '', sources: [''] });
const emptyDraft = (): Draft => ({ title: '', sections: [emptySection()] });

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return emptyDraft();
    const d = JSON.parse(raw) as Draft;
    return Array.isArray(d?.sections) && d.sections.length ? d : emptyDraft();
  } catch {
    return emptyDraft();
  }
}

/** Zone de collage : le HTML du presse-papiers garde les liens de chaque paragraphe. */
function PasteArticle({ onUse }: { onUse: (r: PasteResult) => void }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [result, setResult] = useState<PasteResult | null>(null);
  const [plain, setPlain] = useState('');

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (!html && !text) return;
    e.preventDefault();
    setPlain(text);
    setResult(html ? parsePastedHtml(html) : parsePastedText(text));
  };

  const withLinks = result?.sections.filter((s) => s.sources.length > 0).length ?? 0;
  const distinct = result ? distinctSources(result.sections) : 0;

  return (
    <div className="card p-5 space-y-3">
      <div className="flex items-center gap-2">
        <ClipboardPaste className="w-5 h-5 text-aw-primary" aria-hidden="true" />
        <h2 className="text-lg">{t('Coller un article', 'Paste an article')}</h2>
      </div>
      <p className="text-sm text-aw-muted max-w-prose">
        {t(
          "Copie ton article depuis ton CMS, Google Docs ou Word, avec ses liens, et colle-le ici. Chaque paragraphe devient un passage ; les liens d'un paragraphe sont ses sources.",
          'Copy your article from your CMS, Google Docs or Word, with its links, and paste it here. Each paragraph becomes a passage; the links in a paragraph are its sources.',
        )}
      </p>
      <textarea
        className="field min-h-[120px]"
        value={plain}
        onPaste={handlePaste}
        onChange={(e) => {
          setPlain(e.target.value);
          setResult(e.target.value.trim() ? parsePastedText(e.target.value) : null);
        }}
        aria-label={t("Coller l'article", 'Paste the article')}
        placeholder={t('Colle ton article ici (Ctrl+V).', 'Paste your article here (Ctrl+V).')}
      />
      {result && (
        <div className="text-sm space-y-2" role="status">
          <p>
            {t(
              `${result.sections.length} passage(s), dont ${withLinks} avec lien, ${distinct} source(s) différente(s).`,
              `${result.sections.length} passage(s), ${withLinks} with a link, ${distinct} different source(s).`,
            )}
          </p>
          {distinct > MAX_DISTINCT_SOURCES && (
            <p className="text-red-600">
              {t(`Plus de ${MAX_DISTINCT_SOURCES} sources différentes : garde une partie de l'article, ou fais deux vérifications.`,
                `More than ${MAX_DISTINCT_SOURCES} different sources: keep part of the article, or run two checks.`)}
            </p>
          )}
          {result.tooManyLinks.length > 0 && (
            <p className="text-aw-muted">
              {t(`Passage(s) ${result.tooManyLinks.join(', ')} : plus de ${MAX_SOURCES} liens, seuls les ${MAX_SOURCES} premiers sont gardés.`,
                `Passage(s) ${result.tooManyLinks.join(', ')}: more than ${MAX_SOURCES} links, only the first ${MAX_SOURCES} are kept.`)}
            </p>
          )}
          {result.dropped > 0 && (
            <p className="text-aw-muted">
              {t(`${result.dropped} paragraphe(s) au-delà de ${MAX_SECTIONS} ne sont pas repris.`, `${result.dropped} paragraph(s) beyond ${MAX_SECTIONS} are left out.`)}
            </p>
          )}
          <button type="button" className="btn-outline btn-sm" disabled={!result.sections.length} onClick={() => { onUse(result); setResult(null); setPlain(''); }}>
            {t('Utiliser ces passages (remplace le texte ci-dessous)', 'Use these passages (replaces the text below)')}
          </button>
        </div>
      )}
    </div>
  );
}

function VerifyForm({ access }: { access: ProAccess }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      /* stockage indisponible : le brouillon n'est simplement pas gardé */
    }
  }, [draft]);

  const remaining = Math.max(access.quota - access.used_this_month, 0);
  const problems = draftProblems(draft);
  const distinct = distinctSources(draft.sections.map((s) => ({ ...s, sources: s.sources.filter(isUrl) })));

  const update = (fn: (d: Draft) => Draft) => setDraft((d) => fn(d));
  const setSection = (i: number, patch: Partial<DraftSection>) =>
    update((d) => ({ ...d, sections: d.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));

  const usePasted = (r: PasteResult) =>
    update((d) => ({
      title: d.title.trim() ? d.title : r.title ?? '',
      sections: r.sections.map((s) => ({ text: s.text, sources: s.sources.length ? s.sources : [''] })),
    }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (problems.length || sending) return;
    setSending(true);
    setError(null);
    const input: ProInput = {
      // 3.1 : le modèle écrit ses explications dans la langue du site.
      locale: isEnglish ? 'en' : 'fr',
      title: draft.title.trim(),
      sections: draft.sections.map((s) => ({
        text: s.text.trim(),
        sources: s.sources.map((u) => u.trim()).filter(Boolean).map((url) => ({ url })),
      })),
    };
    try {
      const id = await proApi.create(input);
      try { localStorage.removeItem(DRAFT_KEY); } catch { /* rien */ }
      navigate(`/pro/rapport/${id}`);
    } catch (e) {
      setError((e as Error).message);
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl">{t('Vérifier un texte', 'Check a text')}</h1>
          <p className="text-aw-muted mt-1 max-w-prose">
            {t(
              "ASV lit chaque source en entier et juge chaque passage contre ses propres liens. Un passage sans lien est signalé, pas jugé.",
              'ASV reads each source in full and judges each passage against its own links. A passage without a link is flagged, not judged.',
            )}
          </p>
        </div>
        <p className="text-sm text-aw-muted tabular">
          {t(`${remaining} vérification(s) restante(s) ce mois-ci`, `${remaining} check(s) left this month`)}
        </p>
      </div>

      <PasteArticle onUse={usePasted} />

      <div>
        <label htmlFor="pro-title" className="body-semi block mb-2">{t('Titre', 'Title')}</label>
        <input
          id="pro-title"
          className="field"
          maxLength={TITLE_MAX}
          value={draft.title}
          onChange={(e) => update((d) => ({ ...d, title: e.target.value }))}
          placeholder={t('Ex. : Salaire minimum, ce que prévoit la directive européenne', 'E.g. Minimum wage, what the EU directive says')}
        />
      </div>

      <ol className="space-y-5">
        {draft.sections.map((section, i) => {
          const hasLink = section.sources.some((u) => u.trim());
          return (
            <li key={i} className="card p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg">{t(`Passage ${i + 1}`, `Passage ${i + 1}`)}</h2>
                <div className="flex items-center gap-3">
                  {!hasLink && (
                    <span className="inline-flex items-center gap-1 text-xs text-aw-muted">
                      <Link2Off className="w-3.5 h-3.5" aria-hidden="true" />
                      {t('Sans lien : signalé, pas jugé', 'No link: flagged, not judged')}
                    </span>
                  )}
                  {draft.sections.length > 1 && (
                    <button type="button" className="text-aw-muted hover:text-red-600 p-1" aria-label={t('Retirer le passage', 'Remove passage')}
                      onClick={() => update((d) => ({ ...d, sections: d.sections.filter((_, j) => j !== i) }))}>
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
              <div>
                <textarea
                  className="field min-h-[110px]"
                  aria-label={t(`Texte du passage ${i + 1}`, `Passage ${i + 1} text`)}
                  value={section.text}
                  maxLength={SECTION_MAX}
                  onChange={(e) => setSection(i, { text: e.target.value })}
                  placeholder={t('Le passage à vérifier.', 'The passage to check.')}
                />
                <p className="text-xs text-aw-muted text-right tabular mt-1">{section.text.length} / {SECTION_MAX}</p>
              </div>
              <div className="space-y-3">
                <p className="body-semi text-sm">{t('Liens de ce passage', 'Links in this passage')}</p>
                {section.sources.map((url, k) => (
                  <div key={k}>
                    <div className="flex gap-2">
                      <input
                        className="field"
                        type="url"
                        inputMode="url"
                        aria-label={t(`Lien ${k + 1}`, `Link ${k + 1}`)}
                        value={url}
                        onChange={(e) => setSection(i, { sources: section.sources.map((u, m) => (m === k ? e.target.value : u)) })}
                        placeholder="https://"
                      />
                      {section.sources.length > 1 && (
                        <button type="button" className="text-aw-muted hover:text-red-600 px-2" aria-label={t('Retirer le lien', 'Remove link')}
                          onClick={() => setSection(i, { sources: section.sources.filter((_, m) => m !== k) })}>
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    <AsvReadabilityHint url={url} />
                  </div>
                ))}
                {section.sources.length < MAX_SOURCES && (
                  <button type="button" className="btn-link text-sm" onClick={() => setSection(i, { sources: [...section.sources, ''] })}>
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    {t('Ajouter un lien', 'Add a link')}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {draft.sections.length < MAX_SECTIONS && (
        <button type="button" className="btn-outline btn-sm" onClick={() => update((d) => ({ ...d, sections: [...d.sections, emptySection()] }))}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t('Ajouter un passage', 'Add a passage')}
        </button>
      )}

      <div className="card p-5 space-y-3">
        <p className={`text-sm tabular ${distinct > MAX_DISTINCT_SOURCES ? 'text-red-600' : 'text-aw-muted'}`}>
          {t(`${distinct} / ${MAX_DISTINCT_SOURCES} sources différentes`, `${distinct} / ${MAX_DISTINCT_SOURCES} different sources`)}
        </p>
        {problems.length > 0 && (
          <ul className="text-sm text-aw-muted list-disc pl-5">
            {problems.slice(0, 5).map((p) => <li key={p.fr}>{isEnglish ? p.en : p.fr}</li>)}
          </ul>
        )}
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary" disabled={problems.length > 0 || sending || remaining === 0}>
            {sending ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <Send className="w-5 h-5" aria-hidden="true" />}
            {t('Lancer la vérification', 'Run the check')}
          </button>
          <button type="button" className="btn-outline btn-sm" onClick={() => setDraft(emptyDraft())}>
            {t('Tout effacer', 'Clear all')}
          </button>
        </div>
        <p className="text-xs text-aw-muted">
          {t(
            'Ton texte reste privé : il est gardé dans ton historique jusqu’à ce que tu le supprimes, et rien n’est publié.',
            'Your text stays private: it is kept in your history until you delete it, and nothing is published.',
          )}
        </p>
      </div>
    </form>
  );
}

export default function ProVerifyPage() {
  const { isEnglish } = useLanguage();
  return (
    <ProShell title={isEnglish ? 'Check a text' : 'Vérifier un texte'} path="/pro/verifier">
      {(access) => <VerifyForm access={access} />}
    </ProShell>
  );
}
