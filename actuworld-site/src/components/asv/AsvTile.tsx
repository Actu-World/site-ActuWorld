import React from "react";

/** Remplissage de la jauge, comme dans l'app (asvState.ts) :
 *  plein / moitié / pointillés / rail vide (rien de jugé) / traits qui chargent. */
export type AsvTileFill = "full" | "half" | "outline" | "none" | "pending";

const FOREST = "#2E5F4A";
const CREAM = "#F5E9DA";
const TICKS = 5;

/**
 * Tuile ASV, copie web de `AsvTuile` (app, components/feed/asv/AsvVariants.tsx) :
 * mot « ASV » en Platypi ExtraBold + jauge monochrome sous le mot.
 * `solid` = tuile pleine (fond vert Forêt, encre crème), comme `AsvTuileSolid`.
 * Couleur par défaut : `--app-asv` (maquette téléphone), sinon `--asv-tile`.
 */
export const AsvTile: React.FC<{
  size?: number;
  onDark?: boolean;
  fill?: AsvTileFill;
  solid?: boolean;
}> = ({ size = 22, onDark = false, fill = "full", solid = false }) => {
  const color = solid ? CREAM : onDark ? CREAM : "var(--app-asv, var(--asv-tile))";
  const fs = size * 0.58;
  const gw = fs * 2;
  const pct = fill === "full" ? 100 : fill === "half" ? 50 : 0;
  const seg = (gw - 2 * (TICKS - 1)) / TICKS;
  return (
    <span
      className={`inline-flex flex-col items-center shrink-0 ${fill === "pending" ? "animate-pulse" : ""}`}
      style={{
        gap: 2,
        padding: "3px 8px 4px",
        borderRadius: size * 0.36,
        border: solid ? "1.4px solid transparent" : `1.4px ${fill === "outline" ? "dashed" : "solid"} ${color}`,
        background: solid ? FOREST : onDark ? "rgba(0,0,0,0.28)" : "transparent",
      }}
    >
      <span style={{ fontFamily: "Platypi, serif", fontWeight: 800, fontSize: fs, letterSpacing: 1.2, color, lineHeight: 1 }}>
        ASV
      </span>
      {fill === "pending" ? (
        <span className="flex items-center" style={{ width: gw, height: 4, gap: 2 }}>
          {Array.from({ length: TICKS }, (_, i) => (
            <span
              key={i}
              className="block asv-tick"
              style={{ width: seg, height: 2, background: color, animationDelay: `${i * 130}ms` }}
            />
          ))}
        </span>
      ) : (
        <span className="relative block" style={{ width: gw, height: 4 }}>
          <span className="absolute left-0 right-0 rounded-full" style={{ top: 1, height: 2, background: color, opacity: solid ? 0.4 : 0.32 }} />
          <span
            className="absolute left-0 rounded-full"
            style={{ top: 0.7, height: 2.6, width: `${pct}%`, background: color }}
          />
        </span>
      )}
    </span>
  );
};

/**
 * Tuile de la vérification avant publication (Studio), comme `ProCheckTile`
 * dans l'app : contour + jauge pleine, tuile « en analyse », puis tuile pleine
 * (jauge pleine) quand le rapport du brouillon est prêt. Une seule taille
 * partout (lien et fenêtres), comme dans l'app.
 */
export const ProCheckTile: React.FC<{ status: "idle" | "running" | "ready" }> = ({ status }) =>
  status === "ready"
    ? <AsvTile solid fill="full" />
    : <AsvTile fill={status === "running" ? "pending" : "full"} />;
