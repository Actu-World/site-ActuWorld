import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, LineChart, Check, ChevronRight, Search, ShieldCheck, Newspaper, GraduationCap, Building2 } from "lucide-react";
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
  /** Sous le prix : période, variante annuelle. */
  priceNote?: string;
  desc: string;
  points: string[];
  cta: string;
  to?: string;
  mailto?: string;
  featured: boolean;
};

// ASV Pro 4.7 — grille proposée le 17/11/2026 (Docs/asv/ASV-PRO-TARIFS.md) : prix à
// l'ouverture, bêta gratuite sur invitation tant que CGV et facturation (4.8) ne sont pas prêtes.
const BETA_MAILTO = "mailto:actuworld.app@outlook.fr?subject=ASV%20Pro%20%3A%20demande%20d'acc%C3%A8s%20%C3%A0%20la%20b%C3%AAta";
const QUOTE_MAILTO = "mailto:actuworld.app@outlook.fr?subject=ASV%20Pro%20%3A%20demande%20de%20devis";
const EDU_MAILTO = "mailto:actuworld.app@outlook.fr?subject=ASV%20Pro%20%C3%89ducation";

function PlanCard({ p }: { p: Plan }) {
  return (
    <motion.div
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
          <h3 className="text-xl font-display font-semibold">{p.title}</h3>
          <p className={`text-sm ${p.featured ? "text-white/75 dark:text-aw-muted" : "text-aw-muted"}`}>{p.desc}</p>
        </div>
      </div>

      <p className="font-display text-4xl font-bold mt-6 tabular-nums">{p.price}</p>
      {p.priceNote && (
        <p className={`text-sm mt-1 ${p.featured ? "text-white/75 dark:text-aw-muted" : "text-aw-muted"}`}>{p.priceNote}</p>
      )}

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
  );
}

export default function PricingPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const appPlans: Plan[] = [
    {
      icon: Star,
      title: t("Lecteur", "Reader"),
      price: t("0 €", "€0"),
      desc: t("Pour toujours", "Forever"),
      points: [
        t("Lecture illimitée", "Unlimited reading"),
        t("Accès à toutes les sources", "Access to every source"),
        t("Votes communautaires", "Community voting"),
        t("Suivre des créateurs", "Follow creators"),
      ],
      cta: t("Être prévenu", "Get notified"),
      to: "/liste-attente",
      featured: false,
    },
    {
      icon: LineChart,
      title: t("Créateur", "Creator"),
      price: t("0 €", "€0"),
      desc: t("Gratuit pour publier", "Free to publish"),
      points: [
        t("Publication sourcée", "Source-based publishing"),
        t("Vérification des sources intégrée", "Built-in source verification"),
        t("Écrire sur ordinateur avec le Studio", "Write on desktop with the Studio"),
        t("Statistiques de base", "Basic analytics"),
      ],
      cta: t("Être prévenu", "Get notified"),
      to: "/liste-attente",
      featured: false,
    },
  ];

  const proPlans: Plan[] = [
    {
      icon: Search,
      title: t("Découverte", "Discovery"),
      price: t("0 €", "€0"),
      desc: t("Pour essayer", "To try it out"),
      points: [
        t("5 rapports par mois", "5 reports per month"),
        t("Chaque passage confronté à ses liens", "Each passage checked against its links"),
        t("Citation exacte de la source", "Exact quote from the source"),
      ],
      cta: t("Essayer avec mon compte", "Try it with my account"),
      to: "/pro",
      featured: false,
    },
    {
      icon: ShieldCheck,
      title: "Pro",
      price: t("19 €", "€19"),
      priceNote: t("par mois, ou 190 € par an", "per month, or €190 per year"),
      desc: t("Pigistes, communicants, créateurs", "Freelancers, comms, creators"),
      points: [
        t("100 rapports par mois", "100 reports per month"),
        t("Synthèse et points à reprendre avant publication", "Summary and points to fix before publishing"),
        t("Historique, export, partage en lecture seule", "History, export, read-only sharing"),
      ],
      cta: t("Demander un accès", "Request access"),
      mailto: BETA_MAILTO,
      featured: true,
    },
    {
      icon: Newspaper,
      title: t("Rédaction", "Newsroom"),
      price: t("15 €", "€15"),
      priceNote: t("par siège et par mois en annuel (18 € en mensuel), dès 3 sièges", "per seat per month, billed yearly (€18 monthly), from 3 seats"),
      desc: t("Presse, médias, services communication", "Press, media, comms teams"),
      points: [
        t("150 rapports par siège et par mois, mis en commun", "150 reports per seat per month, pooled"),
        t("Membres gérés par la rédaction", "Members managed by the newsroom"),
        t("Tout ce que contient Pro", "Everything in Pro"),
      ],
      cta: t("Demander un accès", "Request access"),
      mailto: BETA_MAILTO,
      featured: false,
    },
    {
      icon: GraduationCap,
      title: t("Éducation", "Education"),
      price: t("0 €", "€0"),
      priceNote: t("pour les enseignants ; établissement sur devis", "for teachers; schools on quote"),
      desc: t("Éducation aux médias", "Media literacy"),
      points: [
        t("Enseignants : comme Pro, avec une adresse académique", "Teachers: same as Pro, with an academic email"),
        t("Établissement : comptes élèves", "Schools: student accounts"),
        t("Exercices sur un texte et ses sources", "Exercises on a text and its sources"),
      ],
      cta: t("Nous écrire", "Write to us"),
      mailto: EDU_MAILTO,
      featured: false,
    },
  ];

  const faq = [
    {
      q: t("Qu'est-ce qu'un rapport ASV Pro ?", "What is an ASV Pro report?"),
      a: t("Tu colles un texte avec ses liens, jusqu'à 30 paragraphes et 10 sources. ASV lit chaque source en entier et dit, paragraphe par paragraphe, si elle confirme ce que tu écris, le contredit ou ne le contient pas, citation à l'appui. Relancer le même texte reste compris dans le rapport.", "You paste a text with its links, up to 30 paragraphs and 10 sources. ASV reads each source in full and tells you, paragraph by paragraph, whether it confirms what you wrote, contradicts it or doesn't contain it, with the quote. Re-running the same text is included."),
    },
    {
      q: t("Puis-je l'utiliser dès maintenant ?", "Can I use it now?"),
      a: t("Oui : la formule Découverte est ouverte à tout compte ActuWorld, avec 5 rapports par mois. Connecte-toi avec le même compte que dans l'app. Pro et Rédaction sont en bêta, gratuite et sur invitation : écris-nous pour demander un accès. Les prix affichés s'appliqueront à l'ouverture, et les membres de la bêta gardent le tarif de lancement pendant 12 mois.", "Yes: the Discovery plan is open to every ActuWorld account, with 5 reports per month. Sign in with the same account as in the app. Pro and Newsroom are in beta, free and by invitation: write to us to request access. The prices shown will apply at launch, and beta members keep the launch price for 12 months."),
    },
    {
      q: t("Pourquoi c'est gratuit pour les enseignants ?", "Why is it free for teachers?"),
      a: t("Apprendre à vérifier une source fait partie de la mission d'ActuWorld. Un enseignant utilise ASV Pro gratuitement ; un établissement qui veut des comptes pour ses élèves prend une licence annuelle.", "Learning to check a source is part of ActuWorld's mission. A teacher uses ASV Pro for free; a school that wants accounts for its students takes a yearly licence."),
    },
    {
      q: t("ASV dit-il si un texte est vrai ?", "Does ASV tell whether a text is true?"),
      a: t("Non. ASV dit si tes sources disent ce que tu leur fais dire, et qui les publie. Ce n'est pas un détecteur de vérité, c'est un relecteur de sources.", "No. ASV tells you whether your sources say what you make them say, and who publishes them. It isn't a truth detector; it is a source checker."),
    },
    {
      q: t("Comment ActuWorld se finance-t-il ?", "How is ActuWorld funded?"),
      a: t("Pas de publicité, pas de vente de données, et aucun système de don entre utilisateurs pour l'instant. Le financement viendra d'ASV Pro, l'outil des professionnels de l'information. La lecture et la publication dans l'app resteront gratuites.", "No advertising, no data sales, and no donation system between users for now. Funding will come from ASV Pro, the tool for information professionals. Reading and publishing in the app will remain free."),
    },
    {
      q: t("Quand l'app sera-t-elle disponible ?", "When will the app be available?"),
      a: t("ActuWorld sort officiellement le 1er décembre sur l'App Store et Google Play. Laisse ton e-mail pour être prévenu le jour J.", "ActuWorld officially launches on December 1 on the App Store and Google Play. Leave your email to be notified on the day."),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Tarifs : l'app gratuite, ASV Pro pour les pros de l'info", "Pricing: a free app, ASV Pro for information professionals")}
        description={t("Lire et publier sur ActuWorld est gratuit. ASV Pro vérifie un texte contre ses sources : Découverte gratuite, Pro 19 €/mois, Rédaction dès 15 € par siège, gratuit pour les enseignants.", "Reading and publishing on ActuWorld is free. ASV Pro checks a text against its sources: free Discovery, Pro €19/month, Newsroom from €15 per seat, free for teachers.")}
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
            {t("Lire et publier sur ActuWorld est gratuit, et le restera. ASV Pro, l'outil qui vérifie un texte contre ses sources, finance le projet.", "Reading and publishing on ActuWorld is free, and will stay free. ASV Pro, the tool that checks a text against its sources, funds the project.")}
          </motion.p>
        </motion.div>
      </Section>

      {/* L'APP */}
      <Section className="pt-4 pb-16 md:pb-20">
        <H2>{t("L'app ActuWorld", "The ActuWorld app")}</H2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-5 mt-8 max-w-4xl"
        >
          {appPlans.map((p) => <PlanCard key={p.title} p={p} />)}
        </motion.div>
      </Section>

      {/* ASV PRO */}
      <Section className="bg-aw-surface">
        <div className="max-w-3xl">
          <H2>ASV Pro</H2>
          <p className="lead mt-4">
            {t("Pour les journalistes, les rédactions et les enseignants : colle un texte avec ses liens, ASV lit chaque source en entier et te dit ce qu'il faut reprendre avant de publier.", "For journalists, newsrooms and teachers: paste a text with its links, ASV reads every source in full and tells you what to fix before publishing.")}
          </p>
          <p className="mt-5 inline-flex items-start gap-2 rounded-xl border border-aw px-4 py-3 text-[15px]" role="note">
            <ShieldCheck className="w-4 h-4 mt-1 flex-shrink-0 text-aw-primary" aria-hidden="true" />
            <span>
              {t("Découverte est ouverte à tout compte ActuWorld. Pro et Rédaction sont en bêta gratuite, sur invitation : les prix ci-dessous s'appliqueront à l'ouverture, et les membres de la bêta gardent le tarif de lancement 12 mois.", "Discovery is open to every ActuWorld account. Pro and Newsroom are in a free beta, by invitation: the prices below will apply at launch, and beta members keep the launch price for 12 months.")}
            </span>
          </p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10"
        >
          {proPlans.map((p) => <PlanCard key={p.title} p={p} />)}
        </motion.div>
        <AnimatedSection className="card p-6 mt-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <span className="w-10 h-10 rounded-[10px] flex items-center justify-center bg-aw-success flex-shrink-0" aria-hidden="true">
              <Building2 className="w-5 h-5 text-aw-primary" />
            </span>
            <div>
              <h3 className="text-xl font-display font-semibold">{t("Sur mesure", "Custom")}</h3>
              <p className="text-aw-muted text-[15px]">
                {t("Plus de 10 sièges, branchement à ton outil de publication, facture annuelle : on en parle.", "More than 10 seats, connection to your publishing tool, yearly invoice: let's talk.")}
              </p>
            </div>
          </div>
          <a href={QUOTE_MAILTO} className="btn-outline sm:w-auto w-full flex-shrink-0">
            {t("Demander un devis", "Request a quote")}
          </a>
        </AnimatedSection>
      </Section>

      {/* FAQ */}
      <Section>
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
      <Section className="bg-aw-surface">
        <AnimatedSection className="max-w-2xl">
          <H2>{t("Une autre question ?", "Another question?")}</H2>
          <p className="lead mt-4">
            {t("L'équipe répond à toutes tes questions sur ActuWorld et ASV Pro.", "The team answers all your questions about ActuWorld and ASV Pro.")}
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
