import { Link } from "react-router-dom";
import { PageMeta } from "../components/PageMeta";
import { useLanguage } from "../i18n/LanguageContext";
import { LegalLayout } from "../components/legal/LegalLayout";

// Extension navigateur ASV : confidentialité, conditions et support en une page
// (adresse demandée par le Chrome Web Store et Edge Add-ons). ASV Pro 1.7, 16/11/2026.
// Pas sous /asv-extension/ : ce chemin est réservé au proxy de l'API (404 ailleurs).
// Faits vérifiés dans le code de l'extension (browser-extension/) et de RECO-SRC :
// - rien n'est envoyé sans action de l'utilisateur ;
// - pas de compte, pas d'identifiant (le vote et son identifiant anonyme ont été
//   retirés le 16/11) ;
// - mode public : aucune écriture en base ;
// - journaux techniques : 30 jours au plus (Docs/asv/install-purge-logs-30j.sh).
// Toute évolution de l'extension qui change ces points doit mettre cette page à jour.

export default function AsvExtensionLegalPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const sections = [
    {
      id: "editeur",
      title: t("1. Qui édite l'extension", "1. Who publishes the extension"),
      body: (
        <>
          <p>
            {t(
              "L'extension ASV (ActuWorld Source Verification) est éditée par Maxence Allier, entrepreneur individuel, éditeur d'ActuWorld. Il est le responsable du traitement des données décrit sur cette page.",
              "The ASV (ActuWorld Source Verification) extension is published by Maxence Allier, sole proprietor, publisher of ActuWorld. He is the data controller for the processing described on this page."
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
              <a href="mailto:contact@actuworld.fr">contact@actuworld.fr</a>
            </dd>
          </dl>
          <p className="mt-4">
            {t("Le reste des informations légales est dans les ", "The rest of the legal information is in the ")}
            <Link to="/mentions-legales">{t("mentions légales", "legal notice")}</Link>
            {t(" du site.", " of the website.")}
          </p>
        </>
      ),
    },
    {
      id: "service",
      title: t("2. Ce que fait l'extension", "2. What the extension does"),
      body: (
        <>
          <p>
            {t(
              "Quand tu le lui demandes, l'extension montre la transparence de l'éditeur d'une page : est-il identifiable, inscrit dans un registre de presse, son site a-t-il des mentions légales, une connexion sécurisée, un historique ? Elle affiche une note en mots et les raisons qui l'expliquent.",
              "When you ask it to, the extension shows how transparent the publisher of a page is: is it identifiable, listed in a press register, does its site have a legal notice, a secure connection, a history? It shows a rating in words and the reasons behind it."
            )}
          </p>
          <p>
            {t(
              "ASV mesure la transparence d'un éditeur. Il ne dit pas si un contenu est vrai ou faux. Le résultat est une information, pas un conseil : la décision de lire, de citer ou de partager une source t'appartient.",
              "ASV measures how transparent a publisher is. It does not say whether a piece of content is true or false. The result is information, not advice: the decision to read, cite or share a source is yours."
            )}
          </p>
        </>
      ),
    },
    {
      id: "envoi",
      title: t("3. Ce qui part vers nos serveurs, et quand", "3. What is sent to our servers, and when"),
      body: (
        <>
          <p>
            {t(
              "Rien n'est envoyé tant que tu n'agis pas. L'extension contacte notre serveur seulement quand tu cliques sur « Analyser », sur le menu « Vérifier cette page avec ASV », ou sur « Demander l’évaluation ».",
              "Nothing is sent until you act. The extension contacts our server only when you click “Analyze”, the “Check this page with ASV” menu, or “Request the evaluation” (the extension is in French)."
            )}
          </p>
          <p>{t("Elle envoie alors :", "It then sends:")}</p>
          <ul>
            <li>{t("l'adresse de la page à analyser et son nom de domaine ;", "the address of the page to analyze and its domain name;")}</li>
            <li>
              {t(
                "les informations techniques de toute connexion à un site : ton adresse IP, l'heure et la version de ton navigateur.",
                "the technical information of any connection to a website: your IP address, the time and your browser version."
              )}
            </li>
          </ul>
          <p>
            {t(
              "L'extension n'envoie ni le contenu de tes pages, ni ton historique de navigation, ni tes onglets. Elle ne crée pas de compte, ne pose pas de cookie et ne garde aucun identifiant qui te suivrait d'une analyse à l'autre.",
              "The extension does not send the content of your pages, your browsing history or your tabs. It creates no account, sets no cookie and keeps no identifier that would follow you from one analysis to the next."
            )}
          </p>
          <p>
            {t(
              "Pour analyser l'éditeur, notre serveur visite lui-même la page publique demandée et interroge des sources publiques : registres de presse, annuaire des noms de domaine (WHOIS), certificat de sécurité, liste de sites dangereux de Google Safe Browsing. Le texte public de la page peut être analysé par le modèle Gemini de Google. Seule l'adresse de la page leur est transmise, jamais une information sur toi.",
              "To analyze the publisher, our server itself visits the requested public page and queries public sources: press registers, the domain name directory (WHOIS), the security certificate, and Google Safe Browsing's list of dangerous sites. The public text of the page may be analyzed by Google's Gemini model. Only the page address is passed on to them, never information about you."
            )}
          </p>
        </>
      ),
    },
    {
      id: "local",
      title: t("4. Ce que l'extension garde sur ton ordinateur", "4. What the extension keeps on your computer"),
      body: (
        <p>
          {t(
            "Dans le stockage de ton navigateur, l'extension garde le dernier résultat d'analyse, pour te l'afficher quand tu rouvres sa fenêtre, et ses réglages. Ces données ne quittent pas ton ordinateur. Elles sont effacées quand tu désinstalles l'extension.",
            "In your browser's storage, the extension keeps the latest analysis result, to show it when you reopen its window, and its settings. This data does not leave your computer. It is deleted when you uninstall the extension."
          )}
        </p>
      ),
    },
    {
      id: "conservation",
      title: t("5. Ce que nous gardons, et combien de temps", "5. What we keep, and for how long"),
      body: (
        <>
          <p>
            {t(
              "Les analyses demandées depuis l'extension ne sont pas enregistrées dans nos bases de données. Seuls nos journaux techniques en gardent une trace : adresse IP, heure et adresse demandée. Ils servent à la sécurité du service et à bloquer les usages abusifs, ce qui relève de notre intérêt légitime.",
              "Analyses requested from the extension are not saved in our databases. Only our technical logs keep a trace: IP address, time and requested address. They are used for the security of the service and to block abusive use, which is our legitimate interest."
            )}
          </p>
          <p>
            {t(
              "Ces journaux sont effacés au plus tard 30 jours après la demande.",
              "These logs are deleted at the latest 30 days after the request."
            )}
          </p>
          <p>
            {t(
              "Le service est hébergé en France par OVHcloud (OVH SAS, 2 rue Kellermann, 59100 Roubaix), au datacenter de Gravelines. La base des éditeurs est hébergée par Supabase dans l'Union européenne, à Francfort. Nous ne vendons aucune donnée et ne faisons pas de publicité.",
              "The service is hosted in France by OVHcloud (OVH SAS, 2 rue Kellermann, 59100 Roubaix), at the Gravelines datacenter. The publisher database is hosted by Supabase in the European Union, in Frankfurt. We sell no data and run no advertising."
            )}
          </p>
        </>
      ),
    },
    {
      id: "droits",
      title: t("6. Tes droits", "6. Your rights"),
      body: (
        <>
          <p>
            {t(
              "Tu peux demander l'accès aux données qui te concernent, leur rectification, leur effacement, la limitation de leur traitement ou t'y opposer. Écris à contact@actuworld.fr avec l'objet « Données personnelles ». Nous répondons sous un mois.",
              "You can ask to access the data about you, have it corrected or deleted, restrict its processing or object to it. Write to contact@actuworld.fr with the subject “Personal data”. We reply within one month."
            )}
          </p>
          <p>
            {t(
              "Tu peux aussi adresser une réclamation à la CNIL (cnil.fr). La politique de confidentialité de l'application ActuWorld est sur une ",
              "You can also file a complaint with the CNIL, the French data protection authority (cnil.fr). The privacy policy of the ActuWorld app is on a "
            )}
            <Link to="/privacy">{t("page à part", "separate page")}</Link>.
          </p>
        </>
      ),
    },
    {
      id: "conditions",
      title: t("7. Conditions d'utilisation", "7. Terms of use"),
      body: (
        <>
          <p>
            {t(
              "L'extension est gratuite. Tu peux l'utiliser pour ton usage personnel, professionnel ou pédagogique. Il est interdit d'interroger le service de façon automatisée ou massive, de tenter de contourner ses limites, ou de présenter ses résultats comme une certification d'ActuWorld.",
              "The extension is free. You may use it for personal, professional or educational purposes. It is forbidden to query the service in an automated or massive way, to try to get around its limits, or to present its results as an ActuWorld certification."
            )}
          </p>
          <p>
            {t(
              "Les notes reposent sur des signaux publics et automatiques. Elles peuvent être incomplètes ou provisoires, par exemple pour un site que nous découvrons. Le service peut être interrompu ou modifié à tout moment. Si un résultat te semble faux, écris-nous : il sera revu.",
              "Ratings rely on public, automatic signals. They can be incomplete or provisional, for example for a site we are discovering. The service may be interrupted or changed at any time. If a result looks wrong to you, write to us: it will be reviewed."
            )}
          </p>
          <p>
            {t(
              "Le code, le nom, le logo et les textes de l'extension appartiennent à leur éditeur. Ces conditions sont soumises au droit français.",
              "The code, name, logo and texts of the extension belong to its publisher. These terms are governed by French law."
            )}
          </p>
        </>
      ),
    },
    {
      id: "support",
      title: t("8. Aide et contact", "8. Help and contact"),
      body: (
        <p>
          {t(
            "Une question, un bug, un résultat qui te semble faux ? Écris à contact@actuworld.fr avec l'objet « Extension ASV », en indiquant l'adresse de la page analysée et la version de ton navigateur. Pour comprendre comment ASV note un éditeur, lis la ",
            "A question, a bug, a result that looks wrong? Write to contact@actuworld.fr with the subject “ASV extension”, giving the address of the analyzed page and your browser version. To understand how ASV rates a publisher, read the "
          )}
          <Link to="/reco-src">{t("page ASV", "ASV page")}</Link>.
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      head={
        <PageMeta
          title={t("Extension ASV : confidentialité et conditions", "ASV extension: privacy and terms")}
          description={t(
            "Extension navigateur ASV : ce qu'elle envoie, ce qu'elle garde, tes droits, les conditions d'utilisation et l'aide.",
            "ASV browser extension: what it sends, what it keeps, your rights, the terms of use and help."
          )}
          path="/extension-asv"
        />
      }
      title={t("Extension ASV : confidentialité et conditions", "ASV extension: privacy and terms")}
      meta={t("Dernière mise à jour : 16 novembre 2026", "Last updated: November 16, 2026")}
      sections={sections}
    />
  );
}
