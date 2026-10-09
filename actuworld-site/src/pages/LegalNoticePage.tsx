import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

export default function LegalNoticePage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "editeur",
      title: t("1. Éditeur du site", "1. Site Publisher"),
      body: (
        <>
          <p>
            {t(
              "Le site ActuWorld est édité par Maxence Allier, entrepreneur individuel.",
              "The ActuWorld website is published by Maxence Allier, sole proprietor."
            )}
          </p>
          <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[16px]">
            <dt className="text-aw-muted">{t("Statut juridique", "Legal status")}</dt>
            <dd className="font-semibold">{t("Micro-entreprise (entrepreneur individuel)", "Micro-enterprise (sole proprietor)")}</dd>
            <dt className="text-aw-muted">{t("Adresse", "Address")}</dt>
            <dd className="font-semibold">11 allée des Roses, 97441 Sainte-Suzanne, La Réunion (France)</dd>
            <dt className="text-aw-muted">SIRET</dt>
            <dd className="font-semibold tabular">99507068700018</dd>
            <dt className="text-aw-muted">{t("E-mail", "Email")}</dt>
            <dd>
              <a href="mailto:actuworld.app@outlook.fr">actuworld.app@outlook.fr</a>
            </dd>
          </dl>
        </>
      ),
    },
    {
      id: "directeur",
      title: t("2. Directeur de la publication", "2. Publication Director"),
      body: (
        <p>
          {t(
            "Le directeur de la publication est Maxence Allier, en sa qualité de fondateur d'ActuWorld.",
            "The publication director is Maxence Allier, as founder of ActuWorld."
          )}
        </p>
      ),
    },
    {
      id: "hebergement",
      title: t("3. Hébergement", "3. Hosting"),
      body: (
        <p>
          {t(
            "Le site et l'API sont hébergés par OVHcloud (OVH SAS, 2 rue Kellermann, 59100 Roubaix, France), sur un serveur localisé au datacenter de Gravelines (France). Les bases de données sont hébergées par Supabase, Inc. (supabase.com) au sein de l'Union européenne\u00a0: Paris (France) pour l'application, et Francfort (Allemagne) pour le service de vérification des sources.",
            "The website and API are hosted by OVHcloud (OVH SAS, 2 rue Kellermann, 59100 Roubaix, France), on a server located in the Gravelines datacenter (France). Databases are hosted by Supabase, Inc. (supabase.com) within the European Union: Paris (France) for the app, and Frankfurt (Germany) for the source-verification service."
          )}
        </p>
      ),
    },
    {
      id: "propriete",
      title: t("4. Propriété intellectuelle", "4. Intellectual Property"),
      body: (
        <p>
          {t(
            "L'ensemble des éléments du site (marque ActuWorld, logo, textes, interface, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation préalable est interdite.",
            "All elements of the site (ActuWorld brand, logo, texts, interface, code) are protected by intellectual property law. Any reproduction or use without prior authorization is prohibited."
          )}
        </p>
      ),
    },
    {
      id: "donnees",
      title: t("5. Données personnelles", "5. Personal Data"),
      body: (
        <p>
          {t("Le traitement de tes données personnelles est détaillé dans notre ", "The processing of your personal data is detailed in our ")}
          <Link to="/privacy">{t("Politique de confidentialité", "Privacy Policy")}</Link>
          {t(
            ". Conformément au RGPD, tu disposes d'un droit d'accès, de rectification et de suppression de tes données.",
            ". Under GDPR, you have the right to access, rectify and delete your data."
          )}
        </p>
      ),
    },
    {
      id: "contact",
      title: t("6. Contact", "6. Contact"),
      body: (
        <p>
          {t(
            "Pour toute question concernant ces mentions légales, écris-nous à actuworld.app@outlook.fr.",
            "For any question regarding this legal notice, write to us at actuworld.app@outlook.fr."
          )}
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      head={
        <PageMeta
          title={t("Mentions légales", "Legal Notice")}
          description={t(
            "Mentions légales d'ActuWorld\u00a0: éditeur, directeur de la publication et hébergement du site.",
            "ActuWorld legal notice: publisher, publication director and website hosting."
          )}
          path="/mentions-legales"
        />
      }
      title={t("Mentions légales", "Legal Notice")}
      meta={t("Dernière mise à jour\u00a0: juin 2026", "Last updated: June 2026")}
      sections={sections}
    />
  );
}
