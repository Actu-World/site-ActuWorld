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
    updateOrCreateMetaTag('property', 'og:url', `https://actuworld.app${path}`);
    updateOrCreateMetaTag('property', 'og:image', `https://actuworld.app${image}`);
    updateOrCreateMetaTag('property', 'og:type', 'website');

    // Update Twitter tags
    updateOrCreateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateOrCreateMetaTag('name', 'twitter:title', title);
    updateOrCreateMetaTag('name', 'twitter:description', description);
    updateOrCreateMetaTag('name', 'twitter:image', `https://actuworld.app${image}`);

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `https://actuworld.app${path}`);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = `https://actuworld.app${path}`;
      document.head.appendChild(link);
    }
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
