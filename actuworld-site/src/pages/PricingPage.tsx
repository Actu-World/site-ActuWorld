import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, LineChart, Megaphone, CheckCircle2, ChevronRight } from "lucide-react";
import { Section } from "../components/Section";
import { H2 } from "../components/H2";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function PricingPage() {
  const pricing = [
    {
      icon: Star,
      title: "Lecteur",
      price: "0€",
      desc: "Pour toujours",
      points: ["Lecture illimitée", "Accès à toutes les sources", "Votes communautaires", "Suivre des créateurs"],
      cta: "Commencer gratuitement",
      featured: false
    },
    {
      icon: LineChart,
      title: "Créateur",
      price: "0€",
      desc: "Gratuit pour publier",
      points: ["Publication sourcée", "RECO-SRC (5 vidéos/mois)", "Recevoir des dons", "Statistiques basiques"],
      cta: "Devenir créateur",
      featured: false
    },
    {
      icon: Megaphone,
      title: "Créateur Pro",
      price: "9,99€",
      period: "/mois",
      desc: "Pour les créateurs sérieux",
      points: ["RECO-SRC illimité", "Badge vérifié", "Statistiques avancées", "Support prioritaire"],
      cta: "Passer Pro",
      featured: true
    },
  ];

  const faq = [
    {
      q: "Puis-je changer de plan à tout moment ?",
      a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement."
    },
    {
      q: "Y a-t-il une période d'essai pour le plan Pro ?",
      a: "Oui, nous offrons 14 jours d'essai gratuit pour le plan Créateur Pro. Aucune carte bancaire requise."
    },
    {
      q: "Comment fonctionne le système de dons ?",
      a: "Les lecteurs peuvent donner directement aux créateurs. ActuWorld prélève une commission de 10% pour maintenir la plateforme."
    }
  ];

  return (
    <div className="min-h-screen bg-aw-bg text-aw-text">
      {/* HEADER */}
      <Section className="pt-24 pb-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="text-center"
        >
          <motion.div variants={fadeIn}>
            <H2 kicker="Tarifs" center>
              Le savoir accessible à <span className="text-aw-accent">tous</span>
            </H2>
            <p className="text-aw-muted mt-4 max-w-xl mx-auto text-lg">
              La lecture est et restera toujours gratuite. Pas de paywall sur le savoir.
            </p>
          </motion.div>
        </motion.div>
      </Section>

      {/* PRICING CARDS */}
      <Section className="py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                className={`card p-8 relative ${p.featured ? 'ring-2 ring-aw-primary scale-105' : ''}`}
              >
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-aw-primary text-white text-xs font-bold rounded-full">
                    Recommandé
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.featured ? 'bg-aw-primary' : 'bg-aw-success'}`}>
                    <p.icon className={`w-6 h-6 ${p.featured ? 'text-white' : 'text-aw-primary'}`} />
                  </div>
                  <div>
                    <h3 className="body-semi text-xl">{p.title}</h3>
                    <p className="text-xs text-aw-muted">{p.desc}</p>
                  </div>
                </div>
                <div className="text-4xl font-bold mb-6">
                  {p.price}
                  {p.period && <span className="text-lg text-aw-muted font-normal">{p.period}</span>}
                </div>
                <ul className="space-y-3 text-aw-muted mb-8">
                  {p.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-aw-accent flex-shrink-0" />
                      <span className="text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors ${
                  p.featured
                    ? 'bg-aw-primary text-white hover:bg-aw-primary/90'
                    : 'bg-aw-surface border border-aw text-aw-text hover:bg-aw-success'
                }`}>
                  {p.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* COMPARISON */}
      <Section className="bg-aw-surface py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <H2 kicker="Comparaison" center>
              Pourquoi choisir <span className="text-aw-primary">ActuWorld</span> ?
            </H2>
          </motion.div>

          <motion.div variants={fadeIn} className="max-w-4xl mx-auto">
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-aw-surface">
                  <tr>
                    <th className="text-left p-4 font-semibold">Fonctionnalité</th>
                    <th className="text-center p-4 font-semibold text-aw-primary">ActuWorld</th>
                    <th className="text-center p-4 font-semibold text-aw-muted">Medium</th>
                    <th className="text-center p-4 font-semibold text-aw-muted">Substack</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Lecture gratuite", aw: true, medium: false, substack: "Partiel" },
                    { feature: "Sourcing obligatoire", aw: true, medium: false, substack: false },
                    { feature: "IA de vérification", aw: true, medium: false, substack: false },
                    { feature: "Score de confiance", aw: true, medium: false, substack: false },
                    { feature: "Dons aux créateurs", aw: true, medium: false, substack: true },
                  ].map((row, i) => (
                    <tr key={i} className="border-t border-aw">
                      <td className="p-4">{row.feature}</td>
                      <td className="text-center p-4">
                        {row.aw === true ? (
                          <CheckCircle2 className="w-5 h-5 text-aw-accent mx-auto" />
                        ) : row.aw}
                      </td>
                      <td className="text-center p-4 text-aw-muted">
                        {row.medium === true ? (
                          <CheckCircle2 className="w-5 h-5 text-aw-muted mx-auto" />
                        ) : row.medium === false ? "—" : row.medium}
                      </td>
                      <td className="text-center p-4 text-aw-muted">
                        {row.substack === true ? (
                          <CheckCircle2 className="w-5 h-5 text-aw-muted mx-auto" />
                        ) : row.substack === false ? "—" : row.substack}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* FAQ */}
      <Section className="py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeIn} className="text-center mb-12">
            <H2 kicker="Questions" center>
              Questions sur les <span className="text-aw-accent">tarifs</span>
            </H2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faq.map((item, i) => (
              <motion.div key={i} variants={fadeIn} className="card p-6">
                <h3 className="body-semi text-lg mb-2">{item.q}</h3>
                <p className="text-aw-muted">{item.a}</p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeIn} className="text-center mt-8">
            <Link to="/faq" className="text-aw-primary hover:underline inline-flex items-center gap-1">
              Voir toutes les FAQ <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </Section>

      {/* CTA */}
      <Section className="bg-aw-surface py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          className="text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Des questions ?</h3>
          <p className="text-aw-muted mb-8 max-w-xl mx-auto">
            Notre équipe est là pour répondre à toutes vos questions sur ActuWorld.
          </p>
          <Link to="/contact" className="btn-primary">
            Nous contacter <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </Section>
    </div>
  );
}
