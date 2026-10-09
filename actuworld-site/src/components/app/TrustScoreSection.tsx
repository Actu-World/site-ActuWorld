import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { Section } from "../Section";
import { H2 } from "../H2";
import { AnimatedSection } from "../animations";
import { PhoneMockup } from "./phone/PhoneMockup";
import { useLanguage } from "../../i18n/LanguageContext";

/* Couleur du score de confiance (utils/trust.ts de l'app : ≥ 70 / ≥ 40 / < 40) */
const trustColor = (v: number) => (v >= 70 ? "#16a34a" : v >= 40 ? "#f59e0b" : "#ef4444");

/* Votes des autres lecteurs avant le tien : 1 « Fiable », 1 « Douteuse » (score 50).
   Peu de votes pour que ton vote fasse visiblement bouger la barre (67 ou 33). */
const OTHERS = { reliable: 1, doubtful: 1 };

export const TrustScoreSection: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);
  const reduce = useReducedMotion();

  // Un seul vote par lecteur, comme dans l'app (useTrustBase) : retoucher le même bouton l'annule
  const [choice, setChoice] = useState<-1 | 0 | 1>(0);
  const votes = {
    reliable: OTHERS.reliable + (choice === 1 ? 1 : 0),
    doubtful: OTHERS.doubtful + (choice === -1 ? 1 : 0),
  };
  const total = votes.reliable + votes.doubtful;
  // Part de votes « Fiable » ; sans aucun vote, le score part de 50
  const score = total ? Math.round((votes.reliable / total) * 100) : 50;

  // Le chiffre affiché suit la barre (même durée que le filet de la carte)
  const [display, setDisplay] = useState(score);
  const fromRef = useRef(score);
  useEffect(() => {
    const controls = animate(fromRef.current, score, {
      duration: reduce ? 0 : 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    fromRef.current = score;
    return () => controls.stop();
  }, [score, reduce]);

  const onVote = (v: -1 | 1) => setChoice((c) => (c === v ? 0 : v));

  const color = trustColor(display);
  const level =
    display >= 70
      ? t("Jugée fiable", "Seen as reliable")
      : display >= 40
        ? t("Avis partagés", "Opinions split")
        : t("Jugée douteuse", "Seen as doubtful");

  // Paliers du score, du plus bas au plus haut (même ordre que la jauge)
  const legend = [
    { range: t("0 à 39", "0 to 39"), text: t("douteux", "doubtful") },
    { range: t("40 à 69", "40 to 69"), text: t("partagé", "split") },
    { range: t("70 à 100", "70 to 100"), text: t("fiable", "reliable") },
  ];

  return (
    <Section id="confiance" className="bg-aw-surface">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 items-center">
        <AnimatedSection className="order-2 lg:order-1 flex flex-col items-center">
          <PhoneMockup
            screen="back"
            focus="vote"
            width={280}
            vote={{ score, total, choice, onVote }}
            label={t("Maquette interactive : vote Fiable ou Douteuse au verso d'une dépêche", "Interactive mockup: vote Reliable or Doubtful on the back of a dispatch")}
          />

          {/* Relevé du score, synchronisé avec le filet de la carte */}
          <div className="mt-6 text-center" aria-live="polite">
            <p className="flex items-baseline justify-center gap-2.5" style={{ color, transition: "color 0.4s ease" }}>
              <span className="tabular-nums text-3xl font-black leading-none" aria-label={t(`Score de confiance : ${score} sur 100`, `Trust score: ${score} out of 100`)}>
                {display}
              </span>
              <span className="font-semibold">{level}</span>
            </p>
            <p className="caption text-aw-muted mt-1.5">
              {choice !== 0 ? t("Retouche ton vote pour l'annuler", "Tap your vote again to cancel it") : t("Vote sur la carte", "Vote on the card")}
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection className="order-1 lg:order-2">
          <H2>{t("Le vote et la barre de confiance", "Votes and the trust bar")}</H2>
          <p className="lead mt-5">
            {t(
              "ASV analyse les sources. Le score de confiance, lui, vient des lecteurs : c'est l'avis de la communauté, affiché à part.",
              "ASV analyses the sources. The trust score comes from readers: it's the community's opinion, shown separately."
            )}
          </p>

          <ol className="mt-8 space-y-3">
            {/* 1. Le vote : deux pastilles plutôt que des mots colorés dans la phrase */}
            <li className="rounded-[var(--aw-radius-card)] border border-[var(--aw-border)] bg-[var(--aw-bg)] p-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--aw-success)] flex items-center justify-center text-sm font-bold text-aw-primary shrink-0">1</span>
                <h3 className="text-lg">{t("Tu votes au verso", "You vote on the back")}</h3>
              </div>
              <p className="text-aw-muted mt-3 text-[15px]">
                {t("Après avoir lu et ouvert les sources, cette info te paraît :", "After reading and opening the sources, does this look:")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold"
                  style={{ color: "#16a34a", background: "rgb(22 163 74 / 0.12)" }}
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> {t("Fiable", "Reliable")}
                </span>
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold"
                  style={{ color: "#ef4444", background: "rgb(239 68 68 / 0.12)" }}
                >
                  <XCircle className="w-4 h-4" aria-hidden="true" /> {t("Douteuse", "Doubtful")}
                </span>
              </div>
            </li>

            {/* 2. Le score : texte court + jauge à trois paliers */}
            <li className="rounded-[var(--aw-radius-card)] border border-[var(--aw-border)] bg-[var(--aw-bg)] p-5">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-[var(--aw-success)] flex items-center justify-center text-sm font-bold text-aw-primary shrink-0">2</span>
                <h3 className="text-lg">{t("Un score sur 100, sur chaque carte", "A score out of 100, on every card")}</h3>
              </div>
              <p className="text-aw-muted mt-3 text-[15px]">
                {t(
                  "La part de votes « Fiable », 50 tant que personne n'a voté. Il s'affiche en haut à gauche de la carte, et en barre sur son bord.",
                  "The share of “Reliable” votes, 50 until anyone votes. It shows in the card's top-left corner, and as a bar along its edge."
                )}
              </p>
              <div className="mt-4" aria-label={t("Couleurs du score", "Score colours")} role="img">
                <div className="flex h-2 rounded-full overflow-hidden gap-0.5" aria-hidden="true">
                  <span style={{ flex: 40, background: "#ef4444" }} />
                  <span style={{ flex: 30, background: "#f59e0b" }} />
                  <span style={{ flex: 30, background: "#16a34a" }} />
                </div>
                <ul className="mt-2 flex text-xs">
                  {legend.map((l, i) => (
                    <li key={l.range} style={{ flex: i === 0 ? 40 : 30 }} className={i === 0 ? "" : i === 1 ? "text-center" : "text-right"}>
                      <span className="block font-semibold text-aw-text tabular-nums">{l.range}</span>
                      <span className="block text-aw-muted">{l.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ol>
        </AnimatedSection>
      </div>
    </Section>
  );
};
