import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Mail, Instagram, ChevronRight, Newspaper, GraduationCap,
  LineChart, Megaphone, Eye, Rocket, Heart, Sparkles,
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import {
  PageWrapper,
  AnimatedSection,
  staggerContainer,
  fadeInUp,
} from "../components/animations";
import { SectionKicker } from "../components/home/SectionKicker";
import { useLanguage } from "../i18n/LanguageContext";

const PARTNER_EMAIL = "actuworld.app@outlook.fr";
const MAILTO = `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent("Partenariat ActuWorld")}`;

export default function PartnersPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const profiles = [
    {
      icon: Newspaper,
      title: t("Médias & journalistes", "Media & journalists"),
      desc: t("Relayez le projet, testez l'API ASV, co-construisons des usages de vérification de sources.", "Cover the project, test the ASV API, let's co-build source-verification use cases."),
    },
    {
      icon: GraduationCap,
      title: t("Éducateurs & écoles", "Educators & schools"),
      desc: t("Intégrez ActuWorld dans des parcours d'éducation aux médias et à l'esprit critique.", "Bring ActuWorld into media-literacy and critical-thinking programs."),
    },
    {
      icon: LineChart,
      title: t("Investisseurs & soutiens", "Investors & supporters"),
      desc: t("Aidez à accélérer le développement d'une alternative saine à la désinformation.", "Help accelerate a healthy alternative to misinformation."),
    },
    {
      icon: Megaphone,
      title: t("Créateurs & ambassadeurs", "Creators & ambassadors"),
      desc: t("Faites connaître ActuWorld à votre communauté et façonnez la beta avec nous.", "Share ActuWorld with your community and shape the beta with us."),
    },
  ];

  const value = [
    { icon: Eye, title: t("Visibilité croisée", "Cross-visibility"), desc: t("On met en avant nos partenaires sur le site et nos réseaux.", "We showcase our partners on the site and social media.") },
    { icon: Rocket, title: t("Accès anticipé", "Early access"), desc: t("Premier accès à la beta et à l'API ASV avant tout le monde.", "First access to the beta and the ASV API before anyone else.") },
    { icon: Heart, title: t("Un impact réel", "Real impact"), desc: t("Soutenir une information vérifiée, sourcée et accessible à tous.", "Support information that is verified, sourced and open to all.") },
  ];

  return (
    <PageWrapper className="min-h-screen bg-aw-bg text-aw-text">
      <PageMeta
        title={t("Partenaires — Soutenir ActuWorld", "Partners — Support ActuWorld")}
        description={t(
          "ActuWorld cherche des partenaires : médias, journalistes, éducateurs, investisseurs et ambassadeurs pour rendre l'information vérifiée accessible à tous. Contactez-nous.",
          "ActuWorld is looking for partners: media, journalists, educators, investors and ambassadors to make verified information accessible to all. Get in touch."
        )}
        path="/partenaires"
      />

      {/* HERO */}
      <Section className="pt-24 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2E5F4A]/10 via-transparent to-[#00A896]/10 pointer-events-none" />
        <AnimatedSection className="flex flex-col items-center relative">
          <SectionKicker number="—" label={t("Partenaires", "Partners")} center className="mb-5" />
          <H2 as="h1" center>
            {isEnglish ? <>Help us make information <span className="gradient-text">trustworthy</span></> : <>Aidez-nous à rendre l'information <span className="gradient-text">fiable</span></>}
          </H2>
          <p className="text-aw-muted mt-5 max-w-2xl mx-auto text-lg leading-relaxed">
            {t(
              "ActuWorld est un projet porté par un étudiant, déterminé à changer notre rapport à l'information. Pour avancer, j'ai besoin de visibilité, de relais et de soutiens. Et si on construisait ça ensemble ?",
              "ActuWorld is a project led by a student, determined to change our relationship with information. To move forward, I need visibility, reach and support. What if we built this together?"
            )}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={MAILTO} className="btn-primary glow-hover">
              <Mail className="w-5 h-5 mr-2" /> {t("Devenir partenaire", "Become a partner")}
            </a>
            <Link to="/press" className="btn-outline">
              {t("Espace presse", "Press kit")} <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </Section>

      {/* QUI ON CHERCHE */}
      <Section className="bg-aw-surface py-14 md:py-20">
        <AnimatedSection className="text-center mb-12 flex flex-col items-center">
          <SectionKicker number="01" label={t("Qui on cherche", "Who we're looking for")} center className="mb-5" />
          <H2 center>
            {isEnglish ? <>Profiles that can <span className="gradient-text">help</span></> : <>Des profils qui peuvent <span className="gradient-text">aider</span></>}
          </H2>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto"
        >
          {profiles.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              className="card card-hover p-6 flex flex-col gap-3"
            >
              <span
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, var(--aw-primary), var(--aw-accent))" }}
              >
                <p.icon className="w-6 h-6" />
              </span>
              <h3 className="body-semi text-lg">{p.title}</h3>
              <p className="text-aw-muted text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* CE QUE ÇA APPORTE */}
      <Section className="py-14 md:py-20">
        <AnimatedSection className="text-center mb-12 flex flex-col items-center">
          <SectionKicker number="02" label={t("Ce que ça apporte", "What you get")} center className="mb-5" />
          <H2 center>
            {isEnglish ? <>A partnership that <span className="gradient-text">gives back</span></> : <>Un partenariat <span className="gradient-text">gagnant</span></>}
          </H2>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {value.map((v, i) => (
            <motion.div key={i} variants={fadeInUp} className="text-center flex flex-col items-center gap-3">
              <span className="w-14 h-14 rounded-2xl bg-aw-success flex items-center justify-center">
                <v.icon className="w-7 h-7 text-aw-primary" />
              </span>
              <h3 className="body-semi text-lg">{v.title}</h3>
              <p className="text-aw-muted text-sm leading-relaxed max-w-xs">{v.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ILS NOUS SUIVENT */}
      <Section className="bg-aw-surface py-14">
        <AnimatedSection className="text-center">
          <p className="overline text-aw-muted mb-7">{t("Ils suivent déjà le projet", "Already following the project")}</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <motion.a
              href="https://territoires.media"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              className="inline-flex items-center rounded-2xl border border-aw bg-aw-bg px-5 py-3 grayscale hover:grayscale-0 opacity-90 hover:opacity-100 transition-all duration-300"
              aria-label="Territoire(s) Média"
            >
              <img src="/partners/territoires-media.png" alt="Territoire(s) Média" className="h-9 md:h-11 w-auto object-contain dark:bg-white dark:rounded-md dark:px-2 dark:py-1" />
            </motion.a>
          </div>
        </AnimatedSection>
      </Section>

      {/* CTA CONTACT */}
      <Section className="py-16 md:py-24">
        <AnimatedSection direction="scale">
          <div
            className="relative max-w-4xl mx-auto overflow-hidden rounded-[2rem] px-6 py-14 md:px-16 md:py-20 text-center border border-white/10"
            style={{ background: "linear-gradient(160deg, #1B3528 0%, #244736 100%)" }}
          >
            <div
              aria-hidden="true"
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full opacity-[0.07]"
              style={{ background: "radial-gradient(circle, #A8D5BA, transparent 70%)" }}
            />
            <div className="relative">
              <Sparkles className="w-8 h-8 text-[#A8D5BA] mx-auto mb-4" />
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: '"Platypi", Georgia, serif' }}>
                {t("Discutons de votre soutien", "Let's talk about your support")}
              </h2>
              <p className="mt-4 text-white/85 text-lg max-w-xl mx-auto">
                {t("Un mot, une idée, une envie de relayer ? Écrivez-nous, on répond à chaque message.", "A word, an idea, a wish to spread the word? Write to us — we reply to every message.")}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href={MAILTO} className="btn-primary glow-hover">
                  <Mail className="w-5 h-5 mr-2" /> {PARTNER_EMAIL}
                </a>
                <a
                  href="https://instagram.com/actuworld_fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 text-white px-6 py-3 font-semibold hover:bg-white/10 transition-colors"
                >
                  <Instagram className="w-5 h-5" /> @actuworld_fr
                </a>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </Section>
    </PageWrapper>
  );
}
