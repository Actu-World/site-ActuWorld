import { motion } from "framer-motion";
import {
  ShieldCheck, Star, BadgeCheck, FileText, Brain, LineChart, Megaphone,
  HelpCircle, Mail, ChevronRight, Play, Video, Search, BarChart3,
  CheckCircle2, Sparkles, Eye, Smartphone, Target, Users, AlertTriangle,
  TrendingDown, ThumbsUp, BookOpen, Globe2, Heart, Unlock
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { Card } from "../components/Card";
import { PageMeta } from "../components/PageMeta";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function ActuWorldLanding() {
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

  const features = [
    { icon: FileText, title: "Sourcing obligatoire", desc: "Impossible de publier sans indiquer ses sources. Chaque affirmation doit être vérifiable." },
    { icon: ThumbsUp, title: "Confiance communautaire", desc: "La communauté vote sur la qualité et fiabilité des posts. Système de score de confiance." },
    { icon: BookOpen, title: "Catégorisation thématique", desc: "Sciences, Histoire, Tech, Santé, Économie... Trouvez facilement ce qui vous intéresse." },
    { icon: Video, title: "RECO-SRC intégré", desc: "Notre IA extrait automatiquement les sources citées dans les vidéos uploadées." },
    { icon: Unlock, title: "100% gratuit en lecture", desc: "Aucun paywall pour accéder au contenu. Le savoir doit rester accessible à tous." },
    { icon: ShieldCheck, title: "Validation progressive", desc: "Nouveaux utilisateurs modérés, puis publication automatique selon leur score de confiance." },
  ];

  const recoFeatures = [
    { icon: Video, title: "Transcription audio/vidéo", desc: "Conversion automatique du contenu parlé en texte analysable." },
    { icon: Brain, title: "Analyse sémantique", desc: "Identification des affirmations, chiffres et citations par GPT-4." },
    { icon: Search, title: "Recherche de sources", desc: "Interrogation d'APIs académiques (Crossref, Semantic Scholar, Wikipedia)." },
    { icon: Target, title: "Matching intelligent", desc: "Algorithme de similarité pour identifier les sources les plus probables." },
  ];

  const differentiators = [
    { icon: Unlock, title: "Gratuit sans compromis", desc: "Contrairement à Medium ou Substack, tout le contenu reste accessible gratuitement." },
    { icon: Sparkles, title: "IA native", desc: "RECO-SRC est conçu dès le départ pour ActuWorld, pas un outil externe greffé." },
    { icon: Users, title: "Confiance communautaire", desc: "Pas de fact-checkers centralisés coûteux. La communauté valide la qualité." },
    { icon: Heart, title: "Monétisation éthique", desc: "Modèle diversifié qui ne corrompt pas l'algorithme : pub éducative + dons + premium." },
  ];

  const pricing = [
    { icon: Star, title: "Lecteur", price: "0€", desc: "Pour toujours", points: ["Lecture illimitée", "Accès à toutes les sources", "Votes communautaires", "Suivre des créateurs"] },
    { icon: LineChart, title: "Créateur", price: "0€", desc: "Gratuit pour publier", points: ["Publication sourcée", "RECO-SRC (5 vidéos/mois)", "Recevoir des dons", "Statistiques basiques"] },
    { icon: Megaphone, title: "Créateur Pro", price: "9,99€/mois", desc: "Pour les créateurs sérieux", points: ["RECO-SRC illimité", "Badge vérifié", "Statistiques avancées", "Support prioritaire"] },
  ];

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title="ActuWorld — Le réseau social de l'information fiable"
        description="Découvrez comment ActuWorld combat la désinformation avec le sourcing obligatoire, un système de confiance communautaire et l'IA ASV."
        path="/actuworld"
      />

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
              et les créateurs de qualité sont valorisés par la communauté.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a href="#solution" className="btn-primary">
                Découvrir ActuWorld <ChevronRight className="w-5 h-5 ml-2" />
              </a>
              <a href="#reco-src" className="btn-outline group">
                <Sparkles className="w-5 h-5 mr-2 text-aw-accent" />
                L'IA RECO-SRC
              </a>
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

      {/* NOTRE SOLUTION - ACTUWORLD */}
      <Section id="solution" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="badge badge-primary mb-6">
              <Smartphone className="w-4 h-4" /> La Plateforme
            </span>
            <H2 kicker="" center>
              ActuWorld, le réseau social <span className="text-aw-primary">anti-buzz</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              Un écosystème où l'information sourcée prime sur le divertissement,
              et où les créateurs éducatifs sont valorisés.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Mockup téléphone */}
            <motion.div variants={fadeIn} className="relative order-2 lg:order-1">
              <div className="relative mx-auto w-72 md:w-80">
                <div className="relative rounded-[3rem] border-8 border-[#1B3528] bg-[#1B3528] shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1B3528] rounded-b-xl z-10"></div>
                  <div className="aspect-[9/19] bg-aw-bg p-4 pt-8">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-aw-primary">Économie</span>
                        <span className="text-[10px] text-aw-muted">Il y a 2h</span>
                      </div>
                      {/* Post card */}
                      <div className="card p-3">
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
                      </div>
                      {/* Second post preview */}
                      <div className="card p-3 opacity-60">
                        <div className="h-2 w-3/4 bg-aw-surface rounded mb-2"></div>
                        <div className="h-2 w-1/2 bg-aw-surface rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -z-10 -top-8 -right-8 w-40 h-40 bg-aw-secondary rounded-full blur-2xl opacity-40"></div>
                <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-aw-accent rounded-full blur-2xl opacity-30"></div>
              </div>
            </motion.div>

            {/* Features list */}
            <motion.div variants={fadeIn} className="space-y-4 order-1 lg:order-2">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-aw-surface transition-colors">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-aw-success flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-aw-primary" />
                  </div>
                  <div>
                    <h3 className="body-semi">{f.title}</h3>
                    <p className="text-aw-muted text-sm mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* EXEMPLE UTILISATEUR EMMA */}
      <Section id="example" className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <H2 kicker="En pratique" center>
              L'expérience <span className="text-aw-accent">Emma</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto">
              Découvrez comment une étudiante utilise ActuWorld au quotidien.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  variants={fadeIn}
                  className="card p-5 relative"
                >
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-lg bg-aw-primary flex items-center justify-center text-white font-bold text-sm">
                    {step.num}
                  </div>
                  <step.icon className="w-8 h-8 text-aw-secondary mb-3 mt-2" />
                  <p className="text-sm text-aw-muted">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Section>

      {/* RECO-SRC */}
      <Section id="reco-src" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00A896]/5 to-transparent pointer-events-none"></div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="badge badge-accent mb-6">
              <Sparkles className="w-4 h-4" /> Intelligence Artificielle
            </span>
            <H2 kicker="" center>
              RECO-SRC, l'IA de <span className="text-aw-accent">vérification</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-3xl mx-auto text-lg">
              Notre outil extrait automatiquement les sources citées dans les vidéos.
              Un gain de temps massif pour les créateurs et les fact-checkers.
            </p>
          </motion.div>

          {/* Demo card */}
          <motion.div variants={fadeIn} className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="card p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/2">
                    <div className="aspect-video rounded-xl bg-[#1B3528] flex items-center justify-center relative overflow-hidden group cursor-pointer">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-white text-sm font-medium">Vidéo analysée par RECO-SRC</div>
                        <div className="text-white/60 text-xs mt-1">Extraction automatique des sources</div>
                      </div>
                    </div>
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
                        <div key={i} className="p-3 rounded-lg bg-aw-bg border border-aw flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{s.source}</div>
                            <div className="text-xs text-aw-muted">Timestamp : {s.time}</div>
                          </div>
                          <div className="text-aw-primary font-bold">{s.confidence}</div>
                        </div>
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
              </div>
            </div>
          </motion.div>

          {/* How it works */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recoFeatures.map((f, i) => (
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

      {/* DIFFÉRENCIATEURS */}
      <Section id="why" className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <H2 kicker="Pourquoi nous" center>
              Ce qui nous rend <span className="text-aw-primary">uniques</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              ActuWorld est le <strong>seul</strong> réseau social combinant sourcing obligatoire,
              IA intégrée et système de confiance communautaire.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {differentiators.map((d, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card icon={d.icon} title={d.title}>{d.desc}</Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* TARIFS */}
      <Section id="pricing" className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <H2 kicker="Tarifs" center>
              Le savoir accessible à <span className="text-aw-accent">tous</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto">
              La lecture est et restera toujours gratuite. Pas de paywall sur le savoir.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className={`card p-8 relative ${i === 2 ? 'ring-2 ring-aw-primary' : ''}`}
              >
                {i === 2 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-aw-primary text-white text-xs font-bold rounded-full">
                    Recommandé
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-aw-success flex items-center justify-center">
                    <p.icon className="w-6 h-6 text-aw-primary" />
                  </div>
                  <div>
                    <h3 className="body-semi text-xl">{p.title}</h3>
                    <p className="text-xs text-aw-muted">{p.desc}</p>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-6">{p.price}</div>
                <ul className="space-y-3 text-aw-muted mb-6">
                  {p.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-aw-accent flex-shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* VISION */}
      <Section id="vision" className="bg-aw-surface py-24">
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
              et où les créateurs de contenu de qualité obtiennent la visibilité qu'ils méritent.
            </p>
            <p className="text-aw-primary mt-6 body-semi text-lg">
              Lutter contre la désinformation par l'éducation, pas la censure.
            </p>
          </motion.div>
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
          <motion.div variants={fadeIn} className="text-center mb-12">
            <H2 kicker="FAQ" center>Questions fréquentes</H2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { q: "Pourquoi le sourcing est-il obligatoire ?", a: "C'est le cœur de notre mission. Chaque affirmation doit pouvoir être vérifiée. Cela combat la désinformation à la source et responsabilise les créateurs." },
              { q: "Comment fonctionne le système de confiance ?", a: "Les utilisateurs votent sur la qualité et fiabilité des posts. Ces votes construisent un score de confiance pour chaque créateur, visible sur leur profil." },
              { q: "RECO-SRC remplace-t-il les fact-checkers ?", a: "Non, il les aide. RECO-SRC extrait automatiquement les sources citées dans les vidéos, faisant gagner un temps précieux aux vérificateurs humains." },
              { q: "Pourquoi la lecture est-elle gratuite ?", a: "L'accès au savoir ne doit pas dépendre du portefeuille. Notre modèle repose sur les créateurs pro, les dons et la publicité éducative ciblée." },
              { q: "Qui peut devenir créateur ?", a: "Tout le monde ! Les nouveaux créateurs passent par une phase de modération, puis accèdent à la publication automatique selon leur score de confiance." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="card p-6">
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

      {/* CTA FINAL */}
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
            <H2 kicker="Prêt à rejoindre le mouvement ?" center>
              Construisons ensemble l'information de demain
            </H2>
            <p className="text-aw-muted mt-4 text-lg">
              Que vous soyez créateur, média, éducateur ou simplement curieux —
              contactez-nous pour être parmi les premiers à découvrir ActuWorld.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:contact@actuworld.app" className="btn-primary">
                <Mail className="w-5 h-5 mr-2"/> contact@actuworld.app
              </a>
              <a href="#hero" className="btn-outline">
                Rejoindre la beta (bientôt)
              </a>
            </div>
          </motion.div>
        </motion.div>
      </Section>
    </div>
  );
}
