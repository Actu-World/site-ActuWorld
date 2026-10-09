import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

export default function AccountDeletionPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "depuis-app",
      title: t("1. Supprimer ton compte depuis l'application", "1. Delete your account from the app"),
      body: (
        <>
          <p>
            {t(
              "La suppression se fait directement dans l'application, sans nous contacter\u00a0:",
              "You can delete your account directly in the app, without contacting us:"
            )}
          </p>
          <ol>
            <li>{t("Ouvre ActuWorld et connecte-toi.", "Open ActuWorld and sign in.")}</li>
            <li>{t("Va dans Profil → Paramètres.", "Go to Profile → Settings.")}</li>
            <li>{t("Touche « Supprimer le compte ».", "Tap “Delete account”.")}</li>
            <li>{t("Confirme en saisissant le mot demandé\u00a0: la suppression est immédiate et définitive.", "Confirm by typing the requested word: deletion is immediate and permanent.")}</li>
          </ol>
        </>
      ),
    },
    {
      id: "sans-acces",
      title: t("2. Demander la suppression sans accès à l'application", "2. Request deletion without access to the app"),
      body: (
        <p>
          {t(
            "Si tu ne peux plus accéder à ton compte, envoie un e-mail à actuworld.app@outlook.fr depuis l'adresse associée à ton compte, avec pour objet « Suppression de compte ». Nous traitons la demande sous 30 jours au plus.",
            "If you can no longer access your account, email actuworld.app@outlook.fr from the address associated with your account, with the subject “Account deletion”. We process requests within 30 days at most."
          )}
        </p>
      ),
    },
    {
      id: "suppression-partielle",
      title: t("3. Supprimer certaines données sans supprimer ton compte", "3. Delete some data without deleting your account"),
      body: (
        <>
          <p>
            {t(
              "Tu peux à tout moment supprimer tes contenus individuellement depuis l'application ActuWorld\u00a0: tes publications, tes commentaires et tes messages (option « Supprimer » sur chaque contenu). Tu peux aussi modifier ou effacer les informations de ton profil (photo, biographie, localisation) dans Profil → Modifier le profil.",
              "You can delete your content individually at any time from the ActuWorld app: your posts, comments and messages (“Delete” option on each item). You can also edit or clear your profile information (photo, bio, location) in Profile → Edit profile."
            )}
          </p>
          <p>
            {t(
              "Pour toute autre demande de suppression partielle (par exemple l'historique lié à ton compte), écris-nous à actuworld.app@outlook.fr\u00a0: nous traitons la demande sous 30 jours, sans que tu aies à supprimer ton compte.",
              "For any other partial deletion request (for example account-related history), write to actuworld.app@outlook.fr: we process requests within 30 days, without requiring you to delete your account."
            )}
          </p>
        </>
      ),
    },
    {
      id: "donnees",
      title: t("4. Données supprimées et données conservées", "4. Deleted and retained data"),
      body: (
        <>
          <p>
            {t(
              "Lors de la suppression du compte, tes données personnelles (adresse e-mail, nom d'utilisateur, photo et informations de profil, préférences) sont supprimées ou anonymisées immédiatement. Tes publications et commentaires sont dissociés de ton identité.",
              "When your account is deleted, your personal data (email address, username, profile photo and information, preferences) is deleted or anonymized immediately. Your posts and comments are dissociated from your identity."
            )}
          </p>
          <p>
            {t(
              "Certaines données sont conservées temporairement pour des raisons légales ou de sécurité\u00a0:",
              "Some data is retained temporarily for legal or security reasons:"
            )}
          </p>
          <ul>
            <li>{t("Messages privés\u00a0: jusqu'à 12 mois.", "Private messages: up to 12 months.")}</li>
            <li>{t("Données de modération (signalements, actions)\u00a0: jusqu'à 12 mois, hors sanctions en cours.", "Moderation data (reports, actions): up to 12 months, excluding ongoing sanctions.")}</li>
            <li>{t("Notifications\u00a0: 90 jours.", "Notifications: 90 days.")}</li>
          </ul>
          <p>
            {t("Pour en savoir plus, consulte notre ", "For more details, see our ")}
            <Link to="/privacy">{t("politique de confidentialité", "privacy policy")}</Link>.
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: t("5. Contact", "5. Contact"),
      body: (
        <p>
          {t(
            "Pour toute question relative à la suppression de tes données, écris-nous à actuworld.app@outlook.fr.",
            "For any question about the deletion of your data, write to us at actuworld.app@outlook.fr."
          )}
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      head={
        <PageMeta
          title={t("Supprimer ton compte ActuWorld", "Delete Your ActuWorld Account")}
          description={t(
            "Comment supprimer ton compte ActuWorld et les données associées\u00a0: procédure, données supprimées et durées de conservation.",
            "How to delete your ActuWorld account and associated data: procedure, deleted data and retention periods."
          )}
          path="/suppression-compte"
        />
      }
      title={t("Supprimer ton compte ActuWorld", "Delete Your ActuWorld Account")}
      meta={t(
        "Cette page concerne l'application mobile ActuWorld, éditée par ActuWorld.",
        "This page applies to the ActuWorld mobile app, published by ActuWorld."
      )}
      sections={sections}
    />
  );
}
