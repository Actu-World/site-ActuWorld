import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, ShieldCheck, Lightbulb, ChevronRight, Mail } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp,
} from "../components/animations";
import { SectionKicker } from "../components/home/SectionKicker";
import { useLanguage } from "../i18n/LanguageContext";

export default function AboutPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const values = [
    {
      icon: ShieldCheck,
      title: t("La preuve avant la parole", "Proof before speech"),
      desc: t("Pas de source, pas de publication. Montrer d'où vient l'info passe avant tout le reste.", "No source, no post. Showing where info comes from comes before anything else."),
    },
    {
      icon: Eye,
      title: t("La transparence", "Transparency"),
      desc: t("Scores, sources et vérifications sont visibles par tous. Rien n'est caché, rien n'est manipulable.", "Scores, sources and checks are visible to everyone. Nothing hidden, nothing gameable."),
    },
    {
      icon: Lightbulb,
      title: t("L'esprit critique", "Critical thinking"),
      desc: t("ActuWorld ne dit pas quoi penser. Il donne les outils pour juger par soi-même.", "ActuWorld doesn't tell you what to think. It gives you the tools to judge for yourself."),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("À propos — Notre mission", "About — Our mission")}
        description={t(
          "ActuWorld est né d'un constat simple : il est temps de partager l'information avec preuves. Découvrez notre mission et nos valeurs.",
          "ActuWorld was born from a simple observation: it's time to share information with proof. Discover our mission and values."
        )}
        path="/about"
      />

      {/* HERO */}
      <Section className="pt-24 pb-12 text-center">
        <AnimatedSection className="flex flex-col items-center">
          <SectionKicker number="—" label={t("À propos", "About")} center className="mb-5" />
          <H2 as="h1" center>
            {isEnglish ? <>Sharing information <span className="gradient-text">with proof</span></> : <>Partager l'information <span className="gradient-text">avec preuves</span></>}
          </H2>
          <p className="text-aw-muted mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
            {t(
              "ActuWorld est un réseau social préventif où chaque publication s'appuie sur une source visible, vérifiée par ASV, puis éclairée par un jugement communautaire.",
              "ActuWorld is a preventive social network where every post is backed by a visible source, verified by ASV, then enhanced by community judgment."
            )}
          </p>
        </AnimatedSection>
      </Section>

      {/* MISSION */}
      <Section className="bg-aw-surface py-20">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <SectionKicker number="01" label={t("Notre mission", "Our mission")} center className="mb-6" />
          <p className="text-2xl md:text-3xl font-bold leading-snug" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
            {t(
              "Redonner à chacun les moyens de vérifier avant de croire — et de partager ce qui l'intéresse, sans renoncer à la rigueur.",
              "Give everyone the means to verify before believing — and to share what they care about, without giving up rigor."
            )}
          </p>
          <p className="text-aw-muted mt-6 text-lg leading-relaxed">
            {t(
              "Les plateformes actuelles récompensent le buzz, pas la preuve. Résultat : confusion, perte de confiance, et créateurs sérieux invisibles. ActuWorld inverse la logique : ici, ce sont tes sources qui parlent pour toi.",
              "Today's platforms reward hype, not proof. The result: confusion, loss of trust, and serious creators left invisible. ActuWorld flips the logic: here, your sources speak for you."
            )}
          </p>
        </AnimatedSection>
      </Section>

      {/* VALEURS */}
      <Section className="py-20">
        <AnimatedSection className="text-center mb-12 flex flex-col items-center">
          <SectionKicker number="02" label={t("Nos valeurs", "Our values")} center className="mb-5" />
          <H2 center>
            {isEnglish ? <>What we <span className="gradient-text">stand for</span></> : <>Ce qui nous <span className="gradient-text">guide</span></>}
          </H2>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {values.map((v, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="card card-hover p-6 text-center flex flex-col items-center gap-3"
            >
              <span
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, var(--aw-primary), var(--aw-accent))" }}
              >
                <v.icon className="w-7 h-7" />
              </span>
              <h3 className="body-semi text-lg">{v.title}</h3>
              <p className="text-aw-muted text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* SOUTIEN / PARTENAIRES */}
      <Section className="bg-aw-surface py-20">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <SectionKicker number="03" label={t("Soutenir le projet", "Support the project")} center className="mb-5" />
          <H2 center>
            {isEnglish ? <>A student project that <span className="gradient-text">needs you</span></> : <>Un projet étudiant qui <span className="gradient-text">a besoin de vous</span></>}
          </H2>
          <p className="text-aw-muted mt-5 text-lg leading-relaxed">
            {t(
              "ActuWorld est porté par un étudiant déterminé à changer notre rapport à l'information. Médias, journalistes, éducateurs, investisseurs ou simples curieux : votre soutien et votre visibilité font la différence.",
              "ActuWorld is led by a student determined to change our relationship with information. Media, journalists, educators, investors or simply curious minds: your support and visibility make the difference."
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn-primary glow-hover">
              <Mail className="w-5 h-5 mr-2" /> {t("Devenir partenaire", "Become a partner")}
            </Link>
            <Link to="/press" className="btn-outline">
              {t("Espace presse", "Press kit")} <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
