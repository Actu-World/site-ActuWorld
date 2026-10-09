import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

// Normes publiées contre l'exploitation et les abus sexuels sur mineurs (CSAE),
// exigées par le Règlement Google Play sur les normes liées à la sécurité des
// enfants pour les applications de réseau social. L'URL de cette page est
// déclarée dans la Play Console et doit rester stable.
export default function ChildSafetyPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "engagement",
      title: t("1. Notre engagement", "1. Our commitment"),
      body: (
        <>
          <p>
            {t(
              "ActuWorld applique une tolérance zéro à l'égard de l'exploitation et des abus sexuels sur mineurs (CSAE), y compris tout contenu d'abus sexuels sur mineurs (CSAM). Sont strictement interdits sur l'ensemble de la plateforme (dépêches, articles, commentaires, messages privés, cercles de discussion, photos de profil)\u00a0:",
              "ActuWorld enforces zero tolerance towards child sexual abuse and exploitation (CSAE), including any child sexual abuse material (CSAM). The following are strictly prohibited across the entire platform (dispatches, articles, comments, private messages, discussion circles, profile pictures):"
            )}
          </p>
          <ul>
            <li>
              {t(
                "Tout contenu représentant, décrivant ou faisant la promotion d'abus sexuels sur mineurs, qu'il soit réel, simulé ou généré par intelligence artificielle.",
                "Any content depicting, describing or promoting the sexual abuse of minors, whether real, simulated or AI-generated."
              )}
            </li>
            <li>{t("La sexualisation de mineurs sous quelque forme que ce soit.", "The sexualization of minors in any form.")}</li>
            <li>
              {t(
                "Le grooming\u00a0: toute prise de contact ou manipulation d'un mineur à des fins sexuelles, y compris via la messagerie privée.",
                "Grooming: any contact with or manipulation of a minor for sexual purposes, including via private messaging."
              )}
            </li>
            <li>
              {t(
                "La sextorsion, la traite ou toute autre forme d'exploitation de mineurs.",
                "Sextortion, trafficking or any other form of child exploitation."
              )}
            </li>
          </ul>
          <p>
            {t(
              "Toute violation entraîne la suppression immédiate du contenu, la suspension définitive du compte et un signalement aux autorités compétentes.",
              "Any violation results in immediate content removal, permanent account suspension and a report to the competent authorities."
            )}
          </p>
        </>
      ),
    },
    {
      id: "signaler",
      title: t("2. Signaler un contenu ou un utilisateur", "2. Report content or a user"),
      body: (
        <>
          <p>
            {t(
              "Chaque contenu et chaque profil ActuWorld peut être signalé directement dans l'application\u00a0:",
              "Every piece of content and every profile on ActuWorld can be reported directly in the app:"
            )}
          </p>
          <ol>
            <li>
              {t(
                "Ouvre le menu du contenu ou du profil concerné (bouton « ⋯ » ou appui long).",
                "Open the menu of the relevant content or profile (“⋯” button or long press)."
              )}
            </li>
            <li>{t("Touche « Signaler ».", "Tap “Report”.")}</li>
            <li>
              {t(
                "Choisis la catégorie correspondante (par exemple « Contenu inapproprié » ou « Harcèlement ») et décris le problème.",
                "Choose the matching category (for example “Inappropriate content” or “Harassment”) and describe the issue."
              )}
            </li>
          </ol>
          <p>
            {t(
              "Les signalements relatifs à la sécurité des enfants sont traités en priorité absolue par notre équipe de modération. Tu peux aussi nous signaler un problème par e-mail à actuworld.app@outlook.fr (objet\u00a0: « Sécurité enfants »).",
              "Reports related to child safety are treated with the highest priority by our moderation team. You can also report an issue by email at actuworld.app@outlook.fr (subject: “Child safety”)."
            )}
          </p>
        </>
      ),
    },
    {
      id: "reponse",
      title: t("3. Notre réponse aux violations", "3. How we respond to violations"),
      body: (
        <ul>
          <li>{t("Retrait immédiat du contenu concerné dès sa détection ou son signalement.", "Immediate removal of the content as soon as it is detected or reported.")}</li>
          <li>{t("Suspension définitive des comptes impliqués.", "Permanent suspension of the accounts involved.")}</li>
          <li>{t("Conservation des éléments nécessaires à des fins de preuve, conformément à la loi.", "Preservation of the necessary evidence, as required by law.")}</li>
          <li>
            {t(
              "Signalement aux autorités compétentes\u00a0: en France via la plateforme officielle PHAROS (internet-signalement.gouv.fr), et coopération avec les autorités nationales et internationales compétentes, dont le NCMEC lorsque cela est applicable.",
              "Reporting to the competent authorities: in France via the official PHAROS platform (internet-signalement.gouv.fr), and cooperation with the competent national and international authorities, including NCMEC where applicable."
            )}
          </li>
        </ul>
      ),
    },
    {
      id: "conformite",
      title: t("4. Conformité aux lois", "4. Legal compliance"),
      body: (
        <p>
          {t(
            "ActuWorld respecte les lois applicables en matière de protection des mineurs et de lutte contre les contenus d'abus sexuels sur mineurs, notamment le droit français et européen, et coopère pleinement avec les forces de l'ordre dans le cadre des procédures légales. L'application est réservée aux personnes de 13 ans et plus.",
            "ActuWorld complies with applicable laws on the protection of minors and the fight against child sexual abuse material, including French and European law, and cooperates fully with law enforcement within legal procedures. The app is restricted to people aged 13 and over."
          )}
        </p>
      ),
    },
    {
      id: "contact",
      title: t("5. Point de contact", "5. Point of contact"),
      body: (
        <p>
          {t(
            "Pour toute question relative à ces normes ou à la conformité d'ActuWorld en matière de prévention des contenus d'abus sexuels sur mineurs, contacte notre point de contact désigné\u00a0: actuworld.app@outlook.fr.",
            "For any question about these standards or ActuWorld's compliance regarding the prevention of child sexual abuse material, contact our designated point of contact: actuworld.app@outlook.fr."
          )}
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      head={
        <PageMeta
          title={t("Normes de sécurité des enfants", "Child Safety Standards")}
          description={t(
            "Les normes d'ActuWorld contre l'exploitation et les abus sexuels sur mineurs\u00a0: interdictions, signalement dans l'application, coopération avec les autorités et contact.",
            "ActuWorld's standards against child sexual abuse and exploitation: prohibitions, in-app reporting, cooperation with authorities and contact."
          )}
          path="/securite-enfants"
        />
      }
      title={t("Normes de sécurité des enfants", "Child Safety Standards")}
      meta={t(
        "Ces normes s'appliquent à l'application mobile ActuWorld et à tous les services associés (Studio web inclus). Dernière mise à jour\u00a0: juillet 2026.",
        "These standards apply to the ActuWorld mobile app and all associated services (including the web Studio). Last updated: July 2026."
      )}
      sections={sections}
    />
  );
}
