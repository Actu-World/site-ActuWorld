import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

export default function PrivacyPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "donnees-collectees",
      title: t("1. Données collectées", "1. Data We Collect"),
      body: (
        <p>
          {t(
            "ActuWorld collecte uniquement les données nécessaires au fonctionnement du service\u00a0: adresse e-mail, nom d'utilisateur, et les contenus que tu publies (articles, votes, commentaires). Pour le miroir de lecture de ton profil (visible par toi uniquement), nous conservons également des statistiques de lecture agrégées par mois, thème et média, jamais la liste des contenus que tu as consultés. Aucune donnée n'est vendue à des tiers.",
            "ActuWorld only collects data necessary for the service: email address, username, and content you publish (articles, votes, comments). For your profile's reading mirror (visible only to you), we also keep reading statistics aggregated by month, theme and outlet, never the list of contents you viewed. No data is sold to third parties."
          )}
        </p>
      ),
    },
    {
      id: "utilisation",
      title: t("2. Utilisation des données", "2. How We Use Your Data"),
      body: (
        <p>
          {t(
            "Tes données sont utilisées pour\u00a0: gérer ton compte, afficher tes publications, calculer les scores de confiance communautaires, et t'envoyer des notifications liées au service.",
            "Your data is used to: manage your account, display your publications, calculate community trust scores, and send you service-related notifications."
          )}
        </p>
      ),
    },
    {
      id: "hebergement",
      title: t("3. Hébergement et sécurité", "3. Hosting and Security"),
      body: (
        <p>
          {t(
            "Tes données sont hébergées exclusivement au sein de l'Union européenne\u00a0: le site et l'API sur un serveur OVHcloud à Gravelines (France), et les bases de données chez Supabase, Inc. (Paris, France et Francfort, Allemagne). Les communications sont chiffrées via HTTPS\u00a0; les mots de passe sont hashés et ne sont jamais stockés en clair.",
            "Your data is hosted exclusively within the European Union: the website and API on an OVHcloud server in Gravelines (France), and databases on Supabase, Inc. (Paris, France and Frankfurt, Germany). Communications are encrypted via HTTPS; passwords are hashed and never stored in plain text."
          )}
        </p>
      ),
    },
    {
      id: "cookies",
      title: t("4. Cookies et mesure d'audience", "4. Cookies and Analytics"),
      body: (
        <>
          <p>
            {t(
              "ActuWorld utilise des cookies techniques strictement nécessaires au fonctionnement (préférences de langue, thème). Ils ne requièrent pas de consentement.",
              "ActuWorld uses strictly necessary technical cookies (language and theme preferences). These do not require consent."
            )}
          </p>
          <p>
            {t(
              "Avec ton accord uniquement, nous utilisons Google Analytics (avec anonymisation de l'adresse IP) pour mesurer l'audience du site. Ces cookies ne sont déposés qu'après ton consentement, donné via notre bandeau cookies. Tu peux modifier ou retirer ce choix à tout moment grâce au lien « Gérer les cookies » en bas de page.",
              "With your consent only, we use Google Analytics (with IP anonymization) to measure site traffic. These cookies are set only after you consent via our cookie banner. You can change or withdraw this choice at any time through the “Cookie settings” link in the footer."
            )}
          </p>
        </>
      ),
    },
    {
      id: "droits",
      title: t("5. Tes droits", "5. Your Rights"),
      body: (
        <>
          <p>
            {t(
              "Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, de suppression et de portabilité de tes données. Pour toute demande, écris-nous à actuworld.app@outlook.fr.",
              "Under GDPR, you have the right to access, rectify, delete and port your data. For any request, contact us at actuworld.app@outlook.fr."
            )}
          </p>
          <p>
            <Link to="/suppression-compte">
              {t("Comment supprimer ton compte ou tes données", "How to delete your account or your data")}
            </Link>
          </p>
        </>
      ),
    },
    {
      id: "conservation",
      title: t("6. Durées de conservation", "6. Data Retention"),
      body: (
        <>
          <p>{t("Nous ne conservons tes données que le temps nécessaire\u00a0:", "We only keep your data for as long as necessary:")}</p>
          <ul>
            <li>{t("Compte et contenus publiés\u00a0: tant que ton compte est actif.", "Account and published content: as long as your account is active.")}</li>
            <li>{t("Comptes inactifs\u00a0: anonymisés après 24 mois sans connexion (un e-mail d'avertissement est envoyé au préalable).", "Inactive accounts: anonymized after 24 months without sign-in (a warning email is sent beforehand).")}</li>
            <li>{t("Messages privés\u00a0: 12 mois.", "Private messages: 12 months.")}</li>
            <li>{t("Données de modération (signalements, actions)\u00a0: 12 mois, hors sanctions en cours.", "Moderation data (reports, actions): 12 months, excluding ongoing sanctions.")}</li>
            <li>{t("Notifications\u00a0: 90 jours.", "Notifications: 90 days.")}</li>
            <li>{t("Statistiques de lecture agrégées (mois, thème, média, sans historique des contenus consultés)\u00a0: 12 mois.", "Aggregated reading statistics (month, theme, outlet, no history of viewed contents): 12 months.")}</li>
            <li>{t("Sur demande de suppression de compte\u00a0: tes données personnelles sont anonymisées immédiatement.", "On account deletion request: your personal data is anonymized immediately.")}</li>
          </ul>
        </>
      ),
    },
    {
      id: "contact",
      title: t("7. Contact", "7. Contact"),
      body: (
        <p>
          {t(
            "Pour toute question relative à la confidentialité, écris-nous à actuworld.app@outlook.fr.",
            "For any privacy-related questions, write to us at actuworld.app@outlook.fr."
          )}
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      head={
        <PageMeta
          title={t("Politique de confidentialité", "Privacy Policy")}
          description={t(
            "Politique de confidentialité d'ActuWorld\u00a0: comment tes données sont collectées, utilisées et protégées.",
            "ActuWorld privacy policy: how your data is collected, used and protected."
          )}
          path="/privacy"
        />
      }
      title={t("Politique de confidentialité", "Privacy Policy")}
      meta={t("Dernière mise à jour\u00a0: janvier 2025", "Last updated: January 2025")}
      sections={sections}
    />
  );
}
