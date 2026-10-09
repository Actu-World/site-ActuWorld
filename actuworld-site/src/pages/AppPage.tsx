import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, Newspaper, Unlock, Heart, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { PhoneShowcase } from "../components/app/phone/PhoneShowcase";
import { HowItWorks } from "../components/home/HowItWorks";
import { TrustScoreSection } from "../components/app/TrustScoreSection";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp
} from "../components/animations";

export default function AppPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const formats = [
    {
      icon: Zap,
      title: t("La dépêche", "The dispatch"),
      tab: t("Onglet La Une", "Front page tab"),
      desc: t(
        "Une info courte et visuelle, en quelques cartes à faire défiler. Chaque carte s'appuie sur sa propre source.",
        "A short, visual piece of news in a few swipeable cards. Each card relies on its own source."
      ),
    },
    {
      icon: Newspaper,
      title: t("L'article", "The article"),
      tab: t("Onglet Articles", "Articles tab"),
      desc: t(
        "Le format long pour aller au fond d'un sujet : info, enquête, analyse ou opinion, toujours avec ses sources. Tu peux aussi l'écrire depuis ton ordinateur avec le Studio.",
        "The long format to dig into a topic: news, investigation, analysis or opinion, always with its sources. You can also write it from your computer with the Studio."
      ),
    },
  ];

  const topics = [
    t("Géographie", "Geography"), t("Sciences", "Science"), t("Histoire", "History"),
    t("Politique", "Politics"), t("Économie", "Economy"), t("Technologie", "Technology"),
    t("Environnement", "Environment"), t("Sport", "Sport"), t("Culture", "Culture"),
    t("Investigation", "Investigation"),
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("L'app : le réseau de l'information fiable", "The app: the network for reliable information")}
        description={t("Découvre ActuWorld : source visible obligatoire, vérification ASV et jugement communautaire. Partage sur tous les sujets, lecture 100 % gratuite. Bientôt sur l'App Store et Google Play.", "Discover ActuWorld: mandatory visible sources, ASV verification and community judgment. Share on any topic, 100% free to read. Coming soon to the App Store and Google Play.")}
        path="/app"
      />

      {/* HERO : texte à gauche, aperçu de l'app à droite */}
      <Section className="pt-14 md:pt-20 pb-20">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl">
            <motion.p variants={fadeInUp} className="eyebrow mb-5">
              {t("Bientôt sur l'App Store et Google Play", "Coming soon to the App Store and Google Play")}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="display">
              {t("ActuWorld, le réseau de l'information", "ActuWorld, the information network")}
            </motion.h1>
            <motion.p variants={fadeInUp} className="lead mt-6">
              {t("Publie, explore et partage sur tous les sujets, avec des sources visibles et un score de confiance clair.", "Publish, explore and share on any topic, with visible sources and a clear trust score.")}
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to="/#rejoindre" className="btn-primary">
                {t("Être prévenu", "Get notified")}
              </Link>
              <Link to="/reco-src" className="btn-link">
                {t("Découvrir ASV", "Discover ASV")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          <AnimatedSection>
            <PhoneShowcase />
          </AnimatedSection>
        </div>
      </Section>

      {/* COMMENT ÇA MARCHE : les trois gestes, visuel collant */}
      <HowItWorks />

      {/* VOTE ET BARRE DE CONFIANCE */}
      <TrustScoreSection />

      {/* FORMATS : dépêche et article, tous les sujets */}
      <Section id="formats">
        <AnimatedSection className="max-w-2xl">
          <H2>{t("Deux formats, tous les sujets", "Two formats, every topic")}</H2>
          <p className="lead mt-5">
            {t("De l'info rapide à l'enquête de fond, sur ce qui te passionne.", "From quick news to in-depth investigation, on what you care about.")}
          </p>
        </AnimatedSection>
        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {formats.map((f) => (
            <AnimatedSection key={f.title} className="card p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="w-10 h-10 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                  <f.icon className="w-5 h-5 text-aw-primary" />
                </span>
                <span className="caption text-aw-muted">{f.tab}</span>
              </div>
              <h3 className="text-2xl mt-5">{f.title}</h3>
              <p className="text-aw-muted mt-2 max-w-prose">{f.desc}</p>
            </AnimatedSection>
          ))}
        </div>
        <AnimatedSection className="mt-10">
          <ul className="flex flex-wrap gap-2" aria-label={t("Exemples de sujets", "Example topics")}>
            {topics.map((tp) => (
              <li key={tp} className="rounded-lg border border-aw bg-aw-bg px-3 py-1.5 text-sm font-semibold text-aw-text">{tp}</li>
            ))}
          </ul>
        </AnimatedSection>
      </Section>

      {/* DIFFÉRENCE : affirmation à gauche, deux engagements à droite */}
      <Section id="why" className="bg-aw-surface">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <AnimatedSection>
            <H2>{t("Ce qui nous distingue", "What sets us apart")}</H2>
            <p className="lead mt-4">
              {t("Source obligatoire, vérification ASV et jugement communautaire, réunis dans une seule app.", "Mandatory sources, ASV verification and community judgment, together in one app.")}
            </p>
          </AnimatedSection>

          <div className="space-y-5">
            <AnimatedSection className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Unlock className="w-5 h-5 text-aw-primary" aria-hidden="true" />
                <h3 className="text-xl">{t("Lecture 100 % gratuite", "100% free to read")}</h3>
              </div>
              <p className="text-aw-muted">
                {t("Lire, explorer et consulter les sources sans jamais payer. Aucun abonnement requis.", "Read, explore and check sources without ever paying. No subscription required.")}
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="card p-6">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-aw-primary" aria-hidden="true" />
                <h3 className="text-xl">{t("Une monétisation éthique", "Ethical monetization")}</h3>
              </div>
              <p className="text-aw-muted">
                {t("Les créateurs sont soutenus par les dons de leur audience. Pas de publicité intrusive, pas d'algorithme à buzz.", "Creators are supported by donations from their audience. No intrusive ads, no hype-driven algorithm.")}
              </p>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* CTA ASV */}
      <Section>
        <AnimatedSection className="max-w-2xl">
          <H2>{t("Notre IA de vérification", "Our verification AI")}</H2>
          <p className="lead mt-4">
            {t("ASV analyse tes publications, vérifie les sources citées et évalue leur fiabilité. Tu publies en confiance, tes lecteurs jugent en connaissance de cause.", "ASV analyzes your posts, checks the cited sources and rates their reliability. You publish with confidence, your readers judge with full knowledge.")}
          </p>
          <div className="mt-8">
            <Link to="/reco-src" className="btn-primary">
              {t("Découvrir ASV", "Discover ASV")}
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
