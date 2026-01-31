import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, Video, Brain, Shield, ShieldCheck, Globe2,
  FileText, Lock, Clock, AlertTriangle, CheckCircle2, ChevronRight,
  Database, Users, Eye, Zap
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

export default function RecoSrcPage() {
  const coreFeatures = [
    {
      icon: FileText,
      title: "Vérification Posts & Articles",
      desc: "Extraction automatique des URLs et vérification des sources citées dans nos bases de données fiables.",
      status: "done"
    },
    {
      icon: Video,
      title: "Analyse Vidéos & Multimédia",
      desc: "Transcription audio/vidéo + extraction automatique des claims et recherche de sources correspondantes.",
      status: "done"
    },
    {
      icon: ShieldCheck,
      title: "Notation des Sources",
      desc: "Évaluation complète des sources avec scoring avancé pour une fiabilité maximale.",
      status: "done"
    },
    {
      icon: Brain,
      title: "Détection Cherry-Picking",
      desc: "Comparaison sémantique entre l'affirmation utilisateur et le contenu réel de la source citée.",
      status: "done"
    },
  ];

  const scoringModules = [
    { name: "Base de données", weight: "40%", icon: Database, desc: "301 domaines vérifiés (institutions, médias, scientifiques)" },
    { name: "Crowdsourcing", weight: "20%", icon: Users, desc: "Votes et évaluations de la communauté" },
    { name: "Safe Browsing", weight: "15%", icon: Shield, desc: "Détection malware et phishing (Google)" },
    { name: "Validation SSL", weight: "10%", icon: Lock, desc: "Certificat valide, émetteur de confiance" },
    { name: "Âge WHOIS", weight: "10%", icon: Clock, desc: "Domaines récents = plus suspects" },
    { name: "Métadonnées", weight: "5%", icon: Eye, desc: "Mentions légales, contact, auteur visible" },
  ];

  const domainStats = [
    { category: "Médias", count: 127, examples: "AFP, Reuters, Le Monde..." },
    { category: "Scientifiques", count: 60, examples: "HAL, ArXiv, Nature..." },
    { category: "Institutions", count: 49, examples: "INSEE, ONU, .gouv..." },
    { category: "Blacklist", count: 28, examples: "Infowars, RT..." },
    { category: "Think tanks", count: 18, examples: "IFRI, Fondapol..." },
    { category: "Fact-checkers", count: 9, examples: "Snopes, PolitiFact..." },
  ];

  const usps = [
    {
      title: "Analyse de TOUS les posts et articles",
      desc: "ASV passe derrière chaque post et article pour vérifier automatiquement les sources ET le contenu cité.",
      icon: Zap
    },
    {
      title: "Vérification complète : sources + contenu",
      desc: "On ne checke pas juste si la source existe. On vérifie que ce qui a été dit correspond réellement à la source (détection du cherry-picking).",
      icon: Brain
    },
    {
      title: "Vidéos et multimédia inclus",
      desc: "Analyse des vidéos pour extraire les sources citées, transcrire le contenu et le comparer avec les affirmations de l'auteur.",
      icon: Video
    },
    {
      title: "Interface visuelle pour guider",
      desc: "L'API fournit une info visuelle claire sur chaque article et post. Une première base que l'utilisateur peut développer avec son esprit critique.",
      icon: CheckCircle2
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title="ASV — La vérification gratuite des sources"
        description="ASV (Automatic Source Verification) vérifie gratuitement les posts, articles et vidéos. Identifie automatiquement les sources, les note et détecte le cherry-picking."
        path="/reco-src"
      />
      {/* HEADER */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00A896]/10 via-transparent to-transparent pointer-events-none"></div>
        <Floating duration={8} y={15}>
          <div className="absolute top-20 right-20 w-32 h-32 bg-aw-accent/20 rounded-full blur-2xl" />
        </Floating>
        <Floating duration={6} y={10}>
          <div className="absolute bottom-10 left-20 w-24 h-24 bg-aw-primary/20 rounded-full blur-2xl" />
        </Floating>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center relative"
        >
          <motion.div variants={scaleUp}>
            <motion.span
              className="badge badge-accent mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4" /> ActuWorld Source Verification
            </motion.span>
            <H2 kicker="" center>
              ASV : Vérification <span className="gradient-text">puissante et fiable</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-3xl mx-auto text-lg">
              ASV passe derrière tous les posts et articles pour vérifier automatiquement les sources ET le contenu.
              L'API fournit une base visuelle claire, permettant à chaque utilisateur de développer son esprit critique 
              en se renseignant davantage. Accessible aux journalistes, particuliers et entreprises.
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: Database, label: "301", value: "domaines vérifiés" },
              { icon: Shield, label: "6", value: "modules de scoring" },
              { icon: Globe2, label: "B2B", value: "API disponible" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 px-4 py-2 rounded-xl bg-aw-surface border border-aw"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-10 h-10 rounded-lg bg-aw-success flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-aw-primary" />
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-aw-primary">{stat.label}</div>
                  <div className="text-xs text-aw-muted">{stat.value}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Section>

      {/* USPs vs NewsGuard */}
      <Section className="py-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker="Avantages" center>
              Pourquoi ASV <span className="gradient-text">surpasse</span> les solutions existantes
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {usps.map((usp, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card card-hover p-6"
            >
              <motion.div
                className="w-12 h-12 rounded-xl bg-aw-success flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <usp.icon className="w-6 h-6 text-aw-primary" />
              </motion.div>
              <h3 className="body-semi text-lg mb-2">{usp.title}</h3>
              <p className="text-aw-muted text-sm">{usp.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CORE FEATURES */}
      <Section className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Fonctionnalités" center>
              Les modules de <span className="gradient-text">vérification</span>
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {coreFeatures.map((f, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              whileHover={{ y: -10 }}
              className="card card-hover p-6 relative"
            >
              {f.status === "coming" && (
                <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-aw-accent/20 text-aw-accent font-medium">
                  Bientôt
                </span>
              )}
              {f.status === "done" && (
                <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500 font-medium">
                  ✓ Actif
                </span>
              )}
              <motion.div
                className="w-14 h-14 rounded-2xl bg-aw-success flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <f.icon className="w-7 h-7 text-aw-primary" />
              </motion.div>
              <h3 className="body-semi text-lg mb-2">{f.title}</h3>
              <p className="text-aw-muted text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* SCORING SYSTEM */}
      <Section className="py-24 relative overflow-hidden">
        <Parallax offset={30} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-80 h-80 bg-aw-secondary/10 rounded-full blur-3xl" />
        </Parallax>

        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Algorithme" center>
              Le système de <span className="gradient-text">scoring</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto">
              Un score composite pondéré combinant 6 modules de vérification pour une évaluation complète et fiable.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {scoringModules.map((module, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                className="card p-4 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-aw-primary/10 flex items-center justify-center flex-shrink-0">
                  <module.icon className="w-6 h-6 text-aw-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm">{module.name}</h4>
                    <span className="text-aw-accent font-bold">{module.weight}</span>
                  </div>
                  <p className="text-aw-muted text-xs">{module.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <AnimatedSection delay={0.3} className="mt-8">
            <motion.div
              className="card p-6 bg-gradient-to-r from-aw-primary/5 to-aw-accent/5 border-aw-primary/20"
              whileHover={{ scale: 1.01 }}
            >
              <div className="text-center">
                <code className="text-sm text-aw-muted">
                  Score Final = <span className="text-aw-primary font-semibold">40% DB</span> +
                  <span className="text-aw-primary font-semibold"> 20% Crowd</span> +
                  <span className="text-aw-primary font-semibold"> 15% SafeBrowsing</span> +
                  <span className="text-aw-primary font-semibold"> 10% SSL</span> +
                  <span className="text-aw-primary font-semibold"> 10% WHOIS</span> +
                  <span className="text-aw-primary font-semibold"> 5% Meta</span>
                </code>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </Section>

      {/* DATABASE */}
      <Section className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker="Base de données" center>
              <span className="gradient-text">301 domaines</span> vérifiés
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto">
              Une base de données crowdsourcée et scalable, classée par catégorie et niveau de confiance.
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
        >
          {domainStats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card card-hover p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{stat.category}</h4>
                <span className="text-2xl font-bold text-aw-primary">{stat.count}</span>
              </div>
              <p className="text-aw-muted text-xs">{stat.examples}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CHERRY-PICKING DETECTION */}
      <Section className="py-24">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <motion.span
                className="badge badge-success mb-4"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle2 className="w-4 h-4" /> Feature active et en fonctionnement
              </motion.span>
              <H2 kicker="" center>
                Détection du <span className="gradient-text">cherry-picking</span>
              </H2>
            </div>
          </AnimatedSection>

          <AnimatedSection direction="scale">
            <motion.div
              className="card p-8"
              whileHover={{ scale: 1.01 }}
            >
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Exemple de cherry-picking
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-aw-muted">Source originale (Le Monde) :</span>
                      <p className="text-aw-text italic mt-1">
                        "Le chômage a légèrement baissé de 0.1% ce mois-ci, <strong>mais reste à un niveau préoccupant de 8.5%</strong>, bien au-dessus de la moyenne européenne de 6.2%"
                      </p>
                    </div>
                    <div>
                      <span className="text-aw-muted">Post utilisateur :</span>
                      <p className="text-aw-text italic mt-1">
                        "Selon Le Monde, le chômage a baissé ! 📉"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> Détection ASV
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>✅ Source citée : Le Monde (fiable)</p>
                    <p>❌ Citation fidèle : <strong className="text-red-400">NON - Contexte important omis</strong></p>
                    <p>⚠️ Verdict : Cherry-picking détecté (score fidélité : 20%)</p>
                  </div>
                </div>

            <p className="text-aw-muted text-sm text-center">
              ASV analyse ce qui a été dit et compare avec le contenu réel de la source. Il détecte et note le cherry-picking.
            </p>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </Section>

      {/* USE CASES */}
      <Section className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Cas d'usage" center>
              Pour qui est <span className="gradient-text">ASV</span> ?
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              icon: Users,
              title: "Utilisateurs & Lecteurs",
              desc: "Recevez une base visuelle claire sur chaque article et post. Un premier appui pour développer votre esprit critique.",
              badge: "Lecture & compréhension",
              accent: "from-aw-primary/10 to-aw-accent/10"
            },
            {
              icon: FileText,
              title: "Créateurs de contenu",
              desc: "Publiez du contenu sourcé avec confiance. ASV valide automatiquement vos sources et votre contenu.",
              badge: "Publication fiable",
              accent: "from-aw-success/20 to-aw-primary/10"
            },
            {
              icon: Globe2,
              title: "Journalistes & Médias",
              desc: "API B2B qui vérifie les sources et le contenu pour vous en première passe avant publication. Gagnez du temps dans vos vérifications.",
              badge: "Workflow newsroom",
              accent: "from-aw-secondary/15 to-aw-accent/10"
            },
            {
              icon: ShieldCheck,
              title: "Communauté & Apprenants",
              desc: "Une app ouverte et pédagogique pour tous : un réseau de confiance où l'on vérifie ensemble les sources et le contenu.",
              badge: "Esprit critique",
              accent: "from-aw-primary/10 to-aw-success/20"
            }
          ].map((use, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6, scale: 1.02 }}
              className="card card-hover p-6 text-center border border-aw/60 bg-gradient-to-br from-aw-surface to-aw-bg"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${use.accent} flex items-center justify-center mb-4 mx-auto`}>
                <use.icon className="w-6 h-6 text-aw-primary" />
              </div>
              <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-aw-primary bg-aw-success/30 px-3 py-1 rounded-full mb-3 mx-auto">
                {use.badge}
              </div>
              <h3 className="body-semi text-lg mb-2">{use.title}</h3>
              <p className="text-aw-muted text-sm leading-relaxed">{use.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="py-24">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Prêt à vérifier vos sources ?</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              Rejoignez la beta et soyez parmi les premiers à utiliser ASV.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/pricing" className="btn-primary glow-hover">
                Voir les tarifs <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/contact" className="btn-outline">
                Nous contacter
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
