import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Link2, ShieldCheck, Users } from "lucide-react";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, AnimatedSection, staggerContainer, fadeInUp } from "../components/animations";
import { WaitlistForm } from "../components/ui/WaitlistForm";
import { PhoneShowcase } from "../components/app/phone/PhoneShowcase";
import { useLanguage } from "../i18n/LanguageContext";

/**
 * Page d'atterrissage de la liste d'attente (/liste-attente, alias /waitlist).
 * Cible des liens en bio et des campagnes : un seul geste possible, s'inscrire.
 * La provenance vient de `?src=` / UTM, captée dans App (lib/waitlistSource).
 */
export default function WaitlistPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  const points = [
    {
      icon: Link2,
      label: t("Une source visible sur chaque publication", "A visible source on every post"),
    },
    {
      icon: ShieldCheck,
      label: t("ASV analyse les sources : transparence de l'éditeur, fidélité de la reprise", "ASV analyses the sources: publisher transparency, faithful quoting"),
    },
    {
      icon: Users,
      label: t("La communauté vote « Fiable » ou « Douteuse »", "The community votes “Reliable” or “Doubtful”"),
    },
  ];

  return (
    <PageWrapper className="text-aw-text">
      <PageMeta
        title={t("Rejoins la liste d'attente", "Join the waitlist")}
        description={t(
          "ActuWorld, le réseau de l'information sourcée, arrive d'ici la fin de l'année sur l'App Store et Google Play. Laisse ton e-mail pour être prévenu à la sortie.",
          "ActuWorld, the network for sourced information, is coming to the App Store and Google Play by the end of the year. Leave your email to hear at launch."
        )}
        path="/liste-attente"
      />

      <section className="pt-8 pb-16 md:pt-20 md:pb-28">
        <div className="max-w-6xl mx-auto container-px grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-14 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-xl mx-auto lg:mx-0 w-full">
            <motion.p variants={fadeInUp} className="eyebrow mb-5">
              {t("Sortie d'ici la fin de l'année", "Launching by the end of the year")}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="display">
              {t("Sois parmi les premiers sur ActuWorld.", "Be among the first on ActuWorld.")}
            </motion.h1>
            <motion.p variants={fadeInUp} className="lead mt-5">
              {t(
                "Le réseau où chaque info s'appuie sur une source que tu peux ouvrir. Laisse ton e-mail : on te prévient dès que l'app est sur l'App Store et Google Play.",
                "The network where every piece of news rests on a source you can open. Leave your email and we'll let you know as soon as the app is on the App Store and Google Play."
              )}
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8">
              <WaitlistForm form="liste" />
            </motion.div>

            <motion.p variants={fadeInUp} className="mt-2 text-sm text-aw-muted">
              {t("Pas de newsletter, pas de revente. ", "No newsletter, no resale. ")}
              <Link to="/privacy" className="link">
                {t("Confidentialité", "Privacy")}
              </Link>
            </motion.p>

            <motion.ul variants={fadeInUp} className="mt-10 pt-8 border-t border-aw space-y-4">
              {points.map((p) => (
                <li key={p.label} className="flex items-start gap-3">
                  <span className="w-9 h-9 shrink-0 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                    <p.icon className="w-[18px] h-[18px] text-aw-primary" />
                  </span>
                  <span className="pt-1.5 text-[15px] font-semibold">{p.label}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeInUp} className="mt-8">
              <Link to="/app" className="btn-link py-2">
                {t("Voir comment marche l'app", "See how the app works")}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </motion.div>

          <AnimatedSection className="hidden md:flex justify-center">
            <PhoneShowcase width={280} />
          </AnimatedSection>
        </div>
      </section>
    </PageWrapper>
  );
}
