import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, Instagram, ChevronRight, Globe2 } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  AnimatedSection,
  Floating,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";

export default function ContactPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      desc: t("Pour toute question générale", "For any general question"),
      value: "actuworld.app@outlook.fr",
      link: "mailto:actuworld.app@outlook.fr"
    },
    {
      icon: MessageCircle,
      title: t("Support", "Support"),
      desc: t("Aide technique et assistance", "Technical help and support"),
      value: "actuworld.app@outlook.fr",
      link: "mailto:actuworld.app@outlook.fr"
    },
    {
      icon: Instagram,
      title: "Instagram",
      desc: t("Suivez-nous sur les réseaux", "Follow us on social media"),
      value: "@actuworld8",
      link: "https://instagram.com/actuworld8"
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      {/* HEADER */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E5F4A]/10 via-[#94C9AA]/10 to-[#00A896]/10 pointer-events-none"></div>
        <Floating duration={6} y={10}>
          <div className="absolute top-20 left-20 w-24 h-24 bg-aw-secondary/30 rounded-full blur-2xl" />
        </Floating>
        <Floating duration={8} y={15}>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-aw-accent/20 rounded-full blur-2xl" />
        </Floating>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center relative"
        >
          <motion.div variants={scaleUp}>
            <H2 kicker="Contact" center>
              {t("Construisons ensemble l'information de demain", "Let's build tomorrow's information together")}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("Que vous soyez créateur, média, éducateur ou simplement curieux — contactez-nous pour être parmi les premiers à découvrir ActuWorld.", "Whether you're a creator, media organization, educator, or simply curious — contact us to be among the first to discover ActuWorld.")}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* CONTACT METHODS */}
      <Section className="py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {contactMethods.map((method, i) => (
            <motion.a
              key={i}
              href={method.link}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="card card-hover p-6 text-center block"
            >
              <motion.div
                className="w-14 h-14 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <method.icon className="w-7 h-7 text-aw-primary" />
              </motion.div>
              <h3 className="body-semi text-lg mb-1">{method.title}</h3>
              <p className="text-aw-muted text-sm mb-3">{method.desc}</p>
              <p className="text-aw-primary font-medium">{method.value}</p>
            </motion.a>
          ))}
        </motion.div>
      </Section>

      {/* MAIN CTA */}
      <Section className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={scaleUp}>
            <motion.div
              className="w-20 h-20 mx-auto rounded-2xl bg-aw-primary flex items-center justify-center mb-6"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Globe2 className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-3xl font-bold mb-4">{t("Rejoignez le mouvement", "Join the movement")}</h3>
            <p className="text-aw-muted text-lg mb-8">
              {t("ActuWorld est en développement. Contactez-nous pour être informé du lancement et faire partie des premiers utilisateurs de la plateforme.", "ActuWorld is in development. Contact us to be informed about launch and become one of the first users on the platform.")}
            </p>
            <a href="mailto:actuworld.app@outlook.fr?subject=Rejoindre la beta ActuWorld" className="btn-primary glow-hover inline-flex items-center">
              <Mail className="w-5 h-5 mr-2" /> {t("Rejoindre la beta", "Join the beta")}
            </a>
          </motion.div>
        </motion.div>
      </Section>

      {/* WHAT WE'RE LOOKING FOR */}
      <Section className="py-24">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker="On recherche" center>
              {t("Qui peut nous aider ?", "Who can help us?")}
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {[
            {
              title: t("Créateurs de contenu", "Content creators"),
              desc: t("Testeurs beta pour valider l'expérience utilisateur et ASV", "Beta testers to validate user experience and ASV")
            },
            {
              title: t("Médias & Journalistes", "Media & journalists"),
              desc: t("Partenariats pour la vérification d'information", "Partnerships for information verification")
            },
            {
              title: t("Éducateurs", "Educators"),
              desc: t("Intégration dans les parcours pédagogiques", "Integration into learning pathways")
            },
            {
              title: t("Investisseurs", "Investors"),
              desc: t("Financement pour accélérer le développement", "Funding to accelerate development")
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card card-hover p-6"
            >
              <h3 className="body-semi text-lg mb-2">{item.title}</h3>
              <p className="text-aw-muted text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* LINKS */}
      <Section className="bg-aw-surface py-16">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-6">{t("En savoir plus", "Learn more")}</h3>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
            >
              {[
                { to: "/", label: t("Accueil", "Home") },
                { to: "/app", label: t("La plateforme", "The platform") },
                { to: "/reco-src", label: "ASV" },
                { to: "/faq", label: "FAQ" },
              ].map((link, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Link
                    to={link.to}
                    className="btn-outline"
                  >
                    {link.label} <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
