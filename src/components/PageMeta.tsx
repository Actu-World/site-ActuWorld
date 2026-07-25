import { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description: string;
  path: string;
  image?: string;
}

export function PageMeta({ title, description, path, image = '/og-image.png' }: PageMetaProps) {
  useEffect(() => {
    // Update title
    document.title = `${title} — ActuWorld`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update Open Graph tags
    updateOrCreateMetaTag('property', 'og:title', title);
    updateOrCreateMetaTag('property', 'og:description', description);
    updateOrCreateMetaTag('property', 'og:url', `https://www.actuworld.fr${path}`);
    updateOrCreateMetaTag('property', 'og:image', `https://www.actuworld.fr${image}`);
    updateOrCreateMetaTag('property', 'og:type', 'website');

    // Update Twitter tags
    updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('name', 'twitter:title', title);
    updateOrCreateMetaTag('name', 'twitter:description', description);
    updateOrCreateMetaTag('name', 'twitter:image', `https://www.actuworld.fr${image}`);

    // /studio* : outil privé (connexion + éditeur), à exclure des moteurs.
    // On émet un robots noindex et AUCUN canonical pour ces pages ; hors
    // /studio on retire le noindex (navigation SPA) et on gère le canonical.
    const isStudio = path.startsWith('/studio');
    const robotsMeta = document.querySelector('meta[name="robots"]');
    const canonical = document.querySelector('link[rel="canonical"]');
    if (isStudio) {
      if (robotsMeta) {
        robotsMeta.setAttribute('content', 'noindex');
      } else {
        updateOrCreateMetaTag('name', 'robots', 'noindex');
      }
      if (canonical) canonical.remove();
    } else {
      if (robotsMeta) robotsMeta.remove();
      // Update canonical URL
      if (canonical) {
        canonical.setAttribute('href', `https://www.actuworld.fr${path}`);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = `https://www.actuworld.fr${path}`;
        document.head.appendChild(link);
      }
    }

    // Signal au pré-rendu (build ENABLE_PRERENDER) que le contenu de la route est
    // monté et que les balises <head> sont à jour : le renderer Puppeteer capture
    // le HTML sur cet événement (voir vite.config.ts -> renderAfterDocumentEvent).
    // requestAnimationFrame garantit un premier paint avant la capture.
    const raf = requestAnimationFrame(() => {
      document.dispatchEvent(new Event('prerender-ready'));
    });
    return () => cancelAnimationFrame(raf);
  }, [title, description, path, image]);

  return null;
}

function updateOrCreateMetaTag(attr: string, attrValue: string, content: string) {
  let meta = document.querySelector(`meta[${attr}="${attrValue}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, attrValue);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}
