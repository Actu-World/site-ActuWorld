import { Download } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper, AnimatedSection } from "../components/animations";

const PRESS_EMAIL = "actuworld.app@outlook.fr";

export default function PressPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const facts = [
    { label: t("Création", "Founded"), value: "2024" },
    {
      label: t("Mission", "Mission"),
      value: t(
        "Donner à chacun les outils pour partager avec preuves et explorer avec clarté.",
        "Give everyone the tools to share with proof and explore with clarity."
      ),
    },
    {
      label: t("Produit", "Product"),
      value: t(
        "Application mobile iOS et Android, bientôt sur l'App Store et Google Play.",
        "Mobile app for iOS and Android, coming soon to the App Store and Google Play."
      ),
    },
    {
      label: "ASV",
      value: t(
        "ActuWorld Source Verification : contrôle de la cohérence entre la source et le contenu.",
        "ActuWorld Source Verification: checks that the source matches the content."
      ),
    },
    { label: t("Modèle", "Model"), value: t("Lecture 100 % gratuite, sans paywall.", "100% free reading, no paywall.") },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Presse | Espace médias", "Press | Media room")}
        description={t(
          "Espace presse ActuWorld : présentation, repères clés, logo et contact pour les journalistes.",
          "ActuWorld press room: overview, key facts, logo and contact for journalists."
        )}
        path="/press"
      />

      <Section className="pt-10 md:pt-24 pb-8 md:pb-12">
        <AnimatedSection className="max-w-3xl mx-auto lg:mx-0 text-center lg:text-left">
          <H2 as="h1">{t("Espace presse", "Press room")}</H2>
          <p className="lead mt-5 mx-auto lg:mx-0">
            {t(
              "Présentation, repères clés et ressources pour les médias et les journalistes.",
              "Overview, key facts and resources for media and journalists."
            )}
          </p>
        </AnimatedSection>
      </Section>

      <Section className="pt-0 pb-16 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <div className="space-y-10 lg:space-y-14">
            <AnimatedSection>
              <h2 className="text-xl md:text-2xl mb-3 md:mb-4">{t("À propos d'ActuWorld", "About ActuWorld")}</h2>
              <p className="text-aw-muted text-base md:text-[17px] leading-relaxed max-w-prose">
                {t(
                  "ActuWorld est un réseau de l'information fondé en 2024, dédié au partage d'informations fiables sur tout sujet, selon les passions et les intérêts de chacun. Chaque publication s'appuie sur une source visible obligatoire, analysée par ASV (ActuWorld Source Verification), qui évalue la transparence de l'éditeur et la fidélité de la reprise. À côté, un score de confiance issu des votes de la communauté rend la fiabilité lisible pour tous.",
                  "ActuWorld is an information network founded in 2024, dedicated to sharing reliable information on any topic, based on each person's passions and interests. Every post requires a visible source, analysed by ASV (ActuWorld Source Verification), which rates publisher transparency and how faithfully the source is reported. Alongside it, a trust score built from community votes makes reliability readable for everyone."
                )}
              </p>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="text-xl md:text-2xl mb-3 md:mb-4">{t("Repères clés", "Key facts")}</h2>
              <dl className="divide-y divide-[var(--aw-border)] border-y border-aw">
                {facts.map((f) => (
                  <div key={f.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <dt className="font-semibold text-aw-text">{f.label}</dt>
                    <dd className="text-aw-muted">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </AnimatedSection>
          </div>

          <aside className="space-y-3 lg:space-y-6">
            <AnimatedSection className="card p-6 md:p-7">
              <h2 className="text-xl mb-4">{t("Logo", "Logo")}</h2>
              <div className="flex items-center gap-4">
                <img src="/logo.svg" alt="" width={56} height={56} className="w-14 h-14 rounded-xl" />
                <div>
                  <p className="font-semibold text-aw-text">ActuWorld</p>
                  <p className="text-sm text-aw-muted tabular">
                    {t("Couleur principale :", "Primary color:")} <span translate="no">#2E5F4A</span>
                  </p>
                </div>
              </div>
              <a href="/logo.svg" download="actuworld-logo.svg" className="btn-outline btn-sm mt-6 w-full sm:w-auto justify-center">
                <Download className="w-4 h-4" aria-hidden="true" />
                {t("Télécharger le logo (SVG)", "Download the logo (SVG)")}
              </a>
            </AnimatedSection>

            <AnimatedSection className="card p-6 md:p-7">
              <h2 className="text-xl mb-2">{t("Contact presse", "Press contact")}</h2>
              <p className="text-aw-muted text-[15px]">
                {t("Demandes presse, interviews, partenariats médias :", "Press requests, interviews, media partnerships:")}
              </p>
              <a
                href={`mailto:${PRESS_EMAIL}?subject=${encodeURIComponent("Presse ActuWorld")}`}
                className="mt-3 inline-block font-semibold text-aw-primary break-words hover:underline underline-offset-4"
                translate="no"
              >
                {PRESS_EMAIL}
              </a>
            </AnimatedSection>
          </aside>
        </div>
      </Section>
    </PageWrapper>
  );
}
