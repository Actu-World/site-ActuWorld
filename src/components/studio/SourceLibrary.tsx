import { BookMarked, Plus } from 'lucide-react';
import type { JournalSource, StudioDraftRow } from '../../types/journal';
import { hostFromUrl } from '../../lib/studio/journal';
import { useLanguage } from '../../i18n/LanguageContext';

// Bibliothèque de sources : les sources déjà citées dans les articles passés
// du créateur (brouillons + publiés), réutilisables en un clic.

interface SourceLibraryProps {
  rows: StudioDraftRow[];
  currentSources: JournalSource[];
  canAdd: boolean;
  onPick: (source: JournalSource) => void;
}

type LibraryEntry = { url: string; title: string | null; publisher: string | null; count: number };

function buildLibrary(rows: StudioDraftRow[], currentSources: JournalSource[]): LibraryEntry[] {
  const inUse = new Set(currentSources.map((s) => s.url.trim()).filter(Boolean));
  const byUrl = new Map<string, LibraryEntry>();
  for (const row of rows) {
    for (const source of row.sources ?? []) {
      const url = source.url?.trim();
      if (!url || inUse.has(url)) continue;
      const existing = byUrl.get(url);
      if (existing) {
        existing.count += 1;
        if (!existing.title && source.title) existing.title = source.title;
      } else {
        byUrl.set(url, {
          url,
          title: source.title ?? null,
          publisher: source.publisher ?? hostFromUrl(url),
          count: 1,
        });
      }
    }
  }
  return [...byUrl.values()].sort((a, b) => b.count - a.count).slice(0, 6);
}

export function SourceLibrary({ rows, currentSources, canAdd, onPick }: SourceLibraryProps) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const entries = buildLibrary(rows, currentSources);
  if (entries.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-aw-muted text-xs mb-2 inline-flex items-center gap-1.5">
        <BookMarked className="w-3.5 h-3.5" />
        {t('Mes sources déjà citées — clic pour réutiliser', 'My previously cited sources — click to reuse')}
      </p>
      <div className="flex flex-wrap gap-2">
        {entries.map((entry) => (
          <button
            key={entry.url}
            type="button"
            disabled={!canAdd}
            onClick={() => onPick({ url: entry.url, title: entry.title, publisher: entry.publisher })}
            title={entry.url}
            className="inline-flex items-center gap-1.5 max-w-[280px] px-2.5 py-1.5 rounded-lg border border-aw bg-aw-surface text-xs text-aw-text hover:border-aw-primary disabled:opacity-40"
          >
            <Plus className="w-3 h-3 text-aw-primary shrink-0" />
            <span className="truncate">
              <span className="body-semi">{entry.publisher || hostFromUrl(entry.url)}</span>
              {entry.title ? ` — ${entry.title}` : ''}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
