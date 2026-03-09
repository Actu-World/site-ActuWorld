import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper } from "../components/animations";

export default function PressPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Presse — Espace médias", "Press — Media Kit")}
        description={t(
          "Espace presse ActuWorld — ressources médias, chiffres clés et contacts pour les journalistes.",
          "ActuWorld press room — media resources, key figures and journalist contacts."
        )}
        path="/press"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <H2 as="h1" center>
            {t("Espace Presse", "Press Room")}
          </H2>

          <p className="text-aw-muted mt-4 text-center">
            {t(
              "Ressources et informations pour les médias et journalistes.",
              "Resources and information for media and journalists."
            )}
          </p>

          <div className="mt-12 space-y-10">
            {/* About section */}
            <section className="bg-aw-surface rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">
                {t("À propos d'ActuWorld", "About ActuWorld")}
              </h2>
              <p className="text-aw-text/80 leading-relaxed">
                {t(
                  "ActuWorld est un réseau social éducatif fondé en 2024, conçu pour lutter contre la désinformation. La plateforme impose le sourcing obligatoire de chaque publication et intègre un système de score de confiance communautaire. Notre outil ASV (Analyse et Score de Vérification) permet d'évaluer la fiabilité de n'importe quelle source en temps réel.",
                  "ActuWorld is an educational social network founded in 2024, designed to fight misinformation. The platform requires mandatory sourcing for every publication and integrates a community trust scoring system. Our ASV (Analysis and Verification Score) tool enables real-time source reliability assessment."
                )}
              </p>
            </section>

            {/* Key figures */}
            <section className="bg-aw-surface rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">
                {t("Chiffres clés", "Key Figures")}
              </h2>
              <ul className="space-y-3 text-aw-text/80">
                <li>📅 {t("Fondé en 2024", "Founded in 2024")}</li>
                <li>🎯 {t("Mission : rendre l'information fiable accessible à tous", "Mission: make reliable information accessible to all")}</li>
                <li>📱 {t("Application mobile React Native (iOS & Android)", "React Native mobile app (iOS & Android)")}</li>
                <li>🔍 {t("ASV : outil d'analyse de sources intégré", "ASV: integrated source analysis tool")}</li>
                <li>💡 {t("Lecture 100% gratuite, sans paywall", "100% free reading, no paywall")}</li>
              </ul>
            </section>

            {/* Brand assets */}
            <section className="bg-aw-surface rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">
                {t("Ressources de marque", "Brand Assets")}
              </h2>
              <p className="text-aw-text/80 mb-4">
                {t(
                  "Téléchargez nos logos et visuels pour vos articles :",
                  "Download our logos and visuals for your articles:"
                )}
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-aw-primary rounded-xl p-4 flex items-center justify-center">
                  <img src="/logo.svg" alt="ActuWorld logo" className="w-12 h-12" />
                </div>
                <div>
                  <p className="font-medium">ActuWorld</p>
                  <p className="text-sm text-aw-muted">
                    {t("Couleur principale : #2E5F4A", "Primary color: #2E5F4A")}
                  </p>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-aw-surface rounded-2xl p-8">
              <h2 className="text-xl font-semibold mb-4">
                {t("Contact presse", "Press Contact")}
              </h2>
              <p className="text-aw-text/80">
                {t(
                  "Pour toute demande presse, interview ou partenariat média :",
                  "For any press inquiry, interview or media partnership:"
                )}
              </p>
              <p className="mt-3 font-medium text-aw-primary">
                contact@actuworld.fr
              </p>
            </section>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
