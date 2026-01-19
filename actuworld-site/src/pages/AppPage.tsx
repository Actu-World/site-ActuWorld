import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Smartphone, FileText, ThumbsUp, BookOpen, Video, Unlock, ShieldCheck,
  BadgeCheck, Eye, Search, Heart, Sparkles, Users
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { Card } from "../components/Card";
import {
  PageWrapper,
  AnimatedSection,
  Parallax,
  staggerContainer,
  fadeInUp,
  fadeInRight,
  scaleUp
} from "../components/animations";

export default function AppPage() {
  const features = [
    { icon: FileText, title: "Sourcing obligatoire", desc: "Impossible de publier sans indiquer ses sources. Chaque affirmation doit être vérifiable." },
    { icon: ThumbsUp, title: "Confiance communautaire", desc: "La communauté vote sur la qualité et fiabilité des posts. Système de score de confiance." },
    { icon: BookOpen, title: "Catégorisation thématique", desc: "Sciences, Histoire, Tech, Santé, Économie... Trouvez facilement ce qui vous intéresse." },
    { icon: Video, title: "RECO-SRC intégré", desc: "Notre IA extrait automatiquement les sources citées dans les vidéos uploadées." },
    { icon: Unlock, title: "100% gratuit en lecture", desc: "Aucun paywall pour accéder au contenu. Le savoir doit rester accessible à tous." },
    { icon: ShieldCheck, title: "Validation progressive", desc: "Nouveaux utilisateurs modérés, puis publication automatique selon leur score de confiance." },
  ];

  const differentiators = [
    { icon: Unlock, title: "Gratuit sans compromis", desc: "Contrairement à Medium ou Substack, tout le contenu reste accessible gratuitement." },
    { icon: Sparkles, title: "IA native", desc: "RECO-SRC est conçu dès le départ pour ActuWorld, pas un outil externe greffé." },
    { icon: Users, title: "Confiance communautaire", desc: "Pas de fact-checkers centralisés coûteux. La communauté valide la qualité." },
    { icon: Heart, title: "Monétisation éthique", desc: "Modèle diversifié qui ne corrompt pas l'algorithme : pub éducative + dons + premium." },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      {/* HEADER */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <Parallax offset={20} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-80 h-80 bg-aw-secondary/20 rounded-full blur-3xl" />
        </Parallax>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center relative"
        >
          <motion.div variants={scaleUp}>
            <span className="badge badge-primary mb-6">
              <Smartphone className="w-4 h-4" /> La Plateforme
            </span>
            <H2 kicker="" center>
              ActuWorld, le réseau social <span className="gradient-text">anti-buzz</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              Un écosystème où l'information sourcée prime sur le divertissement,
              et où les créateurs éducatifs sont valorisés.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* SOLUTION ACTUWORLD */}
      <Section id="solution" className="py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockup téléphone */}
          <AnimatedSection direction="left" className="relative order-2 lg:order-1">
            <div className="relative mx-auto w-72 md:w-80 phone-mockup">
              <motion.div
                className="relative rounded-[3rem] border-8 border-[#1B3528] bg-[#1B3528] shadow-2xl overflow-hidden"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1B3528] rounded-b-xl z-10"></div>
                <div className="aspect-[9/19] bg-aw-bg p-4 pt-8">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-aw-primary">Économie</span>
                      <span className="text-[10px] text-aw-muted">Il y a 2h</span>
                    </div>
                    {/* Post card */}
                    <motion.div
                      className="card p-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-aw-secondary"></div>
                        <div>
                          <div className="text-xs font-semibold">@eco_expert</div>
                          <div className="flex items-center gap-1">
                            <BadgeCheck className="w-3 h-3 text-aw-accent" />
                            <span className="text-[9px] text-aw-muted">Score 94%</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] mb-2">L'inflation en France atteint 4.2% selon les derniers chiffres...</p>
                      {/* Sources */}
                      <div className="bg-aw-bg rounded-lg p-2 mb-2">
                        <div className="text-[9px] text-aw-muted mb-1">3 sources vérifiées</div>
                        <div className="flex gap-1">
                          <span className="text-[8px] px-1.5 py-0.5 bg-aw-success rounded text-aw-primary">INSEE</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-aw-success rounded text-aw-primary">BCE</span>
                          <span className="text-[8px] px-1.5 py-0.5 bg-aw-success rounded text-aw-primary">+1</span>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center justify-between text-[10px] text-aw-muted">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> 847</span>
                          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> 2.1k</span>
                        </div>
                        <button className="px-2 py-1 bg-aw-primary text-white rounded text-[9px]">Soutenir</button>
                      </div>
                    </motion.div>
                    {/* Second post preview */}
                    <motion.div
                      className="card p-3 opacity-60"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      transition={{ delay: 0.8 }}
                    >
                      <div className="h-2 w-3/4 bg-aw-surface rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-aw-surface rounded"></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 bg-aw-secondary rounded-full blur-2xl opacity-40"></div>
              <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-aw-accent rounded-full blur-2xl opacity-30"></div>
            </div>
          </AnimatedSection>

          {/* Features list */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-4 order-1 lg:order-2"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeInRight}
                whileHover={{ x: 10, backgroundColor: "var(--aw-surface)" }}
                className="flex gap-4 p-4 rounded-2xl transition-colors cursor-default"
              >
                <motion.div
                  className="flex-shrink-0 w-11 h-11 rounded-xl bg-aw-success flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <f.icon className="w-5 h-5 text-aw-primary" />
                </motion.div>
                <div>
                  <h3 className="body-semi">{f.title}</h3>
                  <p className="text-aw-muted text-sm mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* EXEMPLE UTILISATEUR EMMA */}
      <Section id="example" className="bg-aw-surface py-24">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker="En pratique" center>
              L'expérience <span className="gradient-text">Emma</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto">
              Découvrez comment une étudiante utilise ActuWorld au quotidien.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              { num: "1", text: "Emma, étudiante en économie, ouvre ActuWorld le matin", icon: Smartphone },
              { num: "2", text: "Son feed montre un article sur l'inflation avec 3 sources (INSEE, BCE, étude universitaire)", icon: FileText },
              { num: "3", text: "Elle clique sur les sources pour approfondir et vérifier", icon: Search },
              { num: "4", text: "Elle vote 'fiable' sur le post, augmentant le score du créateur", icon: ThumbsUp },
              { num: "5", text: "Elle découvre d'autres posts du créateur dans la catégorie Économie", icon: BookOpen },
              { num: "6", text: "Elle décide de donner 3€ pour soutenir le créateur", icon: Heart },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card card-hover p-5 relative"
              >
                <motion.div
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-aw-primary flex items-center justify-center text-white font-bold text-sm"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {step.num}
                </motion.div>
                <step.icon className="w-8 h-8 text-aw-secondary mb-3 mt-2" />
                <p className="text-sm text-aw-muted">{step.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* DIFFÉRENCIATEURS */}
      <Section id="why" className="py-24 relative overflow-hidden">
        <Parallax offset={40} className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-aw-accent/10 rounded-full blur-3xl" />
        </Parallax>

        <AnimatedSection>
          <div className="text-center mb-16">
            <H2 kicker="Pourquoi nous" center>
              Ce qui nous rend <span className="gradient-text">uniques</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              ActuWorld est le <strong>seul</strong> réseau social combinant sourcing obligatoire,
              IA intégrée et système de confiance communautaire.
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative"
        >
          {differentiators.map((d, i) => (
            <motion.div key={i} variants={scaleUp}>
              <motion.div whileHover={{ y: -10, scale: 1.02 }}>
                <Card icon={d.icon} title={d.title}>{d.desc}</Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="bg-aw-surface py-16">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Découvrez notre IA de vérification</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              RECO-SRC extrait automatiquement les sources citées dans les vidéos.
              Un gain de temps massif pour les créateurs et les fact-checkers.
            </p>
            <Link to="/reco-src" className="btn-primary glow-hover">
              <Sparkles className="w-5 h-5 mr-2" /> Découvrir RECO-SRC
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
