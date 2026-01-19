import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, MessageCircle, Building2, ChevronRight, Globe2 } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

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
      icon: Building2,
      title: "Partenariats",
      desc: "Médias, éducateurs, entreprises",
      value: "partenaires@actuworld.app",
      link: "mailto:partenaires@actuworld.app"
    },
  ];

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      {/* HEADER */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E5F4A]/10 via-[#94C9AA]/10 to-[#00A896]/10 pointer-events-none"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center relative"
        >
          <motion.div variants={fadeIn}>
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
          variants={stagger}
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, i) => (
              <motion.a
                key={i}
                href={method.link}
                variants={fadeIn}
                className="card card-hover p-6 text-center block"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4">
                  <method.icon className="w-7 h-7 text-aw-primary" />
                </div>
                <h3 className="body-semi text-lg mb-1">{method.title}</h3>
                <p className="text-aw-muted text-sm mb-3">{method.desc}</p>
                <p className="text-aw-primary font-medium">{method.value}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* MAIN CTA */}
      <Section className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div variants={fadeIn}>
            <div className="w-20 h-20 mx-auto rounded-2xl bg-aw-primary flex items-center justify-center mb-6">
              <Globe2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Rejoignez le mouvement</h3>
            <p className="text-aw-muted text-lg mb-8">
              ActuWorld est en développement. Inscrivez-vous pour être informé du lancement
              et faire partie des premiers utilisateurs de la plateforme.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="mailto:contact@actuworld.app" className="btn-primary text-lg px-8 py-4">
                <Mail className="w-5 h-5 mr-2" /> contact@actuworld.app
              </a>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* WHAT WE'RE LOOKING FOR */}
      <Section className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <H2 kicker="On recherche" center>
              Qui peut nous aider ?
            </H2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Créateurs de contenu",
                desc: "Testeurs beta pour valider l'expérience utilisateur et RECO-SRC"
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
              <motion.div key={i} variants={fadeIn} className="card p-6">
                <h3 className="body-semi text-lg mb-2">{item.title}</h3>
                <p className="text-aw-muted text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* LINKS */}
      <Section className="bg-aw-surface py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <h3 className="text-xl font-bold mb-6">En savoir plus</h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/" className="btn-outline">
              Accueil <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/app" className="btn-outline">
              La plateforme <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/reco-src" className="btn-outline">
              RECO-SRC <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
            <Link to="/faq" className="btn-outline">
              FAQ <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
}
