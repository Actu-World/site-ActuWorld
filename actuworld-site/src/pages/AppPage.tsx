import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Smartphone, FileText, ThumbsUp, BookOpen, Video, Unlock,
  Search, Heart, Sparkles, Users
} from "lucide-react";
import { Section } from "../components/Section";
import { AppPhoneMockup } from "../components/app/AppPhoneMockup";
import { H2 } from "../components/H2";
import { Card } from "../components/Card";
import { PageMeta } from "../components/PageMeta";
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
    { icon: FileText, title: t("Source visible obligatoire", "Mandatory visible source"), desc: t("Avant de publier, tu montres d'où vient ton information. Tes sources parlent pour toi.", "Before publishing, you show where your information comes from. Your sources speak for you.") },
    { icon: ThumbsUp, title: t("Jugement communautaire", "Community judgment"), desc: t("La communauté vote sur la qualité et fiabilité des posts. Un score de confiance visible pour tous.", "The community votes on post quality and reliability. A trust score visible to everyone.") },
    { icon: BookOpen, title: t("Tous les sujets", "All topics"), desc: t("Culture, sport, sciences, société, tech, environnement, passions... Explore tes sujets avec plus de clarté.", "Culture, sports, science, society, tech, environment, passions... Explore your topics with more clarity.") },
    { icon: Video, title: t("ASV intégré", "Built-in ASV"), desc: t("ASV (ActuWorld Source Verification) vérifie la cohérence entre tes sources et ton contenu.", "ASV (ActuWorld Source Verification) checks the consistency between your sources and your content.") },
    { icon: Unlock, title: t("100% gratuit en lecture", "100% free to read"), desc: t("Aucun paywall pour accéder au contenu. Le savoir doit rester accessible à tous.", "No paywall to access content. Knowledge should remain accessible to everyone.") },
  ];

  const differentiators = [
    { icon: Unlock, title: t("Gratuit pour tous", "Free for everyone"), desc: t("Lire, explorer et s'informer sans jamais payer. Aucun abonnement requis pour accéder aux contenus et aux sources.", "Read, explore, and stay informed without paying. No subscription required to access content and sources.") },
    { icon: Sparkles, title: t("ASV intégré", "Built-in ASV"), desc: t("ASV (ActuWorld Source Verification) vérifie la cohérence entre tes sources et ton contenu, et détecte les détournements de contexte.", "ASV (ActuWorld Source Verification) checks consistency between your sources and content, and detects context distortions.") },
    { icon: Users, title: t("Jugement communautaire", "Community judgment"), desc: t("Les utilisateurs évaluent chaque contenu. Un score de confiance visible rend la fiabilité plus claire pour tous.", "Users evaluate each piece of content. A visible trust score makes reliability clearer for everyone.") },
    { icon: Heart, title: t("Monétisation éthique", "Ethical monetization"), desc: t("Les créateurs sont rémunérés par les dons et abonnements de leur audience. Pas de publicité intrusive, pas d'algorithme à buzz.", "Creators are paid through audience donations and subscriptions. No intrusive ads, no buzz algorithm.") },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("La Plateforme — Réseau social préventif de partage d'informations fiables", "The Platform — Preventive social network for sharing reliable information")}
        description={t("Découvrez ActuWorld : source visible obligatoire, ASV (ActuWorld Source Verification), jugement communautaire. Partage sur tout sujet, 100% gratuit en lecture.", "Discover ActuWorld: mandatory visible sources, ASV (ActuWorld Source Verification), community judgment. Share on any topic, 100% free to read.")}
        path="/app"
      />
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
            <H2 kicker="" center as="h1">
              {isEnglish ? <>ActuWorld, the <span className="gradient-text">preventive</span> social network</> : <>ActuWorld, le réseau social <span className="gradient-text">préventif</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("Un espace pour publier, explorer et partager sur tout sujet — avec des sources visibles et un score de confiance qui rend la fiabilité plus claire.", "A space to publish, explore, and share on any topic — with visible sources and a trust score that makes reliability clearer.")}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* SOLUTION ACTUWORLD */}
      <Section id="solution" className="py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Mockup téléphone — deux affichages réels (Fil visuel / Journal) */}
          <AnimatedSection direction="left" className="relative order-2 lg:order-1">
            <AppPhoneMockup />
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
              {t("ActuWorld est le ", "ActuWorld is the ")}<strong>{t("seul", "only")}</strong>{t(" réseau social combinant source visible obligatoire, ASV et jugement communautaire.", " social network combining mandatory visible sources, ASV, and community judgment.")}
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
