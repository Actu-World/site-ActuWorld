import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  ChevronRight, FileText, Unlock, ThumbsUp, Sparkles,
  AlertTriangle, Search, TrendingDown, Users, Quote
} from "lucide-react";
import founderImg from "../assets/max-image-opt.webp";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import {
  PageWrapper,
  AnimatedSection,
  Parallax,
  Floating,
  staggerContainer,
  fadeInUp
} from "../components/animations";
import { WaitlistForm } from "../components/ui/WaitlistForm";
import { Tooltip } from "../components/ui/Tooltip";
import { HeroPostCard } from "../components/home/HeroPostCard";
import { SectionKicker } from "../components/home/SectionKicker";
import { HowItWorks } from "../components/home/HowItWorks";
import { useLanguage } from "../i18n/LanguageContext";

export default function HomePage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Sur mobile on coupe parallax + animations décoratives continues
  // pour garder un scroll parfaitement fluide.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const problems = [
    {
      icon: AlertTriangle,
      title: t("Information noyée dans le buzz", "Information drowned in hype"),
      desc: t("Les algorithmes privilégient l'engagement émotionnel et la viralité. Les contenus de qualité sont invisibles face au clickbait et aux tendances.", "Algorithms prioritize emotional engagement and virality. Quality content becomes invisible against clickbait and trends.")
    },
    {
      icon: Search,
      title: t("Absence de sourcage", "Lack of sourcing"),
      desc: t("N'importe qui peut affirmer n'importe quoi sans preuve. Aucune plateforme n'exige de montrer ses sources avant de publier.", "Anyone can claim anything without proof. No platform requires showing sources before publishing.")
    },
    {
      icon: TrendingDown,
      title: t("Contenus sans preuves", "Content without proof"),
      desc: t("Sans transparence sur les sources, impossible de savoir ce qui mérite confiance. Les utilisateurs naviguent à l'aveugle.", "Without source transparency, it's impossible to know what deserves trust. Users are navigating blind.")
    },
    {
      icon: Users,
      title: t("Perte de confiance", "Loss of trust"),
      desc: t("73% des jeunes cherchent une alternative plus claire. Ils veulent un espace où la preuve précède la publication.", "73% of young people want a clearer alternative. They want a space where proof comes before publishing.")
    }
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Partage ce qui t'intéresse. Prouve pourquoi c'est fiable.", "Share what matters to you. Show why it's reliable.")}
        description={t("ActuWorld est un réseau social préventif de partage d'informations fiables sur tout sujet, selon les passions et les intérêts de chacun. Source visible, ASV et jugement communautaire.", "ActuWorld is a preventive social network for sharing reliable information on any topic, based on your passions and interests. Visible sources, ASV and community trust.")}
        path="/"
      />
      {/* HERO */}
      <Section id="hero" container={false} className="relative pt-16 md:pt-24 pb-20">
        {/* Calque décoratif : SEUL ce calque masque le débordement (les blobs).
            Le contenu (texte + carte) n'est plus rogné. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {/* Blobs décoratifs — animés sur ordi, figés sur mobile (fluidité) */}
          <motion.div
            className="aw-blob w-[20rem] h-[20rem] md:w-[40rem] md:h-[40rem] bg-[#94C9AA] -top-32 -right-32"
            animate={isDesktop ? { scale: [1, 1.1, 1], rotate: [0, 180, 360] } : undefined}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="aw-blob w-[16rem] h-[16rem] md:w-[32rem] md:h-[32rem] bg-[#00A896] -bottom-32 -left-32"
            animate={isDesktop ? { scale: [1.1, 1, 1.1], rotate: [360, 180, 0] } : undefined}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          {isDesktop && (
            <Floating duration={6} y={20}>
              <div className="aw-blob w-[10rem] h-[10rem] md:w-[20rem] md:h-[20rem] bg-[#2E5F4A] top-1/2 left-1/3 opacity-20" />
            </Floating>
          )}
        </div>

        <motion.div
          ref={heroRef}
          style={isDesktop ? { y: heroY, opacity: heroOpacity } : undefined}
          className="max-w-7xl mx-auto container-px relative"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Colonne texte */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0"
            >
              <motion.div variants={fadeInUp} className="flex justify-center lg:justify-start mb-6">
                <span className="glass-enhanced inline-flex items-center gap-2 rounded-full border border-aw px-4 py-1.5 text-sm font-medium text-aw-text">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-aw-accent opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-aw-accent" />
                  </span>
                  {t("Réseau social de l'information vérifiée", "The social network for verified information")}
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="hero-title text-4xl md:text-6xl font-bold leading-tight"
              >
                <span className="text-aw-text">{t("Partage ce qui t'intéresse.", "Share what matters to you.")}</span>
                <br />
                <span className="gradient-text">{t("Prouve pourquoi c'est fiable.", "Show why it's reliable.")}</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mt-6 text-aw-muted text-lg md:text-xl leading-relaxed"
              >
                {t("Un réseau social préventif où chaque publication s'appuie sur une ", "A preventive social network where every post is backed by a ")}
                <strong className="text-aw-text">{t("source visible", "visible source")}</strong>
                {t(", vérifiée par ", ", verified by ")}
                <strong className="text-aw-text">ASV</strong>
                {t(", puis éclairée par un jugement communautaire.", ", then enhanced by community judgment.")}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
              >
                <Link to="/app" className="btn-primary glow-hover">
                  {t("Découvrir ActuWorld", "Discover ActuWorld")} <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/reco-src" className="btn-outline group">
                  <Sparkles className="w-5 h-5 mr-2 text-aw-accent" />
                  {t("L'IA ASV", "ASV AI")}
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 justify-center lg:justify-start"
              >
                {[
                  { icon: FileText, label: t("Sourcing", "Sourcing"), value: t("obligatoire", "mandatory") },
                  { icon: Unlock, label: t("Lecture", "Reading"), value: t("100% gratuite", "100% free") },
                  { icon: ThumbsUp, label: t("Qualité", "Quality"), value: t("> Viralité", "> Virality") },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-2 text-sm"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-aw-success flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-aw-primary" />
                    </div>
                    <span className="text-aw-muted">{item.label}<br/><strong className="text-aw-text">{item.value}</strong></span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Colonne visuel produit — visible aussi sur mobile, sans flottement */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="mt-6 lg:mt-0 max-w-[250px] sm:max-w-none mx-auto w-full"
            >
              <HeroPostCard float={isDesktop} compact={!isDesktop} />
            </motion.div>
          </div>
        </motion.div>
      </Section>

      {/* 01 · LE CONSTAT */}
      <Section id="problem" className="bg-aw-surface py-16 md:py-24">
        <AnimatedSection>
          <div className="flex flex-col items-center text-center mb-16">
            <SectionKicker number="01" label={t("Le constat", "The problem")} center className="mb-5" />
            <H2 center>
              {isEnglish ? <>Today's social networks <span className="gradient-text">don't ask for proof</span></> : <>Les réseaux sociaux d'aujourd'hui <span className="gradient-text">ne demandent aucune preuve</span></>}
            </H2>
            <p className="text-aw-muted mt-4 max-w-2xl mx-auto text-lg">
              {t("La majorité des plateformes optimisent pour l'engagement émotionnel. Personne ne demande d'où vient l'info. Résultat : confusion, perte de confiance, et créateurs sérieux marginalisés.", "Most platforms optimize for emotional engagement. Nobody asks where the info comes from. Result: confusion, loss of trust, and serious creators marginalized.")}
            </p>
          </div>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-5"
        >
          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="group relative card card-hover p-6 flex gap-5 overflow-hidden"
            >
              {/* Liseré rouge animé au survol */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/25 flex items-center justify-center ring-1 ring-red-500/10 group-hover:scale-110 transition-transform">
                <p.icon className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="body-semi text-lg flex items-center gap-2">
                  <span className="text-xs font-bold text-red-500/60 tabular-nums">0{i + 1}</span>
                  {p.title}
                </h3>
                <p className="text-aw-muted text-sm mt-1.5 leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <AnimatedSection delay={0.3} className="mt-12 text-center">
          <p className="text-lg text-aw-muted">
            <strong className="text-aw-text">ActuWorld</strong> {t("naît d'un constat simple : il est temps de ", "is built on a simple observation: it's time to ")}
            <span className="text-aw-primary font-semibold highlight-text">{t("donner à chacun les outils pour publier, explorer et partager avec preuves", "give everyone the tools to publish, explore, and share with proof")}</span>.{" "}
            {t("Un réseau où ", "A network where ")}<strong className="text-aw-text">{t("tes sources parlent pour toi", "your sources speak for you")}</strong>.
          </p>
        </AnimatedSection>
      </Section>

      {/* 02 · COMMENT ÇA MARCHE */}
      <HowItWorks />

      {/* 03 · VISION */}
      <Section id="vision" className="bg-aw-surface py-16 md:py-24 relative overflow-hidden">
        <Parallax offset={30} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-aw-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-aw-accent/10 rounded-full blur-3xl" />
        </Parallax>

        <div className="max-w-5xl mx-auto relative">
          <AnimatedSection className="flex flex-col items-center text-center">
            <SectionKicker number="03" label={t("Notre vision", "Our vision")} center className="mb-5" />
            <H2 center>
              {isEnglish ? <>A space to share <span className="gradient-text">with clarity</span></> : <>Un espace pour partager <span className="gradient-text">avec clarté</span></>}
            </H2>
            <p className="text-aw-muted mt-6 text-lg leading-relaxed max-w-3xl">
              {t("Publie des ", "Publish ")}<strong className="text-aw-text">{t("posts, articles et vidéos", "posts, articles, and videos")}</strong>{t(" sur tout ce qui te passionne — culture, sport, sciences, société, tech, environnement, actualité locale. Chaque publication s'appuie sur une ", " about anything you're passionate about — culture, sports, science, society, tech, environment, local news. Every post is backed by a ")}
              <strong className="text-aw-text">{t("source visible", "visible source")}</strong>{t(", vérifiée par ", ", verified by ")}
              <strong className="text-aw-text">ASV</strong>{t(" qui détecte le ", " which detects ")}<Tooltip text={t("Le cherry-picking consiste à sélectionner uniquement les données ou faits qui soutiennent son argument, en ignorant ceux qui le contredisent.", "Cherry-picking means selecting only data or facts that support an argument while ignoring contradictory evidence.")}>cherry-picking</Tooltip>{t(", puis éclairée par la communauté.", ", then enhanced by the community.")}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="text-center mt-12">
            <p className="text-aw-primary body-semi text-lg max-w-2xl mx-auto">
              {t("ActuWorld ne dit pas quoi penser. Il donne les outils pour chercher, juger et montrer ce qui mérite confiance.", "ActuWorld doesn't tell you what to think. It gives you the tools to search, judge, and show what deserves trust.")}
            </p>
            <div className="mt-8">
              <Link to="/app" className="btn-primary glow-hover">
                {t("Découvrir la plateforme", "Discover the platform")} <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* 04 · POURQUOI ACTUWORLD EXISTE */}
      <Section id="founder" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-center">
          {/* Photo du fondateur — fondu vertical (un slide horizontal déborde
              à droite sur mobile et coupe le texte) */}
          <AnimatedSection direction="up">
            <div className="relative mx-auto w-56 sm:w-64 md:w-[18rem]">
              {/* Halo + carré d'accent décoratif */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2rem] opacity-70 blur-xl"
                style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--aw-primary) 30%, transparent), color-mix(in srgb, var(--aw-accent) 30%, transparent))" }}
              />
              <div aria-hidden="true" className="absolute -bottom-5 -right-5 w-24 h-24 rounded-3xl border-2 border-aw-primary/30" />
              <img
                src={founderImg}
                alt={t("Maxence Allier, fondateur d'ActuWorld", "Maxence Allier, founder of ActuWorld")}
                className="relative rounded-[1.75rem] w-full aspect-[3/4] object-cover object-top border border-aw shadow-2xl"
                loading="lazy"
                width={650}
                height={975}
              />
              {/* Badge fondateur */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap glass-enhanced border border-aw rounded-full px-4 py-1.5 text-sm font-semibold text-aw-text shadow-lg">
                {t("Fondateur", "Founder")}
              </div>
            </div>
          </AnimatedSection>

          {/* Citation */}
          <AnimatedSection direction="up" className="text-center md:text-left">
            <SectionKicker number="04" label={t("Pourquoi ActuWorld existe", "Why ActuWorld exists")} className="mb-6" />
            <Quote className="w-10 h-10 text-aw-primary/25 mb-2 mx-auto md:mx-0" aria-hidden="true" />
            <p
              className="font-bold leading-snug text-aw-text whitespace-nowrap text-[clamp(11px,3.45vw,16px)] md:whitespace-normal md:text-3xl"
              style={{ fontFamily: '"Platypi", Georgia, serif' }}
            >
              {t("« J'ai construit l'outil dont j'avais besoin. »", "“I built the tool I needed.”")}
            </p>
            <p className="text-aw-muted leading-relaxed mt-5 text-lg">
              {t(
                "Quand je lisais des informations, j'avais toujours ce doute : est-ce fiable ? Il manquait un endroit où partager ce qui nous intéresse tout en montrant d'où ça vient — un espace où vérifier avant de croire devient naturel. ActuWorld est né de ce besoin.",
                "When I read information, I always had that doubt: is this reliable? I was missing a place to share what interests me while showing where it comes from — a space where verifying before believing becomes natural. ActuWorld was born from that need."
              )}
            </p>

            {/* Signature */}
            <div className="mt-6 flex items-center gap-3 justify-center md:justify-start">
              <div className="h-px w-8 bg-aw-primary/40" aria-hidden="true" />
              <div>
                <div className="font-bold text-aw-text">Maxence Allier</div>
                <div className="text-sm text-aw-muted">{t("Fondateur d'ActuWorld", "Founder of ActuWorld")}</div>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/app" className="btn-outline">
                {t("Lire notre vision", "Read our vision")} <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </Section>

      {/* ILS SUIVENT LE PROJET */}
      <Section id="supporters" className="bg-aw-surface py-14">
        <AnimatedSection className="text-center">
          <p className="overline text-aw-muted mb-7">
            {t("Ils suivent le projet", "They follow the project")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <motion.a
              href="https://territoires.media"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ duration: 0.2 }}
              className="inline-flex items-center rounded-2xl border border-aw bg-aw-bg px-5 py-3 grayscale hover:grayscale-0 opacity-90 hover:opacity-100 transition-all duration-300"
              aria-label="Territoire(s) Média"
            >
              <img
                src="/partners/territoires-media.png"
                alt="Territoire(s) Média"
                className="h-9 md:h-11 w-auto object-contain dark:bg-white dark:rounded-md dark:px-2 dark:py-1"
              />
            </motion.a>
          </div>
          <div className="mt-8">
            <Link to="/partenaires" className="link-underline text-aw-primary font-semibold inline-flex items-center gap-1">
              {t("Devenir partenaire ou nous soutenir", "Become a partner or support us")}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>

      {/* 05 · REJOINDRE */}
      <Section className="py-16 md:py-24">
        <AnimatedSection direction="scale">
          <div
            className="relative max-w-4xl mx-auto overflow-hidden rounded-[2rem] px-6 py-14 md:px-16 md:py-20 text-center border border-white/10"
            style={{ background: "linear-gradient(160deg, #1B3528 0%, #244736 100%)" }}
          >
            {/* Halo statique très discret */}
            <div
              aria-hidden="true"
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full opacity-[0.07]"
              style={{ background: "radial-gradient(circle, #A8D5BA, transparent 70%)" }}
            />

            <div className="relative">
              <SectionKicker number="05" label={t("Rejoindre", "Join")} center tone="light" className="mb-6" />
              <h2
                className="text-2xl md:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: '"Platypi", Georgia, serif' }}
              >
                {t("Prêt à partager avec preuves ?", "Ready to share with proof?")}
              </h2>
              <p className="mt-4 text-white/85 text-lg max-w-xl mx-auto">
                {t("Sois parmi les premiers à publier, explorer et juger sur ActuWorld. Inscris-toi à la beta.", "Be among the first to publish, explore and judge on ActuWorld. Join the beta.")}
              </p>

              {/* Formulaire dans un panneau clair */}
              <div className="mt-8 max-w-xl mx-auto rounded-2xl bg-aw-bg/95 backdrop-blur p-5 md:p-6 shadow-2xl text-left">
                <WaitlistForm variant="inline" />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
