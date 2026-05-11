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
                  "ActuWorld est un réseau social préventif fondé en 2024, dédié au partage d'informations fiables sur tout sujet, selon les passions et les intérêts de chacun. Chaque publication s'appuie sur une source visible obligatoire, vérifiée par ASV (ActuWorld Source Verification) qui contrôle la cohérence entre la source et le contenu. Un jugement communautaire via un score de confiance rend la fiabilité plus claire pour tous.",
                  "ActuWorld is a preventive social network founded in 2024, dedicated to sharing reliable information on any topic, based on users' passions and interests. Every post requires a mandatory visible source, verified by ASV (ActuWorld Source Verification) which checks source-content consistency. Community judgment through a trust score makes reliability clearer for everyone."
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
                <li>🎯 {t("Mission : donner à chacun les outils pour partager avec preuves et explorer avec clarté", "Mission: give everyone the tools to share with proof and explore with clarity")}</li>
                <li>📱 {t("Application mobile React Native (iOS & Android)", "React Native mobile app (iOS & Android)")}</li>
                <li>🔍 {t("ASV (ActuWorld Source Verification) : vérification de la cohérence source-contenu", "ASV (ActuWorld Source Verification): source-content consistency check")}</li>
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
