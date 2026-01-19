import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  Globe2, ChevronRight, FileText, Unlock, ThumbsUp, Sparkles,
  AlertTriangle, Search, TrendingDown, Users
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
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

export default function HomePage() {
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
      title: "Information noyée dans le buzz",
      desc: "Les algorithmes actuels optimisent pour l'engagement émotionnel, pas la qualité. Les contenus éducatifs sont invisibles face au clickbait."
    },
    {
      icon: Search,
      title: "Aucune vérification des sources",
      desc: "N'importe qui peut affirmer n'importe quoi sans preuve. Les fact-checkers interviennent trop tard, après la viralité."
    },
    {
      icon: TrendingDown,
      title: "Créateurs mal rémunérés",
      desc: "Les créateurs éducatifs investissent des dizaines d'heures mais gagnent moins que les créateurs de divertissement superficiel."
    },
    {
      icon: Users,
      title: "Défiance des jeunes",
      desc: "68% des 18-35 ans se sentent manipulés par les algorithmes. 73% veulent une alternative plus éthique et éducative."
    }
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      {/* HERO */}
      <Section id="hero" container={false} className="relative overflow-hidden pt-16 md:pt-24 pb-20">
        {/* Animated blobs */}
        <motion.div
          className="aw-blob w-[40rem] h-[40rem] bg-[#94C9AA] -top-32 -right-32"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="aw-blob w-[32rem] h-[32rem] bg-[#00A896] -bottom-32 -left-32"
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <Floating duration={6} y={20}>
          <div className="aw-blob w-[20rem] h-[20rem] bg-[#2E5F4A] top-1/2 left-1/3 opacity-20" />
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
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aw-success text-aw-primary text-sm font-semibold mb-6"
            >
              <Globe2 className="w-4 h-4" /> Réseau social éducatif nouvelle génération
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="hero-title text-4xl md:text-6xl font-bold leading-tight"
            >
              <span className="text-aw-text">Apprendre plutôt que</span>
              <br />
              <span className="gradient-text">scroller sans fin</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-aw-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              ActuWorld est le <strong className="text-aw-text">premier réseau social anti-buzz</strong> où
              chaque publication doit être sourcée. L'information fiable devient enfin visible,
              et les créateurs de qualité sont mis en avant par la communauté.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/app" className="btn-primary glow-hover">
                Découvrir ActuWorld <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/reco-src" className="btn-outline group">
                <Sparkles className="w-5 h-5 mr-2 text-aw-accent" />
                L'IA ASV
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center gap-6 justify-center"
            >
              {[
                { icon: FileText, label: "Sourcing", value: "obligatoire" },
                { icon: Unlock, label: "Lecture", value: "100% gratuite" },
                { icon: ThumbsUp, label: "Qualité", value: "> Viralité" },
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
              Les réseaux sociaux actuels ont un <span className="gradient-text">problème</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              Optimisés pour l'engagement émotionnel et la viralité, ils noient l'information
              fiable sous le buzz et le clickbait.
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
            <strong className="text-aw-text">ActuWorld</strong> est né de cette frustration :
            créer un réseau social qui <span className="text-aw-primary font-semibold highlight-text">récompense la qualité</span> plutôt que la viralité.
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
              Devenir la référence européenne du réseau social éducatif
            </H2>
            <p className="text-aw-muted mt-6 text-lg leading-relaxed">
              Un espace digital où <strong className="text-aw-text">apprendre prime sur scroller</strong>,
              où l'information sourcée et vérifiée est accessible à tous gratuitement,
              et où les créateurs de contenu de qualité obtiennent la visibilité qu'ils méritent.
            </p>
            <motion.p
              className="text-aw-primary mt-6 body-semi text-lg"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Lutter contre la désinformation par l'éducation, pas la censure.
            </motion.p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Link to="/app" className="btn-primary glow-hover">
              Découvrir la plateforme <ChevronRight className="w-5 h-5 ml-2" />
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
