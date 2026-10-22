import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

// Politique de confidentialité. À tenir alignée avec : Docs/INFRA-SERVICES.md
// (sous-traitants réels), la rétention pg_cron (gdpr_retention_cleanup,
// gdpr_inactive_anonymization), le délai de suppression de compte de l'API
// (services/accountPurge.ts, 30 jours) et l'âge minimum de l'app
// (frontend/utils/age.ts, 15 ans).

type Row = { name: string; role: string; where: string };

export default function PrivacyPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const processors: Row[] = [
    {
      name: "Supabase, Inc.",
      role: t("Base de données, authentification, stockage des images", "Database, authentication, image storage"),
      where: t("Paris (France) et Francfort (Allemagne)", "Paris (France) and Frankfurt (Germany)"),
    },
    {
      name: "OVHcloud",
      role: t("Hébergement du site, de l'API et du service d'analyse de sources", "Hosting of the website, the API and the source-analysis service"),
      where: t("Gravelines (France)", "Gravelines (France)"),
    },
    {
      name: "Brevo (Sendinblue SAS)",
      role: t("Envoi des e-mails (connexion, mot de passe, liste d'attente)", "Email delivery (sign-in, password, waitlist)"),
      where: t("France", "France"),
    },
    {
      name: "Google LLC — Gemini",
      role: t(
        "Analyse automatisée de la cohérence entre une publication et ses sources (ASV)",
        "Automated analysis of the consistency between a publication and its sources (ASV)"
      ),
      where: t("États-Unis", "United States"),
    },
    {
      name: "Google LLC — Firebase Cloud Messaging, Sign in with Google",
      role: t("Livraison des notifications Android, connexion avec un compte Google", "Android push delivery, sign-in with a Google account"),
      where: t("États-Unis", "United States"),
    },
    {
      name: "Apple Inc.",
      role: t("Livraison des notifications iOS, connexion avec un compte Apple", "iOS push delivery, Sign in with Apple"),
      where: t("États-Unis", "United States"),
    },
    {
      name: "Expo (650 Industries, Inc.)",
      role: t("Relais des notifications vers Apple et Google", "Relay of push notifications to Apple and Google"),
      where: t("États-Unis", "United States"),
    },
    {
      name: "Functional Software, Inc. (Sentry)",
      role: t("Rapports d'erreurs techniques de l'app et de l'API", "Technical error reports from the app and the API"),
      where: t("Union européenne (Allemagne)", "European Union (Germany)"),
    },
    {
      name: "Tavily, Inc. et Brave Software, Inc.",
      role: t(
        "Recherche web de sources à partir d'extraits de contenu (jamais de données de compte)",
        "Web search for sources from content excerpts (never account data)"
      ),
      where: t("États-Unis", "United States"),
    },
    {
      name: "Google LLC — Google Analytics",
      role: t("Mesure d'audience du site, uniquement avec ton consentement", "Website audience measurement, only with your consent"),
      where: t("États-Unis", "United States"),
    },
  ];

  const sections = [
    {
      id: "responsable",
      title: t("1. Qui est responsable de tes données", "1. Who is responsible for your data"),
      body: (
        <>
          <p>
            {t(
              "Le responsable du traitement est Maxence Allier, entrepreneur individuel, 11 allée des Roses, 97441 Sainte-Suzanne, La Réunion (France), SIRET 995 070 687 00018, éditeur de l'application mobile ActuWorld, du site actuworld.fr et du Studio.",
              "The data controller is Maxence Allier, sole proprietor, 11 allée des Roses, 97441 Sainte-Suzanne, La Réunion (France), SIRET 995 070 687 00018, publisher of the ActuWorld mobile app, the actuworld.fr website and the Studio."
            )}
          </p>
          <p>
            {t(
              "Pour toute question ou demande liée à tes données : actuworld.app@outlook.fr (objet « Données personnelles »). Nous répondons sous un mois.",
              "For any question or request about your data: actuworld.app@outlook.fr (subject “Personal data”). We reply within one month."
            )}
          </p>
        </>
      ),
    },
    {
      id: "donnees-collectees",
      title: t("2. Les données que nous traitons", "2. The data we process"),
      body: (
        <>
          <p>{t("Nous ne collectons que ce qui sert au fonctionnement du service. Rien n'est vendu à des tiers.", "We only collect what the service needs to work. Nothing is sold to third parties.")}</p>
          <ul>
            <li>
              {t(
                "Ton compte : adresse e-mail, nom d'utilisateur, nom affiché, photo de profil, biographie, centres d'intérêt, pays, langue, confirmation que tu as 15 ans ou plus. Si tu te connectes avec Google ou Apple, nous recevons un identifiant technique et l'adresse e-mail associée, jamais ton mot de passe.",
                "Your account: email address, username, display name, profile picture, bio, interests, country, language, confirmation that you are 15 or older. If you sign in with Google or Apple, we receive a technical identifier and the associated email address, never your password."
              )}
            </li>
            <li>
              {t(
                "Ce que tu publies : dépêches, articles, images, sources citées, commentaires, votes de confiance, messages privés et leurs pièces jointes, signalements.",
                "What you publish: dispatches, articles, images, cited sources, comments, trust votes, private messages and their attachments, reports."
              )}
            </li>
            <li>
              {t(
                "Données techniques : jeton de notification push de ton appareil, langue de l'appareil, et en cas d'erreur de l'application un rapport technique (modèle d'appareil, version de l'app, trace de l'erreur) sans ton nom ni ton e-mail.",
                "Technical data: your device's push notification token, device language, and when the app fails a technical report (device model, app version, error trace) without your name or email."
              )}
            </li>
            <li>
              {t(
                "Miroir de lecture (visible par toi uniquement) : des statistiques agrégées par mois, thème et média. Nous ne gardons pas la liste des contenus que tu as consultés.",
                "Reading mirror (visible to you only): statistics aggregated by month, theme and outlet. We do not keep the list of contents you viewed."
              )}
            </li>
            <li>
              {t(
                "Localisation : seulement si tu l'actives toi-même pour pré-remplir ton pays dans ton profil. La position n'est jamais enregistrée.",
                "Location: only if you enable it yourself to pre-fill your country in your profile. The position is never stored."
              )}
            </li>
            <li>
              {t(
                "Liste d'attente : ton adresse e-mail et, le cas échéant, la campagne par laquelle tu es arrivé (par exemple « Instagram »).",
                "Waitlist: your email address and, where applicable, the campaign that brought you here (for example “Instagram”)."
              )}
            </li>
            <li>
              {t(
                "Site : les cookies décrits à la section 7.",
                "Website: the cookies described in section 7."
              )}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "utilisation",
      title: t("3. Pourquoi, et sur quelle base légale", "3. Why, and on which legal basis"),
      body: (
        <ul>
          <li>
            {t(
              "Fournir le service (exécution du contrat) : créer et gérer ton compte, afficher tes publications, faire fonctionner la messagerie et les notifications, calculer les scores de confiance à partir des votes.",
              "Providing the service (performance of the contract): creating and managing your account, displaying your publications, running messaging and notifications, computing trust scores from votes."
            )}
          </li>
          <li>
            {t(
              "Analyser les sources citées (intérêt légitime : qualité et fiabilité de l'information, cœur du service). Voir la section 4.",
              "Analysing cited sources (legitimate interest: quality and reliability of information, the core of the service). See section 4."
            )}
          </li>
          <li>
            {t(
              "Modérer et sécuriser (intérêt légitime et obligations légales) : traiter les signalements, appliquer les règles de publication, prévenir les abus, conserver les journaux techniques.",
              "Moderation and security (legitimate interest and legal obligations): handling reports, enforcing publishing rules, preventing abuse, keeping technical logs."
            )}
          </li>
          <li>
            {t(
              "Te prévenir du lancement si tu t'es inscrit à la liste d'attente (consentement, retirable à tout moment en répondant à l'e-mail).",
              "Letting you know about the launch if you joined the waitlist (consent, withdrawable at any time by replying to the email)."
            )}
          </li>
          <li>
            {t(
              "Mesurer l'audience du site (consentement via le bandeau cookies).",
              "Measuring website audience (consent via the cookie banner)."
            )}
          </li>
          <li>
            {t(
              "Vérifier l'âge minimum de 15 ans (obligation légale). Un compte créé par une personne de moins de 15 ans est supprimé dès que nous en avons connaissance.",
              "Checking the minimum age of 15 (legal obligation). An account created by someone under 15 is deleted as soon as we become aware of it."
            )}
          </li>
        </ul>
      ),
    },
    {
      id: "asv",
      title: t("4. L'analyse de sources (ASV) et la modération", "4. Source analysis (ASV) and moderation"),
      body: (
        <>
          <p>
            {t(
              "Quand tu publies, l'ASV analyse automatiquement les sources que tu cites : réputation du site, accessibilité de la page, et cohérence entre ce que tu écris et ce que dit la source. Pour cette dernière étape, le texte de ta publication et le contenu des pages citées sont transmis au modèle Gemini de Google. Aucune donnée de ton compte (nom, e-mail, identifiant) n'est envoyée.",
              "When you publish, ASV automatically analyses the sources you cite: site reputation, page availability, and consistency between what you write and what the source says. For that last step, the text of your publication and the content of the cited pages are sent to Google's Gemini model. No account data (name, email, identifier) is sent."
            )}
          </p>
          <p>
            {t(
              "Le résultat est une aide à la lecture affichée sur la publication. Il ne dit pas si une information est vraie ou fausse, ne te note pas en tant que personne et ne produit aucune décision à effet juridique à ton égard. Il peut être contesté depuis la publication (« Signaler l'analyse »).",
              "The result is a reading aid shown on the publication. It does not say whether a piece of information is true or false, does not rate you as a person and produces no decision with legal effect on you. It can be challenged from the publication (“Report the analysis”)."
            )}
          </p>
          <p>
            {t(
              "La modération des contenus et des comptes (signalements, retraits, avertissements, suspensions) est faite par des personnes. Toute mesure prise est motivée et peut faire l'objet d'un recours par e-mail.",
              "Moderation of content and accounts (reports, removals, warnings, suspensions) is done by people. Every measure is explained and can be appealed by email."
            )}
          </p>
        </>
      ),
    },
    {
      id: "sous-traitants",
      title: t("5. Qui héberge et traite tes données", "5. Who hosts and processes your data"),
      body: (
        <>
          <p>
            {t(
              "Le site, l'API et le service d'analyse tournent sur un serveur OVHcloud à Gravelines (France). Les bases de données sont chez Supabase, à Paris et Francfort. Certaines fonctions passent par des prestataires établis aux États-Unis ; ces transferts reposent sur le cadre de protection des données UE–États-Unis (Data Privacy Framework) ou sur les clauses contractuelles types de la Commission européenne.",
              "The website, the API and the analysis service run on an OVHcloud server in Gravelines (France). Databases are hosted by Supabase in Paris and Frankfurt. Some functions rely on providers established in the United States; these transfers are covered by the EU–US Data Privacy Framework or the European Commission's standard contractual clauses."
            )}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[15px] border-collapse">
              <thead>
                <tr className="text-left text-aw-muted">
                  <th className="py-2 pr-4 font-semibold">{t("Prestataire", "Provider")}</th>
                  <th className="py-2 pr-4 font-semibold">{t("Rôle", "Role")}</th>
                  <th className="py-2 font-semibold">{t("Lieu", "Location")}</th>
                </tr>
              </thead>
              <tbody>
                {processors.map((row) => (
                  <tr key={row.name} className="border-t border-aw align-top">
                    <td className="py-2 pr-4 font-semibold">{row.name}</td>
                    <td className="py-2 pr-4">{row.role}</td>
                    <td className="py-2">{row.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            {t(
              "Les communications sont chiffrées (HTTPS), les mots de passe sont hachés et jamais stockés en clair, et l'accès aux données est limité par des règles de sécurité au niveau de la base.",
              "Communications are encrypted (HTTPS), passwords are hashed and never stored in plain text, and data access is restricted by database-level security rules."
            )}
          </p>
        </>
      ),
    },
    {
      id: "conservation",
      title: t("6. Combien de temps", "6. For how long"),
      body: (
        <ul>
          <li>{t("Compte et contenus publiés : tant que ton compte est actif.", "Account and published content: as long as your account is active.")}</li>
          <li>
            {t(
              "Suppression de compte : tu as 30 jours pour changer d'avis en te reconnectant ; passé ce délai, ton compte, tes contenus, tes images et tes messages sont supprimés définitivement.",
              "Account deletion: you have 30 days to change your mind by signing back in; after that, your account, content, images and messages are permanently deleted."
            )}
          </li>
          <li>{t("Comptes inactifs : anonymisés après 24 mois sans connexion.", "Inactive accounts: anonymised after 24 months without sign-in.")}</li>
          <li>{t("Messages privés et pièces jointes : 12 mois.", "Private messages and attachments: 12 months.")}</li>
          <li>{t("Signalements et actions de modération : 12 mois, hors sanctions en cours.", "Reports and moderation actions: 12 months, excluding ongoing sanctions.")}</li>
          <li>{t("Notifications : 90 jours.", "Notifications: 90 days.")}</li>
          <li>{t("Statistiques de lecture agrégées : 12 mois.", "Aggregated reading statistics: 12 months.")}</li>
          <li>{t("Rapports d'erreurs techniques : 90 jours.", "Technical error reports: 90 days.")}</li>
          <li>
            {t(
              "Liste d'attente : jusqu'au lancement public, puis supprimée au plus tard 6 mois après, ou dès que tu le demandes.",
              "Waitlist: until the public launch, then deleted no later than 6 months after, or as soon as you ask."
            )}
          </li>
        </ul>
      ),
    },
    {
      id: "cookies",
      title: t("7. Cookies et mesure d'audience", "7. Cookies and analytics"),
      body: (
        <>
          <p>
            {t(
              "Le site utilise des cookies strictement nécessaires (langue, thème, choix de consentement). Ils ne requièrent pas d'accord.",
              "The website uses strictly necessary cookies (language, theme, consent choice). They do not require consent."
            )}
          </p>
          <p>
            {t(
              "Avec ton accord uniquement, Google Analytics mesure l'audience du site. Ces cookies ne sont déposés qu'après ton consentement, donné via le bandeau. Tu peux changer d'avis à tout moment grâce au lien « Gérer les cookies » en bas de page. Ton choix est conservé 13 mois.",
              "With your consent only, Google Analytics measures website traffic. These cookies are set only after you consent via the banner. You can change your mind at any time through the “Cookie settings” link in the footer. Your choice is kept for 13 months."
            )}
          </p>
          <p>{t("L'application mobile n'utilise aucun outil de mesure d'audience ni de publicité.", "The mobile app uses no analytics or advertising tools.")}</p>
        </>
      ),
    },
    {
      id: "droits",
      title: t("8. Tes droits", "8. Your rights"),
      body: (
        <>
          <p>
            {t(
              "Tu disposes des droits d'accès, de rectification, d'effacement, de portabilité, d'opposition et de limitation, ainsi que du droit de retirer ton consentement à tout moment. Écris à actuworld.app@outlook.fr ; nous pouvons te demander de confirmer ton identité depuis l'adresse de ton compte.",
              "You have the rights of access, rectification, erasure, portability, objection and restriction, as well as the right to withdraw your consent at any time. Write to actuworld.app@outlook.fr; we may ask you to confirm your identity from your account's email address."
            )}
          </p>
          <p>
            <Link to="/suppression-compte">
              {t("Comment supprimer ton compte ou tes données", "How to delete your account or your data")}
            </Link>
          </p>
          <p>
            {t(
              "Si tu estimes que tes droits ne sont pas respectés, tu peux saisir la CNIL (cnil.fr).",
              "If you believe your rights are not respected, you can lodge a complaint with the CNIL (cnil.fr), the French data protection authority."
            )}
          </p>
        </>
      ),
    },
    {
      id: "modifications",
      title: t("9. Modifications", "9. Changes"),
      body: (
        <p>
          {t(
            "Cette politique peut évoluer avec le service. La date de mise à jour figure en tête de page ; un changement important est annoncé dans l'application ou par e-mail.",
            "This policy may change as the service evolves. The update date is shown at the top of the page; a significant change is announced in the app or by email."
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
            "Politique de confidentialité d'ActuWorld : quelles données sont traitées, pourquoi, par qui, combien de temps, et tes droits.",
            "ActuWorld privacy policy: what data is processed, why, by whom, for how long, and your rights."
          )}
          path="/privacy"
        />
      }
      title={t("Politique de confidentialité", "Privacy Policy")}
      meta={t("Dernière mise à jour : 22 octobre 2026", "Last updated: 22 October 2026")}
      sections={sections}
    />
  );
}
