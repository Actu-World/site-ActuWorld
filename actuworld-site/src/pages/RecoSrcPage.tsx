import { Link } from "react-router-dom";
import {
  ChevronRight, Link2, ShieldCheck, Building2, Award, Lock, CalendarClock, UserCheck,
  FileWarning, CheckCircle2, XCircle, HelpCircle, MinusCircle, Newspaper, GraduationCap,
  PenLine, BookOpenCheck,
} from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";
import { PageMeta } from "../components/PageMeta";
import { PageWrapper, AnimatedSection } from "../components/animations";
import { PhoneMockup } from "../components/app/phone/PhoneMockup";
import { useLanguage } from "../i18n/LanguageContext";

const NB = " ";

export default function RecoSrcPage() {
  const { isEnglish } = useLanguage();
  const t = (fr: string, en: string) => (isEnglish ? en : fr);

  /* Signaux réellement utilisés pour la note Éditeur (asv_scoring.yaml) */
  const publisherSignals = [
    { icon: CalendarClock, label: t("Ancienneté du domaine", "Domain age") },
    { icon: Lock, label: t("Connexion sécurisée (HTTPS)", "Secure connection (HTTPS)") },
    { icon: Building2, label: t("Mentions légales et pages institutionnelles", "Legal notice and institutional pages") },
    { icon: UserCheck, label: t("Auteurs identifiés", "Identified authors") },
    { icon: FileWarning, label: t("Politique de correction", "Corrections policy") },
    { icon: Award, label: t("Registres reconnus (CPPAP, IFCN, JTI…)", "Recognised registries (CPPAP, IFCN, JTI…)") },
  ];

  /* Verdicts de la note Fidélité (semantic_verification.py) */
  const stances = [
    { icon: CheckCircle2, color: "#10b981", label: t("Soutient", "Supports"), desc: t("La source dit bien ce que dit le post.", "The source says what the post says.") },
    { icon: XCircle, color: "#ef4444", label: t("Contredit", "Contradicts"), desc: t("La source dit autre chose, voire l'inverse.", "The source says something else, or the opposite.") },
    { icon: MinusCircle, color: "#f59e0b", label: t("Hors sujet", "Off-topic"), desc: t("La source ne parle pas de l'affirmation.", "The source doesn't address the claim.") },
    { icon: HelpCircle, color: "#6b7280", label: t("Non vérifiable", "Unverifiable"), desc: t("Impossible de trancher avec ce texte.", "Can't tell from this text.") },
  ];


  const audiences = [
    {
      icon: BookOpenCheck,
      title: t("Lectrices et lecteurs", "Readers"),
      desc: t(
        "Un coup d'œil au badge donne une première idée de la solidité des sources. Une touche ouvre le détail : qui publie, et ce qu'ASV a relevé dans chaque source.",
        "One glance at the badge gives a first idea of how solid the sources are. One tap opens the detail: who publishes, and what ASV found in each source."
      ),
    },
    {
      icon: PenLine,
      title: t("Créateurs", "Creators"),
      desc: t(
        "ASV vérifie les sources de ta publication et donne du poids à ce que tu avances : tes lecteurs voient d'où vient l'info et sur quoi elle s'appuie.",
        "ASV checks the sources of your post and gives weight to what you say: your readers see where the information comes from and what backs it up."
      ),
    },
    {
      icon: Newspaper,
      title: t("Rédactions et médias", "Newsrooms and media"),
      desc: t(
        "ASV fait une première passe sur les sources citées : transparence de l'éditeur et fidélité de la reprise. Un outil d'aide au contrôle, pas un fact-checker automatique.",
        "ASV runs a first pass on cited sources: publisher transparency and how faithfully they're quoted. A checking aid, not an automatic fact-checker."
      ),
    },
    {
      icon: GraduationCap,
      title: t("Enseignants (éducation aux médias)", "Teachers (media literacy)"),
      desc: t(
        "Un outil concret pour développer l'esprit critique : ouvrir les sources, les comparer au post, puis discuter de l'analyse d'ASV plutôt que la prendre pour acquise.",
        "A concrete tool to build critical thinking: open the sources, compare them with the post, then discuss ASV's analysis rather than take it for granted."
      ),
    },
  ];

  return (
    <PageWrapper className="text-aw-text">
      <PageMeta
        title={t("ASV | ActuWorld Source Verification", "ASV | ActuWorld Source Verification")}
        description={t(
          "ASV analyse les sources citées dans chaque publication ActuWorld : transparence de l'éditeur et fidélité de la reprise. Une aide pour vérifier, sans juger à ta place.",
          "ASV analyses the sources cited in every ActuWorld post: publisher transparency and faithful quoting. A help to check, without judging for you."
        )}
        path="/reco-src"
      />

      {/* HERO : texte + fiche ASV dans l'app */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-6xl mx-auto container-px grid lg:grid-cols-[1.2fr_0.8fr] gap-14 items-center">
          <AnimatedSection>
            <p className="eyebrow mb-6">ActuWorld Source Verification</p>
            <h1 className="display">
              {isEnglish ? "Does the source really say what the post claims?" : <>La source <span className="whitespace-nowrap">dit-elle</span> vraiment ce qu'on lui fait dire&nbsp;?</>}
            </h1>
            <p className="lead mt-6">
              {t(
                "À chaque publication, ASV lit les sources citées et répond à deux questions : qui publie cette source, et le post la reprend-il fidèlement ?",
                "On every post, ASV reads the cited sources and answers two questions: who publishes this source, and does the post report it faithfully?"
              )}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href="#notes" className="btn-primary">
                {t("Voir les deux notes", "See the two scores")}
              </a>
              <a href="#pour-qui" className="btn-link">
                {t("À quoi ça sert", "What it's for")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <PhoneMockup screen="asv" width={290} />
            <p className="mt-4 caption text-aw-muted text-center">
              {t("La fiche ASV, telle qu'elle s'ouvre dans l'app.", "The ASV sheet, as it opens in the app.")}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* LES DEUX NOTES */}
      <Section id="notes" className="bg-aw-surface">
        <AnimatedSection className="max-w-2xl">
          <H2>{t("Deux notes, deux questions", "Two scores, two questions")}</H2>
          <p className="lead mt-5">
            {t(
              "ASV ne dit pas si une info est vraie. Elle évalue la qualité des sources et la façon dont elles sont citées. Le reste, c'est à toi de juger.",
              "ASV doesn't say whether information is true. It rates the quality of the sources and how they're cited. The rest is yours to judge."
            )}
          </p>
        </AnimatedSection>

        <div className="mt-12 grid lg:grid-cols-2 gap-6">
          {/* Note Éditeur */}
          <AnimatedSection className="card p-7 md:p-8">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                <Link2 className="w-5 h-5 text-aw-primary" />
              </span>
              <h3 className="text-2xl">{t("Éditeur : qui publie ?", "Publisher: who publishes?")}</h3>
            </div>
            <p className="text-aw-muted mt-4 max-w-prose">
              {t(
                `Chaque site cité reçoit une note de transparence sur 10. ASV s'appuie sur une base de plus de 1${NB}800 domaines déjà évalués, enrichie automatiquement à chaque nouvelle source.`,
                "Each cited site gets a transparency score out of 10. ASV relies on a base of more than 1,800 domains already rated, automatically extended with every new source."
              )}
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {publisherSignals.map((s) => (
                <li key={s.label} className="flex items-start gap-2.5 text-[15px]">
                  <s.icon className="w-4 h-4 mt-1 text-aw-primary shrink-0" aria-hidden="true" />
                  {s.label}
                </li>
              ))}
            </ul>
            <div className="aw-phone mt-7 rounded-xl p-4 border border-aw" style={{ background: "var(--app-bg)" }} aria-hidden="true">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold underline" style={{ color: "var(--app-text)" }}>ign.fr</span>
                <span className="font-bold" style={{ color: "#10b981" }}>9/10</span>
              </div>
              <div className="flex gap-1.5 mt-2 text-[11px] font-semibold">
                <span className="rounded px-1.5 py-0.5" style={{ background: "var(--app-row-strong)", color: "var(--app-text)" }}>Institution</span>
                <span className="rounded px-1.5 py-0.5 inline-flex items-center gap-1" style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                  <Award className="w-3 h-3" /> {t("Registre reconnu", "Recognised registry")}
                </span>
                <span className="rounded px-1.5 py-0.5" style={{ background: "var(--app-row-strong)", color: "var(--app-text)" }}>HTTPS</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Note Fidélité */}
          <AnimatedSection className="card p-7 md:p-8">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-[10px] bg-aw-success flex items-center justify-center" aria-hidden="true">
                <ShieldCheck className="w-5 h-5 text-aw-primary" />
              </span>
              <h3 className="text-2xl">{t("Fidélité : la source dit-elle ça ?", "Faithfulness: does the source say that?")}</h3>
            </div>
            <p className="text-aw-muted mt-4 max-w-prose">
              {t(
                "Une IA lit le texte de chaque source et le compare à ce qu'affirme le post. Elle donne un avis par source, avec l'extrait sur lequel elle s'appuie.",
                "An AI reads the text of each source and compares it to what the post claims. It gives an opinion per source, with the excerpt it relies on."
              )}
            </p>
            <ul className="mt-6 space-y-3">
              {stances.map((s) => (
                <li key={s.label} className="flex items-start gap-3">
                  <s.icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: s.color }} aria-hidden="true" />
                  <span>
                    <strong className="font-semibold">{s.label}</strong>
                    <span className="text-aw-muted"> : {s.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-aw-muted border-t border-aw pt-4">
              {t(
                "Comme toute IA, ASV peut se tromper. C'est une aide, pas un verdict : chaque source reste à portée de clic pour que tu vérifies par toi-même.",
                "Like any AI, ASV can get it wrong. It's a help, not a verdict: every source stays one click away so you can check for yourself."
              )}
            </p>
          </AnimatedSection>
        </div>
        <AnimatedSection className="mt-8 text-[15px] text-aw-muted max-w-prose">
          {t(
            "Les deux notes se combinent en un statut affiché par le badge ASV sur chaque publication : plein, à moitié rempli ou en pointillés.",
            "Both scores combine into a status shown by the ASV badge on every post: full, half-filled or dotted."
          )}
        </AnimatedSection>
      </Section>

      {/* POUR QUI */}
      <Section id="pour-qui" className="bg-aw-surface">
        <AnimatedSection className="max-w-2xl">
          <p className="eyebrow mb-4">{t("Pour qui", "Who it's for")}</p>
          <H2>{t("À quoi sert ASV, concrètement", "What ASV is for, concretely")}</H2>
        </AnimatedSection>
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {audiences.map((a) => (
            <AnimatedSection key={a.title} className="flex gap-5">
              <span className="w-11 h-11 rounded-xl bg-aw-bg border border-aw flex items-center justify-center shrink-0" aria-hidden="true">
                <a.icon className="w-5 h-5 text-aw-primary" />
              </span>
              <div>
                <h3 className="text-xl">{a.title}</h3>
                <p className="text-aw-muted mt-2 leading-relaxed max-w-prose">{a.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <div>
            <H2>{t("Une rédaction, une école, un projet ?", "A newsroom, a school, a project?")}</H2>
            <p className="lead mt-4">
              {t(
                "ASV fonctionne aujourd'hui dans l'app. Une extension navigateur et une intégration pour les rédactions sont en préparation : dis-nous comment tu aimerais l'utiliser.",
                "ASV runs inside the app today. A browser extension and a newsroom integration are in preparation: tell us how you'd like to use it."
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/contact" className="btn-primary">{t("Nous écrire", "Write to us")}</Link>
            <Link to="/#rejoindre" className="btn-link">
              {t("Être prévenu", "Get notified")} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Section>
    </PageWrapper>
  );
}
