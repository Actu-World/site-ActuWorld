import type { ReactNode } from 'react';

// Filets gris façon presse : couleur dérivée du texte du thème (s'adapte
// clair/sombre), avec fondu doux aux extrémités. Les verticaux fondent en
// haut/bas, les horizontaux à gauche/droite : les coins restent « ouverts »,
// comme les encadrés à filets de la presse papier.
const SCOTCH_RULE_COLOR = 'color-mix(in srgb, var(--aw-text) 26%, transparent)';
const SCOTCH_RULE =
  `linear-gradient(180deg, transparent 0, ${SCOTCH_RULE_COLOR} 64px, ${SCOTCH_RULE_COLOR} calc(100% - 64px), transparent 100%)`;
const SCOTCH_RULE_H =
  `linear-gradient(90deg, transparent 0, ${SCOTCH_RULE_COLOR} 64px, ${SCOTCH_RULE_COLOR} calc(100% - 64px), transparent 100%)`;

// « Papier mâché » : grain de papier (bruit SVG inline, aucune ressource
// externe) sur une teinte légèrement décalée du fond — feuille de journal.
const PAPER_NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='linear' slope='0.025'/></feComponentTransfer></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
const PAPER_BACKGROUND = {
  backgroundImage: `${PAPER_NOISE}, linear-gradient(color-mix(in srgb, var(--aw-text) 1.5%, var(--aw-bg)), color-mix(in srgb, var(--aw-text) 1.5%, var(--aw-bg)))`,
} as const;

/**
 * Feuille de journal partagée par les éditeurs du Studio : grain de papier
 * + filets « Scotch rule » (épais + fin, gris, fondu aux extrémités) — le
 * trait vertical classique de la presse papier.
 */
export function PaperSheet({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`relative px-5 sm:px-9 pb-8 pt-5 ${className}`} style={PAPER_BACKGROUND}>
      <div aria-hidden className="absolute inset-y-0 left-0 flex gap-[3px]">
        <div style={{ width: '2.5px', background: SCOTCH_RULE }} />
        <div style={{ width: '1px', background: SCOTCH_RULE }} />
      </div>
      <div aria-hidden className="absolute inset-y-0 right-0 flex gap-[3px]">
        <div style={{ width: '1px', background: SCOTCH_RULE }} />
        <div style={{ width: '2.5px', background: SCOTCH_RULE }} />
      </div>
      <div aria-hidden className="absolute inset-x-0 top-0 flex flex-col gap-[3px]">
        <div style={{ height: '2.5px', background: SCOTCH_RULE_H }} />
        <div style={{ height: '1px', background: SCOTCH_RULE_H }} />
      </div>
      <div aria-hidden className="absolute inset-x-0 bottom-0 flex flex-col gap-[3px]">
        <div style={{ height: '1px', background: SCOTCH_RULE_H }} />
        <div style={{ height: '2.5px', background: SCOTCH_RULE_H }} />
      </div>
      {children}
    </div>
  );
}
