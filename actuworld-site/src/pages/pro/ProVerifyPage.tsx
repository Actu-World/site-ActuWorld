import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Scissors, Send, Loader2 } from 'lucide-react';
import { ProShell } from '../../components/pro/ProShell';
import { AsvReadabilityHint } from '../../components/studio/AsvReadabilityHint';
import { useLanguage } from '../../i18n/LanguageContext';
import { proApi } from '../../lib/pro/api';
import type { ProAccess, ProInput } from '../../lib/pro/types';
import { MAX_SECTIONS, SECTION_MAX, splitIntoSections, type DraftSection } from '../../lib/pro/draft';

// Bornes identiques à l'API (utils/proInput.ts).
const TITLE_MAX = 200;
const MAX_SOURCES = 3;
const DRAFT_KEY = 'aw_pro_draft_v1';

type Draft = { title: string; sections: DraftSection[] };

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

function isUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function VerifyForm({ access }: { access: ProAccess }) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const [splitOpen, setSplitOpen] = useState(false);
  const [article, setArticle] = useState('');
  const [articleSources, setArticleSources] = useState('');
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

  // Recalculé à chaque rendu : quelques sections, coût négligeable.
  const problems = (() => {
    const list: string[] = [];
    if (!draft.title.trim()) list.push(t('Donne un titre à ton texte.', 'Give your text a title.'));
    draft.sections.forEach((s, i) => {
      if (!s.text.trim()) list.push(t(`Section ${i + 1} : le texte est vide.`, `Section ${i + 1}: the text is empty.`));
      if (s.text.length > SECTION_MAX) list.push(t(`Section ${i + 1} : trop longue.`, `Section ${i + 1}: too long.`));
      const urls = s.sources.map((u) => u.trim()).filter(Boolean);
      if (!urls.length) list.push(t(`Section ${i + 1} : ajoute une source.`, `Section ${i + 1}: add a source.`));
      if (urls.some((u) => !isUrl(u))) list.push(t(`Section ${i + 1} : une adresse n'est pas valide.`, `Section ${i + 1}: an address is not valid.`));
    });
    return list;
  })();

  const update = (fn: (d: Draft) => Draft) => setDraft((d) => fn(d));
  const setSection = (i: number, patch: Partial<DraftSection>) =>
    update((d) => ({ ...d, sections: d.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));

  const applySplit = () => {
    const sources = articleSources.split(/\s+/).map((s) => s.trim()).filter(isUrl).slice(0, MAX_SOURCES);
    const sections = splitIntoSections(article, sources.length ? sources : ['']);
    if (sections.length) update((d) => ({ ...d, sections }));
    setSplitOpen(false);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (problems.length || sending) return;
    setSending(true);
    setError(null);
    const input: ProInput = {
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
              'Une section = un passage et la ou les sources qui le soutiennent. ASV juge chaque section contre ses propres sources.',
              'One section = a passage and the source(s) backing it. ASV judges each section against its own sources.',
            )}
          </p>
        </div>
        <p className="text-sm text-aw-muted tabular">
          {t(`${remaining} vérification(s) restante(s) ce mois-ci`, `${remaining} check(s) left this month`)}
        </p>
      </div>

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

      <div className="card p-4">
        <button type="button" className="btn-link text-sm" onClick={() => setSplitOpen((o) => !o)} aria-expanded={splitOpen}>
          <Scissors className="w-4 h-4" aria-hidden="true" />
          {t('Coller un article entier et le découper en sections', 'Paste a whole article and split it into sections')}
        </button>
        {splitOpen && (
          <div className="mt-4 space-y-3">
            <textarea className="field min-h-[160px]" value={article} onChange={(e) => setArticle(e.target.value)}
              placeholder={t('Colle ton article : chaque paragraphe deviendra une section.', 'Paste your article: each paragraph becomes a section.')} />
            <input className="field" value={articleSources} onChange={(e) => setArticleSources(e.target.value)}
              placeholder={t("Adresses des sources de l'article (3 au plus), séparées par des espaces", "The article's source addresses (3 max), separated by spaces")} />
            <p className="text-xs text-aw-muted">
              {t('Chaque section reçoit ces sources ; tu pourras ensuite les ajuster section par section. Cela remplace les sections actuelles.',
                'Each section gets these sources; you can then adjust them section by section. This replaces the current sections.')}
            </p>
            <button type="button" className="btn-outline btn-sm" onClick={applySplit} disabled={!article.trim()}>
              {t('Découper', 'Split')}
            </button>
          </div>
        )}
      </div>

      <ol className="space-y-5">
        {draft.sections.map((section, i) => (
          <li key={i} className="card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">{t(`Section ${i + 1}`, `Section ${i + 1}`)}</h2>
              {draft.sections.length > 1 && (
                <button type="button" className="text-aw-muted hover:text-red-600 p-1" aria-label={t('Retirer la section', 'Remove section')}
                  onClick={() => update((d) => ({ ...d, sections: d.sections.filter((_, j) => j !== i) }))}>
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <div>
              <textarea
                className="field min-h-[120px]"
                aria-label={t(`Texte de la section ${i + 1}`, `Section ${i + 1} text`)}
                value={section.text}
                maxLength={SECTION_MAX}
                onChange={(e) => setSection(i, { text: e.target.value })}
                placeholder={t('Le passage à vérifier.', 'The passage to check.')}
              />
              <p className="text-xs text-aw-muted text-right tabular mt-1">{section.text.length} / {SECTION_MAX}</p>
            </div>
            <div className="space-y-3">
              <p className="body-semi text-sm">{t('Sources de cette section', 'Sources for this section')}</p>
              {section.sources.map((url, k) => (
                <div key={k}>
                  <div className="flex gap-2">
                    <input
                      className="field"
                      type="url"
                      inputMode="url"
                      aria-label={t(`Source ${k + 1}`, `Source ${k + 1}`)}
                      value={url}
                      onChange={(e) => setSection(i, { sources: section.sources.map((u, m) => (m === k ? e.target.value : u)) })}
                      placeholder="https://"
                    />
                    {section.sources.length > 1 && (
                      <button type="button" className="text-aw-muted hover:text-red-600 px-2" aria-label={t('Retirer la source', 'Remove source')}
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
                  {t('Ajouter une source', 'Add a source')}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>

      {draft.sections.length < MAX_SECTIONS && (
        <button type="button" className="btn-outline btn-sm" onClick={() => update((d) => ({ ...d, sections: [...d.sections, emptySection()] }))}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t('Ajouter une section', 'Add a section')}
        </button>
      )}

      <div className="card p-5 space-y-3">
        {problems.length > 0 && (
          <ul className="text-sm text-aw-muted list-disc pl-5">
            {problems.slice(0, 5).map((p) => <li key={p}>{p}</li>)}
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
