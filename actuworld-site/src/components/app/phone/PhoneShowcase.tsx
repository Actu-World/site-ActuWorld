import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { PhoneMockup, type PhoneScreen } from "./PhoneMockup";
import { useLanguage } from "../../../i18n/LanguageContext";

type Step = { screen: PhoneScreen; gesture: "swipe" | "tap" | "tap-source" | null; ms: number; hint: number };

/*
 * Démonstration animée : recto → balayage vers le verso → tap sur une source
 * (navigateur intégré) → tap sur le badge ASV → fiche ASV → retour. Repli statique avec boutons si l'utilisateur
 * a demandé moins d'animations.
 */
const SEQUENCE: Step[] = [
  { screen: "front", gesture: null, ms: 2800, hint: 0 },
  { screen: "front", gesture: "swipe", ms: 300, hint: 1 },
  { screen: "back", gesture: "swipe", ms: 700, hint: 1 },
  { screen: "back", gesture: null, ms: 2400, hint: 1 },
  { screen: "back", gesture: "tap-source", ms: 550, hint: 2 },
  { screen: "source", gesture: "tap-source", ms: 350, hint: 2 },
  { screen: "source", gesture: null, ms: 3000, hint: 2 },
  { screen: "back", gesture: null, ms: 1200, hint: 3 },
  { screen: "back", gesture: "tap", ms: 550, hint: 3 },
  { screen: "asv", gesture: "tap", ms: 350, hint: 3 },
  { screen: "asv", gesture: null, ms: 3800, hint: 3 },
  { screen: "back", gesture: null, ms: 700, hint: 3 },
  { screen: "front", gesture: null, ms: 600, hint: 0 },
];

export const PhoneShowcase: React.FC<{ width?: number }> = ({ width = 300 }) => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const reduce = useReducedMotion();

  const hints = [
    t("La dépêche, telle qu'elle apparaît dans La Une.", "The dispatch, as it appears on the Front page."),
    t("En glissant : les sources citées et ton vote Fiable ou Douteuse.", "Swipe: the cited sources and your Reliable or Doubtful vote."),
    t("Chaque source s'ouvre : tu lis le texte d'origine et tu te fais ton avis.", "Every source opens: read the original and make up your own mind."),
    t("En touchant le badge ASV : le détail de l'analyse des sources.", "Tap the ASV badge: the full source analysis."),
  ];

  /* ── Mode animé ── */
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  // Pas d'animation hors écran ni onglet masqué
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (reduce || paused || !visible) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % SEQUENCE.length), SEQUENCE[step].ms);
    return () => window.clearTimeout(id);
  }, [step, paused, visible, reduce]);

  /* ── Repli statique (mouvement réduit) ── */
  const [manual, setManual] = useState<PhoneScreen>("front");
  if (reduce) {
    const views: { id: PhoneScreen; label: string; hint: number }[] = [
      { id: "front", label: t("La dépêche", "The dispatch"), hint: 0 },
      { id: "back", label: t("Sources et vote", "Sources & vote"), hint: 1 },
      { id: "source", label: t("Source", "Source"), hint: 2 },
      { id: "asv", label: t("Fiche ASV", "ASV sheet"), hint: 3 },
    ];
    return (
      <div className="flex flex-col items-center">
        <PhoneMockup screen={manual} width={width} />
        <div role="group" aria-label={t("Vue de la maquette", "Mockup view")} className="mt-6 flex rounded-xl border border-aw p-1 bg-aw-bg">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setManual(v.id)}
              aria-pressed={manual === v.id}
              className={`px-3 py-1.5 text-sm font-semibold rounded-lg whitespace-nowrap ${
                manual === v.id ? "bg-aw-primary text-on-primary" : "text-aw-muted hover:text-aw-text"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="mt-3 caption text-aw-muted text-center max-w-[18rem] min-h-[2.25rem]">{hints[views.find((v) => v.id === manual)!.hint]}</p>
      </div>
    );
  }

  const current = SEQUENCE[step];
  return (
    <div ref={ref} className="flex flex-col items-center">
      <PhoneMockup
        screen={current.screen}
        gesture={current.gesture}
        animated
        width={width}
        label={t(
          "Démonstration animée de l'app : une dépêche, ses sources et son vote, puis la fiche ASV",
          "Animated app demo: a dispatch, its sources and vote, then the ASV sheet"
        )}
      />
      <div className="mt-6 flex items-center gap-3">
        <div className="flex gap-1.5" aria-hidden="true">
          {hints.map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full transition-[width,background-color] duration-300"
              style={{ width: current.hint === i ? 22 : 6, background: current.hint === i ? "var(--aw-primary)" : "var(--aw-border-strong)" }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="w-8 h-8 rounded-lg border border-aw flex items-center justify-center text-aw-muted hover:text-aw-text hover:border-aw-strong"
          aria-label={paused ? t("Reprendre l'animation", "Resume animation") : t("Mettre l'animation en pause", "Pause animation")}
        >
          {paused ? <Play className="w-3.5 h-3.5" aria-hidden="true" /> : <Pause className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>
      </div>
      <p className="mt-3 caption text-aw-muted text-center max-w-[18rem] min-h-[2.25rem]">{hints[current.hint]}</p>
    </div>
  );
};
