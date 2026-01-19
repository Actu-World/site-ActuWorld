import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles, Video, Brain, Search, Target, Play, BarChart3, ChevronRight
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

export default function RecoSrcPage() {
  const recoFeatures = [
    { icon: Video, title: "Transcription audio/vidéo", desc: "Conversion automatique du contenu parlé en texte analysable." },
    { icon: Brain, title: "Analyse sémantique", desc: "Identification des affirmations, chiffres et citations par GPT-4." },
    { icon: Search, title: "Recherche de sources", desc: "Interrogation d'APIs académiques (Crossref, Semantic Scholar, Wikipedia)." },
    { icon: Target, title: "Matching intelligent", desc: "Algorithme de similarité pour identifier les sources les plus probables." },
  ];

  const steps = [
    { num: "1", title: "Upload", desc: "Le créateur uploade sa vidéo ou audio sur ActuWorld" },
    { num: "2", title: "Transcription", desc: "RECO-SRC convertit automatiquement le contenu parlé en texte" },
    { num: "3", title: "Analyse", desc: "L'IA identifie les affirmations, chiffres et références" },
    { num: "4", title: "Recherche", desc: "Interrogation des bases académiques et encyclopédiques" },
    { num: "5", title: "Matching", desc: "Algorithme de similarité pour trouver les sources probables" },
    { num: "6", title: "Résultats", desc: "Liste des sources avec niveau de confiance et timestamps" },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      {/* HEADER */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00A896]/10 via-transparent to-transparent pointer-events-none"></div>
        <Floating duration={8} y={15}>
          <div className="absolute top-20 right-20 w-32 h-32 bg-aw-accent/20 rounded-full blur-2xl" />
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
              <Sparkles className="w-4 h-4" /> Intelligence Artificielle
            </motion.span>
            <H2 kicker="" center>
              RECO-SRC, l'IA de <span className="gradient-text">vérification</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-3xl mx-auto text-lg">
              Notre outil extrait automatiquement les sources citées dans les vidéos.
              Un gain de temps massif pour les créateurs et les fact-checkers.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* DEMO */}
      <Section className="py-12">
        <AnimatedSection direction="scale">
          <div className="max-w-5xl mx-auto">
            <motion.div
              className="card p-8"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <motion.div
                    className="aspect-video rounded-xl bg-[#1B3528] flex items-center justify-center relative overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <motion.div
                      className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
                      whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.3)" }}
                      transition={{ duration: 0.2 }}
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white text-sm font-medium">Vidéo analysée par RECO-SRC</div>
                      <div className="text-white/60 text-xs mt-1">Extraction automatique des sources</div>
                    </div>
                  </motion.div>
                </div>

                <div className="lg:w-1/2 space-y-4">
                  <h3 className="body-semi text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-aw-accent" />
                    Sources extraites
                  </h3>

                  <div className="space-y-2">
                    {[
                      { source: "INSEE - Indice des prix", confidence: "95%", time: "0:42" },
                      { source: "Banque Centrale Européenne", confidence: "91%", time: "1:15" },
                      { source: "Étude Université Paris-Saclay", confidence: "87%", time: "2:33" },
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        whileHover={{ x: 5, backgroundColor: "var(--aw-success)" }}
                        className="p-3 rounded-lg bg-aw-bg border border-aw flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="text-sm font-medium">{s.source}</div>
                          <div className="text-xs text-aw-muted">Timestamp : {s.time}</div>
                        </div>
                        <motion.div
                          className="text-aw-primary font-bold"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        >
                          {s.confidence}
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-aw">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-aw-muted">Précision actuelle</span>
                      <span className="text-aw-accent font-bold">~60-70%</span>
                    </div>
                    <div className="text-xs text-aw-muted mt-1">
                      Objectif : 80%+ sur contenu éducatif français
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </Section>

      {/* HOW IT WORKS */}
      <Section className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Comment ça marche" center>
              Le processus <span className="gradient-text">RECO-SRC</span>
            </H2>
          </div>
        </AnimatedSection>

        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card card-hover p-6 relative"
              >
                <motion.div
                  className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-aw-accent flex items-center justify-center text-white font-bold"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {step.num}
                </motion.div>
                <h3 className="body-semi text-lg mb-2 mt-4">{step.title}</h3>
                <p className="text-aw-muted text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* FEATURES */}
      <Section className="py-24 relative overflow-hidden">
        <Parallax offset={30} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-0 w-80 h-80 bg-aw-secondary/10 rounded-full blur-3xl" />
        </Parallax>

        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Technologie" center>
              Les fonctionnalités <span className="gradient-text">clés</span>
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {recoFeatures.map((f, i) => (
            <motion.div
              key={i}
              variants={scaleUp}
              whileHover={{ y: -10 }}
              className="card card-hover p-6 text-center"
            >
              <motion.div
                className="w-14 h-14 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4"
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

      {/* USE CASES */}
      <Section className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Cas d'usage" center>
              Pour qui est <span className="gradient-text">RECO-SRC</span> ?
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          {[
            {
              title: "Créateurs de contenu",
              desc: "Gagnez du temps en extrayant automatiquement vos sources. Publiez plus rapidement du contenu bien sourcé."
            },
            {
              title: "Fact-checkers",
              desc: "Accélérez votre travail de vérification. Identifiez rapidement les sources citées dans les vidéos virales."
            },
            {
              title: "Journalistes",
              desc: "Vérifiez rapidement les affirmations des personnalités publiques. Trouvez les sources originales."
            }
          ].map((use, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.02 }}
              className="card card-hover p-6 text-center"
            >
              <h3 className="body-semi text-lg mb-3">{use.title}</h3>
              <p className="text-aw-muted text-sm">{use.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="py-24">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Prêt à essayer RECO-SRC ?</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              Découvrez nos offres et commencez à utiliser notre IA de vérification de sources.
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
