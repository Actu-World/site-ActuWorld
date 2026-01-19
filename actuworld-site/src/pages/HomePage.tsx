import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe2, ChevronRight, FileText, Unlock, ThumbsUp, Sparkles,
  AlertTriangle, Search, TrendingDown, Users
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
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
    <div className="min-h-screen bg-aw-bg text-aw-text">
      {/* HERO */}
      <Section id="hero" container={false} className="relative overflow-hidden pt-16 md:pt-24 pb-20">
        <div className="aw-blob w-[40rem] h-[40rem] bg-[#94C9AA] -top-32 -right-32 rounded-full"></div>
        <div className="aw-blob w-[32rem] h-[32rem] bg-[#00A896] -bottom-32 -left-32 rounded-full"></div>
        <div className="aw-blob w-[20rem] h-[20rem] bg-[#2E5F4A] top-1/2 left-1/3 rounded-full opacity-20"></div>

        <div className="max-w-7xl mx-auto container-px relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aw-success text-aw-primary text-sm font-semibold mb-6">
              <Globe2 className="w-4 h-4" /> Réseau social éducatif nouvelle génération
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="hero-title text-4xl md:text-6xl font-bold leading-tight"
            >
              <span className="text-aw-text">Apprendre plutôt que</span>
              <br />
              <span className="text-aw-primary">scroller sans fin</span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="mt-8 text-aw-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              ActuWorld est le <strong className="text-aw-text">premier réseau social anti-buzz</strong> où
              chaque publication doit être sourcée. L'information fiable devient enfin visible,
              et les créateurs de qualité sont justement rémunérés.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/app" className="btn-primary">
                Découvrir ActuWorld <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/reco-src" className="btn-outline group">
                <Sparkles className="w-5 h-5 mr-2 text-aw-accent" />
                L'IA RECO-SRC
              </Link>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mt-12 flex flex-wrap items-center gap-6 justify-center"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-aw-success flex items-center justify-center">
                  <FileText className="w-5 h-5 text-aw-primary" />
                </div>
                <span className="text-aw-muted">Sourcing<br/><strong className="text-aw-text">obligatoire</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-aw-success flex items-center justify-center">
                  <Unlock className="w-5 h-5 text-aw-primary" />
                </div>
                <span className="text-aw-muted">Lecture<br/><strong className="text-aw-text">100% gratuite</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-10 h-10 rounded-full bg-aw-success flex items-center justify-center">
                  <ThumbsUp className="w-5 h-5 text-aw-primary" />
                </div>
                <span className="text-aw-muted">Qualité<br/><strong className="text-aw-text">&gt; Viralité</strong></span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Section>

      {/* LE PROBLÈME */}
      <Section id="problem" className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <H2 kicker="Le constat" center>
              Les réseaux sociaux actuels ont un <span className="text-aw-accent">problème</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              Optimisés pour l'engagement émotionnel et la viralité, ils noient l'information
              fiable sous le buzz et le clickbait.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="card p-6 flex gap-4"
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
          </div>

          <motion.div variants={fadeIn} className="mt-12 text-center">
            <p className="text-lg text-aw-muted">
              <strong className="text-aw-text">ActuWorld</strong> est né de cette frustration :
              créer un réseau social qui <span className="text-aw-primary font-semibold">récompense la qualité</span> plutôt que la viralité.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* VISION */}
      <Section id="vision" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeIn}>
            <H2 kicker="Notre vision" center>
              Devenir la référence européenne du réseau social éducatif
            </H2>
            <p className="text-aw-muted mt-6 text-lg leading-relaxed">
              Un espace digital où <strong className="text-aw-text">apprendre prime sur scroller</strong>,
              où l'information sourcée et vérifiée est accessible à tous gratuitement,
              et où les créateurs de contenu de qualité sont justement rémunérés.
            </p>
            <p className="text-aw-primary mt-6 body-semi text-lg">
              Lutter contre la désinformation par l'éducation, pas la censure.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="mt-12">
            <Link to="/app" className="btn-primary">
              Découvrir la plateforme <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}
