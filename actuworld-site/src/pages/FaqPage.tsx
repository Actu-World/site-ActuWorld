import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";

export default function FaqPage() {
  const generalFaq = [
    {
      q: "Pourquoi le sourcing est-il obligatoire ?",
      a: "C'est le cœur de notre mission. Chaque affirmation doit pouvoir être vérifiée. Cela combat la désinformation à la source et responsabilise les créateurs."
    },
    {
      q: "Comment fonctionne le système de confiance ?",
      a: "Les utilisateurs votent sur la qualité et fiabilité des posts. Ces votes construisent un score de confiance pour chaque créateur, visible sur leur profil."
    },
    {
      q: "ASV remplace-t-il les fact-checkers ?",
      a: "Non, il les aide. ASV extrait automatiquement les sources citées dans les vidéos, faisant gagner un temps précieux aux vérificateurs humains."
    },
    {
      q: "Pourquoi la lecture est-elle gratuite ?",
      a: "L'accès au savoir ne doit pas dépendre du portefeuille. Notre modèle repose sur les créateurs pro, les dons et la publicité éducative ciblée."
    },
    {
      q: "Qui peut devenir créateur ?",
      a: "Tout le monde ! Les nouveaux créateurs passent par une phase de modération, puis accèdent à la publication automatique selon leur score de confiance."
    },
  ];

  const recoSrcFaq = [
    {
      q: "Quelle est la précision de ASV ?",
      a: "Actuellement, ASV atteint 60-70% de précision sur le contenu éducatif français. Notre objectif est d'atteindre 80%+ dans les prochains mois."
    },
    {
      q: "Quels formats sont supportés ?",
      a: "ASV analyse les vidéos (MP4, WebM) et les fichiers audio (MP3, WAV). Les podcasts et vidéos YouTube peuvent être analysés via leur URL."
    },
    {
      q: "Comment sont trouvées les sources ?",
      a: "ASV utilise des APIs académiques (Crossref, Semantic Scholar) et Wikipedia pour trouver les sources les plus probables correspondant aux affirmations."
    },
  ];

  const creatorsFaq = [
    {
      q: "Comment recevoir des dons ?",
      a: "Les lecteurs peuvent vous soutenir directement via ActuWorld. Vous recevez 90% du don, les 10% restants maintiennent la plateforme."
    },
    {
      q: "Quels sont les avantages du plan Pro ?",
      a: "ASV illimité, badge vérifié, statistiques avancées et support prioritaire. Idéal pour les créateurs qui publient régulièrement."
    },
    {
      q: "Comment augmenter mon score de confiance ?",
      a: "Publiez du contenu bien sourcé et de qualité. Les votes positifs de la communauté augmentent progressivement votre score."
    },
  ];

  const FaqSection = ({ title, items }: { title: string; items: { q: string; a: string }[] }) => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="space-y-4"
    >
      <h3 className="text-xl font-bold text-aw-primary mb-6">{title}</h3>
      {items.map((item, i) => (
        <motion.div
          key={i}
          variants={fadeInUp}
          whileHover={{ x: 5, scale: 1.01 }}
          className="card card-hover p-6"
        >
          <div className="flex items-start gap-4">
            <motion.div
              className="flex-shrink-0 w-8 h-8 rounded-lg bg-aw-success flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <HelpCircle className="w-4 h-4 text-aw-primary" />
            </motion.div>
            <div>
              <h4 className="body-semi text-lg">{item.q}</h4>
              <p className="text-aw-muted mt-2">{item.a}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      {/* HEADER */}
      <Section className="pt-24 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center"
        >
          <motion.div variants={scaleUp}>
            <H2 kicker="FAQ" center>
              Questions fréquentes
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto text-lg">
              Trouvez les réponses à vos questions sur ActuWorld, ASV et notre mission.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* GENERAL FAQ */}
      <Section className="py-12">
        <div className="max-w-3xl mx-auto">
          <FaqSection title="Général" items={generalFaq} />
        </div>
      </Section>

      {/* ASV FAQ */}
      <Section className="bg-aw-surface py-12">
        <div className="max-w-3xl mx-auto">
          <FaqSection title="ASV" items={recoSrcFaq} />
        </div>
      </Section>

      {/* CREATORS FAQ */}
      <Section className="py-12">
        <div className="max-w-3xl mx-auto">
          <FaqSection title="Créateurs" items={creatorsFaq} />
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-aw-surface py-16">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              Notre équipe est là pour répondre à toutes vos questions.
            </p>
            <Link to="/contact" className="btn-primary glow-hover">
              Nous contacter <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
