# Plan d'Actions SEO — actuworld.fr

**Score actuel : 24/100** → **Objectif : 75/100**

---

## 🔴 CRITIQUE — Blocage d'indexation (à faire immédiatement)

### 1. Implémenter le pré-rendu (SSR/SSG)
**Impact :** +30 points sur le score global  
**Problème :** Le site est 100% client-side rendered. Google voit un `<div id="root"></div>` vide. Les crawlers IA ne voient rien du tout.  
**Solution rapide :** Installer `vite-plugin-prerender` pour pré-rendre les 6 routes à la compilation :
```bash
npm install vite-plugin-prerender --save-dev
```
```js
// vite.config.js
import prerender from 'vite-plugin-prerender'
export default {
  plugins: [
    prerender({
      routes: ['/', '/app', '/pricing', '/faq', '/reco-src', '/contact'],
    }),
  ],
}
```
**Solution long terme :** Migrer vers Next.js (App Router) ou Vike (vite-plugin-ssr).

---

### 2. Créer `robots.txt` et `sitemap.xml`
**Impact :** Déblocage du crawl  
**Action :** Créer ces fichiers dans le dossier `public/` :

**`public/robots.txt`**
```
User-agent: *
Allow: /

Sitemap: https://www.actuworld.fr/sitemap.xml
```

**`public/sitemap.xml`**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.actuworld.fr/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.actuworld.fr/app</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.actuworld.fr/reco-src</loc><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.actuworld.fr/pricing</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.actuworld.fr/faq</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.actuworld.fr/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>
```

---

### 3. Ajouter `PageMeta` aux 3 pages manquantes
**Impact :** Chaque page a son propre titre, description et canonical  
**Pages concernées :** `/app`, `/pricing`, `/contact`

Titres recommandés :
- `/app` → "La Plateforme ActuWorld — Réseau social de l'information fiable"
- `/pricing` → "Tarifs ActuWorld — Lecture gratuite, création accessible"
- `/contact` → "Contact — Rejoindre ActuWorld"

---

### 4. Corriger le H1 sur toutes les pages
**Impact :** Chaque page a une balise H1 unique  
**Problème :** Le composant `H2` rend systématiquement `<h2>`. Aucune page n'a de H1.  
**Action :** Modifier le composant ou ajouter un `<h1>` explicite au titre principal de chaque page.

---

### 5. Corriger l'incohérence de domaine canonical
**Impact :** Éviter la dilution SEO  
**Problème :** Le composant `PageMeta` génère des URLs `https://actuworld.app` mais le site est sur `https://www.actuworld.fr`.  
**Action :** Remplacer `actuworld.app` par `www.actuworld.fr` dans le composant `PageMeta`.

---

## 🟠 HAUTE PRIORITÉ — Impact fort (sous 1 semaine)

### 6. Injecter les schemas Organization + WebSite dans `index.html`
Voir les blocs JSON-LD dans le rapport complet.

### 7. Créer un composant `JsonLd` React pour les schemas par page
```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, [data]);
  return null;
}
```

### 8. Configurer `vercel.json` (sécurité + cache + trailing slash)
```json
{
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### 9. Créer les pages légales (Privacy Policy + CGU)
Les liens `#` dans le footer doivent pointer vers de vraies pages. Obligation légale + signal de confiance.

### 10. Créer une page "À propos / Équipe"
Essentiel pour les signaux E-E-A-T. Inclure : noms, rôles, photos, parcours, vision.

---

## 🟡 MOYENNE PRIORITÉ — Optimisation (sous 1 mois)

### 11. Étoffer le contenu des pages sous le seuil
- **Homepage :** +150 mots (stats, "comment ça marche", témoignages)
- **`/app` :** +250 mots (tableau comparatif vs autres plateformes)
- **`/pricing` :** +200 mots (plus de FAQ tarifs, matrice de features)
- **`/contact` :** +100 mots (formulaire de contact, infos légales)

### 12. Ajouter un blog / section ressources
Thèmes prioritaires : désinformation, vérification des sources, media literacy, intelligence collective.

### 13. Réduire le bundle JS
- Code splitting par route avec `React.lazy()` + `Suspense`
- Objectif : passer de 438 Ko monolithique à ~100-150 Ko par route

### 14. Optimiser les Google Fonts
- Self-host les polices OU ajouter `<link rel="preload">`
- Limiter à 2-3 font weights par famille (actuellement 9 fichiers chargés)

### 15. Améliorer les liens internes
Minimum 3-5 liens internes par page. Ajouter des liens contextuels dans les réponses FAQ et les descriptions de features.

### 16. Utiliser un email professionnel
Remplacer `actuworld.app@outlook.fr` par `contact@actuworld.fr` — signal de confiance majeur.

---

## 🟢 BASSE PRIORITÉ — Nice to have (backlog)

### 17. Ajouter des dates de contenu
Publication dates et "dernière mise à jour" sur chaque page.

### 18. Créer une page presse / media kit
Assets téléchargeables, mentions presse, logos.

### 19. Ajouter des témoignages / cas d'usage réels
Même des retours de beta testeurs suffisent.

### 20. Ajouter un fichier `llms.txt` pour les crawlers IA
Résumé structuré du site pour GPTBot, ClaudeBot, etc.

### 21. Rediriger non-www → www en 301/308
Actuellement en 307 (temporaire). Passer en redirect permanent.

### 22. Convertir les images en WebP/AVIF
Avec alt text descriptifs détaillés.

---

## Projection de score après implémentation

| Phase | Actions | Score estimé |
|-------|---------|-------------|
| **Actuel** | — | 24/100 |
| **Après actions critiques (1-5)** | Pré-rendu, robots.txt, sitemap, PageMeta, H1 | ~55/100 |
| **Après haute priorité (6-10)** | Schema, vercel.json, pages légales, à propos | ~70/100 |
| **Après moyenne priorité (11-16)** | Contenu enrichi, blog, perf, liens internes | ~85/100 |
| **Après basse priorité (17-22)** | Dates, presse, témoignages, llms.txt | ~90/100 |
