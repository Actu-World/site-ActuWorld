// ASV Pro — formule du compte : son nom affiché et ce qu'elle ouvre. La page
// Tarifs fait foi : Découverte = le rapport seul ; historique, export, partage
// et synthèse viennent avec Pro, Rédaction, la bêta et l'équipe. Retoucher un
// contenu avant de le vérifier est ouvert à tous. L'API applique
// les mêmes règles (elle refuse l'historique et le partage en Découverte).
import type { ProAccess, ProFeatures } from './types';

type Translate = (fr: string, en: string) => string;

/** Nom de la formule, tel qu'affiché à côté d'« ASV Pro » et dans Compte. */
export function planLabel(access: Pick<ProAccess, 'plan' | 'moderator' | 'org_name'>, t: Translate): string {
  if (access.moderator && !access.org_name) return t('Équipe ActuWorld', 'ActuWorld team');
  const labels: Record<string, string> = {
    discovery: t('Découverte', 'Discovery'),
    beta: t('Bêta', 'Beta'),
    pro: 'Pro',
    team: t('Rédaction', 'Newsroom'),
    staff: t('Équipe ActuWorld', 'ActuWorld team'),
  };
  return labels[access.plan ?? ''] ?? '—';
}

/** Fonctions ouvertes par la formule (repli sur la formule si l'API ne les envoie pas). */
export function featuresOf(access: Pick<ProAccess, 'plan' | 'features'>): ProFeatures {
  const paid = !!access.plan && access.plan !== 'discovery';
  // Retoucher avant de vérifier : ouvert à toutes les formules, Découverte comprise.
  const edit = !!access.plan;
  if (access.features) return { ...access.features, edit: access.features.edit ?? edit };
  return { history: paid, export: paid, share: paid, review: paid, edit };
}
