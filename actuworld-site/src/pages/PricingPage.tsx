import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, LineChart, Megaphone, Check, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp
} from "../components/animations";

type Plan = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  price: string;
  desc: string;
  points: string[];
  cta: string;
  to?: string;
  mailto?: string;
  featured: boolean;
};

export default function PricingPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const pricing: Plan[] = [
    {
      icon: Star,
      title: t("Lecteur", "Reader"),
      price: t("0 €", "€0"),
      desc: t("Pour toujours", "Forever"),
      points: [
        t("Lecture illimitée", "Unlimited reading"),
        t("Accès à toutes les sources", "Access to every source"),
        t("Votes communautaires", "Community voting"),
        t("Suivre des créateurs", "Follow creators"),
      ],
      cta: t("Être prévenu", "Get notified"),
      to: "/#rejoindre",
      featured: false,
    },
    {
      icon: LineChart,
      title: t("Créateur", "Creator"),
      price: t("0 €", "€0"),
      desc: t("Gratuit pour publier", "Free to publish"),
      points: [
        t("Publication sourcée", "Source-based publishing"),
        t("Vérification des sources intégrée", "Built-in source verification"),
        t("Recevoir des dons", "Receive donations"),
        t("Statistiques de base", "Basic analytics"),
      ],
      cta: t("Être prévenu", "Get notified"),
      to: "/#rejoindre",
      featured: false,
    },
    {
      icon: Megaphone,
      title: "ASV Pro",
      price: t("En préparation", "In preparation"),
      desc: t("Pour les professionnels de l'info", "For information professionals"),
      points: [
        t("Analyse ASV des sources que tu cites", "ASV analysis of the sources you cite"),
        t("Intégration à tes outils, en conception", "Integration with your tools, being designed"),
        t("Pensé pour les médias, rédactions et écoles", "Built for media, newsrooms and schools"),
        t("Conçu avec les premiers partenaires", "Designed with early partners"),
      ],
      cta: t("En parler", "Let's talk"),
      mailto: "mailto:actuworld.app@outlook.fr?subject=ASV%20Pro%20%3A%20demande%20d'information",
      featured: true,
    },
  ];

  const faq = [
    {
      q: t("À qui s'adresse ASV Pro ?", "Who is ASV Pro for?"),
      a: t("ASV Pro est l'offre en préparation pour les professionnels de l'information : médias, rédactions, écoles. Elle n'est pas encore disponible. Si tu veux l'utiliser ou nous aider à la concevoir, écris-nous.", "ASV Pro is the upcoming offer for information professionals: media, newsrooms, schools. It isn't available yet. If you'd like to use it or help us shape it, write to us."),
    },
    {
      q: t("Comment fonctionnent les dons ?", "How do donations work?"),
      a: t("Les lecteurs peuvent donner directement aux créateurs. ActuWorld prélève une commission de 10 % pour faire vivre la plateforme.", "Readers can donate directly to creators. ActuWorld takes a 10% fee to keep the platform running."),
    },
    {
      q: t("Quand l'app sera-t-elle disponible ?", "When will the app be available?"),
      a: t("ActuWorld arrive bientôt sur l'App Store et Google Play. Laisse ton e-mail pour être prévenu à la sortie.", "ActuWorld is coming soon to the App Store and Google Play. Leave your email to be notified at launch."),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Tarifs : lecture gratuite, création accessible", "Pricing: free reading, accessible creation")}
        description={t("La lecture est et restera gratuite. Pas de paywall sur le savoir. Découvre les offres Lecteur, Créateur et ASV Pro.", "Reading is and will stay free. No paywall on knowledge. Discover the Reader, Creator and ASV Pro plans.")}
        path="/pricing"
      />

      {/* EN-TÊTE */}
      <Section className="pt-14 md:pt-20 pb-12">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
          <motion.p variants={fadeInUp} className="eyebrow mb-5">{t("Tarifs", "Pricing")}</motion.p>
          <motion.h1 variants={fadeInUp} className="display">
            {t("Le savoir accessible à tous", "Knowledge for everyone")}
          </motion.h1>
          <motion.p variants={fadeInUp} className="lead mt-6">
            {t("La lecture est et restera gratuite. Pas de paywall sur le savoir.", "Reading is and will stay free. No paywall on knowledge.")}
          </motion.p>
        </motion.div>
      </Section>

      {/* OFFRES */}
      <Section className="pt-4 pb-20 md:pb-28">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-5"
        >
          {pricing.map((p) => (
            <motion.div
              key={p.title}
              variants={fadeInUp}
              className={`card p-7 flex flex-col ${p.featured ? "!bg-[color:var(--aw-primary-strong)] !border-transparent text-white dark:!bg-[color:var(--aw-surface)] dark:!border-[color:var(--aw-primary)] dark:text-aw-text" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${p.featured ? "bg-white/10 dark:bg-aw-success" : "bg-aw-success"}`}
                  aria-hidden="true"
                >
                  <p.icon className={`w-5 h-5 ${p.featured ? "text-[#A8D5BA] dark:text-aw-primary" : "text-aw-primary"}`} />
                </span>
                <div>
                  <h2 className="text-xl">{p.title}</h2>
                  <p className={`text-sm ${p.featured ? "text-white/75 dark:text-aw-muted" : "text-aw-muted"}`}>{p.desc}</p>
                </div>
              </div>

              <p className="font-display text-4xl font-bold mt-6 tabular-nums">{p.price}</p>

              <ul className={`mt-6 mb-8 space-y-3 ${p.featured ? "text-white/85 dark:text-aw-muted" : "text-aw-muted"}`}>
                {p.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-[15px]">
                    <Check className={`w-4 h-4 mt-1 flex-shrink-0 ${p.featured ? "text-[#A8D5BA] dark:text-aw-primary" : "text-aw-primary"}`} aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {p.mailto ? (
                  <a
                    href={p.mailto}
                    className={`w-full ${p.featured ? "btn-primary !bg-[#A8D5BA] !text-[#0F1512] hover:!bg-white dark:!bg-[color:var(--aw-primary)]" : "btn-outline"}`}
                  >
                    {p.cta}
                  </a>
                ) : (
                  <Link to={p.to!} className="btn-outline w-full">
                    {p.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section className="bg-aw-surface">
        <div className="grid md:grid-cols-[5fr_7fr] gap-10 md:gap-16">
          <AnimatedSection>
            <H2>{t("Questions sur les tarifs", "Pricing questions")}</H2>
            <Link to="/faq" className="btn-link mt-6">
              {t("Voir toute la FAQ", "See the full FAQ")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </AnimatedSection>

          <motion.dl
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="divide-y divide-[color:var(--aw-border)]"
          >
            {faq.map((item) => (
              <motion.div key={item.q} variants={fadeInUp} className="py-6 first:pt-0 last:pb-0">
                <dt className="font-display text-xl font-semibold">{item.q}</dt>
                <dd className="text-aw-muted mt-2 max-w-prose">{item.a}</dd>
              </motion.div>
            ))}
          </motion.dl>
        </div>
      </Section>

      {/* CONTACT */}
      <Section>
        <AnimatedSection className="max-w-2xl">
          <H2>{t("Une autre question ?", "Another question?")}</H2>
          <p className="lead mt-4">
            {t("L'équipe répond à toutes tes questions sur ActuWorld.", "The team answers all your questions about ActuWorld.")}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/contact" className="btn-primary">
              {t("Nous écrire", "Write to us")}
            </Link>
            <Link to="/app" className="btn-link">
              {t("Découvrir l'app", "Discover the app")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
