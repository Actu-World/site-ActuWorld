import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper } from "../components/animations";

export default function LegalNoticePage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Mentions légales", "Legal Notice")}
        description={t(
          "Mentions légales d'ActuWorld — éditeur, directeur de la publication et hébergement du site.",
          "ActuWorld legal notice — publisher, publication director and website hosting."
        )}
        path="/mentions-legales"
      />

      <Section className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto prose prose-lg">
          <H2 as="h1" center>
            {t("Mentions légales", "Legal Notice")}
          </H2>

          <p className="text-aw-muted mt-4 text-center text-sm">
            {t("Dernière mise à jour : juin 2026", "Last updated: June 2026")}
          </p>

          <div className="mt-12 space-y-8 text-aw-text/80">
            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("1. Éditeur du site", "1. Site Publisher")}
              </h2>
              <p>
                {t(
                  "Le site ActuWorld est édité par Maxence Allier, entrepreneur individuel.",
                  "The ActuWorld website is published by Maxence Allier, sole proprietor."
                )}
                <br />
                {t("Statut juridique : ", "Legal status: ")}<strong>{t("Micro-entreprise (entrepreneur individuel)", "Micro-enterprise (sole proprietor)")}</strong>
                <br />
                {t("Adresse : ", "Address: ")}<strong>11 allée des Roses, 97441 Sainte-Suzanne, La Réunion (France)</strong>
                <br />
                {t("SIRET : ", "Company ID: ")}<strong>99507068700018</strong>
                <br />
                {t("E-mail : ", "Email: ")}actuworld.app@outlook.fr
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("2. Directeur de la publication", "2. Publication Director")}
              </h2>
              <p>
                {t(
                  "Le directeur de la publication est Maxence Allier, en sa qualité de fondateur d'ActuWorld.",
                  "The publication director is Maxence Allier, as founder of ActuWorld."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("3. Hébergement", "3. Hosting")}
              </h2>
              <p>
                {t(
                  "Le site et l'API sont hébergés par OVHcloud (OVH SAS, 2 rue Kellermann, 59100 Roubaix, France), sur un serveur localisé au datacenter de Gravelines (France). Les bases de données sont hébergées par Supabase, Inc. (supabase.com) au sein de l'Union européenne : Paris (France) pour l'application, et Francfort (Allemagne) pour le service de vérification des sources.",
                  "The website and API are hosted by OVHcloud (OVH SAS, 2 rue Kellermann, 59100 Roubaix, France), on a server located in the Gravelines datacenter (France). Databases are hosted by Supabase, Inc. (supabase.com) within the European Union: Paris (France) for the app, and Frankfurt (Germany) for the source-verification service."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("4. Propriété intellectuelle", "4. Intellectual Property")}
              </h2>
              <p>
                {t(
                  "L'ensemble des éléments du site (marque ActuWorld, logo, textes, interface, code) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation préalable est interdite.",
                  "All elements of the site (ActuWorld brand, logo, texts, interface, code) are protected by intellectual property law. Any reproduction or use without prior authorization is prohibited."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("5. Données personnelles", "5. Personal Data")}
              </h2>
              <p>
                {t(
                  "Le traitement de vos données personnelles est détaillé dans notre Politique de confidentialité. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.",
                  "The processing of your personal data is detailed in our Privacy Policy. Under GDPR, you have the right to access, rectify and delete your data."
                )}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">
                {t("6. Contact", "6. Contact")}
              </h2>
              <p>
                {t(
                  "Pour toute question concernant ces mentions légales, écrivez-nous à actuworld.app@outlook.fr.",
                  "For any question regarding this legal notice, write to us at actuworld.app@outlook.fr."
                )}
              </p>
            </section>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
