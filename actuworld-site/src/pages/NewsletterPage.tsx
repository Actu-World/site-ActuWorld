import { motion } from "framer-motion";
import { Newspaper, ShieldCheck, BookOpen, Eye, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { WaitlistForm } from "../components/ui/WaitlistForm";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  AnimatedSection,
  Floating,
  staggerContainer,
  fadeInUp,
  scaleUp,
} from "../components/animations";

export default function NewsletterPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const contentCards = [
    {
      icon: ShieldCheck,
      title: t("Actus vérifiées", "Verified news"),
      desc: t(
        "L'essentiel de l'actualité passée au crible de notre système de vérification ASV.",
        "Key news stories filtered through our ASV verification system."
      ),
    },
    {
      icon: Eye,
      title: t("Décryptages", "Deep dives"),
      desc: t(
        "Analyses et contexte pour comprendre les sujets complexes en toute clarté.",
        "Analysis and context to understand complex topics clearly."
      ),
    },
    {
      icon: BookOpen,
      title: t("Ressources éducatives", "Educational resources"),
      desc: t(
        "Guides et outils pour développer votre esprit critique face à l'information.",
        "Guides and tools to sharpen your critical thinking about information."
      ),
    },
    {
      icon: Newspaper,
      title: t("Coulisses ActuWorld", "Behind the scenes"),
      desc: t(
        "Avancées produit, nouveautés et vision de la plateforme en avant-première.",
        "Product updates, new features and platform vision — first look."
      ),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t(
          "Newsletter — Restez informé avec ActuWorld",
          "Newsletter — Stay informed with ActuWorld"
        )}
        description={t(
          "Inscrivez-vous à la newsletter ActuWorld : actus vérifiées, décryptages et ressources éducatives dans votre boîte mail.",
          "Subscribe to the ActuWorld newsletter: verified news, deep dives and educational resources in your inbox."
        )}
        path="/newsletter"
      />

      {/* HERO */}
      <Section className="pt-24 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E5F4A]/10 via-[#94C9AA]/10 to-[#00A896]/10 pointer-events-none" />
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
            <H2 kicker="Newsletter" center as="h1">
              {t(
                "L'info vérifiée, directement dans votre boîte mail",
                "Verified news, straight to your inbox"
              )}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t(
                "Chaque semaine, recevez le meilleur d'ActuWorld : actualités passées au crible, décryptages et ressources pour mieux comprendre le monde.",
                "Every week, get the best of ActuWorld: fact-checked news, deep dives and resources to better understand the world."
              )}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* CONTENT PREVIEW */}
      <Section className="py-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker={t("Au programme", "What you'll get")} center>
              {t("Ce que vous recevrez", "What's inside")}
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
          {contentCards.map((card, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className="card card-hover p-6 text-center"
            >
              <motion.div
                className="w-14 h-14 mx-auto rounded-2xl bg-aw-success flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <card.icon className="w-7 h-7 text-aw-primary" />
              </motion.div>
              <h3 className="body-semi text-lg mb-2">{card.title}</h3>
              <p className="text-aw-muted text-sm">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* SUBSCRIBE FORM */}
      <Section className="bg-aw-surface py-24">
        <AnimatedSection direction="scale">
          <div className="max-w-md mx-auto">
            <WaitlistForm variant="card" />
          </div>
        </AnimatedSection>
      </Section>

      {/* RGPD */}
      <Section className="py-12">
        <AnimatedSection>
          <div className="max-w-2xl mx-auto text-center text-sm text-aw-muted space-y-2">
            <p>
              {t(
                "En vous inscrivant, vous acceptez de recevoir des emails d'ActuWorld. Vous pouvez vous désinscrire à tout moment via le lien présent dans chaque email.",
                "By subscribing, you agree to receive emails from ActuWorld. You can unsubscribe at any time via the link in every email."
              )}
            </p>
            <p>
              {t("Vos données sont traitées conformément à notre ", "Your data is processed in accordance with our ")}
              <Link to="/privacy" className="text-aw-primary hover:underline">
                {t("politique de confidentialité", "privacy policy")}
              </Link>.
            </p>
          </div>
        </AnimatedSection>
      </Section>

      {/* LINKS */}
      <Section className="bg-aw-surface py-16">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-6">
              {t("En savoir plus", "Learn more")}
            </h3>
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
                { to: "/contact", label: "Contact" },
              ].map((link, i) => (
                <motion.div key={i} variants={fadeInUp}>
                  <Link to={link.to} className="btn-outline">
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
