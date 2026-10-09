import { Link } from "react-router-dom";
import { Link2, ShieldCheck, Users, ChevronRight } from "lucide-react";
import { Section } from "../Section";
import { H2 } from "../H2";
import { AnimatedSection } from "../animations";
import { useLanguage } from "../../i18n/LanguageContext";

/*
 * Les trois gestes, en cartes texte. Pas de maquette ici : le parcours est déjà
 * montré par l'animation du hero, et le vote par la section interactive qui suit.
 */
export const HowItWorks: React.FC = () => {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const steps = [
    {
      icon: Link2,
      title: t("Des sources que tu peux ouvrir", "Sources you can open"),
      desc: t(
        "Pas de source, pas de publication. Chaque source est un lien : tu lis le texte d'origine et tu compares avec ce qu'en dit l'auteur, avant de croire ou de partager.",
        "No source, no post. Every source is a link: read the original and compare it with what the author says, before you believe or share."
      ),
    },
    {
      icon: ShieldCheck,
      title: t("ASV analyse les sources", "ASV analyses the sources"),
      desc: t(
        "ASV note la transparence de chaque éditeur cité, puis compare chaque source à ce qu'affirme le post, extrait à l'appui.",
        "ASV rates the transparency of each cited publisher, then compares each source with what the post claims, with the supporting excerpt."
      ),
      link: { to: "/reco-src", label: t("Comprendre ASV", "Understand ASV") },
    },
    {
      icon: Users,
      title: t("La communauté éclaire", "The community weighs in"),
      desc: t(
        "Au verso, les lecteurs votent « Fiable » ou « Douteuse ». Ce score de confiance s'affiche à côté d'ASV, sans s'y mélanger.",
        "On the back, readers vote “Reliable” or “Doubtful”. This trust score sits next to ASV without mixing with it."
      ),
      anchor: { href: "#confiance", label: t("Essayer le vote", "Try the vote") },
    },
  ];

  return (
    <Section id="how" className="pt-6 pb-16 md:py-28">
      <AnimatedSection className="max-w-2xl">
        <H2>{t("Comment ça marche", "How it works")}</H2>
        <p className="lead mt-5">
          {t("Trois gestes, un seul principe : montrer d'où vient l'info avant d'y croire.", "Three moves, one principle: show where information comes from before you believe it.")}
        </p>
      </AnimatedSection>

      <ol className="mt-8 md:mt-12 grid md:grid-cols-3 gap-3 md:gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex">
            <AnimatedSection delay={i * 0.08} className="card p-6 md:p-7 flex flex-col w-full">
              <div className="flex items-center justify-between gap-4">
                <span className="w-10 h-10 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                  <s.icon className="w-5 h-5 text-aw-primary" />
                </span>
                <span className="caption text-aw-muted tabular-nums" aria-hidden="true">0{i + 1}</span>
              </div>
              <h3 className="text-xl mt-5">{s.title}</h3>
              <p className="text-aw-muted mt-2">{s.desc}</p>
              {s.link && (
                <Link to={s.link.to} className="btn-link mt-auto pt-5 self-start">
                  {s.link.label} <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
              {s.anchor && (
                <a href={s.anchor.href} className="btn-link mt-auto pt-5 self-start">
                  {s.anchor.label} <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </AnimatedSection>
          </li>
        ))}
      </ol>
    </Section>
  );
};
