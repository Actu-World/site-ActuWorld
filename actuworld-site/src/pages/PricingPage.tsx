import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, LineChart, Megaphone, CheckCircle2, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { useLanguage } from "../i18n/LanguageContext";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp,
  scaleUp
} from "../components/animations";

export default function PricingPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const pricing = [
    {
      icon: Star,
      title: t("Lecteur", "Reader"),
      price: "0€",
      desc: t("Pour toujours", "Forever"),
      points: [
        t("Lecture illimitée", "Unlimited reading"),
        t("Accès à toutes les sources", "Access to all sources"),
        t("Votes communautaires", "Community voting"),
        t("Suivre des créateurs", "Follow creators")
      ],
      cta: t("Commencer gratuitement", "Start for free"),
      featured: false
    },
    {
      icon: LineChart,
      title: t("Créateur", "Creator"),
      price: "0€",
      desc: t("Gratuit pour publier", "Free to publish"),
      points: [
        t("Publication sourcée", "Source-based publishing"),
        t("Vérification des sources intégrée", "Built-in source verification"),
        t("Recevoir des dons", "Receive donations"),
        t("Statistiques basiques", "Basic analytics")
      ],
      cta: t("Devenir créateur", "Become a creator"),
      featured: false
    },
    {
      icon: Megaphone,
      title: "ASV Pro",
      price: t("Sur devis", "Custom quote"),
      period: "",
      desc: t("Pour les professionnels de l'info", "For information professionals"),
      points: [
        t("ASV illimité et personnalisable", "Unlimited and customizable ASV"),
        t("Intégration sur vos outils", "Integration with your tools"),
        t("Adapté aux médias, entreprises et rédactions", "Designed for media, companies, and newsrooms"),
        t("Support dédié", "Dedicated support")
      ],
      cta: t("Nous contacter", "Contact us"),
      featured: true
    },
  ];

  const faq = [
    {
      q: t("À qui s'adresse ASV Pro ?", "Who is ASV Pro for?"),
      a: t("ASV Pro est conçu pour tous les professionnels de l'information : médias, journaux, entreprises, rédactions ou particuliers qui souhaitent intégrer notre IA de vérification dans leurs outils.", "ASV Pro is built for information professionals: media teams, newsrooms, companies, and individuals who want to integrate our verification AI into their workflows.")
    },
{
      q: t("Comment fonctionne le système de dons ?", "How does the donation system work?"),
      a: t("Les lecteurs peuvent donner directement aux créateurs. ActuWorld prélève une commission de 10% pour maintenir la plateforme.", "Readers can donate directly to creators. ActuWorld takes a 10% fee to maintain the platform.")
    }
  ];

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
            <H2 kicker={t("Tarifs", "Pricing")} center>
              {isEnglish ? <>Knowledge accessible to <span className="gradient-text">everyone</span></> : <>Le savoir accessible à <span className="gradient-text">tous</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto text-lg">
              {t("La lecture est et restera toujours gratuite. Pas de paywall sur le savoir.", "Reading is and will always remain free. No paywall on knowledge.")}
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* PRICING CARDS */}
      <Section className="py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {pricing.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`card p-8 relative ${p.featured ? 'ring-2 ring-aw-primary' : ''}`}
            >
              {p.featured && (
                <motion.div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-aw-primary text-on-primary text-xs font-bold rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {t("Recommandé", "Recommended")}
                </motion.div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.featured ? 'bg-aw-primary' : 'bg-aw-success'}`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <p.icon className={`w-6 h-6 ${p.featured ? 'text-on-primary' : 'text-aw-primary'}`} />
                </motion.div>
                <div>
                  <h3 className="body-semi text-xl">{p.title}</h3>
                  <p className="text-xs text-aw-muted">{p.desc}</p>
                </div>
              </div>
              <motion.div
                className="text-4xl font-bold mb-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {p.price}
                {p.period && <span className="text-lg text-aw-muted font-normal">{p.period}</span>}
              </motion.div>
              <ul className="space-y-3 text-aw-muted mb-8">
                {p.points.map((point, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-aw-accent flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                  p.featured
                    ? 'bg-aw-primary text-on-primary hover:bg-aw-primary/90'
                    : 'bg-aw-surface border border-aw text-aw-text hover:bg-aw-success'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {p.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </Section>


      {/* FAQ */}
      <Section className="py-24">
        <AnimatedSection>
          <div className="text-center mb-12">
            <H2 kicker="Questions" center>
              {isEnglish ? <>Questions about <span className="gradient-text">pricing</span></> : <>Questions sur les <span className="gradient-text">tarifs</span></>}
            </H2>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faq.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ x: 5 }}
              className="card card-hover p-6"
            >
              <h3 className="body-semi text-lg mb-2">{item.q}</h3>
              <p className="text-aw-muted">{item.a}</p>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection delay={0.3} className="text-center mt-8">
          <Link to="/faq" className="text-aw-primary hover:underline inline-flex items-center gap-1 link-underline">
            {t("Voir toutes les FAQ", "See all FAQs")} <ChevronRight className="w-4 h-4" />
          </Link>
        </AnimatedSection>
      </Section>

      {/* CTA */}
      <Section className="bg-aw-surface py-16">
        <AnimatedSection direction="scale">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{t("Des questions ?", "Any questions?")}</h3>
            <p className="text-aw-muted mb-8 max-w-xl mx-auto">
              {t("Notre équipe est là pour répondre à toutes vos questions sur ActuWorld.", "Our team is here to answer all your questions about ActuWorld.")}
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
