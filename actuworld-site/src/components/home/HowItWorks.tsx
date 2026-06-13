import { useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Link2, ShieldCheck, Star, Users, CheckCircle2, AlertCircle } from "lucide-react";
import phoneImg from "../../assets/phone_img_normalized.jpg";
import { Section } from "../Section";
import { H2 } from "../H2";
import { SectionKicker } from "./SectionKicker";
import { useLanguage } from "../../i18n/LanguageContext";

/* ───── Visuel piloté par l'étape active ───── */
const HowVisual: React.FC<{ active: number }> = ({ active }) => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: 320,
        maxWidth: "100%",
        aspectRatio: "4 / 5",
        borderRadius: 24,
        backgroundColor: "#0D1410",
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
      }}
    >
      {/* Image de fond commune */}
      <img src={phoneImg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/55" />

      {/* Filet de confiance (se remplit à l'étape 3) */}
      <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-white/15 overflow-hidden flex flex-col justify-end">
        <motion.div
          animate={{ height: active >= 2 ? "82%" : active >= 1 ? "55%" : "20%" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ backgroundColor: active >= 2 ? "#16a34a" : "#f59e0b" }}
        />
      </div>

      <AnimatePresence>
        {/* ── Étape 1 : Source visible ── */}
        {active === 0 && (
          <motion.div
            key="src"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center"
          >
            <motion.span
              className="inline-flex items-center gap-2 rounded-full bg-black/60 backdrop-blur px-4 py-2 text-white font-semibold"
              animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 0 0 rgba(16,185,129,0)", "0 0 0 8px rgba(16,185,129,0.18)", "0 0 0 0 rgba(16,185,129,0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Link2 className="w-4 h-4 text-[#A8D5BA]" /> Nature.com
            </motion.span>
            <p className="text-white/80 text-sm max-w-[14rem]">
              {t("Chaque post pointe vers une source consultable.", "Every post links to a source you can check.")}
            </p>
          </motion.div>
        )}

        {/* ── Étape 2 : ASV vérifie ── */}
        {active === 1 && (
          <motion.div
            key="asv"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
            >
              <svg width={84} height={92} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill="#10b981" fillOpacity={0.9} />
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke="rgba(255,255,255,0.6)" strokeWidth={1} fill="none" />
              </svg>
              <span className="absolute text-white font-black text-2xl" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>8</span>
            </motion.div>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.12 }}>
                  <Star className="w-5 h-5" style={{ color: "#10b981", fill: "#10b981" }} />
                </motion.span>
              ))}
            </div>
            <p className="text-white/85 text-sm font-medium inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10b981]" /> {t("Cohérence source ↔ contenu", "Source ↔ content match")}
            </p>
          </motion.div>
        )}

        {/* ── Étape 3 : Jugement communautaire ── */}
        {active === 2 && (
          <motion.div
            key="vote"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6"
          >
            <div className="w-full max-w-[15rem]">
              <p className="text-white/60 text-[11px] font-semibold text-center mb-2">
                {t("Cette info te paraît…", "Does this look…")}
              </p>
              <div className="flex items-center rounded-xl border border-white/15 bg-white/5 overflow-hidden h-10">
                <div className="flex-1 h-full flex items-center justify-center gap-1.5 text-[#ef4444]">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">{t("Douteuse", "Doubtful")}</span>
                </div>
                <div className="w-px h-5 bg-white/15" />
                <motion.div
                  className="flex-1 h-full flex items-center justify-center gap-1.5 text-[#A8D5BA]"
                  animate={{ backgroundColor: ["rgba(16,185,129,0)", "rgba(16,185,129,0.18)", "rgba(16,185,129,0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wide">{t("Fiable", "Reliable")}</span>
                </motion.div>
              </div>
              <p className="text-white/40 text-[10px] text-right mt-1.5">1 248 {t("votes", "votes")}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-white text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-[#A8D5BA]" /> {t("Score de confiance", "Trust score")}
              <span className="text-[#16a34a] font-black">82</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HowItWorks: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [active, setActive] = useState(0);

  // Pilotage déterministe du visuel sticky par la progression de scroll
  const stepsRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ["start center", "end center"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(2, Math.max(0, Math.floor(v * 3)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const steps = [
    {
      icon: Link2,
      title: t("Une source, toujours visible", "A source, always visible"),
      desc: t(
        "Pas de source, pas de publication. Chaque post s'appuie sur un lien consultable par tous : la preuve précède la parole.",
        "No source, no post. Every publication is backed by a link anyone can check: proof comes before speech."
      ),
    },
    {
      icon: ShieldCheck,
      title: t("ASV vérifie la cohérence", "ASV checks consistency"),
      desc: t(
        "ActuWorld Source Verification analyse la cohérence entre la source et le contenu, détecte le cherry-picking et attribue un score de fiabilité.",
        "ActuWorld Source Verification analyzes source-content consistency, detects cherry-picking and assigns a reliability score."
      ),
    },
    {
      icon: Users,
      title: t("La communauté éclaire", "The community weighs in"),
      desc: t(
        "Les lecteurs votent : fiable ou douteux. Le score de confiance évolue en transparence — visible par tous, manipulable par personne.",
        "Readers vote: reliable or doubtful. The trust score evolves transparently — visible to all, gameable by none."
      ),
    },
  ];

  return (
    <Section id="how" className="py-24 relative">
      <div className="flex flex-col items-center text-center mb-12 lg:mb-20">
        <SectionKicker number="02" label={t("Comment ça marche", "How it works")} center className="mb-5" />
        <H2 center>
          {isEnglish ? <>From a claim to <span className="gradient-text">verified trust</span></> : <>De l'affirmation à <span className="gradient-text">la confiance prouvée</span></>}
        </H2>
        <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
          {t("Trois étapes, un seul principe : montrer d'où vient l'info avant d'y croire.", "Three steps, one principle: show where the info comes from before believing it.")}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 max-w-5xl mx-auto">
        {/* Visuel sticky (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-28">
            <HowVisual active={active} />
          </div>
        </div>

        {/* Étapes */}
        <div ref={stepsRef}>
          {steps.map((s, i) => (
            <motion.div
              key={i}
              data-step={i}
              className="lg:min-h-[58vh] flex flex-col justify-center py-8 lg:py-0"
            >
              <div className="flex items-center gap-4 mb-4">
                <span
                  className="flex items-center justify-center w-12 h-12 rounded-2xl text-white shrink-0 transition-all"
                  style={{
                    background: active === i
                      ? "linear-gradient(135deg, var(--aw-primary), var(--aw-accent))"
                      : "var(--aw-surface)",
                    color: active === i ? "#fff" : "var(--aw-text-muted)",
                  }}
                >
                  <s.icon className="w-6 h-6" />
                </span>
                <span className="text-5xl font-black tabular-nums text-aw-primary/15" style={{ fontFamily: '"Platypi", serif' }}>
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3">{s.title}</h3>
              <p className="text-aw-muted text-lg leading-relaxed max-w-md">{s.desc}</p>

              {/* Visuel inline (mobile) */}
              <div className="lg:hidden mt-8">
                <HowVisual active={i} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
};
