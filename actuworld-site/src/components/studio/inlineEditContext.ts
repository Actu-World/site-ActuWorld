import { createContext, useContext } from 'react';

// Contexte du mode retouche (page Rédaction), partagé par les aperçus et le panneau.

export type InlineEditApi = {
  /** Mode retouche activé. */
  active: boolean;
  /** Ce champ a-t-il une retouche enregistrée ? */
  isEdited: (path: string) => boolean;
  /** Ouvre le panneau sur ce champ (valeur affichée actuellement). */
  open: (path: string, label: string, value: string) => void;
  /** Texte à afficher : la saisie en cours si ce champ est ouvert, sinon la valeur. */
  textFor: (path: string, value: string) => string;
  /** Champ ouvert dans le panneau. */
  openPath: string | null;
};

export const InlineEditContext = createContext<InlineEditApi | null>(null);

/** Texte affiché dans l'aperçu (saisie en direct si le champ est en cours d'édition). */
export function useEditText() {
  const ctx = useContext(InlineEditContext);
  return (path: string, value: string) => (ctx ? ctx.textFor(path, value) : value);
}

/** Évite que les raccourcis de l'aperçu (← → Échap) réagissent pendant la saisie. */
export const isTyping = (e: Event) => {
  const el = e.target as HTMLElement | null;
  return !!el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable);
};

export type EditDraft = {
  path: string;
  label: string;
  /** Valeur au moment de l'ouverture (affichée, retouches comprises). */
  initial: string;
  value: string;
  limit: number;
  /** Une retouche est déjà enregistrée sur ce champ. */
  edited: boolean;
};

