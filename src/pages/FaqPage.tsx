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

  const faqs = [
    {
      q: t("Pourquoi le sourcing est-il obligatoire ?", "Why is source citation mandatory?"),
      a: t("C'est le principe fondateur d'ActuWorld. Avant de publier, tu montres d'où vient ton information. Ça donne du poids à ce que tu partages et de la clarté à ceux qui te lisent.", "This is ActuWorld's founding principle. Before publishing, you show where your information comes from. It gives weight to what you share and clarity to those who read you.")
    },
    {
      q: t("Comment fonctionne le système de confiance ?", "How does the trust system work?"),
      a: t("Les utilisateurs votent sur la fiabilité des posts. Ces votes construisent un score de confiance pour chaque créateur, visible sur son profil. C'est le jugement communautaire qui rend la confiance plus claire.", "Users vote on post reliability. These votes build a trust score for each creator, visible on their profile. It's community judgment that makes trust clearer.")
    },
    {
      q: t("ASV remplace-t-il les fact-checkers ?", "Does ASV replace fact-checkers?"),
      a: t("Non. ASV (ActuWorld Source Verification) vérifie automatiquement si la source est cohérente avec le contenu et détecte les détournements de contexte. C'est un outil qui donne à chacun les moyens de juger par soi-même.", "No. ASV (ActuWorld Source Verification) automatically checks if the source is consistent with the content and detects context distortions. It's a tool that empowers everyone to judge for themselves.")
    },
    {
      q: t("Comment ASV trouve-t-il les sources ?", "How does ASV identify sources?"),
      a: t("ASV analyse les posts, articles et vidéos pour extraire les sources citées, les note, et compare ce qui a été dit avec le contenu réel de la source pour détecter le cherry-picking.", "ASV analyzes posts, articles, and videos to extract cited sources, rates them, and compares claims with the actual source content to detect cherry-picking.")
    },
    {
      q: t("Pourquoi la lecture est-elle gratuite ?", "Why is reading free?"),
      a: t("L'accès au savoir ne doit pas dépendre du portefeuille. La lecture est et restera gratuite.", "Access to knowledge should not depend on income. Reading is and will remain free.")
    },
    {
      q: t("Qui peut devenir créateur ?", "Who can become a creator?"),
      a: t("Tout le monde ! Sport, sciences, culture, actualité locale… tu peux publier. Les nouveaux créateurs passent par une phase de modération, puis accèdent à la publication automatique selon leur score de confiance.", "Anyone! Sports, science, culture, local news… you can publish. New creators go through a moderation phase, then gain automatic publishing based on their trust score.")
    },
    {
      q: t("Quand ActuWorld sera-t-il disponible ?", "When will ActuWorld be available?"),
      a: t("Nous finalisons actuellement la bêta fermée. Rejoins notre liste d'attente pour être parmi les premiers à tester et donner ton avis !", "We are currently finalizing the closed beta. Join our waitlist to be among the first to test and share feedback!")
    },
    {
      q: t("Comment rejoindre la bêta ?", "How can I join the beta?"),
      a: t("Inscris-toi à notre liste d'attente depuis la page d'accueil, ou contacte-nous directement. Les bêta-testeurs sont sélectionnés selon leur profil et leur intérêt pour ActuWorld.", "Sign up for our waitlist from the homepage, or contact us directly. Beta testers are selected based on profile and interest in ActuWorld.")
    },
  ];

  const FaqList = ({ items }: { items: { q: string; a: string }[] }) => (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerContainer}
      className="space-y-4"
    >
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
            <H2 kicker="FAQ" center as="h1">
              {t("Questions fréquentes", "Frequently asked questions")}
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto text-lg">
              {t("Trouvez les réponses à vos questions sur ActuWorld, ASV (ActuWorld Source Verification) et notre approche.", "Find answers to your questions about ActuWorld, ASV (ActuWorld Source Verification) and our approach.")}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section className="py-12">
        <div className="max-w-3xl mx-auto">
          <FaqList items={faqs} />
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
