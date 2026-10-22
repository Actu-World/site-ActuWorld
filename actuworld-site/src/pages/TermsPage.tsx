import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

// CGU. À tenir alignées avec : l'âge minimum de l'app (frontend/utils/age.ts,
// 15 ans), le délai de suppression de compte de l'API (30 jours), la doctrine
// ASV (« soutenue / contredite par », jamais vrai / faux), la Politique de
// confidentialité (/privacy) et les mentions légales (/mentions-legales).

export default function TermsPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "objet",
      title: t("1. Objet et acceptation", "1. Purpose and acceptance"),
      body: (
        <>
          <p>
            {t(
              "Les présentes conditions régissent l'utilisation d'ActuWorld : l'application mobile, le site actuworld.fr et le Studio d'écriture sur ordinateur. Le service est édité par Maxence Allier, entrepreneur individuel, dont les coordonnées figurent dans les mentions légales.",
              "These terms govern the use of ActuWorld: the mobile app, the actuworld.fr website and the desktop writing Studio. The service is published by Maxence Allier, sole proprietor, whose details appear in the legal notice."
            )}
          </p>
          <p>
            {t(
              "En créant un compte ou en utilisant le service, tu acceptes ces conditions ainsi que la politique de confidentialité. Si tu n'es pas d'accord, n'utilise pas le service.",
              "By creating an account or using the service, you accept these terms and the privacy policy. If you do not agree, do not use the service."
            )}
          </p>
        </>
      ),
    },
    {
      id: "age",
      title: t("2. Âge minimum", "2. Minimum age"),
      body: (
        <p>
          {t(
            "ActuWorld est réservé aux personnes de 15 ans et plus. Tu le confirmes à la création de ton compte. Un compte ouvert par une personne de moins de 15 ans est supprimé dès que nous en avons connaissance. Si tu as entre 15 et 18 ans, assure-toi d'avoir l'accord de tes parents ou de ton responsable légal.",
            "ActuWorld is restricted to people aged 15 and over. You confirm this when creating your account. An account opened by someone under 15 is deleted as soon as we become aware of it. If you are between 15 and 18, make sure you have the consent of your parents or legal guardian."
          )}
        </p>
      ),
    },
    {
      id: "compte",
      title: t("3. Ton compte", "3. Your account"),
      body: (
        <ul>
          <li>
            {t(
              "Un compte par personne, avec des informations exactes. Tu es responsable de ce qui est publié depuis ton compte et de la confidentialité de tes moyens de connexion (mot de passe, compte Google ou Apple, lien de connexion du Studio).",
              "One account per person, with accurate information. You are responsible for what is published from your account and for keeping your sign-in methods confidential (password, Google or Apple account, Studio sign-in link)."
            )}
          </li>
          <li>
            {t(
              "Pas de faux comptes, d'usurpation d'identité ni de comptes automatisés. Les comptes officiels « Rédaction ActuWorld » sont identifiés comme tels dans l'application.",
              "No fake accounts, impersonation or automated accounts. The official “Rédaction ActuWorld” accounts are identified as such in the app."
            )}
          </li>
          <li>
            {t(
              "Tu peux supprimer ton compte à tout moment depuis les réglages de l'application ou en suivant la procédure de la page dédiée. Tu disposes de 30 jours pour annuler en te reconnectant ; passé ce délai, ton compte et tes contenus sont supprimés définitivement.",
              "You can delete your account at any time from the app settings or by following the procedure on the dedicated page. You have 30 days to cancel by signing back in; after that, your account and content are permanently deleted."
            )}{" "}
            <Link to="/suppression-compte">{t("Supprimer son compte", "Delete your account")}</Link>
          </li>
        </ul>
      ),
    },
    {
      id: "sourcing",
      title: t("4. Règles de publication : la source d'abord", "4. Publishing rules: the source first"),
      body: (
        <>
          <p>
            {t(
              "Toute publication sur ActuWorld doit citer au moins une source vérifiable et accessible, au moment même de la publication. C'est la règle fondatrice du service : sans source, pas de publication.",
              "Every publication on ActuWorld must cite at least one verifiable, accessible source at the moment of publishing. This is the founding rule of the service: no source, no publication."
            )}
          </p>
          <ul>
            <li>
              {t(
                "La source doit correspondre à ce que tu affirmes. Citer une source réelle en lui faisant dire autre chose est traité comme une publication sans source.",
                "The source must match what you claim. Citing a real source while making it say something else is treated as a publication without a source."
              )}
            </li>
            <li>
              {t(
                "Tu ne publies que des textes et des images dont tu détiens les droits ou que tu es autorisé à utiliser, en créditant leurs auteurs.",
                "You only publish texts and images you own the rights to or are authorised to use, crediting their authors."
              )}
            </li>
            <li>
              {t(
                "Tu peux modifier ou supprimer tes publications. Une publication modifiée perd le résultat d'analyse obtenu avant la modification jusqu'à une nouvelle analyse.",
                "You can edit or delete your publications. An edited publication loses the analysis result obtained before the edit until it is analysed again."
              )}
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "score",
      title: t("5. Score de confiance", "5. Trust score"),
      body: (
        <p>
          {t(
            "Chaque contenu affiche un score de confiance construit à partir des votes des lecteurs (« je fais confiance » ou non). Il n'y a pas de like ni de compteur de popularité. Toute manipulation du score (faux comptes, votes coordonnés, échange de votes) entraîne la suspension des comptes concernés et l'annulation des votes en cause.",
            "Each content shows a trust score built from readers' votes (“I trust this” or not). There are no likes and no popularity counters. Any manipulation of the score (fake accounts, coordinated voting, vote trading) leads to the suspension of the accounts involved and the cancellation of the votes concerned."
          )}
        </p>
      ),
    },
    {
      id: "asv",
      title: t("6. L'analyse de sources (ASV)", "6. Source analysis (ASV)"),
      body: (
        <>
          <p>
            {t(
              "L'ASV est un outil automatisé, en version bêta, qui analyse les sources citées : réputation du site, accessibilité de la page, et cohérence entre ta publication et le contenu de la source. Son résultat est affiché sur la publication comme une aide à la lecture.",
              "ASV is an automated tool, in beta, that analyses cited sources: site reputation, page availability, and consistency between your publication and the source's content. Its result is shown on the publication as a reading aid."
            )}
          </p>
          <p>
            {t(
              "L'ASV ne dit pas si une information est vraie ou fausse et ne remplace pas ton jugement. Il peut se tromper. Son résultat n'est pas une sanction et ne constitue pas une décision à ton encontre ; tu peux le contester depuis la publication (« Signaler l'analyse »). Le fonctionnement détaillé est décrit sur la page ASV.",
              "ASV does not say whether a piece of information is true or false and does not replace your judgement. It can be wrong. Its result is not a sanction and is not a decision against you; you can challenge it from the publication (“Report the analysis”). How it works is described on the ASV page."
            )}
          </p>
        </>
      ),
    },
    {
      id: "interdits",
      title: t("7. Contenus et comportements interdits", "7. Prohibited content and behaviour"),
      body: (
        <>
          <p>{t("Sont interdits sur ActuWorld :", "The following are prohibited on ActuWorld:")}</p>
          <ul>
            <li>{t("la désinformation volontaire et les sources falsifiées ;", "deliberate misinformation and falsified sources;")}</li>
            <li>{t("les contenus haineux, discriminatoires, violents ou incitant à la violence ;", "hateful, discriminatory or violent content, or incitement to violence;")}</li>
            <li>{t("le harcèlement, les menaces et la divulgation de données personnelles d'autrui ;", "harassment, threats and disclosure of other people's personal data;")}</li>
            <li>{t("les contenus à caractère sexuel, et tout contenu impliquant des mineurs ;", "sexual content, and any content involving minors;")}</li>
            <li>{t("les contenus illégaux, l'atteinte aux droits d'auteur et à l'image ;", "illegal content, copyright and image-rights infringement;")}</li>
            <li>{t("le spam, la publicité déguisée et la manipulation des votes ;", "spam, disguised advertising and vote manipulation;")}</li>
            <li>{t("toute tentative de contourner la sécurité ou la modération du service.", "any attempt to bypass the service's security or moderation.")}</li>
          </ul>
        </>
      ),
    },
    {
      id: "moderation",
      title: t("8. Signalement, modération et recours", "8. Reporting, moderation and appeals"),
      body: (
        <>
          <p>
            {t(
              "Chaque publication, commentaire et profil peut être signalé depuis l'application, et chaque utilisateur peut en bloquer un autre. Les signalements sont examinés par des personnes. Les contenus manifestement contraires à ces conditions sont retirés et les comptes responsables écartés sous 24 heures après signalement.",
              "Every publication, comment and profile can be reported from the app, and every user can block another. Reports are reviewed by people. Content that clearly breaches these terms is removed and the responsible accounts are removed within 24 hours of being reported."
            )}
          </p>
          <p>
            {t(
              "Selon la gravité, la modération peut : masquer ou retirer un contenu, adresser un avertissement, restreindre temporairement la publication, suspendre ou bannir un compte. Toute mesure t'est notifiée avec son motif. Tu peux la contester en écrivant à actuworld.app@outlook.fr dans les 30 jours ; nous répondons sous 15 jours. En cas de bannissement, tu ne peux pas ouvrir un nouveau compte.",
              "Depending on severity, moderation may: hide or remove content, issue a warning, temporarily restrict publishing, suspend or ban an account. Every measure is notified to you with its reason. You can appeal by writing to actuworld.app@outlook.fr within 30 days; we reply within 15 days. If banned, you may not open a new account."
            )}
          </p>
        </>
      ),
    },
    {
      id: "propriete",
      title: t("9. Propriété intellectuelle", "9. Intellectual property"),
      body: (
        <>
          <p>
            {t(
              "Tu restes propriétaire de ce que tu publies. Tu accordes à ActuWorld une licence non exclusive, gratuite et mondiale pour héberger, afficher, reproduire et diffuser tes contenus dans le cadre du service (y compris les aperçus de partage et l'analyse de sources), pour la durée de leur publication. Cette licence prend fin quand tu supprimes le contenu ou ton compte, sauf pour les copies techniques de sauvegarde et les contenus déjà repris légitimement par d'autres utilisateurs.",
              "You remain the owner of what you publish. You grant ActuWorld a non-exclusive, free, worldwide licence to host, display, reproduce and distribute your content as part of the service (including share previews and source analysis) for as long as it is published. This licence ends when you delete the content or your account, except for technical backup copies and content already legitimately reused by other users."
            )}
          </p>
          <p>
            {t(
              "La marque, le logo, l'interface et le code d'ActuWorld restent la propriété de l'éditeur. Les sources citées restent la propriété de leurs auteurs et éditeurs respectifs.",
              "The ActuWorld brand, logo, interface and code remain the publisher's property. Cited sources remain the property of their respective authors and publishers."
            )}
          </p>
        </>
      ),
    },
    {
      id: "gratuite",
      title: t("10. Gratuité et services payants", "10. Free access and paid services"),
      body: (
        <>
          <p>
            {t(
              "La lecture de tous les contenus et la publication sont gratuites, et le resteront. Aucun paywall n'est appliqué à l'accès à l'information. ActuWorld ne diffuse pas de publicité et ne vend pas de données.",
              "Reading all content and publishing are free, and will remain so. No paywall is applied to information access. ActuWorld shows no advertising and sells no data."
            )}
          </p>
          <p>
            {t(
              "À ce jour, le service ne propose aucune offre payante ni aucun système de don entre utilisateurs. Des outils destinés aux professionnels de l'information (ASV Pro) sont en préparation ; ils feront l'objet de conditions particulières au moment de leur ouverture.",
              "To date, the service offers no paid plan and no donation system between users. Tools for information professionals (ASV Pro) are being prepared; they will be covered by specific terms when they open."
            )}
          </p>
        </>
      ),
    },
    {
      id: "studio",
      title: t("11. Le Studio", "11. The Studio"),
      body: (
        <p>
          {t(
            "Le Studio permet d'écrire sur ordinateur avec ton compte ActuWorld, par lien de connexion envoyé à ton adresse e-mail ou par association avec ton téléphone. Les textes y sont enregistrés comme brouillons ; les mêmes règles de publication s'appliquent. Le lien de connexion est personnel et à usage unique.",
            "The Studio lets you write on a computer with your ActuWorld account, via a sign-in link sent to your email address or by pairing with your phone. Texts are saved there as drafts; the same publishing rules apply. The sign-in link is personal and single-use."
          )}
        </p>
      ),
    },
    {
      id: "responsabilite",
      title: t("12. Responsabilité et disponibilité", "12. Liability and availability"),
      body: (
        <>
          <p>
            {t(
              "ActuWorld est un hébergeur de contenus publiés par ses utilisateurs. Les publications relèvent de la responsabilité de leurs auteurs. ActuWorld ne garantit pas l'exactitude des contenus, mais fournit les outils pour les évaluer (sources obligatoires, score de confiance, analyse de sources) et retire les contenus illicites qui lui sont signalés.",
              "ActuWorld hosts content published by its users. Publications are the responsibility of their authors. ActuWorld does not guarantee the accuracy of content, but provides tools to evaluate it (mandatory sources, trust score, source analysis) and removes unlawful content reported to it."
            )}
          </p>
          <p>
            {t(
              "Le service est fourni en l'état. Nous faisons le nécessaire pour qu'il soit disponible et sécurisé, sans garantir une disponibilité ininterrompue ; des maintenances ou des évolutions peuvent l'interrompre temporairement. Dans la mesure permise par la loi, la responsabilité de l'éditeur est limitée aux dommages directs et prouvés.",
              "The service is provided as is. We do what is needed to keep it available and secure, without guaranteeing uninterrupted availability; maintenance or updates may interrupt it temporarily. To the extent permitted by law, the publisher's liability is limited to direct and proven damages."
            )}
          </p>
        </>
      ),
    },
    {
      id: "donnees",
      title: t("13. Données personnelles", "13. Personal data"),
      body: (
        <p>
          {t(
            "Le traitement de tes données est décrit dans la politique de confidentialité, qui fait partie des présentes conditions.",
            "The processing of your data is described in the privacy policy, which forms part of these terms."
          )}{" "}
          <Link to="/privacy">{t("Lire la politique de confidentialité", "Read the privacy policy")}</Link>
        </p>
      ),
    },
    {
      id: "modifications",
      title: t("14. Modification des conditions", "14. Changes to these terms"),
      body: (
        <p>
          {t(
            "Nous pouvons modifier ces conditions pour suivre l'évolution du service ou de la loi. La date de mise à jour figure en tête de page. Un changement important est annoncé dans l'application ou par e-mail au moins 7 jours avant son entrée en vigueur ; si tu le refuses, tu peux supprimer ton compte.",
            "We may change these terms to follow changes in the service or the law. The update date is shown at the top of the page. A significant change is announced in the app or by email at least 7 days before it takes effect; if you refuse it, you can delete your account."
          )}
        </p>
      ),
    },
    {
      id: "droit",
      title: t("15. Droit applicable", "15. Governing law"),
      body: (
        <p>
          {t(
            "Ces conditions sont régies par le droit français. En cas de litige, nous chercherons d'abord une solution amiable ; tu peux aussi recourir gratuitement à un médiateur de la consommation. À défaut, les tribunaux français sont compétents, sous réserve des règles protectrices applicables aux consommateurs résidant dans l'Union européenne.",
            "These terms are governed by French law. In the event of a dispute, we will first seek an amicable solution; you may also use a consumer mediator free of charge. Failing that, the French courts have jurisdiction, subject to the protective rules applicable to consumers residing in the European Union."
          )}
        </p>
      ),
    },
    {
      id: "contact",
      title: t("16. Contact", "16. Contact"),
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
            "Conditions générales d'utilisation d'ActuWorld : âge minimum, source obligatoire, score de confiance, ASV, modération et recours, gratuité.",
            "ActuWorld terms of service: minimum age, mandatory sourcing, trust score, ASV, moderation and appeals, free access."
          )}
          path="/terms"
        />
      }
      title={t("Conditions générales d'utilisation", "Terms of Service")}
      meta={t("Dernière mise à jour : 22 octobre 2026", "Last updated: 22 October 2026")}
      sections={sections}
    />
  );
}
