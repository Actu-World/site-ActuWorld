import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

export default function TermsPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "objet",
      title: t("1. Objet", "1. Purpose"),
      body: (
        <p>
          {t(
            "Les présentes conditions régissent l'utilisation de la plateforme ActuWorld, accessible à l'adresse www.actuworld.fr et via l'application mobile. En utilisant le service, tu acceptes ces conditions.",
            "These terms govern the use of the ActuWorld platform, accessible at www.actuworld.fr and via the mobile application. By using the service, you accept these terms."
          )}
        </p>
      ),
    },
    {
      id: "sourcing",
      title: t("2. Sourcing obligatoire", "2. Mandatory Sourcing"),
      body: (
        <p>
          {t(
            "Tout contenu publié sur ActuWorld doit être accompagné d'au moins une source vérifiable. Les publications sans source seront signalées et pourront être retirées. Cette règle est le fondement de notre plateforme.",
            "All content published on ActuWorld must include at least one verifiable source. Publications without sources will be flagged and may be removed. This rule is the foundation of our platform."
          )}
        </p>
      ),
    },
    {
      id: "score",
      title: t("3. Score de confiance", "3. Trust Score"),
      body: (
        <p>
          {t(
            "Le score de confiance est calculé à partir des votes communautaires. Toute tentative de manipulation (faux comptes, votes coordonnés) entraînera la suspension du compte.",
            "The trust score is calculated from community votes. Any manipulation attempt (fake accounts, coordinated voting) will result in account suspension."
          )}
        </p>
      ),
    },
    {
      id: "moderation",
      title: t("4. Contenu interdit et modération", "4. Prohibited Content & Moderation"),
      body: (
        <p>
          {t(
            "Tolérance zéro. Sont strictement interdits\u00a0: la désinformation volontaire, les contenus haineux, le harcèlement, les contenus illégaux, le spam et toute atteinte aux droits d'auteur. ActuWorld applique une politique de tolérance zéro envers les contenus offensants et les utilisateurs abusifs. Chaque publication et chaque utilisateur peuvent être signalés ou bloqués directement dans l'application. ActuWorld s'engage à examiner les signalements et à retirer les contenus contrevenants sous 24 heures, et à exclure les utilisateurs responsables.",
            "Zero tolerance. The following are strictly prohibited: deliberate misinformation, hateful content, harassment, illegal content, spam, and any copyright infringement. ActuWorld enforces a zero-tolerance policy toward objectionable content and abusive users. Every post and every user can be reported or blocked directly within the app. ActuWorld commits to reviewing reports and removing violating content within 24 hours, and to ejecting the users responsible."
          )}
        </p>
      ),
    },
    {
      id: "propriete",
      title: t("5. Propriété intellectuelle", "5. Intellectual Property"),
      body: (
        <p>
          {t(
            "Tu conserves les droits sur tes contenus publiés. En publiant sur ActuWorld, tu accordes une licence non exclusive pour afficher et distribuer ton contenu sur la plateforme.",
            "You retain rights to your published content. By publishing on ActuWorld, you grant a non-exclusive license to display and distribute your content on the platform."
          )}
        </p>
      ),
    },
    {
      id: "gratuite",
      title: t("6. Gratuité de la lecture", "6. Free Reading"),
      body: (
        <p>
          {t(
            "La lecture de tous les contenus sur ActuWorld est et restera toujours gratuite. Aucun paywall ne sera appliqué à l'accès à l'information. Les abonnements payants concernent uniquement les outils de création.",
            "Reading all content on ActuWorld is and will always remain free. No paywall will be applied to information access. Paid subscriptions only apply to creation tools."
          )}
        </p>
      ),
    },
    {
      id: "responsabilite",
      title: t("7. Limitation de responsabilité", "7. Limitation of Liability"),
      body: (
        <p>
          {t(
            "ActuWorld fournit un outil de publication et de vérification collaborative. La plateforme ne garantit pas l'exactitude de tous les contenus publiés par les utilisateurs, mais s'engage à fournir les outils pour les évaluer.",
            "ActuWorld provides a collaborative publishing and verification tool. The platform does not guarantee the accuracy of all user-published content, but commits to providing tools to evaluate it."
          )}
        </p>
      ),
    },
    {
      id: "contact",
      title: t("8. Contact", "8. Contact"),
      body: (
        <p>
          {t(
            "Pour toute question relative aux conditions d'utilisation, écris-nous à actuworld.app@outlook.fr.",
            "For any questions about these terms, contact us at actuworld.app@outlook.fr."
          )}
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      head={
        <PageMeta
          title={t("Conditions générales d'utilisation", "Terms of Service")}
          description={t(
            "Conditions générales d'utilisation d'ActuWorld\u00a0: règles de la plateforme, droits et responsabilités.",
            "ActuWorld terms of service: platform rules, rights and responsibilities."
          )}
          path="/terms"
        />
      }
      title={t("Conditions générales d'utilisation", "Terms of Service")}
      meta={t("Dernière mise à jour\u00a0: août 2026", "Last updated: August 2026")}
      sections={sections}
    />
  );
}
