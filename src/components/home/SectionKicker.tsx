interface SectionKickerProps {
  /** Numéro d'étape, ex. "01" */
  number: string;
  /** Libellé, ex. "Le constat" */
  label: string;
  center?: boolean;
  /** "light" : version claire pour fond sombre */
  tone?: "default" | "light";
  className?: string;
}

/**
 * Étiquette de section numérotée pour le récit de la page d'accueil
 * (01 · Le constat, 02 · La solution, …).
 */
export const SectionKicker: React.FC<SectionKickerProps> = ({
  number,
  label,
  center = false,
  tone = "default",
  className = "",
}) => {
  const light = tone === "light";
  return (
    <div
      className={`inline-flex items-center gap-3 ${center ? "justify-center" : ""} ${className}`}
    >
      <span
        className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold tabular-nums ${
          light ? "border-white/40 text-white bg-white/10" : "border-aw text-aw-primary bg-aw-bg/40"
        }`}
      >
        {number}
      </span>
      <span className={`overline ${light ? "text-white/80" : "text-aw-primary"}`}>{label}</span>
      <span
        className={`h-px w-8 bg-gradient-to-r to-transparent ${light ? "from-white/50" : "from-aw-primary/40"}`}
        aria-hidden="true"
      />
    </div>
  );
};
