import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { HelpCircle, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";

export default function FaqPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const generalFaq = [
    {
      q: t("Pourquoi le sourcing est-il obligatoire ?", "Why is source citation mandatory?"),
      a: t("C'est le cœur de notre mission. Chaque affirmation doit pouvoir être vérifiée. Cela combat la désinformation à la source et responsabilise les créateurs.", "This is central to our mission. Every claim must be verifiable. It fights misinformation at the source and encourages creator responsibility.")
    },
    {
      q: t("Comment fonctionne le système de confiance ?", "How does the trust system work?"),
      a: t("Les utilisateurs votent sur la qualité et fiabilité des posts. Ces votes construisent un score de confiance pour chaque créateur, visible sur leur profil.", "Users vote on post quality and reliability. These votes build a trust score for each creator, visible on their profile.")
    },
    {
      q: t("ASV remplace-t-il les fact-checkers ?", "Does ASV replace fact-checkers?"),
      a: t("Non, ASV est un outil de vérification automatique des sources payant pour les journalistes, particuliers et entreprises. Les fact-checkers peuvent l'utiliser pour gagner du temps dans leurs recherches.", "No. ASV is a paid automatic source verification tool for journalists, individuals, and companies. Fact-checkers can use it to save research time.")
    },
    {
      q: t("Pourquoi la lecture est-elle gratuite ?", "Why is reading free?"),
      a: t("L'accès au savoir ne doit pas dépendre du portefeuille. Notre modèle repose sur les créateurs pro, les dons et la publicité éducative ciblée.", "Access to knowledge should not depend on income. Our model relies on pro creators, donations, and targeted educational advertising.")
    },
    {
      q: t("Qui peut devenir créateur ?", "Who can become a creator?"),
      a: t("Tout le monde ! Les nouveaux créateurs passent par une phase de modération, puis accèdent à la publication automatique selon leur score de confiance.", "Anyone. New creators go through a moderation phase, then gain automatic publishing based on their trust score.")
    },
    {
      q: t("Quand ActuWorld sera-t-il disponible ?", "When will ActuWorld be available?"),
      a: t("Nous finalisons actuellement la bêta fermée. Rejoignez notre liste d'attente pour être parmi les premiers à tester et donner votre avis!", "We are currently finalizing the closed beta. Join our waitlist to be among the first to test and share feedback.")
    },
    {
      q: t("Comment rejoindre le programme bêta ?", "How can I join the beta program?"),
      a: t("Consultez la page de contact ou inscrivez-vous à notre liste d'attente. Les bêta-testeurs seront sélectionnés en fonction de leur profil et intérêt pour la mission d'ActuWorld.", "Visit the contact page or sign up for our waitlist. Beta testers are selected based on profile and interest in ActuWorld's mission.")
    },
  ];

  const recoSrcFaq = [
    {
      q: t("Quelle est la précision de ASV ?", "What is ASV's current accuracy?"),
      a: t("Actuellement, ASV atteint 60-70% de précision sur le contenu éducatif français. Notre objectif est d'atteindre 80%+ dans les prochains mois.", "Currently, ASV reaches 60-70% accuracy on French educational content. Our goal is to reach 80%+ over the coming months.")
    },
    {
      q: t("Quels formats sont supportés ?", "Which formats are supported?"),
      a: t("ASV analyse les vidéos (MP4, WebM) et les fichiers audio (MP3, WAV). Les podcasts et vidéos YouTube peuvent être analysés via leur URL.", "ASV analyzes videos (MP4, WebM) and audio files (MP3, WAV). Podcasts and YouTube videos can be analyzed via URL.")
    },
    {
      q: t("Comment sont trouvées les sources ?", "How are sources identified?"),
      a: t("ASV analyse les posts, articles et vidéos pour extraire et identifier les sources citées. Il les note et compare ce qui a été dit avec le contenu réel de la source pour détecter le cherry-picking.", "ASV analyzes posts, articles, and videos to extract and identify cited sources. It rates them and compares claims with source content to detect cherry-picking.")
    },
  ];

  const creatorsFaq = [
    {
      q: t("Comment recevoir des dons ?", "How can I receive donations?"),
      a: t("Les lecteurs peuvent vous soutenir directement via ActuWorld. Vous recevez 90% du don, les 10% restants maintiennent la plateforme.", "Readers can support you directly through ActuWorld. You receive 90% of each donation, and 10% supports platform operations.")
    },
    {
      q: t("Quels sont les avantages du plan Pro ?", "What are the benefits of the Pro plan?"),
      a: t("Analyses détaillées ASV, badge vérifié, statistiques avancées et support prioritaire. Idéal pour les créateurs qui publient régulièrement et veulent des insights approfondis.", "Detailed ASV analytics, verified badge, advanced stats, and priority support. Ideal for creators who publish frequently and need deeper insights.")
    },
    {
      q: t("Comment augmenter mon score de confiance ?", "How do I increase my trust score?"),
      a: t("Publiez du contenu bien sourcé et de qualité. Les votes positifs de la communauté augmentent progressivement votre score.", "Publish high-quality, well-sourced content. Positive community votes gradually increase your score.")
    },
    {
      q: t("Comment fonctionne le système de votes ?", "How does the voting system work?"),
      a: t("Les lecteurs votent 'Fiable', 'Neutre' ou 'Douteuse' sur chaque post. Ces votes construisent un score agrégé visible dans les profils et les classements.", "Readers vote 'Reliable', 'Neutral', or 'Questionable' on each post. These votes create an aggregate score visible in profiles and rankings.")
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
      <PageMeta
        title={t("FAQ — Questions fréquentes", "FAQ — Frequently asked questions")}
        description={t("Trouvez les réponses à vos questions sur ActuWorld, ASV, la disponibilité de la plateforme, et comment rejoindre la bêta.", "Find answers to your questions about ActuWorld, ASV, platform availability, and how to join the beta.")}
        path="/faq"
      />
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
              {t("Questions fréquentes", "Frequently asked questions")}
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto text-lg">
              {t("Trouvez les réponses à vos questions sur ActuWorld, ASV et notre mission.", "Find answers to your questions about ActuWorld, ASV, and our mission.")}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* GENERAL FAQ */}
      <Section className="py-12">
        <div className="max-w-3xl mx-auto">
          <FaqSection title={t("Général", "General")} items={generalFaq} />
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
          <FaqSection title={t("Créateurs", "Creators")} items={creatorsFaq} />
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-aw-surface py-16">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{t("Vous n'avez pas trouvé votre réponse ?", "Didn't find your answer?")}</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              {t("Notre équipe est là pour répondre à toutes vos questions.", "Our team is here to answer all your questions.")}
            </p>
            <Link to="/contact" className="btn-primary glow-hover">
              {t("Nous contacter", "Contact us")} <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
