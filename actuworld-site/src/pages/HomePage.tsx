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
      desc: t("Les algorithmes privilégient l'engagement émotionnel et la viralité. L'information éducative est invisible face au clickbait et aux tendances.", "Algorithms prioritize emotional engagement and virality. Educational information becomes invisible against clickbait and trends.")
    },
    {
      icon: Search,
      title: t("Absence de sourcage", "Lack of sourcing"),
      desc: t("Aucune vérification des sources. N'importe qui peut affirmer n'importe quoi. Les fact-checkers arrivent trop tard, après la propagation virale.", "No source verification. Anyone can claim anything. Fact-checkers arrive too late, after viral spread.")
    },
    {
      icon: TrendingDown,
      title: t("Désinformation incontrôlée", "Unchecked misinformation"),
      desc: t("Sans transparence sur les sources, la désinformation se propage rapidement. Les utilisateurs ne savent plus en qui faire confiance.", "Without source transparency, misinformation spreads rapidly. Users no longer know whom to trust.")
    },
    {
      icon: Users,
      title: t("Perte de confiance", "Loss of trust"),
      desc: t("73% des jeunes cherchent une alternative éthique. Ils veulent une plateforme basée sur la vérification et l'éducation, pas sur la manipulation.", "73% of young people are looking for an ethical alternative. They want a platform built on verification and education, not manipulation.")
    }
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("ActuWorld — L'information vérifiée par tous, accessible à tous", "ActuWorld — Verified information by everyone, for everyone")}
        description={t("Le réseau social de l'information fiable où chaque publication est sourcée. Accédez à une information claire et valorisez les créateurs de qualité.", "The social network for reliable information where every publication is sourced. Access clear information and support high-quality creators.")}
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
              <span className="text-aw-text">{t("L'information fiable", "Reliable information")}</span>
              <br />
              <span className="gradient-text">{t("enfin mise en avant", "finally put first")}</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-aw-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              {t("ActuWorld réinvente la façon dont nous nous informons. Sur cette plateforme, ", "ActuWorld is reinventing how we stay informed. On this platform, ")}
              <strong className="text-aw-text"> {t("chaque contenu est sourcé et évalué par la communauté", "every piece of content is sourced and reviewed by the community")}</strong>. 
              {t("Fini le buzz sans fondement. Bienvenue dans le réseau social de l'intelligence collective, où ", "No more baseless buzz. Welcome to the social network of collective intelligence, where ")}
              <strong className="text-aw-text">{t("la qualité prime sur la viralité", "quality comes before virality")}</strong>.
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
              {isEnglish ? <>Today's social networks <span className="gradient-text">prioritize entertainment</span></> : <>Les réseaux sociaux d'aujourd'hui <span className="gradient-text">privilégient le divertissement</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("La majorité des plateformes optimisent pour l'engagement émotionnel. L'information fiable se noie dans un flux constant. Résultat : désinformation, perte de confiance, et créateurs éducatifs marginalisés.", "Most platforms optimize for emotional engagement. Reliable information is drowned in a constant stream. Result: misinformation, loss of trust, and marginalized educational creators.")}
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
            <span className="text-aw-primary font-semibold highlight-text"> {t("rendre l'information utile, claire et formatrice", "make information useful, clear, and educational")}</span>. 
            {t("Un réseau basé sur l'", "A network based on ")}<strong className="text-aw-text">{t("intelligence collective", "collective intelligence")}</strong>{t(", où la communauté valide la fiabilité des contenus.", ", where the community validates content reliability.")}
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
              {isEnglish ? <>Building the future of <span className="gradient-text">educational information</span></> : <>Bâtir l'avenir de l'<span className="gradient-text">information éducative</span></>}
            </H2>
            <p className="text-aw-muted mt-6 text-lg leading-relaxed">
              {t("Une plateforme où les utilisateurs créent et consultent des ", "A platform where users create and consult ")}<strong className="text-aw-text">{t("posts détaillés, articles et vidéos éducatives", "detailed posts, articles, and educational videos")}</strong>{t(" sur des sujets variés : actualité, culture, science, environnement…", " on a wide range of topics: news, culture, science, environment...")}
              <br /><br />
              {t("Chaque contenu est ", "Every piece of content is ")}<strong className="text-aw-text">{t("sourcé", "sourced")}</strong>{t(" et évalué par un score de fiabilité. ", " and evaluated through a reliability score. ")}
              {t("Un ", "A ")}<strong className="text-aw-text">{t("parcours de contributeur", "contributor pathway")}</strong>{t(" (Explorateur → Navigateur → Pionnier) valorise les créateurs sérieux. Et ", " (Explorer → Navigator → Pioneer) rewards serious creators. And ")}
              <strong className="text-aw-text">ASV</strong>, {t("notre outil de vérification automatique, analyse les sources, les note, et détecte le ", "our automatic verification tool, analyzes sources, rates them, and detects ")}<Tooltip text={t("Le cherry-picking consiste à sélectionner uniquement les données ou faits qui soutiennent son argument, en ignorant ceux qui le contredisent.", "Cherry-picking means selecting only data or facts that support an argument while ignoring contradictory evidence.")}>cherry-picking</Tooltip>{t(" pour une transparence maximale.", " for maximum transparency.")}
            </p>
            <motion.p
              className="text-aw-primary mt-6 body-semi text-lg"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t("Lutter contre la désinformation par l'éducation et l'intelligence collective.", "Fighting misinformation through education and collective intelligence.")}
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Link to="/app" className="btn-primary glow-hover">
              {t("Découvrir la plateforme", "Discover the platform")} <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
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
