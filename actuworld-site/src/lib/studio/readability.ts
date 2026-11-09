// ASV 7.7 — message affiché sous une source du Studio selon la lecture d'essai de l'ASV.
import type { SourceReadability } from './journal';

export type ReadabilityNotice = { tone: 'ok' | 'info' | 'warning'; fr: string; en: string };

export function readabilityNotice(r: SourceReadability | null): ReadabilityNotice | null {
  if (!r) return null;
  if (r.readable && r.partial) {
    return { tone: 'info', fr: "Article réservé aux abonnés : l'ASV n'en lira que le début. Si tu peux, ajoute une source en accès libre.", en: 'Subscriber-only article: ASV will only read the beginning. If you can, add a free-access source.' };
  }
  if (r.readable) return { tone: 'ok', fr: "L'ASV pourra lire cette source.", en: 'ASV will be able to read this source.' };
  switch (r.state) {
    case 'not_found':
      return { tone: 'warning', fr: "Lien mort : vérifie l'adresse.", en: 'Dead link: check the address.' };
    case 'unsupported_type':
      return { tone: 'warning', fr: "Vidéo ou réseau social : l'ASV ne lit pas ce format. Ajoute plutôt un article qui rapporte les mêmes faits.", en: "Video or social network: ASV doesn't read this format. Add an article reporting the same facts instead." };
    case 'pdf_no_text':
      return { tone: 'warning', fr: "PDF scanné : l'ASV ne peut pas en lire le texte. Si tu peux, choisis une version en texte.", en: "Scanned PDF: ASV can't read its text. If you can, pick a text version." };
    case 'too_short':
      return { tone: 'warning', fr: "Page sans texte d'article : l'ASV n'y trouvera rien à vérifier.", en: 'Page without article text: ASV will find nothing to check.' };
    default:
      return { tone: 'warning', fr: "L'ASV ne pourra pas lire cette source (site protégé contre la lecture automatique) : elle sera notée « non vérifiable ». Si tu peux, choisis une autre source.", en: "ASV won't be able to read this source (site protected against automatic reading): it will be marked “not verifiable”. If you can, pick another source." };
  }
}
