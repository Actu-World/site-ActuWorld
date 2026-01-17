import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, GraduationCap, Compass, Star, BadgeCheck, ListChecks,
  FileText, Brain, Languages, Bell, LineChart, Megaphone, HelpCircle, Mail,
  ChevronRight, Play, Video, Search, BarChart3, CheckCircle2, Sparkles, Eye,
  Zap, ArrowRight, Smartphone, Target
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { Card } from "../components/Card";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function ActuWorldLanding() {
  const features = useMemo(() => [
    { icon: BadgeCheck, title: "Badges de vérification", desc: "Sources authentifiées (institutions, médias reconnus, experts). Transparence by design." },
    { icon: ShieldCheck, title: "Score de fiabilité", desc: "Notation dynamique des contenus selon sources, ancienneté, et concordance." },
    { icon: FileText, title: "Traçabilité des sources", desc: "Liens, archives, citations : tout est référencé + indicateur de fraîcheur." },
    { icon: GraduationCap, title: "Apprentissage actif", desc: "Fiches synthèse, glossaire, quiz, modes d'explication débutant → expert." },
    { icon: Brain, title: "Parcours guidés", desc: "Comprendre un sujet en 10 min/jour. Curation humaine + algorithmes explicables." },
    { icon: Languages, title: "Multilingue", desc: "Mise en avant des sources locales fiables. Traductions de qualité." },
    { icon: Bell, title: "Alertes intelligentes", desc: "Seulement quand un fait est confirmé ou qu'un score de confiance change." },
    { icon: ListChecks, title: "Modération responsable", desc: "Signalements pondérés par réputation + revue humaine sur sujets sensibles." },
  ], []);

  const aiFeatures = [
    { icon: Video, title: "Analyse automatique", desc: "Extraction des sources et faits cités directement depuis le contenu vidéo." },
    { icon: Search, title: "Identification des sources", desc: "Détection et catalogage des références mentionnées par les créateurs." },
    { icon: BarChart3, title: "Notation des sources", desc: "Classement automatique de la fiabilité des sources citées." },
    { icon: Target, title: "Comparaison contenu/source", desc: "Analyse de la concordance entre ce qui est dit et les sources données." },
  ];

  const business = [
    { icon: Star, title: "Freemium", price: "0€", points: ["Lecture gratuite", "Pub limitée non intrusive", "Bases d'apprentissage"] },
    { icon: LineChart, title: "ActuWorld+", price: "4,99€/mois", points: ["Parcours avancés & quiz illimités", "Veille thématique", "Sans pub"] },
    { icon: Megaphone, title: "Organisations Verified", price: "19€/mois", points: ["Badge vérifié", "Page dédiée + API", "Tarif ONG/Éducation"] },
  ];

  const stats = [
    { value: "95%", label: "Précision IA" },
    { value: "24/7", label: "Analyse continue" },
    { value: "50+", label: "Sources vérifiées" },
    { value: "10k+", label: "Vidéos analysées" },
  ];

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">

      {/* HERO - Section principale */}
      <Section id="hero" container={false} className="relative overflow-hidden pt-16 md:pt-24 pb-20">
        {/* Décor background - Blobs aux couleurs de la charte */}
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
            <motion.p
              variants={fadeIn}
              className="overline text-aw-primary mb-6"
            >
              Apprendre • Comprendre • Vérifier
            </motion.p>

            <motion.h1
              variants={fadeIn}
              className="hero-title text-4xl md:text-6xl font-bold leading-tight"
            >
              <span className="text-aw-text">
                L'information
              </span>
              <br />
              <span className="text-aw-primary">
                vérifiée par l'IA
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="mt-8 text-aw-muted text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            >
              ActuWorld analyse automatiquement les vidéos pour identifier les sources,
              vérifier les faits et vous donner un <strong className="text-aw-text">score de fiabilité</strong> en temps réel.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#app" className="btn-primary">
                Découvrir l'app <ChevronRight className="w-5 h-5 ml-2" />
              </a>
              <a href="#ai-tool" className="btn-outline group">
                <Sparkles className="w-5 h-5 mr-2 text-aw-accent" />
                L'outil IA
              </a>
            </motion.div>

            <motion.div
              variants={fadeIn}
              className="mt-12 flex flex-wrap items-center gap-6 justify-center text-sm text-aw-muted"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-aw-primary" /> Anti-fake news
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-aw-accent" /> 100% transparent
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-aw-secondary" /> Analyse temps réel
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-aw-primary">
                  {stat.value}
                </div>
                <div className="caption text-aw-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Section App ActuWorld */}
      <Section id="app" className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="badge badge-primary mb-6">
              <Smartphone className="w-4 h-4" /> Application Mobile
            </span>
            <H2 kicker="" center>
              ActuWorld, l'app pour <span className="text-aw-accent">comprendre</span> l'actualité
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              Plus qu'un agrégateur d'infos : un véritable outil d'apprentissage et de vérification
              pour devenir un citoyen éclairé.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Mockup téléphone */}
            <motion.div variants={fadeIn} className="relative">
              <div className="relative mx-auto w-72 md:w-80">
                {/* Phone frame */}
                <div className="relative rounded-[3rem] border-8 border-[#1B3528] bg-[#1B3528] shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1B3528] rounded-b-xl z-10"></div>
                  <div className="aspect-[9/19] bg-aw-bg p-4 pt-8">
                    {/* App content mockup */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-aw-secondary"></div>
                        <div>
                          <div className="h-3 w-24 bg-aw-surface rounded"></div>
                          <div className="h-2 w-16 bg-aw-surface rounded mt-1"></div>
                        </div>
                        <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-aw-success rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-aw-primary" />
                          <span className="text-[10px] text-aw-primary font-semibold">92%</span>
                        </div>
                      </div>
                      {[1,2,3].map((_, i) => (
                        <div key={i} className="card p-3">
                          <div className="h-2.5 w-full bg-aw-bg rounded mb-2"></div>
                          <div className="h-2 w-3/4 bg-aw-bg rounded mb-3"></div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <BadgeCheck className="w-3 h-3 text-aw-accent" />
                              <span className="text-[9px] text-aw-muted">Source vérifiée</span>
                            </div>
                            <div className="h-5 w-12 bg-aw-primary rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 bg-aw-secondary rounded-full blur-2xl opacity-40"></div>
                <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-aw-accent rounded-full blur-2xl opacity-30"></div>
              </div>
            </motion.div>

            {/* Features list */}
            <motion.div variants={fadeIn} className="space-y-6">
              {[
                { icon: BadgeCheck, title: "Sources vérifiées", desc: "Chaque information est tracée jusqu'à sa source avec un indicateur de fiabilité." },
                { icon: GraduationCap, title: "Apprentissage intégré", desc: "Fiches, quiz et parcours pour transformer l'actualité en connaissance durable." },
                { icon: Compass, title: "Algorithme transparent", desc: "Comprenez pourquoi vous voyez chaque contenu et ajustez vos préférences." },
                { icon: Bell, title: "Notifications intelligentes", desc: "Alertes uniquement sur les faits confirmés ou changements de score." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-aw-bg transition-colors">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-aw-success flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-aw-primary" />
                  </div>
                  <div>
                    <h3 className="body-semi text-lg">{item.title}</h3>
                    <p className="text-aw-muted text-sm mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* Section Outil IA - Analyse Vidéo */}
      <Section id="ai-tool" className="py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#94C9AA]/10 to-transparent pointer-events-none"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-7xl mx-auto relative"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="badge badge-accent mb-6">
              <Sparkles className="w-4 h-4" /> Intelligence Artificielle
            </span>
            <H2 kicker="" center>
              Analyse vidéo <span className="text-aw-accent">intelligente</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-3xl mx-auto text-lg">
              Notre outil IA révolutionnaire analyse automatiquement les vidéos pour identifier
              les sources citées, vérifier les faits et comparer le contenu avec les références données.
            </p>
          </motion.div>

          {/* Video analysis demo */}
          <motion.div variants={fadeIn} className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="card p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Video placeholder */}
                  <div className="lg:w-1/2">
                    <div className="aspect-video rounded-xl bg-[#1B3528] flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white text-sm font-medium">Démonstration de l'analyse IA</div>
                        <div className="text-white/60 text-xs mt-1">Voir comment fonctionne notre technologie</div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis results */}
                  <div className="lg:w-1/2 space-y-4">
                    <h3 className="body-semi text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-aw-accent" />
                      Résultats d'analyse
                    </h3>

                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-aw-bg border border-aw">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Sources identifiées</span>
                          <span className="text-aw-accent font-bold">12</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: '80%' }}></div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-aw-bg border border-aw">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Score de fiabilité global</span>
                          <span className="text-aw-primary font-bold">87%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: '87%' }}></div>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-aw-bg border border-aw">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Concordance contenu/sources</span>
                          <span className="text-aw-secondary font-bold">74%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-bar-fill" style={{ width: '74%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiFeatures.map((f, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="card card-hover p-6 text-center"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4">
                  <f.icon className="w-7 h-7 text-aw-primary" />
                </div>
                <h3 className="body-semi text-lg mb-2">{f.title}</h3>
                <p className="text-aw-muted text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Comment ça marche */}
      <Section id="how" className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center mb-16">
            <H2 kicker="En pratique" center>Comment ça marche ?</H2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Soumettez une vidéo", desc: "Collez un lien ou uploadez directement le contenu à analyser.", icon: Video },
              { num: "02", title: "L'IA analyse", desc: "Extraction des sources, faits et vérification en temps réel.", icon: Brain },
              { num: "03", title: "Résultats détaillés", desc: "Score de fiabilité, sources listées et comparatif contenu/références.", icon: CheckCircle2 },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="relative"
              >
                <div className="card p-8 h-full">
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-aw-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.num}
                  </div>
                  <div className="pt-4">
                    <step.icon className="w-10 h-10 text-aw-secondary mb-4" />
                    <h3 className="body-semi text-xl mb-3">{step.title}</h3>
                    <p className="text-aw-muted">{step.desc}</p>
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-aw-secondary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Fonctionnalités */}
      <Section id="features" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <H2 kicker="Fonctionnalités clés" center>Tout ce qu'il faut pour apprendre et faire confiance.</H2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card icon={f.icon} title={f.title}>{f.desc}</Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Business */}
      <Section id="business" className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <H2 kicker="Tarifs" center>Un modèle aligné avec la qualité de l'info.</H2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {business.map((b, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className={`card p-8 relative ${i === 1 ? 'ring-2 ring-aw-primary' : ''}`}
              >
                {i === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-aw-primary text-white text-xs font-bold rounded-full">
                    Populaire
                  </div>
                )}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-aw-success flex items-center justify-center">
                    <b.icon className="w-6 h-6 text-aw-primary" />
                  </div>
                  <h3 className="body-semi text-xl">{b.title}</h3>
                </div>
                <ul className="space-y-3 text-aw-muted mb-6">
                  {b.points.map((p, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-aw-accent flex-shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-aw">
                  <span className="caption text-aw-muted">à partir de</span>
                  <div className="text-3xl font-bold text-aw-text">{b.price}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section id="faq" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <H2 kicker="FAQ" center>Questions fréquentes</H2>
          </motion.div>
          <div className="max-w-4xl mx-auto mt-12 space-y-4">
            {[
              { q: "Comment fonctionne l'analyse IA des vidéos ?", a: "Notre IA utilise des modèles de traitement du langage naturel et de vision pour extraire les affirmations, identifier les sources citées et les comparer avec des bases de données de faits vérifiés." },
              { q: "Comment gérez-vous les fake news ?", a: "Réputation + badges + score de fiabilité + revue humaine. Contenus traçables et contestables (avec sources)." },
              { q: "Vos algorithmes sont-ils opaques ?", a: 'Non : un mode "pourquoi je vois ça ?" explique les facteurs et permet des réglages.' },
              { q: "C'est payant ?", a: "Le cœur est gratuit (freemium). L'offre + supprime la pub et ajoute des fonctions avancées d'analyse." },
              { q: "Mode hors-ligne ?", a: "Oui pour les fiches et parcours sauvegardés." },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className="card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-aw-success flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-aw-primary" />
                  </div>
                  <div>
                    <h3 className="body-semi text-lg">{item.q}</h3>
                    <p className="text-aw-muted mt-2">{item.a}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* CTA Final */}
      <Section id="contact" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E5F4A]/10 via-[#94C9AA]/10 to-[#00A896]/10 pointer-events-none"></div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative"
        >
          <motion.div variants={fadeIn} className="max-w-3xl mx-auto text-center">
            <H2 kicker="Prêt à commencer ?" center>Rejoignez la révolution de l'info vérifiée</H2>
            <p className="text-aw-muted mt-4 text-lg">
              Démo, partenariat (éducation, médias, ONG, collectivités) ? Contactez-nous.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:contact@actuworld.app" className="btn-primary">
                <Mail className="w-5 h-5 mr-2"/> contact@actuworld.app
              </a>
              <a href="#hero" className="btn-outline">
                Télécharger l'app (bientôt)
              </a>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}
