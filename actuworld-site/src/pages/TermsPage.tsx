import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper } from "../components/animations";

export default function TermsPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Conditions générales d'utilisation", "Terms of Service")}
        description={t(
          "Conditions générales d'utilisation d'ActuWorld — règles de la plateforme, droits et responsabilités.",
          "ActuWorld terms of service — platform rules, rights and responsibilities."
        )}
        path="/terms"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <H2 as="h1" center>
            {t("Conditions générales d'utilisation", "Terms of Service")}
          </H2>

          <p className="text-aw-muted mt-4 text-center text-sm">
            {t("Dernière mise à jour : janvier 2025", "Last updated: January 2025")}
          </p>

          <div className="mt-12 space-y-8 text-aw-text/80">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("1. Objet", "1. Purpose")}
              </h2>
              <p>
                {t(
                  "Les présentes conditions régissent l'utilisation de la plateforme ActuWorld, accessible à l'adresse www.actuworld.fr et via l'application mobile. En utilisant le service, vous acceptez ces conditions.",
                  "These terms govern the use of the ActuWorld platform, accessible at www.actuworld.fr and via the mobile application. By using the service, you accept these terms."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("2. Sourcing obligatoire", "2. Mandatory Sourcing")}
              </h2>
              <p>
                {t(
                  "Tout contenu publié sur ActuWorld doit être accompagné d'au moins une source vérifiable. Les publications sans source seront signalées et pourront être retirées. Cette règle est le fondement de notre plateforme.",
                  "All content published on ActuWorld must include at least one verifiable source. Publications without sources will be flagged and may be removed. This rule is the foundation of our platform."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("3. Score de confiance", "3. Trust Score")}
              </h2>
              <p>
                {t(
                  "Le score de confiance est calculé à partir des votes communautaires. Toute tentative de manipulation (faux comptes, votes coordonnés) entraînera la suspension du compte.",
                  "The trust score is calculated from community votes. Any manipulation attempt (fake accounts, coordinated voting) will result in account suspension."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("4. Contenu interdit", "4. Prohibited Content")}
              </h2>
              <p>
                {t(
                  "Sont interdits : la désinformation volontaire, les contenus haineux, le harcèlement, les contenus illégaux, le spam, et toute atteinte aux droits d'auteur. ActuWorld se réserve le droit de supprimer tout contenu contrevenant.",
                  "Prohibited: deliberate misinformation, hateful content, harassment, illegal content, spam, and any copyright infringement. ActuWorld reserves the right to remove any violating content."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("5. Propriété intellectuelle", "5. Intellectual Property")}
              </h2>
              <p>
                {t(
                  "Vous conservez les droits sur vos contenus publiés. En publiant sur ActuWorld, vous accordez une licence non exclusive pour afficher et distribuer votre contenu sur la plateforme.",
                  "You retain rights to your published content. By publishing on ActuWorld, you grant a non-exclusive license to display and distribute your content on the platform."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("6. Gratuité de la lecture", "6. Free Reading")}
              </h2>
              <p>
                {t(
                  "La lecture de tous les contenus sur ActuWorld est et restera toujours gratuite. Aucun paywall ne sera appliqué à l'accès à l'information. Les abonnements payants concernent uniquement les outils de création.",
                  "Reading all content on ActuWorld is and will always remain free. No paywall will be applied to information access. Paid subscriptions only apply to creation tools."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("7. Limitation de responsabilité", "7. Limitation of Liability")}
              </h2>
              <p>
                {t(
                  "ActuWorld fournit un outil de publication et de vérification collaborative. La plateforme ne garantit pas l'exactitude de tous les contenus publiés par les utilisateurs, mais s'engage à fournir les outils pour les évaluer.",
                  "ActuWorld provides a collaborative publishing and verification tool. The platform does not guarantee the accuracy of all user-published content, but commits to providing tools to evaluate it."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("8. Contact", "8. Contact")}
              </h2>
              <p>
                {t(
                  "Pour toute question relative aux conditions d'utilisation, contactez-nous à contact@actuworld.fr.",
                  "For any questions about these terms, contact us at contact@actuworld.fr."
                )}
              </p>
            </section>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
