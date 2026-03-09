import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper } from "../components/animations";

export default function PrivacyPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Politique de confidentialité", "Privacy Policy")}
        description={t(
          "Politique de confidentialité d'ActuWorld — comment vos données sont collectées, utilisées et protégées.",
          "ActuWorld privacy policy — how your data is collected, used and protected."
        )}
        path="/privacy"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <H2 as="h1" center>
            {t("Politique de confidentialité", "Privacy Policy")}
          </H2>

          <p className="text-aw-muted mt-4 text-center text-sm">
            {t("Dernière mise à jour : janvier 2025", "Last updated: January 2025")}
          </p>

          <div className="mt-12 space-y-8 text-aw-text/80">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("1. Données collectées", "1. Data We Collect")}
              </h2>
              <p>
                {t(
                  "ActuWorld collecte uniquement les données nécessaires au fonctionnement du service : adresse e-mail, nom d'utilisateur, et les contenus que vous publiez (articles, votes, commentaires). Aucune donnée n'est vendue à des tiers.",
                  "ActuWorld only collects data necessary for the service: email address, username, and content you publish (articles, votes, comments). No data is sold to third parties."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("2. Utilisation des données", "2. How We Use Your Data")}
              </h2>
              <p>
                {t(
                  "Vos données sont utilisées pour : gérer votre compte, afficher vos publications, calculer les scores de confiance communautaires, et vous envoyer des notifications liées au service.",
                  "Your data is used to: manage your account, display your publications, calculate community trust scores, and send you service-related notifications."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("3. Hébergement et sécurité", "3. Hosting and Security")}
              </h2>
              <p>
                {t(
                  "Les données sont hébergées sur des serveurs sécurisés (Supabase, Vercel). Les communications sont chiffrées via HTTPS. Les mots de passe sont hashés et ne sont jamais stockés en clair.",
                  "Data is hosted on secure servers (Supabase, Vercel). Communications are encrypted via HTTPS. Passwords are hashed and never stored in plain text."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("4. Cookies", "4. Cookies")}
              </h2>
              <p>
                {t(
                  "ActuWorld utilise des cookies techniques strictement nécessaires au fonctionnement (authentification, préférences de langue). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.",
                  "ActuWorld uses only strictly necessary technical cookies (authentication, language preferences). No advertising or third-party tracking cookies are used."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("5. Vos droits", "5. Your Rights")}
              </h2>
              <p>
                {t(
                  "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour toute demande, contactez-nous à contact@actuworld.fr.",
                  "Under GDPR, you have the right to access, rectify, delete and port your data. For any request, contact us at contact@actuworld.fr."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("6. Contact", "6. Contact")}
              </h2>
              <p>
                {t(
                  "Pour toute question relative à la confidentialité, écrivez-nous à contact@actuworld.fr.",
                  "For any privacy-related questions, write to us at contact@actuworld.fr."
                )}
              </p>
            </section>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
