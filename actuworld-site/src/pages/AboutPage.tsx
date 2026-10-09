import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, AnimatedSection } from "../components/animations";
import { useLanguage } from "../i18n/LanguageContext";

export default function AboutPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const values = [
    {
      title: t("La preuve avant la parole", "Proof before speech"),
      desc: t(
        "Pas de source, pas de publication. Montrer d'où vient l'info passe avant tout le reste.",
        "No source, no post. Showing where information comes from comes before anything else."
      ),
    },
    {
      title: t("La transparence", "Transparency"),
      desc: t(
        "Scores, sources et vérifications sont visibles par tous. Tu vois exactement sur quoi repose une note.",
        "Scores, sources and checks are visible to everyone. You see exactly what a rating is based on."
      ),
    },
    {
      title: t("L'esprit critique", "Critical thinking"),
      desc: t(
        "ActuWorld ne te dit pas quoi penser. Il te donne les outils pour juger par toi-même.",
        "ActuWorld doesn't tell you what to think. It gives you the tools to judge for yourself."
      ),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("À propos | Notre mission", "About | Our mission")}
        description={t(
          "ActuWorld part d'une idée simple : partager l'information avec ses preuves. Découvre notre mission et nos valeurs.",
          "ActuWorld starts from a simple idea: share information with its proof. Discover our mission and values."
        )}
        path="/about"
      />

      {/* EN-TÊTE */}
      <Section className="pt-20 md:pt-24 pb-16 md:pb-20">
        <AnimatedSection className="max-w-3xl">
          <p className="eyebrow mb-4">{t("À propos", "About")}</p>
          <H2 as="h1">{t("Partager l'information avec ses preuves", "Sharing information with its proof")}</H2>
          <p className="lead mt-5">
            {t(
              "ActuWorld est le réseau de l'information où chaque publication s'appuie sur une source visible, analysée par ASV, puis jugée par la communauté.",
              "ActuWorld is the information network where every post is backed by a visible source, checked by ASV, then judged by the community."
            )}
          </p>
        </AnimatedSection>
      </Section>

      {/* MISSION : manifeste */}
      <Section className="bg-aw-surface">
        <AnimatedSection className="max-w-4xl mx-auto">
          <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.3] tracking-[-0.01em] text-aw-text">
            {t(
              "Redonner à chacun les moyens de vérifier avant de croire, et de partager ce qui l'intéresse sans renoncer à la rigueur.",
              "Give everyone the means to check before believing, and to share what they care about without giving up rigor."
            )}
          </p>
          <p className="lead mt-8">
            {t(
              "Les plateformes actuelles récompensent le buzz, pas la preuve. Résultat : confusion, perte de confiance et créateurs sérieux invisibles. ActuWorld inverse la logique : ici, ce sont tes sources qui parlent pour toi.",
              "Today's platforms reward hype, not proof. The result: confusion, lost trust and serious creators left invisible. ActuWorld flips the logic: here, your sources speak for you."
            )}
          </p>
        </AnimatedSection>
      </Section>

      {/* VALEURS : liste éditoriale */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <AnimatedSection>
            <H2>{t("Ce qui nous guide", "What guides us")}</H2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <ul className="divide-y divide-[var(--aw-border)] border-y border-aw">
              {values.map((v) => (
                <li key={v.title} className="grid gap-2 py-7 md:grid-cols-[14rem_1fr] md:gap-8">
                  <h3 className="text-xl text-aw-text">{v.title}</h3>
                  <p className="text-aw-muted leading-relaxed max-w-prose">{v.desc}</p>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </Section>

      {/* SOUTENIR LE PROJET */}
      <Section className="bg-aw-surface">
        <AnimatedSection className="max-w-2xl">
          <H2>{t("Un projet étudiant qui a besoin de toi", "A student project that needs you")}</H2>
          <p className="lead mt-5">
            {t(
              "ActuWorld est porté par un étudiant déterminé à changer notre rapport à l'information. Média, journaliste, éducateur, investisseur ou simple curieux : ton soutien et ta visibilité font la différence.",
              "ActuWorld is led by a student determined to change our relationship with information. Media, journalist, educator, investor or simply curious: your support and visibility make the difference."
            )}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link to="/partenaires" className="btn-primary">
              {t("Devenir partenaire", "Become a partner")}
            </Link>
            <Link to="/press" className="btn-link">
              {t("Espace presse", "Press room")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
