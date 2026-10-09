import { Link } from "react-router-dom";
import { Mail, ChevronRight, Newspaper, GraduationCap, LineChart, Megaphone } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, AnimatedSection } from "../components/animations";
import { useLanguage } from "../i18n/LanguageContext";

const PARTNER_EMAIL = "actuworld.app@outlook.fr";
const MAILTO = `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent("Partenariat ActuWorld")}`;

export default function PartnersPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const profiles = [
    {
      icon: Newspaper,
      title: t("Médias et journalistes", "Media and journalists"),
      desc: t(
        "Relaie le projet et construisons ensemble des usages d'ASV pour vérifier les sources en rédaction.",
        "Cover the project and let's build together how ASV can help newsrooms check sources."
      ),
    },
    {
      icon: GraduationCap,
      title: t("Éducateurs et écoles", "Educators and schools"),
      desc: t(
        "Intègre ActuWorld dans des parcours d'éducation aux médias et à l'esprit critique.",
        "Bring ActuWorld into media-literacy and critical-thinking programs."
      ),
    },
    {
      icon: LineChart,
      title: t("Investisseurs et soutiens", "Investors and supporters"),
      desc: t(
        "Aide à accélérer le développement d'une alternative saine à la désinformation.",
        "Help speed up the development of a healthy alternative to misinformation."
      ),
    },
    {
      icon: Megaphone,
      title: t("Créateurs et ambassadeurs", "Creators and ambassadors"),
      desc: t(
        "Fais connaître ActuWorld à ta communauté avant la sortie sur les stores.",
        "Introduce ActuWorld to your community ahead of the store launch."
      ),
    },
  ];

  const benefits = [
    {
      title: t("Visibilité croisée", "Cross-visibility"),
      desc: t("On met en avant nos partenaires sur le site et sur nos réseaux.", "We feature our partners on the site and on our social accounts."),
    },
    {
      title: t("Accès anticipé", "Early access"),
      desc: t("Les nouveautés et les futurs outils ASV avant tout le monde.", "New features and upcoming ASV tools before anyone else."),
    },
    {
      title: t("Un impact réel", "Real impact"),
      desc: t("Soutenir une information vérifiée, sourcée et accessible à tous.", "Support information that is verified, sourced and open to all."),
    },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Partenaires | Soutenir ActuWorld", "Partners | Support ActuWorld")}
        description={t(
          "ActuWorld cherche des partenaires : médias, journalistes, éducateurs, investisseurs et ambassadeurs, pour rendre l'information vérifiée accessible à tous. Écris-nous.",
          "ActuWorld is looking for partners: media, journalists, educators, investors and ambassadors, to make verified information accessible to all. Write to us."
        )}
        path="/partenaires"
      />

      {/* EN-TÊTE */}
      <Section className="pt-10 md:pt-24 pb-12 md:pb-20">
        <AnimatedSection className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
          <p className="eyebrow mb-4">{t("Partenaires", "Partners")}</p>
          <H2 as="h1">{t("Aide-nous à rendre l'information fiable", "Help us make information reliable")}</H2>
          <p className="lead mt-5 mx-auto lg:mx-0">
            {t(
              "ActuWorld est porté par un étudiant déterminé à changer notre rapport à l'information. Pour avancer, j'ai besoin de visibilité, de relais et de soutiens. Et si on construisait ça ensemble ?",
              "ActuWorld is led by a student determined to change our relationship with information. To move forward, I need visibility, reach and support. What if we built this together?"
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3">
            <a href={MAILTO} className="btn-primary w-full sm:w-auto justify-center">
              {t("Devenir partenaire", "Become a partner")}
            </a>
            <Link to="/press" className="btn-link py-2">
              {t("Espace presse", "Press room")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>

      {/* QUI ON CHERCHE : grille 2 × 2 */}
      <Section className="bg-aw-surface">
        <AnimatedSection className="mb-8 md:mb-12">
          <H2>{t("Les profils qu'on cherche", "Who we're looking for")}</H2>
        </AnimatedSection>
        <AnimatedSection delay={0.1}>
          {/* Téléphone : cartes à faire glisser ; dès 768 px, grille jointe 2 × 2 */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-5 px-5 scroll-px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-px md:overflow-hidden md:mx-0 md:px-0 md:pb-0 md:rounded-[20px] md:border md:border-[var(--aw-border)] md:bg-[var(--aw-border)]">
            {profiles.map((p) => (
              <div
                key={p.title}
                className="snap-start shrink-0 w-[80%] md:w-auto rounded-[var(--aw-radius-card)] border border-[var(--aw-border)] md:rounded-none md:border-0 bg-[var(--aw-bg)] md:bg-[var(--aw-surface)] p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-5"
              >
                <span className="w-10 h-10 shrink-0 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                  <p.icon className="w-5 h-5 text-aw-primary" />
                </span>
                <div>
                  <h3 className="text-lg text-aw-text">{p.title}</h3>
                  <p className="mt-1.5 text-[15px] text-aw-muted leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </Section>

      {/* CE QUE ÇA APPORTE : liste horizontale */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr] lg:gap-16 lg:items-center">
          <AnimatedSection>
            <H2>{t("Ce que ça t'apporte", "What you get")}</H2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <dl className="divide-y divide-[var(--aw-border)] border-y border-aw">
              {benefits.map((b) => (
                <div key={b.title} className="grid gap-1 py-5 md:py-6 md:grid-cols-[12rem_1fr] md:gap-8">
                  <dt className="text-lg font-semibold text-aw-text">{b.title}</dt>
                  <dd className="text-aw-muted leading-relaxed">{b.desc}</dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>
        </div>
      </Section>

      {/* ILS SUIVENT DÉJÀ LE PROJET : logos uniquement */}
      <Section className="md:border-t md:border-aw py-4 md:py-16">
        <AnimatedSection className="flex flex-col items-center gap-6 rounded-[var(--aw-radius-card)] border border-[var(--aw-border)] p-6 md:p-0 md:rounded-none md:border-0 md:flex-row md:justify-between md:gap-8">
          <h2 className="text-xl text-aw-text">{t("Ils suivent déjà le projet", "Already following the project")}</h2>
          <a
            href="https://territoires.media"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg opacity-80 grayscale hover:opacity-100 hover:grayscale-0"
          >
            <img
              src="/partners/territoires-media.png"
              alt="Territoire(s) Média"
              width={1500}
              height={289}
              loading="lazy"
              className="h-10 md:h-12 w-auto object-contain dark:bg-white dark:rounded-md dark:px-2 dark:py-1"
            />
          </a>
        </AnimatedSection>
      </Section>

      {/* CONTACT */}
      <Section className="pt-8 md:pt-4 pb-16 md:pb-28">
        <AnimatedSection>
          <div
            className="rounded-[20px] px-6 py-10 md:px-14 md:py-16 grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center text-center md:text-left"
            style={{ backgroundColor: "#1B3528", boxShadow: "var(--aw-shadow-lg)" }}
          >
            <div>
              <h2 className="text-[clamp(1.75rem,3vw,2.25rem)] leading-tight font-bold text-white">
                {t("Parlons de ton soutien", "Let's talk about your support")}
              </h2>
              <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto md:mx-0">
                {t(
                  "Un mot, une idée, une envie de relayer ? Écris-nous, on répond à chaque message.",
                  "A word, an idea, want to spread the word? Write to us, we reply to every message."
                )}
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 md:items-end">
              <a href={MAILTO} className="btn-primary w-full md:w-auto justify-center !bg-[#A8D5BA] !text-[#0F1512] hover:!bg-white">
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span translate="no">{PARTNER_EMAIL}</span>
              </a>
              <a
                href="https://instagram.com/actuworld_fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/85 font-semibold hover:text-white underline-offset-4 hover:underline"
              >
                Instagram @actuworld_fr
              </a>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
