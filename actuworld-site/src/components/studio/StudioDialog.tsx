import { useEffect, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

// LA fenêtre du Studio (20/11/2026, unifiée entre l'article et la dépêche,
// comme dans l'app) : confirmations, vérification des sources, suppression.
// Remplace aussi les `window.confirm` du navigateur. Le `tone` donne la couleur
// de l'icône et de sa pastille, toujours la même pour un même sens.

export type DialogTone = 'default' | 'danger' | 'warning' | 'success';

const TONE_CLASSES: Record<DialogTone, string> = {
  default: 'bg-aw-primary/10 text-aw-primary',
  danger: 'bg-red-500/15 text-red-600 dark:text-red-400',
  warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
};

/** Bouton d'action rouge (suppression), sur la base de btn-primary. */
export const DANGER_BUTTON = 'btn-primary bg-red-600 hover:bg-red-700 text-white';

type StudioDialogProps = {
  open: boolean;
  /** Échap, clic à côté : absent = la fenêtre ne se ferme que par ses boutons. */
  onClose?: () => void;
  title: string;
  icon?: LucideIcon;
  /** À la place de l'icône : un composant du site (ex. la tuile ASV), sans pastille. */
  iconNode?: ReactNode;
  /** Icône qui tourne (analyse en cours). */
  iconSpin?: boolean;
  tone?: DialogTone;
  /** Texte d'explication, sous le titre. */
  description?: ReactNode;
  children?: ReactNode;
  /** Boutons empilés : l'action en haut, « Annuler » en bas. */
  actions?: ReactNode;
};

export function StudioDialog({ open, onClose, title, icon: Icon, iconNode, iconSpin = false, tone = 'default', description, children, actions }: StudioDialogProps) {
  const { isEnglish } = useLanguage();

  useEffect(() => {
    if (!open || !onClose) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="studio-dialog-title">
      {onClose ? (
        <button type="button" className="absolute inset-0 bg-black/50 cursor-default" aria-label={isEnglish ? 'Close' : 'Fermer'} onClick={onClose} />
      ) : (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}
      <div className="card relative w-full max-w-md p-6 space-y-4 text-center">
        {iconNode ? (
          <div className="flex justify-center" aria-hidden="true">{iconNode}</div>
        ) : Icon && (
          <span className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${TONE_CLASSES[tone]}`}>
            <Icon className={`w-6 h-6 ${iconSpin ? 'animate-spin' : ''}`} aria-hidden="true" />
          </span>
        )}
        <h2 id="studio-dialog-title" className="text-xl">{title}</h2>
        {description && <div className="text-sm text-aw-muted">{description}</div>}
        {children}
        {actions && <div className="flex flex-col gap-2">{actions}</div>}
      </div>
    </div>
  );
}
