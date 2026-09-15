import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, X, Check, Tags } from 'lucide-react';
import { STUDIO_THEMES, STUDIO_THEME_BY_KEY } from '../../lib/studio/themes';
import { useLanguage } from '../../i18n/LanguageContext';

// Sélecteur de thématique — pendant web du ThemeSelector de l'app :
// une puce déclencheur colorée (icône dans un carré teinté + libellé + chevron)
// ouvre une feuille avec recherche + liste illustrée. Chaque thème garde sa
// couleur propre (identique à l'app), texte + icône + fond teinté.

// Normalise pour la recherche : minuscules + sans accents.
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

interface Props {
  value: string;
  onChange: (key: string) => void;
  /** Affiche le marqueur « Requis » tant qu'aucun thème n'est choisi (Dépêche). */
  required?: boolean;
  label?: string;
  id?: string;
}

export function ThemeSelect({ value, onChange, required = false, label, id }: Props) {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const shownLabel = label ?? t('Thème principal', 'Main theme');

  const selected = value ? STUDIO_THEME_BY_KEY[value] ?? null : null;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    if (!q) return STUDIO_THEMES;
    return STUDIO_THEMES.filter((th) => {
      const hay = norm(`${th.fr} ${th.en} ${th.descFr} ${th.descEn} ${th.key}`);
      return hay.includes(q);
    });
  }, [query]);

  // Escape ferme la feuille + on verrouille le scroll du corps quand elle est ouverte.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const openSheet = () => { setQuery(''); setOpen(true); };
  const pick = (key: string) => { onChange(key); setOpen(false); };

  return (
    <div>
      <div className="flex items-center mb-2.5">
        <span className="body-semi text-aw-text">{shownLabel}</span>
        {required && !value && (
          <span className="ml-2 caption" style={{ color: '#f59e0b' }}>{t('Requis', 'Required')}</span>
        )}
      </div>

      {/* Déclencheur compact */}
      <button
        type="button"
        id={id}
        onClick={openSheet}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-[14px] border transition-colors text-left"
        style={
          selected
            ? { borderColor: tint(selected.color, 70), backgroundColor: tint(selected.color, 12) }
            : { borderColor: 'var(--aw-border)', backgroundColor: 'transparent' }
        }
      >
        <span
          className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ backgroundColor: selected ? tint(selected.color, 20) : tint('#2E5F4A', 12) }}
        >
          {selected ? (
            <selected.Icon className="w-[18px] h-[18px]" style={{ color: selected.color }} />
          ) : (
            <Tags className="w-[18px] h-[18px] text-aw-primary" />
          )}
        </span>
        <span
          className="flex-1 min-w-0 truncate body-semi"
          style={{ color: selected ? selected.color : 'var(--aw-text-muted)' }}
        >
          {selected ? (isEnglish ? selected.en : selected.fr) : t('Choisir une thématique…', 'Pick a theme…')}
        </span>
        <ChevronDown className="w-[18px] h-[18px] shrink-0" style={{ color: selected ? selected.color : 'var(--aw-text-muted)' }} />
      </button>

      {/* Feuille de sélection */}
      {createPortal(
        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-[60] flex items-end sm:items-center sm:justify-center" role="dialog" aria-modal="true" aria-label={shownLabel}>
              <motion.div
                className="absolute inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.div
                className="relative w-full sm:max-w-lg max-h-[85vh] flex flex-col bg-aw-bg border-t sm:border border-aw rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
                initial={{ y: '100%', opacity: 0.6 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0.6 }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              >
                {/* Poignée mobile */}
                <div className="sm:hidden mx-auto mt-2.5 mb-1 h-1 w-10 rounded-full bg-aw-text/15" aria-hidden />

                <div className="flex items-center gap-3 px-5 pt-4 pb-3">
                  <h3 className="h2 flex-1 text-aw-text">{shownLabel}</h3>
                  <button type="button" onClick={() => setOpen(false)} className="text-aw-muted hover:text-aw-text p-1" aria-label={t('Fermer', 'Close')}>
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Recherche */}
                <div className="px-5 pb-3">
                  <div className="flex items-center gap-2 rounded-lg border border-aw bg-aw-surface px-3 py-2">
                    <Search className="w-4 h-4 text-aw-muted shrink-0" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={t('Rechercher une thématique…', 'Search a theme…')}
                      className="flex-1 bg-transparent text-sm text-aw-text placeholder:text-aw-muted focus:outline-none"
                    />
                    {query.length > 0 && (
                      <button type="button" onClick={() => setQuery('')} className="text-aw-muted hover:text-aw-text" aria-label={t('Effacer', 'Clear')}>
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste illustrée */}
                <div className="flex-1 overflow-y-auto px-3 pb-5 space-y-1.5">
                  {filtered.length === 0 ? (
                    <p className="text-center text-aw-muted text-sm py-8">{t('Aucune thématique trouvée', 'No theme found')}</p>
                  ) : (
                    filtered.map((theme) => {
                      const isSel = theme.key === value;
                      const Icon = theme.Icon;
                      return (
                        <button
                          key={theme.key}
                          type="button"
                          onClick={() => pick(theme.key)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-colors"
                          style={{
                            borderColor: isSel ? tint(theme.color, 60) : 'var(--aw-border)',
                            backgroundColor: isSel ? tint(theme.color, 10) : 'transparent',
                          }}
                        >
                          <span className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: tint(theme.color, 18) }}>
                            <Icon className="w-5 h-5" style={{ color: theme.color }} />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block body-semi truncate" style={{ color: isSel ? theme.color : 'var(--aw-text)' }}>
                              {isEnglish ? theme.en : theme.fr}
                            </span>
                            <span className="block caption text-aw-muted truncate">{isEnglish ? theme.descEn : theme.descFr}</span>
                          </span>
                          {isSel && <Check className="w-5 h-5 shrink-0" style={{ color: theme.color }} />}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
