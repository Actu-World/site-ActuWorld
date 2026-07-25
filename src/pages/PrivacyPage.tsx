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
                  "Vos données sont hébergées exclusivement au sein de l'Union européenne : le site et l'API sur un serveur OVHcloud à Gravelines (France), et les bases de données chez Supabase, Inc. (Paris, France et Francfort, Allemagne). Les communications sont chiffrées via HTTPS ; les mots de passe sont hashés et ne sont jamais stockés en clair.",
                  "Your data is hosted exclusively within the European Union: the website and API on an OVHcloud server in Gravelines (France), and databases on Supabase, Inc. (Paris, France and Frankfurt, Germany). Communications are encrypted via HTTPS; passwords are hashed and never stored in plain text."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("4. Cookies et mesure d'audience", "4. Cookies and Analytics")}
              </h2>
              <p>
                {t(
                  "ActuWorld utilise des cookies techniques strictement nécessaires au fonctionnement (préférences de langue, thème). Ils ne requièrent pas de consentement.",
                  "ActuWorld uses strictly necessary technical cookies (language and theme preferences). These do not require consent."
                )}
              </p>
              <p className="mt-3">
                {t(
                  "Avec votre accord uniquement, nous utilisons Google Analytics (avec anonymisation de l'adresse IP) pour mesurer l'audience du site. Ces cookies ne sont déposés qu'après votre consentement, donné via notre bandeau cookies. Vous pouvez modifier ou retirer ce choix à tout moment grâce au lien « Cookies » en bas de page.",
                  "With your consent only, we use Google Analytics (with IP anonymization) to measure site traffic. These cookies are set only after you consent via our cookie banner. You can change or withdraw this choice at any time through the “Cookies” link in the footer."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("5. Vos droits", "5. Your Rights")}
              </h2>
              <p>
                {t(
                  "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour toute demande, contactez-nous à actuworld.app@outlook.fr.",
                  "Under GDPR, you have the right to access, rectify, delete and port your data. For any request, contact us at actuworld.app@outlook.fr."
                )}
              </p>
              <p className="mt-3">
                <a href="/suppression-compte" className="underline">
                  {t(
                    "Comment supprimer votre compte ou vos données →",
                    "How to delete your account or your data →"
                  )}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("6. Durées de conservation", "6. Data Retention")}
              </h2>
              <p>
                {t(
                  "Nous ne conservons vos données que le temps nécessaire :",
                  "We only keep your data for as long as necessary:"
                )}
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>{t("Compte et contenus publiés : tant que votre compte est actif.", "Account and published content: as long as your account is active.")}</li>
                <li>{t("Comptes inactifs : anonymisés après 24 mois sans connexion (un e-mail d'avertissement est envoyé au préalable).", "Inactive accounts: anonymized after 24 months without sign-in (a warning email is sent beforehand).")}</li>
                <li>{t("Messages privés : 12 mois.", "Private messages: 12 months.")}</li>
                <li>{t("Données de modération (signalements, actions) : 12 mois, hors sanctions en cours.", "Moderation data (reports, actions): 12 months, excluding ongoing sanctions.")}</li>
                <li>{t("Notifications : 90 jours.", "Notifications: 90 days.")}</li>
                <li>{t("Sur demande de suppression de compte : vos données personnelles sont anonymisées immédiatement.", "On account deletion request: your personal data is anonymized immediately.")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("7. Contact", "7. Contact")}
              </h2>
              <p>
                {t(
                  "Pour toute question relative à la confidentialité, écrivez-nous à actuworld.app@outlook.fr.",
                  "For any privacy-related questions, write to us at actuworld.app@outlook.fr."
                )}
              </p>
            </section>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
