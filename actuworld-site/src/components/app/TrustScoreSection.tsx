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

  const legend = [
    { c: "#16a34a", range: t("70 et plus", "70 and above"), text: t("fiable", "reliable") },
    { c: "#f59e0b", range: t("De 40 à 69", "40 to 69"), text: t("partagé", "split") },
    { c: "#ef4444", range: t("Moins de 40", "Below 40"), text: t("douteux", "doubtful") },
  ];

  return (
    <Section id="confiance" className="bg-aw-surface">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 items-center">
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

          <ol className="mt-8 space-y-5">
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-lg bg-aw-bg border border-aw flex items-center justify-center text-sm font-bold text-aw-primary shrink-0">1</span>
              <div>
                <h3 className="text-lg">{t("Tu votes au verso", "You vote on the back")}</h3>
                <p className="text-aw-muted mt-1 text-[15px] max-w-prose">
                  {t("Après avoir lu et ouvert les sources : cette info te paraît", "After reading and opening the sources: does this look")}{" "}
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: "#16a34a" }}>
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" /> {t("Fiable", "Reliable")}
                  </span>{" "}
                  {t("ou", "or")}{" "}
                  <span className="inline-flex items-center gap-1 font-semibold" style={{ color: "#ef4444" }}>
                    <XCircle className="w-4 h-4" aria-hidden="true" /> {t("Douteuse", "Doubtful")}
                  </span>
                  {t(" ?", "?")}
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="w-8 h-8 rounded-lg bg-aw-bg border border-aw flex items-center justify-center text-sm font-bold text-aw-primary shrink-0">2</span>
              <div>
                <h3 className="text-lg">{t("Un score sur 100, sur chaque carte", "A score out of 100, on every card")}</h3>
                <p className="text-aw-muted mt-1 text-[15px] max-w-prose">
                  {t(
                    "C'est la part de votes « Fiable » (50 tant que personne n'a voté). Il s'affiche en chiffre en haut à gauche de la carte, et en barre sur son bord qui monte et descend au fil des votes.",
                    "It's the share of “Reliable” votes (50 until anyone votes). It shows as a number in the card's top-left corner, and as a bar along its edge that rises and falls as votes come in."
                  )}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2" aria-label={t("Couleurs du score", "Score colours")}>
                  {legend.map((l) => (
                    <li key={l.range} className="flex items-center gap-2 text-sm">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.c }} aria-hidden="true" />
                      <span className="font-semibold text-aw-text">{l.range}</span>
                      <span className="text-aw-muted">{l.text}</span>
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
