import { Link } from "react-router-dom";
import { Mail, Instagram, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper, AnimatedSection } from "../components/animations";

const EMAIL = "actuworld.app@outlook.fr";

export default function ContactPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const channels = [
    {
      icon: Mail,
      label: t("E-mail", "Email"),
      desc: t("Questions, aide technique, presse, partenariats.", "Questions, technical help, press, partnerships."),
      value: EMAIL,
      href: `mailto:${EMAIL}`,
      external: false,
    },
    {
      icon: Instagram,
      label: "Instagram",
      desc: t("Les coulisses du projet et les annonces.", "Behind the scenes and announcements."),
      value: "@actuworld_fr",
      href: "https://instagram.com/actuworld_fr",
      external: true,
    },
  ];

  const profiles = [
    {
      title: t("Créateurs de contenu", "Content creators"),
      desc: t(
        "Tu publies déjà sur un sujet qui te passionne ? Ton regard nous aide à affiner l'expérience et ASV.",
        "Already publishing on a topic you love? Your feedback helps us refine the experience and ASV."
      ),
    },
    {
      title: t("Médias et journalistes", "Media and journalists"),
      desc: t("Partenariats autour de la vérification de l'information.", "Partnerships around information verification."),
    },
    {
      title: t("Éducateurs", "Educators"),
      desc: t("Intégrer ActuWorld dans des parcours d'éducation aux médias.", "Bringing ActuWorld into media-literacy programs."),
    },
    {
      title: t("Investisseurs", "Investors"),
      desc: t("Financer la suite du développement.", "Funding the next stage of development."),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Contact | Écrire à ActuWorld", "Contact | Write to ActuWorld")}
        description={t(
          "Écris à l'équipe ActuWorld : créateurs, médias, éducateurs ou curieux. L'app arrive bientôt sur l'App Store et Google Play.",
          "Write to the ActuWorld team: creators, media, educators or curious minds. The app is coming soon to the App Store and Google Play."
        )}
        path="/contact"
      />

      {/* EN-TÊTE + CANAUX */}
      <Section className="pt-10 md:pt-24 pb-12 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:items-end">
          <AnimatedSection className="text-center lg:text-left">
            <p className="eyebrow mb-4">Contact</p>
            <H2 as="h1">{t("Une question, une idée, une envie de participer ?", "A question, an idea, want to get involved?")}</H2>
            <p className="lead mt-5 mx-auto lg:mx-0">
              {t(
                "Que tu sois passionné, créateur, journaliste ou simplement curieux, écris-nous. On lit chaque message.",
                "Whether you're passionate about a topic, a creator, a journalist or just curious, write to us. We read every message."
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <ul className="space-y-3 lg:space-y-0 lg:divide-y divide-[var(--aw-border)] lg:border-y lg:border-[var(--aw-border)]">
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-start gap-4 p-4 lg:px-0 lg:py-5 rounded-[var(--aw-radius-card)] lg:rounded-none border border-[var(--aw-border)] lg:border-0 bg-[var(--aw-surface)] lg:bg-transparent"
                  >
                    <span className="mt-0.5 w-10 h-10 shrink-0 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                      <c.icon className="w-5 h-5 text-aw-primary" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-aw-muted">{c.label}</span>
                      <span className="block text-base sm:text-lg font-semibold text-aw-text group-hover:text-aw-primary break-words" translate="no">
                        {c.value}
                      </span>
                      <span className="block text-[15px] text-aw-muted mt-0.5">{c.desc}</span>
                    </span>
                    <ChevronRight className="mt-3 w-5 h-5 shrink-0 text-aw-muted transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </Section>

      {/* QUI PEUT NOUS AIDER */}
      <Section className="bg-aw-surface">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <AnimatedSection>
            <H2>{t("Qui peut nous aider", "Who can help us")}</H2>
            <p className="lead mt-4">
              {t(
                "ActuWorld avance avec celles et ceux qui partagent l'envie d'une information vérifiable.",
                "ActuWorld moves forward with people who want information you can check."
              )}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="min-w-0">
            {/* Téléphone : cartes à faire glisser ; dès 640 px, grille 2 colonnes à filets */}
            <dl className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 scroll-px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0">
              {profiles.map((p) => (
                <div
                  key={p.title}
                  className="snap-start shrink-0 w-[78%] sm:w-auto rounded-[var(--aw-radius-card)] sm:rounded-none border border-[var(--aw-border)] sm:border-0 sm:border-t sm:border-[var(--aw-border-strong)] bg-[var(--aw-bg)] sm:bg-transparent p-5 sm:p-0 sm:pt-4"
                >
                  <dt className="text-lg font-semibold text-aw-text">{p.title}</dt>
                  <dd className="mt-1.5 text-[15px] text-aw-muted leading-relaxed">{p.desc}</dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>
        </div>
      </Section>

      {/* SORTIE */}
      <Section>
        <AnimatedSection className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
          <H2>{t("Bientôt sur l'App Store et Google Play", "Coming soon to the App Store and Google Play")}</H2>
          <p className="lead mt-4 mx-auto lg:mx-0">
            {t(
              "La publication sur les stores est en cours. Laisse ton e-mail et on te prévient dès la sortie.",
              "Store publication is in progress. Leave your email and we'll let you know at launch."
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3">
            <Link to="/#rejoindre" className="btn-primary w-full sm:w-auto justify-center">
              {t("Être prévenu", "Get notified")}
            </Link>
            <Link to="/faq" className="btn-link py-2">
              {t("Lire la FAQ", "Read the FAQ")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
