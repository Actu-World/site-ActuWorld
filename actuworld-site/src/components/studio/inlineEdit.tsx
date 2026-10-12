import { useContext, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Check, Loader2, Pencil, RotateCcw, X } from 'lucide-react';
import { InlineEditContext, type EditDraft } from './inlineEditContext';

// Retouche des textes sur place (page Rédaction) : en mode retouche, chaque
// texte de l'aperçu devient cliquable ; le clic ouvre le panneau d'édition à
// côté du téléphone, et l'aperçu affiche la saisie en direct.

/** Rend un texte de l'aperçu cliquable en mode retouche. Sans mode retouche : transparent. */
export function Editable({ path, label, value, children, dark = false }: {
  path: string;
  label: string;
  value: string;
  children: ReactNode;
  /** Texte clair sur fond sombre (cartes de dépêche). */
  dark?: boolean;
}) {
  const ctx = useContext(InlineEditContext);
  if (!ctx?.active) return <>{children}</>;
  const isOpen = ctx.openPath === path;
  const edited = ctx.isEdited(path);
  const ring = isOpen
    ? 'outline-amber-400'
    : edited
      ? 'outline-emerald-400'
      : dark ? 'outline-white/30 hover:outline-sky-300' : 'outline-sky-500/40 hover:outline-sky-500';
  const openIt = () => ctx.open(path, label, value);
  return (
    <div
      role="button"
      tabIndex={0}
      title={label}
      onClick={(e) => { e.stopPropagation(); openIt(); }}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); openIt(); } }}
      className={`relative z-20 cursor-text rounded-md outline outline-2 outline-dashed outline-offset-2 transition-colors ${ring}`}
    >
      {children}
      {edited && !isOpen && (
        <span className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black/40" aria-hidden />
      )}
    </div>
  );
}

/** Panneau d'édition, à côté du téléphone. */
export function EditPanel({ draft, onChange, onSave, onCancel, onRevert, saving, error }: {
  draft: EditDraft;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onRevert: () => void;
  saving: boolean;
  error: string | null;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focusedPath, setFocusedPath] = useState('');
  useEffect(() => {
    if (focusedPath === draft.path) return;
    setFocusedPath(draft.path);
    const el = ref.current;
    if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
  }, [draft.path, focusedPath]);

  const len = draft.value.length;
  const over = len > draft.limit;
  const changed = draft.value !== draft.initial;
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && changed && !over && !saving) { e.preventDefault(); onSave(); }
  };

  return (
    <div
      className="fixed z-[60] bottom-4 right-4 w-[min(440px,calc(100vw-2rem))] rounded-2xl bg-aw-bg text-aw-text shadow-[0_20px_60px_rgba(0,0,0,0.5)] ring-1 ring-aw p-4 flex flex-col gap-2.5"
      role="dialog"
      aria-label="Retouche"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-bold flex items-center gap-1.5">
          <Pencil className="w-4 h-4 text-aw-primary" /> {draft.label}
        </p>
        <button type="button" onClick={onCancel} className="p-1 rounded-md hover:bg-aw-surface" aria-label="Fermer">
          <X className="w-4 h-4" />
        </button>
      </div>
      <textarea
        ref={ref}
        value={draft.value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKey}
        rows={Math.min(14, Math.max(3, Math.ceil(len / 48) + 1))}
        className="w-full resize-y rounded-xl border border-aw bg-aw-surface px-3 py-2.5 text-[15px] leading-6 focus:outline-none focus:ring-2 focus:ring-aw-primary"
      />
      <div className="flex items-center justify-between text-xs">
        <span className="text-aw-muted">**gras** · *italique* · Ctrl+Entrée pour enregistrer</span>
        <span className={`tabular-nums font-bold ${over ? 'text-red-500' : len > draft.limit * 0.9 ? 'text-amber-600' : 'text-aw-muted'}`}>
          {len}/{draft.limit}
        </span>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex items-center justify-between gap-2">
        {draft.edited ? (
          <button type="button" onClick={onRevert} disabled={saving} className="inline-flex items-center gap-1 text-xs font-semibold text-aw-muted hover:text-aw-text disabled:opacity-50">
            <RotateCcw className="w-3.5 h-3.5" /> Revenir au texte d’origine
          </button>
        ) : <span />}
        <div className="flex items-center gap-2">
          <button type="button" onClick={onCancel} className="btn-outline text-sm px-3 py-1.5">Annuler</button>
          <button
            type="button"
            onClick={onSave}
            disabled={!changed || over || saving}
            className="btn-primary text-sm px-3 py-1.5 inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
