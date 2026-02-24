import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Smartphone, FileText, ThumbsUp, BookOpen, Video, Unlock,
  Search, Heart, Sparkles, Users,
  Bell, MessageCircle, Image, X, Check, MoreHorizontal, Home, PenLine, PlaySquare, PlusCircle, Globe2
} from "lucide-react";
import phoneImg from "../assets/phone_img.jpg";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { Card } from "../components/Card";
import { useLanguage } from "../i18n/LanguageContext";
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
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const features = [
    { icon: FileText, title: t("Sourcing obligatoire", "Mandatory sourcing"), desc: t("Impossible de publier sans indiquer ses sources. Chaque affirmation doit être vérifiable.", "You cannot publish without citing your sources. Every claim must be verifiable.") },
    { icon: ThumbsUp, title: t("Confiance communautaire", "Community trust"), desc: t("La communauté vote sur la qualité et fiabilité des posts. Système de score de confiance.", "The community votes on post quality and reliability. Trust score system.") },
    { icon: BookOpen, title: t("Catégorisation thématique", "Topic categories"), desc: t("Sciences, Histoire, Tech, Santé, Économie... Trouvez facilement ce qui vous intéresse.", "Science, History, Tech, Health, Economy... Easily find what interests you.") },
    { icon: Video, title: t("ASV intégré", "Built-in ASV"), desc: t("Notre IA extrait automatiquement les sources citées dans les vidéos uploadées.", "Our AI automatically extracts sources cited in uploaded videos.") },
    { icon: Unlock, title: t("100% gratuit en lecture", "100% free to read"), desc: t("Aucun paywall pour accéder au contenu. Le savoir doit rester accessible à tous.", "No paywall to access content. Knowledge should remain accessible to everyone.") },
  ];

  const differentiators = [
    { icon: Unlock, title: t("Gratuit pour tous", "Free for everyone"), desc: t("Lire, apprendre et s'informer sans jamais payer. Aucun abonnement requis pour accéder aux contenus et aux sources.", "Read, learn, and stay informed without paying. No subscription required to access content and sources.") },
    { icon: Sparkles, title: t("IA intégrée", "Integrated AI"), desc: t("Notre IA ASV vérifie les sources de vos textes et vidéos, analyse leur fiabilité et détecte les informations non sourcées.", "Our ASV AI verifies sources from your texts and videos, analyzes reliability, and detects unsourced claims.") },
    { icon: Users, title: t("Validé par la communauté", "Community validated"), desc: t("Les utilisateurs évaluent chaque contenu. Plus un post est sourcé et apprécié, plus il gagne en visibilité sur la plateforme.", "Users evaluate each piece of content. The more sourced and appreciated a post is, the more visibility it gains.") },
    { icon: Heart, title: t("Monétisation éthique", "Ethical monetization"), desc: t("Les créateurs sont rémunérés par les dons et abonnements de leur audience. Pas de publicité intrusive, pas d'algorithme à buzz.", "Creators are paid through audience donations and subscriptions. No intrusive ads, no buzz algorithm.") },
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
              <Smartphone className="w-4 h-4" /> {t("La Plateforme", "The Platform")}
            </span>
            <H2 kicker="" center>
              {isEnglish ? <>ActuWorld, the social network <span className="gradient-text">for reliable information</span></> : <>ActuWorld, le réseau social <span className="gradient-text">de l'information fiable</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("Un écosystème où l'information sourcée prime sur le divertissement, et où les créateurs éducatifs sont valorisés.", "An ecosystem where sourced information comes before entertainment, and educational creators are valued.")}
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
                <div className="aspect-[9/19] bg-aw-bg p-3 pt-7 flex flex-col">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-7 h-7 rounded-full bg-aw-surface border border-aw"></div>
                    <span className="text-[13px] font-bold text-aw-primary" style={{fontFamily: 'Georgia, serif', letterSpacing: '0.5px'}}>ActuWorld</span>
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <Bell className="w-4 h-4 text-aw-primary" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full text-[5px] text-white flex items-center justify-center font-bold">1</div>
                      </div>
                      <MessageCircle className="w-4 h-4 text-aw-primary" />
                    </div>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex rounded-xl overflow-hidden bg-aw-surface border border-aw mb-2.5">
                    <div className="flex-1 py-1.5 text-center text-[8px] font-medium bg-aw-success text-aw-primary rounded-xl flex items-center justify-center gap-1">
                      <Image className="w-3 h-3" /> {t("Fil visuel", "Visual feed")}
                    </div>
                    <div className="flex-1 py-1.5 text-center text-[8px] text-aw-muted flex items-center justify-center gap-1">
                      <FileText className="w-3 h-3" /> {t("Journal", "Journal")}
                    </div>
                  </div>

                  {/* Post header */}
                  <motion.div
                    className="flex items-center justify-between mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-aw-surface border border-aw"></div>
                      <span className="text-[10px] font-semibold text-aw-text">ScienceExplorer</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-5 h-5 rounded-md border border-red-800/60 flex items-center justify-center">
                        <X className="w-2.5 h-2.5 text-red-400" />
                      </div>
                      <div className="w-5 h-5 rounded-md border border-aw-primary/60 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-aw-primary" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Vote bar */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex-1 h-1 bg-aw-surface rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-amber-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "50%" }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                      />
                    </div>
                    <span className="text-[7px] text-aw-muted">2 votes</span>
                  </div>

                  {/* Large image */}
                  <motion.div
                    className="flex-1 rounded-2xl overflow-hidden relative mb-1.5 min-h-0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                  >
                    <img src={phoneImg} alt="Post nature" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center text-[7px] text-white font-medium">2</div>
                      <div className="w-5 h-5 rounded-full bg-black/50 flex items-center justify-center">
                        <MoreHorizontal className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/40 rounded-full text-[7px] text-white flex items-center gap-1">
                      <PenLine className="w-2.5 h-2.5" /> Nature
                    </div>
                  </motion.div>

                  {/* Post title */}
                  <p className="text-[10px] font-semibold text-aw-text mb-1.5">{t("Les cascades cachées de la biodiversité", "Hidden cascades of biodiversity")}</p>

                  {/* Bottom nav */}
                  <div className="flex items-center justify-around py-1.5 border-t border-aw mt-auto">
                    <div className="flex flex-col items-center gap-0.5">
                      <Home className="w-3.5 h-3.5 text-aw-primary" />
                      <span className="text-[5px] text-aw-primary font-medium">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <PlaySquare className="w-3.5 h-3.5 text-aw-muted" />
                      <span className="text-[5px] text-aw-muted">Reel</span>
                    </div>
                    <PlusCircle className="w-5 h-5 text-aw-primary" />
                    <div className="flex flex-col items-center gap-0.5">
                      <Search className="w-3.5 h-3.5 text-aw-muted" />
                      <span className="text-[5px] text-aw-muted">Search</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Globe2 className="w-3.5 h-3.5 text-aw-muted" />
                      <span className="text-[5px] text-aw-muted">ActuWorld</span>
                    </div>
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
              {isEnglish ? <>The <span className="gradient-text">Emma</span> journey</> : <>L'expérience <span className="gradient-text">Emma</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto">
              {t("Découvrez comment une étudiante utilise ActuWorld au quotidien.", "See how a student uses ActuWorld every day.")}
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
              { num: "1", text: t("Emma, étudiante en économie, ouvre ActuWorld le matin", "Emma, an economics student, opens ActuWorld in the morning"), icon: Smartphone },
              { num: "2", text: t("Son feed montre un article sur l'inflation avec 3 sources (INSEE, BCE, étude universitaire)", "Her feed shows an article on inflation with 3 sources (INSEE, ECB, university study)"), icon: FileText },
              { num: "3", text: t("Elle clique sur les sources pour approfondir et vérifier", "She clicks the sources to dive deeper and verify"), icon: Search },
              { num: "4", text: t("Elle vote 'fiable' sur le post, augmentant le score du créateur", "She votes 'reliable' on the post, increasing the creator's score"), icon: ThumbsUp },
              { num: "5", text: t("Elle découvre d'autres posts du créateur dans la catégorie Économie", "She discovers more posts from the creator in the Economy category"), icon: BookOpen },
              { num: "6", text: t("Elle décide de donner 3€ pour soutenir le créateur", "She decides to donate €3 to support the creator"), icon: Heart },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card card-hover p-5 relative"
              >
                <motion.div
                  className="absolute -top-3 -right-3 w-9 h-9 rounded-2xl bg-aw-success flex items-center justify-center text-aw-primary font-bold text-sm"
                  whileHover={{ scale: 1.1, rotate: 6 }}
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
              {isEnglish ? <>What makes us <span className="gradient-text">unique</span></> : <>Ce qui nous rend <span className="gradient-text">uniques</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("ActuWorld est le ", "ActuWorld is the ")}<strong>{t("seul", "only")}</strong>{t(" réseau social combinant sourcing obligatoire, IA intégrée et système de confiance communautaire.", " social network combining mandatory sourcing, integrated AI, and a community trust system.")}
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
            <h3 className="text-2xl font-bold mb-4">{isEnglish ? <>Discover our <span className="gradient-text">verification AI</span></> : <>Découvrez notre <span className="gradient-text">IA de vérification</span></>}</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              {t("ASV analyse vos textes et vidéos, vérifie les sources citées et évalue leur fiabilité. Publiez en confiance, informez en toute transparence.", "ASV analyzes your texts and videos, verifies cited sources, and evaluates reliability. Publish with confidence and inform with transparency.")}
            </p>
            <Link to="/reco-src" className="btn-primary glow-hover">
              <Sparkles className="w-5 h-5 mr-2" /> {t("Découvrir ASV", "Discover ASV")}
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
