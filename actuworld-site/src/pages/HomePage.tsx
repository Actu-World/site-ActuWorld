import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Link2, ShieldCheck, Users } from "lucide-react";
import founderImg from "../assets/max-image-opt.webp";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, AnimatedSection, staggerContainer, fadeInUp } from "../components/animations";
import { WaitlistForm } from "../components/ui/WaitlistForm";
import { Tooltip } from "../components/ui/Tooltip";
import { LogoMark } from "../components/LogoMark";
import { useLanguage } from "../i18n/LanguageContext";

const NB = " "; // espace insécable (typographie française)

export default function HomePage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  // Sommaire vers les pages qui expliquent en détail (pas de répétition ici)
  const principles = [
    {
      icon: Link2,
      to: "/app#how",
      label: t("Des sources que tu peux ouvrir", "Sources you can open"),
      desc: t("Chaque source est un lien vers le texte d'origine.", "Every source links to the original text."),
    },
    {
      icon: ShieldCheck,
      to: "/reco-src",
      label: t("ASV analyse chaque source", "ASV analyses every source"),
      desc: t("Qui publie, et la reprise est-elle fidèle\u00a0?", "Who publishes, and is it quoted faithfully?"),
    },
    {
      icon: Users,
      to: "/app#how",
      label: t("La communauté donne son avis", "The community weighs in"),
      desc: t("Un vote «\u00a0Fiable\u00a0» ou «\u00a0Douteuse\u00a0», à part d'ASV.", "A “Reliable” or “Doubtful” vote, separate from ASV."),
    },
  ];

  const problems = [
    {
      title: t("L'info noyée dans le buzz", "Information drowned in hype"),
      desc: t(
        "Les algorithmes misent sur l'émotion et la viralité. Les contenus solides disparaissent derrière le clickbait.",
        "Algorithms bet on emotion and virality. Solid content disappears behind clickbait."
      ),
    },
    {
      title: t("Aucune source exigée", "No source required"),
      desc: t(
        "N'importe qui peut affirmer n'importe quoi. Aucune grande plateforme ne demande de montrer d'où vient l'info avant de publier.",
        "Anyone can claim anything. No major platform asks where information comes from before it's published."
      ),
    },
    {
      title: t("Impossible de trier", "No way to sort it out"),
      desc: t(
        "Sans transparence sur les sources, tu ne peux pas savoir ce qui mérite ta confiance. Tu lis à l'aveugle.",
        "Without transparent sources, you can't tell what deserves your trust. You read blind."
      ),
    },
    {
      title: t("La confiance s'use", "Trust wears thin"),
      desc: t(
        "À force de tout voir passer sans preuve, on finit par ne plus croire personne, y compris les créateurs sérieux.",
        "When everything goes by without proof, you end up trusting no one, serious creators included."
      ),
    },
  ];

  return (
    <PageWrapper className="text-aw-text">
      <PageMeta
        title={t("Partage ce qui t'intéresse. Prouve pourquoi c'est fiable.", "Share what matters to you. Show why it's reliable.")}
        description={t(
          "ActuWorld est le réseau de l'information fiable, sur tous les sujets qui te passionnent : source visible, vérification ASV et jugement communautaire.",
          "ActuWorld is the network for reliable information on any topic you care about: visible sources, ASV verification and community judgment."
        )}
        path="/"
      />

      {/* HERO : texte à gauche, aperçu produit à droite */}
      <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-6xl mx-auto container-px grid lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-10 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
            <motion.p variants={fadeInUp} className="eyebrow mb-6">
              {t("Le réseau de l'information vérifiée", "The network for verified information")}
            </motion.p>

            <motion.h1 variants={fadeInUp} className="display">
              {t("Partage ce qui t'intéresse.", "Share what matters to you.")}{" "}
              <span className="block text-aw-primary">{t("Prouve pourquoi c'est fiable.", "Show why it's reliable.")}</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="lead mt-6">
              {t(
                "Chaque publication s'appuie sur une source visible, analysée par ASV puis jugée par la communauté.",
                "Every post is backed by a visible source, analysed by ASV, then judged by the community."
              )}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link to="/app" className="btn-primary">
                {t("Découvrir l'app", "Discover the app")}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/reco-src" className="btn-link">
                {t("Comment ASV vérifie", "How ASV verifies")}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Sigle ActuWorld en grand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="w-full flex justify-center lg:justify-end"
          >
            <LogoMark size={440} className="w-full max-w-[260px] sm:max-w-[340px] lg:max-w-[400px] h-auto" />
          </motion.div>
        </div>
      </section>

      {/* PRINCIPES : bandeau à filets, sous le hero */}
      <section aria-label={t("Nos principes", "Our principles")} className="border-y border-aw">
        <ul className="max-w-6xl mx-auto container-px grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--aw-border)]">
          {principles.map((p) => (
            <li key={p.label} className="sm:px-6 first:sm:pl-0 last:sm:pr-0">
              <Link to={p.to} className="group flex items-start gap-4 py-6 rounded-lg">
                <p.icon className="w-5 h-5 mt-0.5 text-aw-primary shrink-0" aria-hidden="true" />
                <span className="flex-1">
                  <span className="flex items-center gap-1 font-semibold text-aw-text group-hover:text-aw-primary">
                    {p.label}
                    <ChevronRight className="w-4 h-4 opacity-50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
                  </span>
                  <span className="block text-[15px] text-aw-muted mt-0.5">{p.desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* CONSTAT : titre collant à gauche, liste éditoriale à droite */}
      <Section id="problem" className="bg-aw-surface">
        <div className="grid lg:grid-cols-[5fr_7fr] gap-10 lg:gap-16">
          <AnimatedSection className="lg:sticky lg:top-28 self-start">
            <H2>{t("Les réseaux sociaux ne demandent aucune preuve", "Social networks don't ask for proof")}</H2>
            <p className="lead mt-5">
              {t(
                "La plupart des plateformes optimisent l'engagement. Personne ne demande d'où vient l'info. Résultat : confusion, défiance, et des créateurs sérieux mis de côté.",
                "Most platforms optimize for engagement. Nobody asks where information comes from. The result: confusion, distrust, and serious creators pushed aside."
              )}
            </p>
          </AnimatedSection>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="divide-y divide-[var(--aw-border-strong)] border-t border-aw-strong"
          >
            {problems.map((p) => (
              <motion.li key={p.title} variants={fadeInUp} className="py-7">
                <h3 className="text-xl md:text-2xl">{p.title}</h3>
                <p className="text-aw-muted mt-2 leading-relaxed max-w-prose">{p.desc}</p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </Section>

      {/* VISION : manifeste centré */}
      <Section id="vision">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-6">{t("Notre vision", "Our vision")}</p>
          <p className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.15] tracking-[-0.015em] font-semibold text-aw-text">
            {t(
              "ActuWorld ne te dit pas quoi penser. Il te donne les outils pour vérifier.",
              "ActuWorld doesn't tell you what to think. It gives you the tools to check."
            )}
          </p>
          <p className="lead mx-auto mt-8">
            {t("Publie des ", "Publish ")}
            <strong className="text-aw-text font-semibold">{t("dépêches et des articles", "dispatches and articles")}</strong>
            {t(
              " sur ce qui te passionne : culture, sport, sciences, société, tech, environnement, actu locale. ASV relit chaque source et repère le ",
              " about what you love: culture, sport, science, society, tech, the environment, local news. ASV reviews every source and flags "
            )}
            <Tooltip
              text={t(
                "Choisir seulement les faits qui arrangent son argument, en ignorant ceux qui le contredisent.",
                "Picking only the facts that support an argument while ignoring those that contradict it."
              )}
            >
              cherry-picking
            </Tooltip>
            {t(", puis la communauté donne son avis. Et la lecture est gratuite.", ", then the community weighs in. And reading is free.")}
          </p>
          <div className="mt-9">
            <Link to="/app" className="btn-link">
              {t("Découvrir l'app", "Discover the app")}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>

      {/* FONDATEUR : portrait + citation */}
      <Section id="founder" className="bg-aw-surface">
        <div className="grid md:grid-cols-[minmax(0,18rem)_1fr] gap-10 md:gap-16 items-center max-w-5xl mx-auto">
          <AnimatedSection>
            <figure className="mx-auto w-56 sm:w-64 md:w-full">
              <img
                src={founderImg}
                alt={t("Portrait de Maxence Allier, fondateur d'ActuWorld", "Portrait of Maxence Allier, founder of ActuWorld")}
                className="w-full aspect-[3/4] object-cover object-top rounded-[var(--aw-radius-card)] border border-aw"
                style={{ boxShadow: "var(--aw-shadow-lg)" }}
                loading="lazy"
                width={650}
                height={975}
              />
            </figure>
          </AnimatedSection>

          <AnimatedSection>
            <blockquote>
              <p className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.2] font-semibold text-aw-text">
                {t(`«${NB}J'ai construit l'outil dont j'avais besoin.${NB}»`, "“I built the tool I needed.”")}
              </p>
              <p className="text-aw-muted leading-relaxed mt-6 text-[17px] max-w-prose">
                {t(
                  `Quand je lisais une info, j'avais toujours ce doute${NB}: est-ce que tout est vrai${NB}? Il me manquait un outil simple pour prendre du recul et me poser les bonnes questions avant de croire ou de partager. ActuWorld est né de ce besoin.`,
                  "Whenever I read the news, I had the same doubt: is all of this true? I was missing a simple tool to step back and ask the right questions before believing or sharing. ActuWorld grew out of that need."
                )}
              </p>
              <footer className="mt-6">
                <cite className="not-italic font-semibold text-aw-text">Maxence Allier</cite>
                <span className="block text-sm text-aw-muted">{t("Fondateur d'ActuWorld", "Founder of ActuWorld")}</span>
              </footer>
            </blockquote>
            <Link to="/about" className="btn-link mt-8">
              {t("L'histoire du projet", "The story behind it")}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </AnimatedSection>
        </div>
      </Section>

      {/* SOUTIENS : bandeau de logos */}
      <section id="supporters" className="py-12">
        <div className="max-w-6xl mx-auto container-px flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm font-semibold text-aw-muted">{t("Ils suivent le projet", "Following the project")}</p>
          <a
            href="https://territoires.media"
            target="_blank"
            rel="noopener noreferrer"
            className="grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-[filter,opacity] duration-300 rounded-lg"
          >
            <img
              src="/partners/territoires-media.png"
              alt="Territoire(s) Média"
              className="h-10 w-auto object-contain dark:bg-white dark:rounded-md dark:px-2 dark:py-1"
              loading="lazy"
              height={40}
            />
          </a>
          <Link to="/partenaires" className="btn-link text-[15px]">
            {t("Devenir partenaire", "Become a partner")}
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* REJOINDRE : panneau vert, alerte de sortie */}
      <section id="rejoindre" className="pb-20 md:pb-28 pt-4">
        <div className="max-w-6xl mx-auto container-px">
          <AnimatedSection>
            <div
              className="relative overflow-hidden rounded-[28px] px-6 py-12 md:px-14 md:py-16 grid lg:grid-cols-2 gap-10 items-center"
              style={{ background: "#1B3528", boxShadow: "var(--aw-shadow-lg)" }}
            >
              <div>
                <h2 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.1] tracking-[-0.015em] font-bold text-white">
                  {t("Bientôt sur l'App Store et Google Play", "Coming soon to the App Store and Google Play")}
                </h2>
                <p className="mt-4 text-white/80 text-lg max-w-md">
                  {t(
                    "Laisse ton e-mail, on te prévient dès que tu peux télécharger ActuWorld.",
                    "Leave your email and we'll let you know as soon as you can download ActuWorld."
                  )}
                </p>
              </div>
              <WaitlistForm tone="dark" />
            </div>
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
