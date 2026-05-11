import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  ChevronRight, FileText, Unlock, ThumbsUp, Sparkles,
  AlertTriangle, Search, TrendingDown, Users
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import {
  PageWrapper,
  AnimatedSection,
  Parallax,
  Floating,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";
import { WaitlistForm } from "../components/ui/WaitlistForm";
import { Tooltip } from "../components/ui/Tooltip";
import { useLanguage } from "../i18n/LanguageContext";

export default function HomePage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const problems = [
    {
      icon: AlertTriangle,
      title: t("Information noyée dans le buzz", "Information drowned in hype"),
      desc: t("Les algorithmes privilégient l'engagement émotionnel et la viralité. Les contenus de qualité sont invisibles face au clickbait et aux tendances.", "Algorithms prioritize emotional engagement and virality. Quality content becomes invisible against clickbait and trends.")
    },
    {
      icon: Search,
      title: t("Absence de sourcage", "Lack of sourcing"),
      desc: t("N'importe qui peut affirmer n'importe quoi sans preuve. Aucune plateforme n'exige de montrer ses sources avant de publier.", "Anyone can claim anything without proof. No platform requires showing sources before publishing.")
    },
    {
      icon: TrendingDown,
      title: t("Contenus sans preuves", "Content without proof"),
      desc: t("Sans transparence sur les sources, impossible de savoir ce qui mérite confiance. Les utilisateurs naviguent à l'aveugle.", "Without source transparency, it's impossible to know what deserves trust. Users are navigating blind.")
    },
    {
      icon: Users,
      title: t("Perte de confiance", "Loss of trust"),
      desc: t("73% des jeunes cherchent une alternative plus claire. Ils veulent un espace où la preuve précède la publication.", "73% of young people want a clearer alternative. They want a space where proof comes before publishing.")
    }
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("ActuWorld — Partage ce qui t'intéresse. Prouve pourquoi c'est fiable.", "ActuWorld — Share what matters to you. Show why it's reliable.")}
        description={t("ActuWorld est un réseau social préventif de partage d'informations fiables sur tout sujet, selon les passions et les intérêts de chacun. Source visible, ASV et jugement communautaire.", "ActuWorld is a preventive social network for sharing reliable information on any topic, based on your passions and interests. Visible sources, ASV and community trust.")}
        path="/"
      />
      {/* HERO */}
      <Section id="hero" container={false} className="relative overflow-hidden pt-16 md:pt-24 pb-20">
        {/* Animated blobs — tailles réduites sur mobile via classes responsive */}
        <motion.div
          className="aw-blob w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] bg-[#94C9AA] -top-32 -right-32"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="aw-blob w-[16rem] h-[16rem] md:w-[32rem] md:h-[32rem] bg-[#00A896] -bottom-32 -left-32"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <Floating duration={6} y={20}>
          <div className="aw-blob w-[10rem] h-[10rem] md:w-[20rem] md:h-[20rem] bg-[#2E5F4A] top-1/2 left-1/3 opacity-20" />
        </Floating>

        <motion.div
          ref={heroRef}
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-7xl mx-auto container-px relative"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
<motion.h1
              variants={fadeInUp}
              className="hero-title text-4xl md:text-6xl font-bold leading-tight"
            >
              <span className="text-aw-text">{t("Partage ce qui t'intéresse.", "Share what matters to you.")}</span>
              <br />
              <span className="gradient-text">{t("Prouve pourquoi c'est fiable.", "Show why it's reliable.")}</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-aw-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              {t("ActuWorld est un réseau social préventif de partage d'informations fiables sur tout sujet, selon ", "ActuWorld is a preventive social network for sharing reliable information on any topic, based on ")}
              <strong className="text-aw-text">{t("tes passions et tes intérêts", "your passions and interests")}</strong>.{" "}
              {t("Chaque publication s'appuie sur une source visible, vérifiée par ", "Every post is backed by a visible source, verified by ")}
              <strong className="text-aw-text">ASV (ActuWorld Source Verification)</strong>
              {t(", puis éclairée par un jugement communautaire.", ", then enhanced by community judgment.")}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/app" className="btn-primary glow-hover">
                {t("Découvrir ActuWorld", "Discover ActuWorld")} <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/reco-src" className="btn-outline group">
                <Sparkles className="w-5 h-5 mr-2 text-aw-accent" />
                {t("L'IA ASV", "ASV AI")}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center gap-6 justify-center"
            >
              {[
                { icon: FileText, label: t("Sourcing", "Sourcing"), value: t("obligatoire", "mandatory") },
                { icon: Unlock, label: t("Lecture", "Reading"), value: t("100% gratuite", "100% free") },
                { icon: ThumbsUp, label: t("Qualité", "Quality"), value: t("> Viralité", "> Virality") },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 rounded-full bg-aw-success flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-aw-primary" />
                  </div>
                  <span className="text-aw-muted">{item.label}<br/><strong className="text-aw-text">{item.value}</strong></span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </Section>

      {/* LE PROBLÈME */}
      <Section id="problem" className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Le constat" center>
              {isEnglish ? <>Today's social networks <span className="gradient-text">don't ask for proof</span></> : <>Les réseaux sociaux d'aujourd'hui <span className="gradient-text">ne demandent aucune preuve</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("La majorité des plateformes optimisent pour l'engagement émotionnel. Personne ne demande d'où vient l'info. Résultat : confusion, perte de confiance, et créateurs sérieux marginalisés.", "Most platforms optimize for emotional engagement. Nobody asks where the info comes from. Result: confusion, loss of trust, and serious creators marginalized.")}
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card card-hover p-6 flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <p.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="body-semi text-lg">{p.title}</h3>
                <p className="text-aw-muted text-sm mt-1">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <p className="text-lg text-aw-muted">
            <strong className="text-aw-text">ActuWorld</strong> {t("naît d'un constat simple : il est temps de ", "is built on a simple observation: it's time to ")}
            <span className="text-aw-primary font-semibold highlight-text">{t("donner à chacun les outils pour publier, explorer et partager avec preuves", "give everyone the tools to publish, explore, and share with proof")}</span>.{" "}
            {t("Un réseau où ", "A network where ")}<strong className="text-aw-text">{t("tes sources parlent pour toi", "your sources speak for you")}</strong>.
          </p>
        </AnimatedSection>
      </Section>

      {/* VISION */}
      <Section id="vision" className="py-24 relative overflow-hidden">
        <Parallax offset={30} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-aw-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-aw-accent/10 rounded-full blur-3xl" />
        </Parallax>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative"
        >
          <motion.div variants={scaleUp}>
            <H2 kicker="Notre vision" center>
              {isEnglish ? <>A space to share <span className="gradient-text">with clarity</span></> : <>Un espace pour partager <span className="gradient-text">avec clarté</span></>}
            </H2>
            <p className="text-aw-muted mt-6 text-lg leading-relaxed">
              {t("Publie des ", "Publish ")}<strong className="text-aw-text">{t("posts, articles et vidéos", "posts, articles, and videos")}</strong>{t(" sur tout ce qui te passionne : culture, sport, sciences, société, tech, environnement, actualité locale…", " about anything you're passionate about: culture, sports, science, society, tech, environment, local news...")}
              <br /><br />
              {t("Chaque publication s'appuie sur une ", "Every post is backed by a ")}<strong className="text-aw-text">{t("source visible", "visible source")}</strong>{t(", vérifiée par ", ", verified by ")}
              <strong className="text-aw-text">ASV (ActuWorld Source Verification)</strong>{t(" qui vérifie la cohérence entre la source et le contenu, et détecte le ", " which checks source-content consistency and detects ")}<Tooltip text={t("Le cherry-picking consiste à sélectionner uniquement les données ou faits qui soutiennent son argument, en ignorant ceux qui le contredisent.", "Cherry-picking means selecting only data or facts that support an argument while ignoring contradictory evidence.")}>cherry-picking</Tooltip>.{" "}
              {t("Un ", "A ")}<strong className="text-aw-text">{t("parcours de contributeur", "contributor pathway")}</strong>{t(" (Explorateur → Navigateur → Pionnier) valorise ceux qui publient avec rigueur.", " (Explorer → Navigator → Pioneer) rewards those who publish with rigor.")}
            </p>
            <motion.p
              className="text-aw-primary mt-6 body-semi text-lg"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t("ActuWorld ne dit pas quoi penser. Il donne les outils pour chercher, juger et montrer ce qui mérite confiance.", "ActuWorld doesn't tell you what to think. It gives you the tools to search, judge, and show what deserves trust.")}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Link to="/app" className="btn-primary glow-hover">
              {t("Découvrir la plateforme", "Discover the platform")} <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </Section>

      {/* POURQUOI ACTUWORLD EXISTE */}
      <Section id="founder" className="bg-aw-surface py-20">
        <AnimatedSection>
          <div className="max-w-4xl mx-auto card p-8 md:p-10">
            <p className="text-sm uppercase tracking-wide text-aw-primary mb-3">
              {t("Pourquoi ActuWorld existe", "Why ActuWorld exists")}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t("J'ai construit l'outil dont j'avais besoin.", "I built the tool I needed.")}
            </h3>
            <p className="text-aw-muted leading-relaxed">
              {t(
                "Quand je lisais des informations, j'avais toujours ce doute : est-ce que c'est fiable ? Il manquait un endroit où l'on puisse partager ce qui nous intéresse tout en montrant d'où ça vient. Un espace où vérifier avant de croire devient naturel. ActuWorld est né de ce besoin.",
                "When I read information, I always had that doubt: is this reliable? I was missing a place where you could share what interests you while showing where it comes from. A space where verifying before believing becomes natural. ActuWorld was born from that need."
              )}
            </p>
            <div className="mt-6">
              <Link to="/app" className="btn-outline">
                {t("Lire notre vision", "Read our vision")}
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </Section>

      {/* ILS SUIVENT LE PROJET */}
      <Section id="supporters" className="py-20">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker={t("Soutiens", "Supporters")} center>
              {isEnglish ? <>They <span className="gradient-text">follow the project</span></> : <>Ils <span className="gradient-text">suivent le projet</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto">
              {t(
                "Des médias et acteurs de l'information qui s'intéressent à notre démarche.",
                "Media outlets and information stakeholders who are interested in our approach."
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10">
            <motion.a
              href="https://territoires.media"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
            >
              <img
                src="/partners/territoires-media.png"
                alt="Territoire(s) Média"
                className="h-12 md:h-16 w-auto object-contain"
              />
            </motion.a>
          </div>
        </AnimatedSection>
      </Section>

      {/* WAITLIST */}
      <Section className="bg-aw-surface py-24">
        <div className="max-w-lg mx-auto">
          <AnimatedSection direction="scale">
            <WaitlistForm />
          </AnimatedSection>
        </div>
      </Section>
    </PageWrapper>
  );
}
