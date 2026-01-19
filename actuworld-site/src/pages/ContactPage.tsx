import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, Instagram, ChevronRight, Globe2 } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import {
  PageWrapper,
  AnimatedSection,
  Floating,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";
import { WaitlistForm } from "../components/ui/WaitlistForm";

export default function ContactPage() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      desc: "Pour toute question générale",
      value: "contact@actuworld.app",
      link: "mailto:contact@actuworld.app"
    },
    {
      icon: MessageCircle,
      title: "Support",
      desc: "Aide technique et assistance",
      value: "support@actuworld.app",
      link: "mailto:support@actuworld.app"
    },
    {
      icon: Instagram,
      title: "Instagram",
      desc: "Suivez-nous sur les réseaux",
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
              Construisons ensemble l'information de demain
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              Que vous soyez créateur, média, éducateur ou simplement curieux —
              contactez-nous pour être parmi les premiers à découvrir ActuWorld.
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
            <h3 className="text-3xl font-bold mb-4">Rejoignez le mouvement</h3>
            <p className="text-aw-muted text-lg mb-8">
              ActuWorld est en développement. Inscrivez-vous pour être informé du lancement
              et faire partie des premiers utilisateurs de la plateforme.
            </p>
            <div className="max-w-md mx-auto">
              <WaitlistForm variant="inline" />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* WHAT WE'RE LOOKING FOR */}
      <Section className="py-24">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker="On recherche" center>
              Qui peut nous aider ?
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
              title: "Créateurs de contenu",
              desc: "Testeurs beta pour valider l'expérience utilisateur et ASV"
            },
            {
              title: "Médias & Journalistes",
              desc: "Partenariats pour la vérification d'information"
            },
            {
              title: "Éducateurs",
              desc: "Intégration dans les parcours pédagogiques"
            },
            {
              title: "Investisseurs",
              desc: "Financement pour accélérer le développement"
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
            <h3 className="text-xl font-bold mb-6">En savoir plus</h3>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
            >
              {[
                { to: "/", label: "Accueil" },
                { to: "/app", label: "La plateforme" },
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
