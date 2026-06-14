import { motion } from "framer-motion";
import { MoreHorizontal, Clock, Star, ChevronLeft } from "lucide-react";
import phoneImg from "../../assets/phone_img_opt.webp";
import { useLanguage } from "../../i18n/LanguageContext";

/**
 * Aperçu du fil ActuWorld pour le hero : reproduction fidèle du vrai post
 * (VisualFeedCard de l'app) au premier plan, avec deux posts en éventail
 * derrière pour suggérer le fil et la diversité des scores.
 */

const Shield: React.FC<{ score: number; color: string; size?: number }> = ({
  score,
  color,
  size = 26,
}) => (
  <div className="relative flex items-center justify-center">
    <svg width={size} height={size * 1.1} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        fill={color}
        fillOpacity={0.9}
      />
      <path
        d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth={1}
        fill="none"
      />
    </svg>
    <span
      className="absolute font-black text-white"
      style={{ fontSize: size * 0.35, textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
    >
      {score}
    </span>
  </div>
);

/* ───── Carte d'arrière-plan (post secondaire, simplifié) ───── */
const BackCard: React.FC<{
  gradient: string;
  trustScore: number;
  trustColor: string;
  category: string;
  title: string;
}> = ({ gradient, trustScore, trustColor, category, title }) => (
  <div
    className="absolute inset-0 overflow-hidden"
    style={{ borderRadius: 22, backgroundColor: "#111", boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
  >
    <div className="absolute inset-0" style={{ background: gradient }} />
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15), transparent 40%, rgba(0,0,0,0.85))" }}
    />
    {/* Filet de confiance */}
    <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-white/15 overflow-hidden flex flex-col justify-end">
      <div style={{ height: `${trustScore}%`, backgroundColor: trustColor }} />
    </div>
    {/* Badge score */}
    <div
      className="absolute left-1.5 top-3 min-w-[26px] h-6 px-1 rounded-[7px] border flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.25)", borderColor: trustColor }}
    >
      <span className="text-[12px] font-black leading-none" style={{ color: trustColor }}>
        {trustScore}
      </span>
    </div>
    {/* Catégorie + titre */}
    <div className="absolute bottom-0 left-0 right-0 px-5 pb-5">
      <span className="text-white/60 text-[10px] font-semibold uppercase tracking-wider">{category}</span>
      <h4
        className="text-white font-black leading-tight mt-1"
        style={{ fontFamily: '"Platypi", Georgia, serif', fontSize: 18, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
      >
        {title}
      </h4>
    </div>
  </div>
);

export const HeroPostCard: React.FC<{ float?: boolean; compact?: boolean }> = ({ float = true, compact = false }) => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <div className="relative">
      {/* Halo d'ambiance */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[2.5rem] opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(55% 55% at 70% 15%, color-mix(in srgb, var(--aw-accent) 35%, transparent), transparent 70%), radial-gradient(45% 45% at 25% 90%, color-mix(in srgb, var(--aw-secondary) 45%, transparent), transparent 70%)",
        }}
      />

      <motion.div
        animate={float ? { y: [0, -10, 0] } : undefined}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative mx-auto"
        style={{ width: 340, maxWidth: "100%", aspectRatio: "3 / 4" }}
      >
        {/* ── Post en éventail (arrière, gauche) ── */}
        <motion.div
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: compact ? -5 : -7, x: compact ? -14 : -26, y: compact ? 9 : 14 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          className="absolute inset-0 origin-bottom"
          style={{ zIndex: 10 }}
        >
          <BackCard
            gradient="linear-gradient(150deg, #1B3528, #2E5F4A 60%, #0d2a1e)"
            trustScore={68}
            trustColor="#f59e0b"
            category={t("Société", "Society")}
            title={t("Ce que disent vraiment les chiffres du climat", "What the climate figures really say")}
          />
        </motion.div>

        {/* ── Post en éventail (arrière, droite) ── */}
        <motion.div
          initial={{ opacity: 0, rotate: 0, x: 0, y: 0 }}
          animate={{ opacity: 1, rotate: compact ? 5 : 6, x: compact ? 12 : 22, y: compact ? 6 : 8 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="absolute inset-0 origin-bottom"
          style={{ zIndex: 20 }}
        >
          <BackCard
            gradient="linear-gradient(150deg, #0b3b39, #00A896 65%, #064a45)"
            trustScore={91}
            trustColor="#16a34a"
            category={t("Tech", "Tech")}
            title={t("L'IA open-source rattrape les géants", "Open-source AI catches up with the giants")}
          />
        </motion.div>

        {/* ───── Post principal (premier plan, fidèle à l'app) ───── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            zIndex: 30,
            borderRadius: 22,
            backgroundColor: "#111",
            boxShadow: "0 18px 50px rgba(0,0,0,0.32)",
          }}
        >
          {/* Image */}
          <img src={phoneImg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />

          {/* Dégradé */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 20%, transparent 45%, rgba(0,0,0,0.88) 100%)",
            }}
          />

          {/* Filet de confiance vertical (gauche) */}
          <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-white/15 overflow-hidden flex flex-col justify-end">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: "82%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
              style={{ backgroundColor: "#16a34a", borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
            />
          </div>

          {/* Badge de score (haut-gauche) */}
          <div
            className="absolute left-1.5 top-3 min-w-[26px] h-6 px-1 rounded-[7px] border flex items-center justify-center"
            style={{ backgroundColor: "rgba(22,163,74,0.12)", borderColor: "rgba(22,163,74,0.55)" }}
          >
            <span className="text-[12px] font-black leading-none" style={{ color: "#16a34a" }}>
              82
            </span>
          </div>

          {/* Colonne haut-droite : menu + bouclier + étoiles */}
          <div className="absolute right-3 top-3 flex flex-col items-center gap-2">
            <div className="w-[34px] h-[34px] rounded-full bg-black/35 flex items-center justify-center">
              <MoreHorizontal className="w-[18px] h-[18px] text-white" />
            </div>
            <div className="flex flex-col items-center gap-0.5 px-[3px] py-[3px] rounded-lg bg-black/20">
              <Shield score={8} color="#10b981" />
              <div className="flex">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-[10px] h-[10px]"
                    style={{
                      color: i < 3 ? "#10b981" : "rgba(255,255,255,0.35)",
                      fill: i < 3 ? "#10b981" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Indice de swipe */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60">
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          </div>

          {/* Bas de carte */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-6">
            <h3
              className="text-white font-black leading-tight"
              style={{
                fontFamily: '"Platypi", Georgia, serif',
                fontSize: 22,
                letterSpacing: "-0.2px",
                textShadow: "0 2px 10px rgba(0,0,0,0.7)",
              }}
            >
              {t("Les cascades cachées de la Réunion", "The hidden waterfalls of Réunion Island")}
            </h3>
            <p
              className="text-white/90 mt-1.5 text-sm leading-snug"
              style={{ textShadow: "0 1px 5px rgba(0,0,0,0.5)" }}
            >
              {t("Au cœur des cirques, des chutes d'eau que peu de randonneurs connaissent.", "Deep in the cirques, waterfalls few hikers ever reach.")}
            </p>

            <div className="mt-3 pt-2 flex items-center justify-between border-t border-white/20">
              <div className="flex items-center gap-2">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, #2E5F4A, #10b981)" }}
                >
                  C
                </span>
                <div className="leading-tight">
                  <div className="text-white text-[11px] font-bold tracking-wide">CAMILLE R.</div>
                  <div className="text-white/55 text-[9.5px] font-semibold tracking-wide">
                    {t("Journaliste · Sciences", "Journalist · Science")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-white/55">
                <Clock className="w-3 h-3" />
                <span className="text-[11px]">{t("il y a 2 h", "2 h ago")}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
