import type { CSSProperties, ReactNode } from "react";
import {
  Lock, RotateCw,
  CheckCircle2, XCircle, Users, MessageCircle, Share2, Link2, ShieldCheck,
  MessageSquareMore, Flag, HelpCircle, ChevronDown, ChevronRight, Award,
  Bell, MessagesSquare, Newspaper, MoreHorizontal, GraduationCap,
} from "lucide-react";
import coverImg from "../../../assets/phone_img_opt.webp";
import sourcePageImg from "../../../assets/source_parc_national.webp";
import homeSvg from "./icons/HomeIconR.svg?raw";
import addSvg from "./icons/AddIcon.svg?raw";
import searchSvg from "./icons/SearchIcon.svg?raw";
import earthSvg from "./icons/EarthIcon.svg?raw";
import { useLanguage } from "../../../i18n/LanguageContext";

/*
 * Reproduction fidèle de l'écran « La Une » de l'app (valeurs reprises de
 * VisualFeedCard.tsx, HeaderBar.tsx, (tabs)/_layout.tsx, VerificationBadge.tsx).
 * Dessiné à la taille réelle d'un iPhone (390 × 844) puis mis à l'échelle,
 * pour garder les proportions exactes de l'app.
 */

export type PhoneScreen = "front" | "back" | "asv" | "source";
export type PhoneFocus = "sources" | "vote";

/* Halo de mise en évidence d'une zone de la carte */
const focusStyle = (on: boolean): CSSProperties =>
  on ? { outline: "2.5px solid #A8D5BA", outlineOffset: 6, borderRadius: 12, boxShadow: "0 0 0 10px rgba(168,213,186,0.12)" } : {};

const W = 390;
const H = 844;
const BEZEL = 12;
const STATUS_H = 47;
const TAB_H = 83;
const CARD_W = W - 32;
const CARD_H = 535;
const NB = " ";

/* ───── Couleurs de confiance (utils/trust.ts) ───── */
const trustColor = (s: number) => (s >= 70 ? "#16a34a" : s >= 40 ? "#f59e0b" : "#ef4444");
const sourceScoreColor = (s: number) => (s >= 7 ? "#10b981" : s >= 4 ? "#f59e0b" : "#ef4444");

/* ───── Tuile ASV (asv/AsvVariants.tsx, AsvTuile) ───── */
export const AsvTile: React.FC<{ size?: number; onDark?: boolean; fill?: "full" | "half" | "outline" }> = ({
  size = 22,
  onDark = false,
  fill = "full",
}) => {
  const color = onDark ? "#F5E9DA" : "var(--app-asv)";
  const fs = size * 0.58;
  const gw = fs * 2;
  return (
    <span
      className="inline-flex flex-col items-center shrink-0"
      style={{
        gap: 2,
        padding: "3px 8px 4px",
        borderRadius: size * 0.36,
        border: `1.4px ${fill === "outline" ? "dashed" : "solid"} ${color}`,
        background: onDark ? "rgba(0,0,0,0.28)" : "transparent",
      }}
    >
      <span style={{ fontFamily: "Platypi, serif", fontWeight: 800, fontSize: fs, letterSpacing: 1.2, color, lineHeight: 1 }}>
        ASV
      </span>
      <span className="relative block" style={{ width: gw, height: 4 }}>
        <span className="absolute left-0 right-0 rounded-full" style={{ top: 1, height: 2, background: color, opacity: 0.32 }} />
        <span
          className="absolute left-0 rounded-full"
          style={{ top: 0.7, height: 2.6, width: fill === "full" ? "100%" : fill === "half" ? "50%" : 0, background: color }}
        />
      </span>
    </span>
  );
};

/* ───── Icône SVG de l'app (currentColor) ───── */
const RawIcon: React.FC<{ svg: string; size: number; color: string }> = ({ svg, size, color }) => (
  <span
    className="inline-flex [&>svg]:w-full [&>svg]:h-full"
    style={{ width: size, height: size, color }}
    dangerouslySetInnerHTML={{ __html: svg }}
  />
);

/* ───── Barre d'état iOS ───── */
const StatusBar: React.FC<{ light?: boolean }> = ({ light }) => {
  const c = light ? "#fff" : "var(--app-text)";
  return (
    <div className="flex items-end justify-between px-8 pb-2" style={{ height: STATUS_H, color: c }}>
      <span style={{ fontSize: 16, fontWeight: 600 }}>9:41</span>
      <span className="flex items-center gap-1.5">
        <span className="flex items-end gap-[2px]">
          {[5, 7, 9, 11].map((h) => (
            <i key={h} className="block rounded-[1px]" style={{ width: 3, height: h, background: c }} />
          ))}
        </span>
        <span className="block rounded-[4px] p-[2px]" style={{ width: 25, height: 12, border: `1.3px solid ${c}` }}>
          <i className="block h-full rounded-[1px]" style={{ width: "75%", background: c }} />
        </span>
      </span>
    </div>
  );
};

/* ───── En-tête (feed/HeaderBar.tsx) ───── */
const HeaderBar: React.FC = () => (
  <div style={{ background: "var(--app-bg)", paddingTop: 8, paddingBottom: 10, borderBottom: "0.5px solid var(--app-border)" }}>
    <div className="flex items-center" style={{ paddingInline: 16 }}>
      <div style={{ width: 44 }}>
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{ width: 40, height: 40, borderRadius: 10, background: "var(--app-surface)", border: "0.5px solid var(--app-border)" }}
        >
          <span className="block overflow-hidden" style={{ width: 36, height: 36, borderRadius: 9 }}><img src="/logo.svg" alt="" className="block w-full h-full object-cover" /></span>
        </div>
      </div>
      <div className="flex-1 text-center" style={{ fontFamily: "Platypi, serif", fontWeight: 800, fontSize: 28, lineHeight: "38px", color: "var(--app-primary)" }}>
        ActuWorld
      </div>
      <div className="flex items-center" style={{ gap: 8 }}>
        {[Bell, MessagesSquare].map((Icon, i) => (
          <span
            key={i}
            className="relative flex items-center justify-center"
            style={{ width: 34, height: 34, borderRadius: 999, background: "var(--app-surface)", border: "0.5px solid var(--app-border)" }}
          >
            <Icon style={{ width: 20, height: 20, color: "var(--app-primary)" }} strokeWidth={1.8} />
            {i === 0 && (
              <span
                className="absolute flex items-center justify-center"
                style={{ top: -5, right: -5, minWidth: 18, height: 18, borderRadius: 9, paddingInline: 4, background: "var(--app-primary)", border: "1px solid var(--app-bg)", color: "var(--app-on-primary)", fontSize: 10, fontWeight: 700 }}
              >
                3
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  </div>
);

/* ───── Barre d'onglets ((tabs)/_layout.tsx) ───── */
const TabBar: React.FC<{ t: (fr: string, en: string) => string }> = ({ t }) => {
  const inactive = "var(--app-tab-inactive)";
  const tabs: { label: string; icon: ReactNode; active?: boolean }[] = [
    { label: t("La Une", "Front page"), icon: <RawIcon svg={homeSvg} size={26} color="var(--app-primary)" />, active: true },
    { label: t("Articles", "Articles"), icon: <Newspaper style={{ width: 24, height: 24, color: inactive }} strokeWidth={1.7} /> },
    { label: "", icon: <RawIcon svg={addSvg} size={26} color={inactive} /> },
    { label: t("Découverte", "Discover"), icon: <RawIcon svg={searchSvg} size={24} color={inactive} /> },
    { label: "ActuWorld", icon: <RawIcon svg={earthSvg} size={26} color={inactive} /> },
  ];
  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex justify-around"
      style={{ height: TAB_H, paddingTop: 8, paddingBottom: 26, background: "var(--app-bg)", borderTop: "0.5px solid var(--app-border)" }}
    >
      {tabs.map((tab, i) => (
        <span key={i} className="flex flex-col items-center justify-start" style={{ width: 70, gap: 3 }}>
          <span className="flex items-center justify-center" style={{ height: 28 }}>{tab.icon}</span>
          {tab.label && (
            <span style={{ fontSize: 12, fontWeight: 600, color: tab.active ? "var(--app-primary)" : inactive }}>{tab.label}</span>
          )}
        </span>
      ))}
    </div>
  );
};

/* ───── Éléments communs de la carte ───── */
const TrustStrip: React.FC<{ score: number }> = ({ score }) => (
  <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-end" style={{ width: 5, background: "rgba(255,255,255,0.15)" }}>
    <div
      style={{
        height: `${Math.max(score, 6)}%`,
        background: trustColor(score),
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        transition: "height 0.9s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s ease",
      }}
    />
  </div>
);

const Segments: React.FC<{ active: number; count?: number }> = ({ active, count = 2 }) => (
  <div className="absolute left-0 right-0 flex justify-center" style={{ top: 6, gap: 5, paddingInline: 40 }}>
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} className="flex-1" style={{ maxWidth: 34, height: 3, borderRadius: 1, background: i === active ? "#FAF4EB" : "rgba(255,255,255,0.3)" }} />
    ))}
  </div>
);

const MenuBtn = () => (
  <span className="absolute flex items-center justify-center" style={{ right: 12, top: 12, width: 34, height: 34 }}>
    <MoreHorizontal style={{ width: 18, height: 18, color: "#fff" }} strokeWidth={2.4} />
  </span>
);

const cardShell: CSSProperties = {
  width: CARD_W,
  height: CARD_H,
  borderRadius: 22,
  overflow: "hidden",
  position: "relative",
  background: "#111",
  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
};

/* ───── Recto de la carte (renderCover) ───── */
const CardFront: React.FC<{ t: (fr: string, en: string) => string; score: number }> = ({ t, score }) => (
  <div style={cardShell}>
    <img src={coverImg} alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div
      className="absolute inset-0"
      style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 22%, transparent 50%, rgba(0,0,0,0.9) 100%)" }}
    />
    <TrustStrip score={score} />
    <Segments active={0} />
    <div className="absolute flex items-center flex-wrap" style={{ top: 12, paddingLeft: 12, paddingRight: 64, gap: 6, minHeight: 34 }}>
      <span
        className="flex items-center justify-center"
        style={{ minWidth: 26, height: 24, borderRadius: 8, paddingInline: 6, background: "rgba(0,0,0,0.5)", color: trustColor(score), fontSize: 12, fontWeight: 900, letterSpacing: -0.3 }}
      >
        {score}
      </span>
      <span
        className="flex items-center"
        style={{ gap: 4, borderRadius: 8, padding: "3px 8px", background: "#A8D5BA", color: "#1B3528", fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}
      >
        <GraduationCap style={{ width: 11, height: 11 }} />
        {t("Exemple", "Sample")}
      </span>
      {[t("Nature", "Nature"), t("La Réunion", "Réunion")].map((tag) => (
        <span
          key={tag}
          style={{ borderRadius: 8, padding: "3px 8px", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 9.5, fontWeight: 800, letterSpacing: 0.8, textTransform: "uppercase" }}
        >
          {tag}
        </span>
      ))}
    </div>
    <MenuBtn />
    <div className="absolute left-0 right-0 bottom-0" style={{ padding: "24px 22px 22px" }}>
      <div style={{ fontFamily: "Platypi, serif", fontWeight: 700, fontSize: 22, lineHeight: "28px", letterSpacing: -0.2, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.7)" }}>
        {t("Les cascades cachées de La Réunion", "The hidden waterfalls of Réunion Island")}
      </div>
      <div style={{ marginTop: 6, fontSize: 14, lineHeight: "20px", fontWeight: 500, color: "rgba(255,255,255,0.88)", textShadow: "0 1px 5px rgba(0,0,0,0.5)" }}>
        {t(
          "Au cœur des cirques, des chutes d'eau que peu de randonneurs connaissent. Le parc national en recense…",
          "Deep in the cirques, waterfalls few hikers ever reach. The national park lists…"
        )}
      </div>
      <div className="flex items-center justify-between" style={{ marginTop: 10, paddingTop: 8, borderTop: "0.5px solid rgba(255,255,255,0.2)" }}>
        <div className="flex items-center" style={{ gap: 8 }}>
          <span className="block overflow-hidden shrink-0" style={{ width: 32, height: 32, borderRadius: 8 }}><img src="/logo.svg" alt="" className="block w-full h-full object-cover" /></span>
          <div>
            <div style={{ color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: 0.6 }}>ACTUWORLD</div>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 9.5, fontWeight: 600, letterSpacing: 0.4 }}>{t("Rédaction", "Newsroom")}</span>
              <span className="block rounded-full" style={{ width: 2, height: 2, background: "rgba(255,255,255,0.4)" }} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>3{NB}h</span>
            </div>
          </div>
        </div>
        <AsvTile onDark />
      </div>
    </div>
  </div>
);

/* ───── Vote interactif (démo du score de confiance) ───── */
export type PhoneVote = { score: number; total: number; choice: -1 | 0 | 1; onVote: (v: -1 | 1) => void };

/* ───── Verso de la carte (renderInfo) : sources + vote ───── */
const CardBack: React.FC<{ t: (fr: string, en: string) => string; score: number; focus?: PhoneFocus; tap?: boolean; tapSource?: boolean; fingerOnSource?: boolean; vote?: PhoneVote }> = ({ t, score, focus, tap, tapSource, fingerOnSource, vote }) => {
  // Sans démo interactive : état figé « déjà voté Fiable » de la maquette
  const choice = vote ? vote.choice : 1;
  const voteBtn = (v: -1 | 1, side: "left" | "right"): CSSProperties => ({
    gap: 5,
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    background: choice === v ? (v === 1 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)") : "transparent",
    opacity: choice !== 0 && choice !== v ? 0.4 : 1,
    color: v === 1 ? "#A8D5BA" : "#ef4444",
    cursor: vote ? "pointer" : "default",
    transition: "background-color 0.25s ease, opacity 0.25s ease",
    borderRadius: side === "left" ? "9px 0 0 9px" : "0 9px 9px 0",
  });
  const VoteEl = vote ? "button" : "span";
  return (
  <div style={cardShell}>
    <img src={coverImg} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "blur(30px)", transform: "scale(1.2)" }} />
    <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.82)" }} />
    <TrustStrip score={score} />
    <Segments active={1} />
    <MenuBtn />
    <div className="absolute inset-0 flex flex-col" style={{ padding: "44px 22px 14px" }}>
      <div style={{ fontFamily: "Platypi, serif", fontWeight: 700, fontSize: 19, lineHeight: "25px", color: "#fff" }}>
        {t("Les cascades cachées de La Réunion", "The hidden waterfalls of Réunion Island")}
      </div>
      <div style={{ marginTop: 10, fontSize: 15, lineHeight: "23px", color: "rgba(255,255,255,0.72)" }}>
        {t(
          "Au cœur des cirques, des chutes d'eau que peu de randonneurs connaissent. Le parc national en recense plusieurs dizaines, dont certaines ne sont accessibles qu'après de longues heures de marche. Avant de partir, vérifie l'état des sentiers sur le site du parc.",
          "Deep in the cirques, waterfalls few hikers ever reach. The national park lists dozens of them, some only reachable after hours of walking. Before you go, check trail conditions on the park's website."
        )}
      </div>

      <div className="mt-auto flex flex-col" style={{ gap: 8 }}>
        <div style={{ height: 0.5, background: "rgba(255,255,255,0.12)" }} />
        {/* Sources */}
        <div className="flex items-center justify-between" style={focusStyle(focus === "sources")}>
          <div className="flex items-center" style={{ gap: 6 }}>
            <span className="relative flex items-center" style={{ gap: 7, padding: "5px 10px", borderRadius: 10, background: "rgba(255,255,255,0.09)", border: "0.5px solid rgba(255,255,255,0.22)" }}>
              {tapSource && <Finger className="aw-tap" style={{ left: "50%", top: "50%", marginLeft: -23, marginTop: -23 }} />}
              {fingerOnSource && <Finger style={{ left: "60%", top: "50%", marginLeft: -23, marginTop: -8, opacity: 0.9 }} />}
              <span className="block rounded-full" style={{ width: 6, height: 6, background: sourceScoreColor(9) }} />
              <span style={{ color: "#fff", fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap" }}>Parc national</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, whiteSpace: "nowrap" }}>reunion-parcnational.fr</span>
            </span>
            <span className="flex items-center" style={{ gap: 2, padding: "5px 8px", borderRadius: 10, background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, fontWeight: 700 }}>
              +1 <ChevronRight style={{ width: 11, height: 11 }} />
            </span>
          </div>
          <span className="relative">
            <AsvTile onDark />
            {tap && <Finger className="aw-tap" style={{ left: "50%", top: "50%", marginLeft: -23, marginTop: -23 }} />}
          </span>
        </div>
        {/* Vote */}
        <div className="flex flex-col" style={{ gap: 8, marginTop: 4, ...focusStyle(focus === "vote") }}>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, fontWeight: 600 }}>
          {vote && vote.choice !== 0 ? t("Merci pour ton vote", "Thanks for your vote") : t("Cette info te paraît…", "Does this look…")}
        </div>
        <div className="flex items-center" style={{ height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: `1px solid ${choice === -1 ? "rgba(239,68,68,0.25)" : choice === 1 ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.1)"}`, overflow: "hidden" }}>
          <VoteEl {...(vote ? { type: "button" as const, onClick: () => vote.onVote(-1), "aria-label": t("Voter Douteuse", "Vote Doubtful") } : {})} className="aw-vote flex-1 h-full flex items-center justify-center" style={voteBtn(-1, "left")}>
            {choice === -1 && <XCircle style={{ width: 13, height: 13 }} />}
            {t("Douteuse", "Doubtful")}
          </VoteEl>
          <span style={{ width: 1, height: 18, background: "rgba(255,255,255,0.12)" }} />
          <VoteEl {...(vote ? { type: "button" as const, onClick: () => vote.onVote(1), "aria-label": t("Voter Fiable", "Vote Reliable") } : {})} className="aw-vote flex-1 h-full flex items-center justify-center" style={voteBtn(1, "right")}>
            {choice === 1 && <CheckCircle2 style={{ width: 13, height: 13 }} />}
            {t("Fiable", "Reliable")}
          </VoteEl>
        </div>
        <div className="flex items-center justify-end tabular-nums" style={{ gap: 5, color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
          <Users style={{ width: 12, height: 12 }} /> {vote ? vote.total : 128} votes
        </div>
        </div>
        {/* Pied */}
        <div className="flex items-center justify-between" style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)", paddingTop: 10 }}>
          <div className="flex items-center" style={{ gap: 8 }}>
            <span className="block overflow-hidden shrink-0" style={{ width: 28, height: 28, borderRadius: 7 }}><img src="/logo.svg" alt="" className="block w-full h-full object-cover" /></span>
            <div>
              <div style={{ color: "#fff", fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6 }}>ACTUWORLD</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9.5, fontWeight: 600 }}>{t("Rédaction", "Newsroom")}</div>
            </div>
          </div>
          <div className="flex" style={{ gap: 4 }}>
            {[MessageCircle, Share2].map((Icon, i) => (
              <span key={i} className="flex items-center justify-center" style={{ width: 36, height: 36 }}>
                <Icon style={{ width: 17, height: 17, color: "#fff" }} strokeWidth={1.8} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

/* ───── Fiche ASV (VerificationBadge.tsx, DetailModal) ───── */
const AsvSheet: React.FC<{ t: (fr: string, en: string) => string; open?: boolean }> = ({ t, open = true }) => {
  const muted = "var(--app-muted)";
  const row = (icon: ReactNode, label: string, value: ReactNode, sub?: string) => (
    <div className="flex" style={{ gap: 10 }}>
      <span style={{ width: 18, paddingTop: 1, color: muted }}>{icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--app-text)" }}>{label}</span>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{value}</span>
        </div>
        {sub && <div style={{ fontSize: 12, color: muted, marginTop: 2, lineHeight: 1.35 }}>{sub}</div>}
      </div>
    </div>
  );
  const src = (dom: string, score: string, cat: string) => (
    <div style={{ marginLeft: 28, borderRadius: 10, padding: 10, background: "var(--app-row)" }}>
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--app-text)", textDecoration: "underline" }}>{dom}</span>
        <span className="flex items-center" style={{ gap: 4, fontSize: 13, fontWeight: 700, color: "#10b981" }}>
          {score} <ChevronDown style={{ width: 14, height: 14, color: muted }} />
        </span>
      </div>
      <div className="flex items-center" style={{ gap: 6, marginTop: 5 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--app-text)", background: "var(--app-row-strong)", borderRadius: 4, padding: "1.5px 6px" }}>{cat}</span>
        <span className="flex items-center" style={{ gap: 3, fontSize: 11, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.12)", borderRadius: 4, padding: "1.5px 6px" }}>
          <Award style={{ width: 11, height: 11 }} /> {t("Registre reconnu", "Recognised registry")}
        </span>
      </div>
    </div>
  );
  return (
    <>
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.5)", zIndex: 30, opacity: open ? 1 : 0, transition: "opacity 0.35s ease" }}
      />
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          zIndex: 31,
          background: "var(--app-bg)",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 34,
          transform: open ? "translateY(0)" : "translateY(105%)",
          transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div className="mx-auto" style={{ width: 36, height: 4, borderRadius: 2, background: "var(--app-handle)", margin: "10px auto 8px" }} />
        <div style={{ padding: "14px 20px", borderBottom: "0.5px solid var(--app-border)" }}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <AsvTile size={20} />
            <span className="flex-1" style={{ fontFamily: "Platypi, serif", fontWeight: 700, fontSize: 18, color: "var(--app-text)" }}>
              Actuworld Source Vérification
            </span>
            <span style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", color: "#8b5cf6", background: "rgba(139,92,246,0.15)", borderRadius: 6, padding: "2px 7px" }}>
              {t("Bêta", "Beta")}
            </span>
          </div>
          <div className="text-center" style={{ fontSize: 12, fontStyle: "italic", color: muted, marginTop: 10, lineHeight: 1.4 }}>
            {t(
              "Cette analyse évalue la qualité et la cohérence des sources citées, pas la véracité du contenu.",
              "This analysis rates the quality and consistency of the cited sources, not whether the content is true."
            )}
          </div>
        </div>
        <div className="flex flex-col" style={{ padding: 16, gap: 12 }}>
          {row(<Link2 style={{ width: 16, height: 16 }} />, t("Sources accessibles", "Accessible sources"), <span style={{ color: "var(--app-text)" }}>2/2</span>, t(`Éditeurs identifiables${NB}: fiabilité moyenne 9/10`, "Identifiable publishers: average reliability 9/10"))}
          {src("reunion-parcnational.fr", "9/10", "Institution")}
          {src("ign.fr", "9/10", "Institution")}
          {row(<ShieldCheck style={{ width: 16, height: 16 }} />, t("Fidélité aux sources", "Faithfulness to sources"), <span style={{ color: "#10b981" }}>{t("Fidèle à ses sources", "Faithful to its sources")}</span>, t("2/2 sources cohérentes avec le post.", "2/2 sources consistent with the post."))}
          <div className="flex" style={{ gap: 8 }}>
            <span className="flex-1 flex items-center justify-center" style={{ gap: 5, borderRadius: 10, padding: "10px 0", fontSize: 12, fontWeight: 600, color: "#10b981", background: "rgba(16,185,129,0.08)" }}>
              <MessageSquareMore style={{ width: 15, height: 15 }} /> {t("Demander une source", "Ask for a source")}
            </span>
            <span className="flex-1 flex items-center justify-center" style={{ gap: 5, borderRadius: 10, padding: "10px 0", fontSize: 12, fontWeight: 600, color: "#f59e0b", background: "rgba(245,158,11,0.08)" }}>
              <Flag style={{ width: 15, height: 15 }} /> {t("Signaler l'analyse", "Report analysis")}
            </span>
          </div>
          <div className="flex items-center" style={{ gap: 8, fontSize: 14, fontWeight: 600, color: "var(--app-text)" }}>
            <HelpCircle style={{ width: 16, height: 16, color: muted }} />
            <span className="flex-1">{t("Pourquoi ce score ?", "Why this score?")}</span>
            <ChevronDown style={{ width: 16, height: 16, color: muted }} />
          </div>
        </div>
        <div className="text-center" style={{ margin: "4px 20px 0", padding: "14px 0", borderRadius: 12, background: "var(--app-row-strong)", fontSize: 15, fontWeight: 600, color: "var(--app-text)" }}>
          {t("Fermer", "Close")}
        </div>
      </div>
    </>
  );
};

/* ───── Source ouverte dans le navigateur intégré ───── */
const SourceSheet: React.FC<{ t: (fr: string, en: string) => string; open?: boolean }> = ({ t, open = true }) => {
  return (
    <div
      className="absolute left-0 right-0 bottom-0 flex flex-col overflow-hidden"
      style={{
        top: 54,
        zIndex: 32,
        background: "#FFFFFF",
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        boxShadow: "0 -8px 30px rgba(0,0,0,0.25)",
        transform: open ? "translateY(0)" : "translateY(105%)",
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Barre du navigateur intégré */}
      <div className="flex items-center justify-between" style={{ padding: "12px 16px", borderBottom: "0.5px solid rgba(0,0,0,0.1)", background: "#F7F7F7", borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0A84FF" }}>{t("Terminé", "Done")}</span>
        <span className="flex items-center" style={{ gap: 5, fontSize: 14, fontWeight: 600, color: "#1c1c1e" }}>
          <Lock style={{ width: 12, height: 12 }} /> reunion-parcnational.fr
        </span>
        <RotateCw style={{ width: 16, height: 16, color: "#0A84FF" }} />
      </div>
      {/* Page d'origine : capture réelle du site du Parc national (mobile, 390 px) */}
      <div className="flex-1 overflow-hidden">
        <img src={sourcePageImg} alt="" className="block w-full" draggable={false} />
      </div>
    </div>
  );
};

/* ───── Doigt qui simule un geste (tap / balayage) ───── */
const Finger: React.FC<{ style?: CSSProperties; className?: string }> = ({ style, className = "" }) => (
  <span
    className={`absolute pointer-events-none rounded-full ${className}`}
    style={{
      width: 46,
      height: 46,
      background: "rgba(255,255,255,0.55)",
      border: "2px solid rgba(255,255,255,0.9)",
      boxShadow: "0 4px 14px rgba(0,0,0,0.35)",
      zIndex: 50,
      ...style,
    }}
  />
);

/* ───── Composant public ───── */
export const PhoneMockup: React.FC<{
  screen?: PhoneScreen;
  focus?: PhoneFocus;
  /** Mode animé : les vues s'enchaînent avec les transitions de l'app */
  animated?: boolean;
  /** Mode animé : geste simulé en cours */
  gesture?: "swipe" | "tap" | "tap-source" | null;
  /** Largeur rendue du téléphone en px (cadre compris) */
  width?: number;
  className?: string;
  label?: string;
  /** Démo interactive du vote (verso statique uniquement) */
  vote?: PhoneVote;
}> = ({ screen = "front", focus, animated = false, gesture = null, width = 300, className = "", label, vote }) => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const outerW = W + BEZEL * 2;
  const outerH = H + BEZEL * 2;
  const scale = width / outerW;
  const score = vote ? vote.score : 86;

  const alt =
    label ??
    (screen === "source"
      ? t("Source d'origine ouverte depuis une dépêche dans l'app", "Original source opened from a dispatch in the app")
      : screen === "asv"
      ? t("Fiche ASV ouverte dans l'app : sources, éditeurs et fidélité aux sources", "ASV sheet in the app: sources, publishers and faithfulness")
      : screen === "back"
        ? t("Verso d'une dépêche dans l'app : sources citées et vote Fiable ou Douteuse", "Back of a dispatch in the app: cited sources and Reliable or Doubtful vote")
        : t("Écran La Une de l'app ActuWorld avec une dépêche et son badge ASV", "ActuWorld Front page screen with a dispatch and its ASV badge"));

  return (
    <div
      role={vote ? "group" : "img"}
      aria-label={alt}
      className={`relative mx-auto ${className}`}
      style={{ width, height: outerH * scale }}
    >
      <div
        aria-hidden={vote ? undefined : true}
        className="aw-phone absolute left-0 top-0 origin-top-left select-none"
        style={{
          width: outerW,
          height: outerH,
          transform: `scale(${scale})`,
          padding: BEZEL,
          borderRadius: 62,
          background: "#121A15",
          boxShadow: "0 40px 70px -20px rgba(10,20,15,0.45), 0 10px 24px rgba(10,20,15,0.22)",
          fontFamily: "Urbanist, sans-serif",
        }}
      >
        <div className="relative overflow-hidden" style={{ width: W, height: H, borderRadius: 50, background: "var(--app-feed)" }}>
          {/* Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ top: 11, width: 120, height: 34, borderRadius: 20, background: "#000", zIndex: 40 }} />
          <div style={{ background: "var(--app-bg)" }}>
            <StatusBar />
            <HeaderBar />
          </div>
          <div className="flex flex-col items-center" style={{ paddingTop: 16, gap: 20 }}>
            {animated ? (
              <div className="relative overflow-hidden" style={{ width: CARD_W, height: CARD_H, borderRadius: 22, boxShadow: cardShell.boxShadow }}>
                <div
                  className="flex"
                  style={{
                    width: CARD_W * 2,
                    transform: screen === "front" ? "translateX(0)" : `translateX(-${CARD_W}px)`,
                    transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <CardFront t={t} score={score} />
                  <CardBack t={t} score={score} tap={gesture === "tap"} tapSource={gesture === "tap-source"} />
                </div>
                {gesture === "swipe" && <Finger className="aw-swipe" style={{ top: "42%", right: 30 }} />}
              </div>
            ) : screen === "back" ? (
              <CardBack t={t} score={score} focus={focus} fingerOnSource={focus === "sources"} vote={vote} />
            ) : (
              <CardFront t={t} score={score} />
            )}
            {/* Carte suivante qui dépasse (fil accroché carte par carte) */}
            <div style={{ ...cardShell, height: 120, background: "linear-gradient(160deg,#1B3528,#2E5F4A 70%)" }} />
          </div>
          <TabBar t={t} />
          {animated ? <AsvSheet t={t} open={screen === "asv"} /> : screen === "asv" && <AsvSheet t={t} />}
          {animated ? <SourceSheet t={t} open={screen === "source"} /> : screen === "source" && <SourceSheet t={t} />}
          {/* Indicateur d'accueil iOS */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 8, width: 134, height: 5, borderRadius: 3, background: "var(--app-text)", opacity: 0.85, zIndex: 41 }} />
        </div>
      </div>
    </div>
  );
};
