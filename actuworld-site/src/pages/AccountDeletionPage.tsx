import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper } from "../components/animations";

export default function AccountDeletionPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Supprimer votre compte ActuWorld", "Delete Your ActuWorld Account")}
        description={t(
          "Comment supprimer votre compte ActuWorld et les données associées — procédure, données supprimées et durées de conservation.",
          "How to delete your ActuWorld account and associated data — procedure, deleted data and retention periods."
        )}
        path="/suppression-compte"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <H2 as="h1" center>
            {t("Supprimer votre compte ActuWorld", "Delete Your ActuWorld Account")}
          </H2>

          <p className="text-aw-muted mt-4 text-center text-sm">
            {t(
              "Cette page concerne l'application mobile ActuWorld, éditée par ActuWorld.",
              "This page applies to the ActuWorld mobile app, published by ActuWorld."
            )}
          </p>

          <div className="mt-12 space-y-8 text-aw-text/80">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("1. Supprimer votre compte depuis l'application", "1. Delete your account from the app")}
              </h2>
              <p>
                {t(
                  "La suppression se fait directement dans l'application, sans nous contacter :",
                  "You can delete your account directly in the app, without contacting us:"
                )}
              </p>
              <ol className="mt-3 list-decimal pl-6 space-y-1">
                <li>{t("Ouvrez ActuWorld et connectez-vous.", "Open ActuWorld and sign in.")}</li>
                <li>{t("Allez dans Profil → Paramètres.", "Go to Profile → Settings.")}</li>
                <li>{t("Touchez « Supprimer le compte ».", "Tap “Delete account”.")}</li>
                <li>{t("Confirmez en saisissant le mot demandé : la suppression est immédiate et définitive.", "Confirm by typing the requested word: deletion is immediate and permanent.")}</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("2. Demander la suppression sans accès à l'application", "2. Request deletion without access to the app")}
              </h2>
              <p>
                {t(
                  "Si vous ne pouvez plus accéder à votre compte, envoyez un e-mail à actuworld.app@outlook.fr depuis l'adresse associée à votre compte, avec pour objet « Suppression de compte ». Nous traitons la demande sous 30 jours au plus.",
                  "If you can no longer access your account, email actuworld.app@outlook.fr from the address associated with your account, with the subject “Account deletion”. We process requests within 30 days at most."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("3. Données supprimées et données conservées", "3. Deleted and retained data")}
              </h2>
              <p>
                {t(
                  "Lors de la suppression du compte, vos données personnelles (adresse e-mail, nom d'utilisateur, photo et informations de profil, préférences) sont supprimées ou anonymisées immédiatement. Vos publications et commentaires sont dissociés de votre identité.",
                  "When your account is deleted, your personal data (email address, username, profile photo and information, preferences) is deleted or anonymized immediately. Your posts and comments are dissociated from your identity."
                )}
              </p>
              <p className="mt-3">
                {t(
                  "Certaines données sont conservées temporairement pour des raisons légales ou de sécurité :",
                  "Some data is retained temporarily for legal or security reasons:"
                )}
              </p>
              <ul className="mt-3 list-disc pl-6 space-y-1">
                <li>{t("Messages privés : jusqu'à 12 mois.", "Private messages: up to 12 months.")}</li>
                <li>{t("Données de modération (signalements, actions) : jusqu'à 12 mois, hors sanctions en cours.", "Moderation data (reports, actions): up to 12 months, excluding ongoing sanctions.")}</li>
                <li>{t("Notifications : 90 jours.", "Notifications: 90 days.")}</li>
              </ul>
              <p className="mt-3">
                {t(
                  "Pour en savoir plus, consultez notre politique de confidentialité.",
                  "For more details, see our privacy policy."
                )}{" "}
                <a href="/privacy" className="underline">
                  {t("Politique de confidentialité", "Privacy Policy")}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">{t("4. Contact", "4. Contact")}</h2>
              <p>
                {t(
                  "Pour toute question relative à la suppression de vos données, écrivez-nous à actuworld.app@outlook.fr.",
                  "For any question about the deletion of your data, write to us at actuworld.app@outlook.fr."
                )}
              </p>
            </section>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
