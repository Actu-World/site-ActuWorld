import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, MessageCircle, Star, Clock,
  MoreHorizontal, MoreVertical, Home, Newspaper, PlusCircle, Search, Globe2,
} from "lucide-react";
import phoneImg from "../../assets/phone_img_opt.webp";
import { useLanguage } from "../../i18n/LanguageContext";

/* Mini bouclier de vérification (score + étoiles) */
const MiniShield: React.FC<{ score: number; color: string; stars: number; dark?: boolean }> = ({
  score, color, stars, dark = true,
}) => (
  <div className="flex flex-col items-center">
    <div className="relative flex items-center justify-center">
      <svg width={18} height={20} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" fill={color} fillOpacity={0.9} />
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" stroke={dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.2)"} strokeWidth={1} fill="none" />
      </svg>
      <span className="absolute text-[6px] font-black text-white" style={{ textShadow: "0 1px 1px rgba(0,0,0,0.4)" }}>{score}</span>
    </div>
    <div className="flex gap-px mt-px">
      {Array.from({ length: 3 }).map((_, i) => (
        <Star key={i} className="w-[6px] h-[6px]" style={{ color: i < stars ? color : "rgba(150,150,150,0.4)", fill: i < stars ? color : "transparent" }} />
      ))}
    </div>
  </div>
);

/* ───── Fil visuel (Home) : carte magazine plein cadre ───── */
const VisualFeedMini: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  return (
    <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden">
      <img src={phoneImg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 45%, rgba(0,0,0,0.9) 100%)" }} />
      {/* Filet de confiance */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/15 overflow-hidden flex flex-col justify-end">
        <div style={{ height: "82%", backgroundColor: "#16a34a" }} />
      </div>
      {/* Badge score */}
      <div className="absolute left-1.5 top-2 px-1 h-4 rounded-[5px] border flex items-center" style={{ backgroundColor: "rgba(22,163,74,0.15)", borderColor: "rgba(22,163,74,0.6)" }}>
        <span className="text-[9px] font-black leading-none" style={{ color: "#16a34a" }}>82</span>
      </div>
      {/* Menu + bouclier */}
      <div className="absolute right-1.5 top-2 flex flex-col items-center gap-1">
        <div className="w-5 h-5 rounded-full bg-black/40 flex items-center justify-center">
          <MoreHorizontal className="w-3 h-3 text-white" />
        </div>
        <MiniShield score={8} color="#10b981" stars={3} />
      </div>
      {/* Bas */}
      <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-2.5">
        <p className="text-white font-black leading-tight text-[12px]" style={{ fontFamily: '"Platypi", Georgia, serif', textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
          {t("Les cascades cachées de la Réunion", "The hidden waterfalls of Réunion Island")}
        </p>
        <div className="mt-1.5 pt-1.5 flex items-center gap-1.5 border-t border-white/20">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ background: "linear-gradient(135deg, #2E5F4A, #10b981)" }}>C</span>
          <div className="leading-none">
            <div className="text-white text-[7px] font-bold tracking-wide">CAMILLE R.</div>
            <div className="text-white/55 text-[6px] font-semibold">{t("Journaliste · Sciences", "Journalist · Science")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───── Journal : carte façon presse ───── */
const JournalMini: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  return (
    <div className="relative flex-1 min-h-0 rounded-2xl bg-aw-bg border border-aw overflow-hidden pl-7 pr-2.5 py-2.5 flex flex-col">
      {/* Rail de confiance (score + barre courte) */}
      <div className="absolute left-1.5 top-2.5 w-5 flex flex-col items-center">
        <div className="px-1 h-4 rounded-[5px] border flex items-center" style={{ backgroundColor: "rgba(22,163,74,0.12)", borderColor: "rgba(22,163,74,0.55)" }}>
          <span className="text-[8px] font-black leading-none" style={{ color: "#16a34a" }}>79</span>
        </div>
        <div className="w-[3px] h-12 mt-1.5 rounded-full overflow-hidden flex flex-col justify-end" style={{ backgroundColor: "rgba(22,163,74,0.15)" }}>
          <div style={{ height: "79%", backgroundColor: "#16a34a" }} />
        </div>
      </div>

      {/* Rubrique + menu */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-[3px] border px-1.5 py-px text-[7px] font-extrabold uppercase tracking-wider text-aw-primary" style={{ borderColor: "color-mix(in srgb, var(--aw-primary) 50%, transparent)", backgroundColor: "color-mix(in srgb, var(--aw-primary) 6%, transparent)" }}>
          {t("Société", "Society")}
        </span>
        <MoreVertical className="w-3 h-3 text-aw-muted" />
      </div>
      <div className="h-px bg-aw my-1.5" />

      {/* Titre éditorial */}
      <h4 className="text-aw-text font-black leading-tight text-[13px] tracking-tight" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
        {t("Ce que disent vraiment les chiffres du climat", "What the climate figures really say")}
      </h4>
      {/* Chapeau */}
      <p className="text-aw-muted italic text-[8.5px] leading-snug mt-1">
        {t("Derrière les moyennes mondiales, des écarts régionaux que l'on oublie souvent.", "Behind global averages, regional gaps we too often forget.")}
      </p>

      {/* Image 3:2 */}
      <div className="mt-2 rounded-lg overflow-hidden aspect-[3/2]">
        <img src={phoneImg} alt="" aria-hidden="true" className="w-full h-full object-cover" />
      </div>

      {/* Byline + bouclier */}
      <div className="mt-2 pt-1.5 flex items-center justify-between border-t border-aw">
        <div className="flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-bold" style={{ background: "linear-gradient(135deg, #2E5F4A, #10b981)" }}>L</span>
          <div className="leading-none">
            <div className="text-aw-text text-[7px] font-bold tracking-wide">LÉA M.</div>
            <div className="text-aw-muted text-[6px] font-semibold">{t("Correspondante", "Correspondent")}</div>
          </div>
        </div>
        <MiniShield score={8} color="#10b981" stars={3} dark={false} />
      </div>

      {/* Footer date + commentaires */}
      <div className="mt-1.5 flex items-center justify-between text-aw-muted">
        <span className="inline-flex items-center gap-0.5 text-[7px]">
          <Clock className="w-2.5 h-2.5" /> {t("il y a 5 h", "5 h ago")}
        </span>
        <MessageCircle className="w-2.5 h-2.5" />
      </div>
      {/* Double filet journal */}
      <div className="mt-1.5 space-y-0.5">
        <div className="h-px bg-aw" />
        <div className="h-[2px] bg-aw/60" />
      </div>
    </div>
  );
};

export const AppPhoneMockup: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const [tab, setTab] = useState<"visual" | "journal">("visual");

  return (
    <div className="relative mx-auto w-72 md:w-80 phone-mockup">
      <motion.div
        className="relative rounded-[3rem] border-8 border-[#1B3528] bg-[#1B3528] shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1B3528] rounded-b-xl z-10" />
        <div className="aspect-[9/19] bg-aw-bg p-3 pt-7 flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-full bg-aw-surface border border-aw" />
            <span className="text-[13px] font-bold text-aw-primary" style={{ fontFamily: '"Platypi", Georgia, serif', letterSpacing: "0.5px" }}>ActuWorld</span>
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Bell className="w-4 h-4 text-aw-primary" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full text-[5px] text-white flex items-center justify-center font-bold">1</div>
              </div>
              <MessageCircle className="w-4 h-4 text-aw-primary" />
            </div>
          </div>

          {/* Contenu (piloté par le bottom nav) */}
          <div className="flex-1 min-h-0 flex flex-col mb-1.5 mt-0.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: tab === "visual" ? -12 : 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: tab === "visual" ? 12 : -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 min-h-0 flex flex-col"
              >
                {tab === "visual" ? <VisualFeedMini /> : <JournalMini />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom nav — pilote l'affichage (La Une / Journal) */}
          <div className="flex items-end justify-around py-1.5 border-t border-aw mt-auto">
            <button onClick={() => setTab("visual")} className="flex flex-col items-center gap-0.5">
              <Home className="w-3.5 h-3.5" style={{ color: tab === "visual" ? "var(--aw-primary)" : "var(--aw-text-muted)" }} fill={tab === "visual" ? "currentColor" : "none"} />
              <span className="text-[5px] font-medium" style={{ color: tab === "visual" ? "var(--aw-primary)" : "var(--aw-text-muted)" }}>{t("La Une", "Front Page")}</span>
            </button>
            <button onClick={() => setTab("journal")} className="flex flex-col items-center gap-0.5">
              <Newspaper className="w-3.5 h-3.5" style={{ color: tab === "journal" ? "var(--aw-primary)" : "var(--aw-text-muted)" }} fill={tab === "journal" ? "currentColor" : "none"} />
              <span className="text-[5px] font-medium" style={{ color: tab === "journal" ? "var(--aw-primary)" : "var(--aw-text-muted)" }}>{t("Journal", "Journal")}</span>
            </button>
            <PlusCircle className="w-5 h-5 text-aw-primary mb-1" />
            <div className="flex flex-col items-center gap-0.5">
              <Search className="w-3.5 h-3.5 text-aw-muted" />
              <span className="text-[5px] text-aw-muted">{t("Découverte", "Discover")}</span>
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <Globe2 className="w-3.5 h-3.5 text-aw-muted" />
              <span className="text-[5px] text-aw-muted">ActuWorld</span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 bg-aw-secondary rounded-full blur-2xl opacity-40" />
      <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-aw-accent rounded-full blur-2xl opacity-30" />
    </div>
  );
};
