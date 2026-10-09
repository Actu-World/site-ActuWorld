import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { JsonLd } from "../components/JsonLd";
import { useLanguage } from "../i18n/LanguageContext";
import { PageWrapper, AnimatedSection } from "../components/animations";

type Faq = { q: string; a: string };
type Group = { id: string; title: string; items: Faq[] };

export default function FaqPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const groups: Group[] = [
    {
      id: "principe",
      title: t("Le principe", "The principle"),
      items: [
        {
          q: t("Pourquoi la source est-elle obligatoire ?", "Why is a source mandatory?"),
          a: t(
            "C'est le principe fondateur d'ActuWorld. Avant de publier, tu montres d'où vient ton information. Et chaque source est un lien : en la touchant, tes lecteurs lisent le texte d'origine, comparent avec ce que tu en dis et se font leur propre avis. C'est la meilleure école de l'esprit critique.",
            "It's ActuWorld's founding principle. Before publishing, you show where your information comes from. And every source is a link: with one tap, your readers read the original, compare it with what you say and make up their own minds. It's the best training for critical thinking."
          ),
        },
        {
          q: t("Comment fonctionne le score de confiance ?", "How does the trust score work?"),
          a: t(
            "Au verso de chaque dépêche, les lecteurs votent «\u00a0Fiable\u00a0» ou «\u00a0Douteuse\u00a0». La part de votes «\u00a0Fiable\u00a0» donne le score de confiance de la publication, sur 100. Celui d'un créateur est la moyenne de ses publications. Ce score est indépendant d'ASV.",
            "On the back of every dispatch, readers vote “Reliable” or “Doubtful”. The share of “Reliable” votes gives the post's trust score, out of 100. A creator's score is the average of their posts. This score is independent from ASV."
          ),
        },
        {
          q: t("Pourquoi la lecture est-elle gratuite ?", "Why is reading free?"),
          a: t(
            "L'accès au savoir ne doit pas dépendre du portefeuille. La lecture est et restera gratuite.",
            "Access to knowledge shouldn't depend on your wallet. Reading is free and will stay free."
          ),
        },
      ],
    },
    {
      id: "asv",
      title: "ASV",
      items: [
        {
          q: t("ASV remplace-t-il les fact-checkers ?", "Does ASV replace fact-checkers?"),
          a: t(
            "Non. ASV (ActuWorld Source Verification) ne dit pas si une info est vraie. Elle évalue qui publie les sources citées et si le post les reprend fidèlement. C'est un outil pour juger par toi-même, pas un verdict.",
            "No. ASV (ActuWorld Source Verification) doesn't say whether information is true. It rates who publishes the cited sources and whether the post reports them faithfully. It's a tool to judge for yourself, not a verdict."
          ),
        },
        {
          q: t("Comment ASV analyse-t-il les sources ?", "How does ASV analyze sources?"),
          a: t(
            "À la publication, ASV récupère les sources citées et donne deux notes. Éditeur : la transparence du site (ancienneté, mentions légales, auteurs identifiés, registres reconnus…). Fidélité : une IA compare le texte de chaque source avec ce qu'affirme le post, ce qui permet de repérer le cherry-picking et les contradictions.",
            "When a post is published, ASV fetches the cited sources and gives two scores. Publisher: how transparent the site is (age, legal notice, identified authors, recognised registries…). Faithfulness: an AI compares each source's text with what the post claims, which reveals cherry-picking and contradictions."
          ),
        },
      ],
    },
    {
      id: "publier",
      title: t("Publier", "Publishing"),
      items: [
        {
          q: t("Qui peut publier ?", "Who can publish?"),
          a: t(
            "Tout le monde, dès l'inscription. Sport, sciences, culture, actualité locale : tu publies sur ce qui te passionne, avec au moins une source. La publication est immédiate, puis ASV analyse tes sources. Un contenu signalé plusieurs fois par la communauté est examiné par la modération.",
            "Everyone, from sign-up. Sports, science, culture, local news: you publish about what you care about, with at least one source. Posts go live immediately, then ASV analyses your sources. Content reported several times by the community is reviewed by moderators."
          ),
        },
      ],
    },
    {
      id: "disponibilite",
      title: t("Disponibilité", "Availability"),
      items: [
        {
          q: t("Quand ActuWorld sera-t-il disponible ?", "When will ActuWorld be available?"),
          a: t(
            "L'app arrive bientôt sur l'App Store et Google Play. La publication sur les stores est en cours.",
            "The app is coming soon to the App Store and Google Play. Store publication is in progress."
          ),
        },
        {
          q: t("Comment être prévenu de la sortie ?", "How do I get notified at launch?"),
          a: t(
            "Laisse ton adresse e-mail en bas de la page d'accueil : on t'écrit dès que l'app sort sur les stores.",
            "Leave your email address at the bottom of the home page: we'll email you as soon as the app is on the stores."
          ),
        },
      ],
    },
  ];

  const allFaqs = groups.flatMap((g) => g.items);
  const faqSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: isEnglish ? "en" : "fr",
      mainEntity: allFaqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEnglish]
  );

  // Sommaire : la catégorie en cours de lecture est surlignée. Une section est
  // « active » dès que son titre passe le tiers haut de l'écran ; tout en bas
  // de page, c'est la dernière (elle n'atteint jamais ce repère).
  const groupIds = groups.map((g) => g.id).join(",");
  const [active, setActive] = useState(groups[0].id);
  useEffect(() => {
    const ids = groupIds.split(",");
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      let current = ids[0];
      if (atBottom) current = ids[ids.length - 1];
      else
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.33) current = id;
        }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [groupIds]);

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("FAQ | Questions fréquentes", "FAQ | Frequently asked questions")}
        description={t(
          "Les réponses à tes questions sur ActuWorld, ASV, le score de confiance et la sortie de l'app sur les stores.",
          "Answers to your questions about ActuWorld, ASV, the trust score and the app's store launch."
        )}
        path="/faq"
      />
      <JsonLd data={faqSchema} />

      <Section className="pt-20 md:pt-24 pb-10">
        <AnimatedSection>
          <H2 as="h1">{t("Questions fréquentes", "Frequently asked questions")}</H2>
          <p className="lead mt-5">
            {t(
              "Le principe, ASV, la publication et la sortie de l'app. Une question sans réponse ici ? Écris-nous.",
              "The principle, ASV, publishing and the app's launch. A question not answered here? Write to us."
            )}
          </p>
        </AnimatedSection>
      </Section>

      <Section className="pt-4 pb-20 md:pb-28">
        <div className="grid gap-10 lg:grid-cols-[13rem_1fr] lg:gap-16">
          {/* Sommaire des catégories (bureau) */}
          <nav aria-label={t("Catégories", "Categories")} className="hidden lg:block">
            <ul className="sticky top-24 space-y-1 border-l border-aw">
              {groups.map((g) => (
                <li key={g.id}>
                  <a
                    href={`#${g.id}`}
                    aria-current={active === g.id ? "true" : undefined}
                    className={`block -ml-px border-l-2 pl-4 pr-3 py-1.5 rounded-r-lg text-[15px] transition-colors duration-200 ${
                      active === g.id
                        ? "border-aw-primary text-aw-text"
                        : "border-transparent text-aw-muted hover:text-aw-text hover:border-aw-primary"
                    }`}
                    style={active === g.id ? { background: "color-mix(in srgb, var(--aw-success) 45%, transparent)" } : undefined}
                  >
                    {g.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14 max-w-3xl">
            {groups.map((g) => (
              <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`} className="scroll-mt-24">
                <h2 id={`${g.id}-title`} className="text-2xl mb-4">
                  {g.title}
                </h2>
                <div className="divide-y divide-[var(--aw-border)] border-y border-aw">
                  {g.items.map((item) => (
                    <details key={item.q} className="group">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-semibold text-aw-text hover:text-aw-primary [&::-webkit-details-marker]:hidden">
                        <span>{item.q}</span>
                        <ChevronDown
                          className="mt-1 h-5 w-5 shrink-0 text-aw-muted transition-transform duration-200 group-open:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <p className="pb-6 pr-10 text-aw-muted leading-relaxed max-w-prose">{item.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-aw-surface py-16 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl">{t("Tu n'as pas trouvé ta réponse ?", "Didn't find your answer?")}</h2>
            <p className="text-aw-muted mt-2">
              {t("On lit chaque message et on te répond.", "We read every message and get back to you.")}
            </p>
          </div>
          <Link to="/contact" className="btn-primary self-start md:self-auto">
            {t("Nous écrire", "Write to us")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Section>
    </PageWrapper>
  );
}
