# FICHE TECHNIQUE SEO — actuworld.fr
## Tous les points à améliorer / modifier

**Score actuel : 24/100** | **Objectif : 85+/100**  
**Stack : React 19 + Vite 7 + React Router 7 + Tailwind 4 + Vercel**  
**Répertoire : `SITE-Actuworld/actuworld-site/`**

---

## TABLE DES MATIÈRES

1. [CRITIQUE — Pré-rendu (SSR/SSG)](#1-critique--pre-rendu-ssrssg)
2. [CRITIQUE — Fichiers robots.txt + sitemap.xml](#2-critique--robotstxt--sitemapxml)
3. [CRITIQUE — Composant H2 → autoriser H1](#3-critique--composant-h2--autoriser-h1)
4. [CRITIQUE — PageMeta manquant (3 pages)](#4-critique--pagemeta-manquant-3-pages)
5. [CRITIQUE — Domaine canonical incorrect](#5-critique--domaine-canonical-incorrect)
6. [HAUTE — Données structurées JSON-LD](#6-haute--donnees-structurees-json-ld)
7. [HAUTE — vercel.json (sécurité + cache + slash)](#7-haute--verceljson-securite--cache--slash)
8. [HAUTE — Liens Footer morts (#)](#8-haute--liens-footer-morts-)
9. [HAUTE — Page "À propos / Équipe"](#9-haute--page-a-propos--equipe)
10. [HAUTE — Email professionnel](#10-haute--email-professionnel)
11. [MOYENNE — Contenu thin à étoffer](#11-moyenne--contenu-thin-a-etoffer)
12. [MOYENNE — Bundle JS monolithique](#12-moyenne--bundle-js-monolithique)
13. [MOYENNE — Google Fonts : optimisation](#13-moyenne--google-fonts-optimisation)
14. [MOYENNE — Liens internes insuffisants](#14-moyenne--liens-internes-insuffisants)
15. [MOYENNE — Image alt text + format](#15-moyenne--image-alt-text--format)
16. [BASSE — Dates, presse, llms.txt](#16-basse--dates-presse-llmstxt)

---

## 1. CRITIQUE — Pré-rendu (SSR/SSG)

**Problème :** Le serveur envoie un `<div id="root"></div>` vide pour TOUTES les URLs. Google, Bing et les crawlers IA ne voient aucun contenu sans exécuter JavaScript.

**Fichier :** `vite.config.ts`

**Contenu actuel :**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**À modifier :**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/vite'

export default defineConfig({
  plugins: [
    react(),
    prerender({
      routes: ['/', '/app', '/pricing', '/faq', '/reco-src', '/contact'],
    }),
  ],
})
```

**Installation :**
```bash
npm install @prerenderer/vite @prerenderer/renderer-puppeteer --save-dev
```

> **Alternative long terme :** Migrer vers **Next.js** (App Router) qui gère SSR/SSG nativement avec Vercel.

---

## 2. CRITIQUE — robots.txt + sitemap.xml

**Problème :** Les URLs `/robots.txt` et `/sitemap.xml` retournent le shell HTML SPA au lieu de vrais fichiers. Les moteurs de recherche n'ont aucune directive de crawl.

**Fichiers à créer dans `public/` :**

### `public/robots.txt`
```
User-agent: *
Allow: /

# AI Crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://www.actuworld.fr/sitemap.xml
```

### `public/sitemap.xml`
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

## 3. CRITIQUE — Composant H2 → autoriser H1

**Problème :** Le composant `H2` rend TOUJOURS un `<h2>`. Aucune page du site n'a de balise `<h1>`. C'est un signal critique pour les moteurs de recherche.

**Fichier :** `src/components/H2.tsx`

**Contenu actuel :**
```tsx
import React from 'react';

type Props = { kicker?: string; children: React.ReactNode; center?: boolean };

export const H2: React.FC<Props> = ({ kicker, children, center }) => (
  <div className={center ? 'text-center' : ''}>
    {kicker && (
      <p className="overline text-aw-primary mb-3">
        {kicker}
      </p>
    )}
    <h2 className="text-3xl md:text-4xl font-bold leading-tight">
      {children}
    </h2>
  </div>
);
```

**À modifier :**
```tsx
import React from 'react';

type Props = {
  kicker?: string;
  children: React.ReactNode;
  center?: boolean;
  as?: 'h1' | 'h2';
};

export const H2: React.FC<Props> = ({ kicker, children, center, as = 'h2' }) => {
  const Tag = as;
  return (
    <div className={center ? 'text-center' : ''}>
      {kicker && (
        <p className="overline text-aw-primary mb-3">
          {kicker}
        </p>
      )}
      <Tag className="text-3xl md:text-4xl font-bold leading-tight">
        {children}
      </Tag>
    </div>
  );
};
```

**Puis** dans chaque page, passer `as="h1"` au PREMIER `<H2>` de la page :
- `HomePage.tsx` → premier `<H2>` du hero
- `AppPage.tsx` → premier `<H2>`
- `PricingPage.tsx` → premier `<H2>`
- `FaqPage.tsx` → premier `<H2>`
- `RecoSrcPage.tsx` → premier `<H2>`
- `ContactPage.tsx` → premier `<H2>`

---

## 4. CRITIQUE — PageMeta manquant (3 pages)

**Problème :** `/app`, `/pricing` et `/contact` n'ont PAS de composant `PageMeta`. Elles n'ont donc aucun titre spécifique, description, canonical, ou balises OG.

**Pages avec PageMeta :** `HomePage.tsx` ✅, `FaqPage.tsx` ✅, `RecoSrcPage.tsx` ✅  
**Pages SANS PageMeta :** `AppPage.tsx` ❌, `PricingPage.tsx` ❌, `ContactPage.tsx` ❌

### `src/pages/AppPage.tsx` — Ajouter après l'ouverture de `<PageWrapper>` :
```tsx
import { PageMeta } from "../components/PageMeta";
// ... dans le return, juste après <PageWrapper ...> :
<PageMeta
  title="La Plateforme — Réseau social de l'information fiable"
  description="Découvrez ActuWorld : sourcing obligatoire, score de confiance communautaire, catégorisation thématique, ASV intégré. 100% gratuit en lecture."
  path="/app"
/>
```

### `src/pages/PricingPage.tsx` — Même logique :
```tsx
import { PageMeta } from "../components/PageMeta";
// ...
<PageMeta
  title="Tarifs — Lecture gratuite, création accessible"
  description="La lecture est et restera toujours gratuite. Pas de paywall sur le savoir. Découvrez les plans Lecteur, Créateur et ASV Pro."
  path="/pricing"
/>
```

### `src/pages/ContactPage.tsx` — Même logique :
```tsx
import { PageMeta } from "../components/PageMeta";
// ...
<PageMeta
  title="Contact — Rejoindre ActuWorld"
  description="Contactez l'équipe ActuWorld — créateurs, médias, éducateurs ou curieux. Rejoignez la bêta."
  path="/contact"
/>
```

---

## 5. CRITIQUE — Domaine canonical incorrect

**Problème :** Le composant `PageMeta` génère toutes les URLs avec `https://actuworld.app` au lieu de `https://www.actuworld.fr`.

**Fichier :** `src/components/PageMeta.tsx`

**Lignes à modifier (5 occurrences) :**

| Ligne | Actuel | Correct |
|-------|--------|---------|
| 26 | `https://actuworld.app${path}` | `https://www.actuworld.fr${path}` |
| 27 | `https://actuworld.app${image}` | `https://www.actuworld.fr${image}` |
| 34 | `https://actuworld.app${image}` | `https://www.actuworld.fr${image}` |
| 40 | `https://actuworld.app${path}` | `https://www.actuworld.fr${path}` |
| 44 | `https://actuworld.app${path}` | `https://www.actuworld.fr${path}` |

**Remplacement global :** Chercher `actuworld.app` → Remplacer par `www.actuworld.fr` dans ce fichier.

---

## 6. HAUTE — Données structurées JSON-LD

**Problème :** Zéro donnée structurée sur tout le site. Aucun rich result possible.

### 6a. Schema site-wide dans `index.html`

**Fichier :** `index.html` — Ajouter avant `</head>` :

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ActuWorld",
  "url": "https://www.actuworld.fr",
  "logo": "https://www.actuworld.fr/logo.svg",
  "description": "Réseau social éducatif de l'information vérifiée",
  "foundingDate": "2024",
  "sameAs": ["https://instagram.com/actuworld8"]
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ActuWorld",
  "url": "https://www.actuworld.fr",
  "inLanguage": "fr"
}
</script>
```

### 6b. Composant JsonLd réutilisable

**Fichier à créer :** `src/components/JsonLd.tsx`

```tsx
import { useEffect } from 'react';

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

### 6c. Schemas par page (à ajouter via `<JsonLd>`)

| Page | Schema type | Priorité |
|------|------------|----------|
| `/app` | `SoftwareApplication` (name: ActuWorld, price: 0, category: SocialNetworking) | P1 |
| `/reco-src` | `SoftwareApplication` (name: ASV, category: Utilities) | P1 |
| `/pricing` | `Product` + `Offer` × 3 plans | P1 |
| Toutes | `BreadcrumbList` | P1 |
| `/contact` | `ContactPage` | P2 |

---

## 7. HAUTE — vercel.json (sécurité + cache + slash)

**Fichier :** `vercel.json`

**Contenu actuel :**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**À remplacer par :**
```json
{
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
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

**Effets :**
- Normalise les trailing slashes (évite `/pricing/` et `/pricing` en doublon)
- Headers de sécurité (X-Frame-Options, CSP, Referrer, Permissions)
- Cache longue durée pour les assets hashés (JS/CSS/images)

---

## 8. HAUTE — Liens Footer morts (#)

**Fichier :** `src/components/Footer.tsx`

**Contenu actuel (lignes 34-38) :**
```tsx
<a href="#" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Privacy' : 'Confidentialité'}</a>
<a href="#" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Terms' : 'Conditions'}</a>
<a href="#" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Press' : 'Presse'}</a>
```

**À modifier :**
```tsx
<Link to="/privacy" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Privacy' : 'Confidentialité'}</Link>
<Link to="/terms" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Terms' : 'Conditions'}</Link>
<Link to="/press" className="hover:text-aw-primary transition-colors">{isEnglish ? 'Press' : 'Presse'}</Link>
```

**Puis créer les pages :**
- `src/pages/PrivacyPage.tsx` — Politique de confidentialité
- `src/pages/TermsPage.tsx` — Conditions générales d'utilisation
- `src/pages/PressPage.tsx` — Page presse / média kit

**Et ajouter les routes dans `App.tsx` :**
```tsx
<Route path="/privacy" element={<PrivacyPage />} />
<Route path="/terms" element={<TermsPage />} />
<Route path="/press" element={<PressPage />} />
```

---

## 9. HAUTE — Page "À propos / Équipe"

**Problème :** Aucune page n'identifie l'équipe. C'est un signal E-E-A-T critique (Expertise, Authoritativeness, Trustworthiness).

**À créer :**
- `src/pages/AboutPage.tsx`
- Route `/about` dans `App.tsx`
- Lien dans la Navbar et le Footer

**Contenu recommandé :**
- Noms + rôles + photos de l'équipe
- Mission et vision
- Historique du projet
- Liens LinkedIn/Twitter des fondateurs

---

## 10. HAUTE — Email professionnel

**Problème :** L'email `actuworld.app@outlook.fr` est utilisé partout. C'est un signal de confiance très négatif.

**Fichiers concernés :**
- `src/pages/ContactPage.tsx` (3 occurrences)
- `src/components/PageMeta.tsx` (si ajouté dans le schema Organization)
- `index.html` (si ajouté dans le JSON-LD)

**Action :** Configurer un email `contact@actuworld.fr` via le registrar du domaine ou un service email (Zoho Mail gratuit, Google Workspace, etc.). Puis remplacer toutes les occurrences.

---

## 11. MOYENNE — Contenu thin à étoffer

| Page | Mots actuels | Minimum | À ajouter |
|------|-------------|---------|-----------|
| `/` (Accueil) | ~350 | 500 | +150 mots : section stats, section "comment ça marche" en 3 étapes, section témoignages |
| `/app` | ~550 | 800 | +250 mots : tableau comparatif vs réseaux sociaux, plus de détails sur chaque feature |
| `/pricing` | ~300 | 500 | +200 mots : 3-5 questions FAQ supplémentaires, matrice comparative des plans |
| `/contact` | ~200 | 300 | +100 mots : formulaire de contact (au lieu du simple mailto), infos légales |

**Fichiers :** Chaque fichier de page dans `src/pages/`.

---

## 12. MOYENNE — Bundle JS monolithique

**Problème :** Un seul fichier `index-pKBSVFBP.js` de 438 Ko. Pas de code splitting. Chaque page charge l'intégralité de l'application.

**Fichier :** `src/App.tsx`

**Contenu actuel :**
```tsx
import HomePage from './pages/HomePage';
import AppPage from './pages/AppPage';
import RecoSrcPage from './pages/RecoSrcPage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
```

**À modifier (lazy loading par route) :**
```tsx
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));
const AppPage = lazy(() => import('./pages/AppPage'));
const RecoSrcPage = lazy(() => import('./pages/RecoSrcPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
```

Et wrapper les `<Routes>` avec :
```tsx
<Suspense fallback={<PageLoader isLoading={true} />}>
  <Routes>...</Routes>
</Suspense>
```

**Impact attendu :** Bundle initial réduit à ~100-150 Ko, chaque page chargée à la demande.

---

## 13. MOYENNE — Google Fonts : optimisation

**Problème :** 9 fichiers de polices chargés (Platypi 5 weights + Urbanist 4 weights). Bloque le rendu.

**Fichier :** `index.html`

**Contenu actuel :**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Platypi:wght@400;500;600;700;800&family=Urbanist:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**À modifier :**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Platypi:wght@500;700&family=Urbanist:wght@400;600&display=swap">
<link href="https://fonts.googleapis.com/css2?family=Platypi:wght@500;700&family=Urbanist:wght@400;600&display=swap" rel="stylesheet">
```

**Changements :**
- Ajout de `crossorigin` au premier `preconnect` (manquant actuellement)
- Réduction de 9 weights à 4 (Platypi 500+700, Urbanist 400+600)
- Ajout de `preload` pour charger les fonts en priorité

---

## 14. MOYENNE — Liens internes insuffisants

**Problème :** La plupart des pages ont 1-2 liens internes. Le minimum recommandé est 3-5.

| Fichier | Page | Liens actuels | Action |
|---------|------|--------------|--------|
| `HomePage.tsx` | `/` | 2 (→app, →reco-src) | Ajouter liens vers /pricing, /faq |
| `AppPage.tsx` | `/app` | 1 (→reco-src) | Ajouter liens vers /pricing, /faq, / |
| `PricingPage.tsx` | `/pricing` | 2 (→faq, →contact) | Ajouter liens vers /app, /reco-src |
| `FaqPage.tsx` | `/faq` | 1 (→contact) | Ajouter liens vers /app, /reco-src, /pricing dans les réponses |
| `RecoSrcPage.tsx` | `/reco-src` | 2 (→pricing, →contact) | Ajouter lien vers /app, /faq |

**Comment :** Ajouter des liens contextuels dans le texte existant (ex: dans les réponses FAQ, les descriptions de features, les sections CTA).

---

## 15. MOYENNE — Image alt text + format

**Fichier :** `src/pages/AppPage.tsx`

**Contenu actuel :**
```tsx
import phoneImg from "../assets/phone_img.jpg";
// ...
<img ... src={phoneImg} alt="Post nature" />
```

**À modifier :**
- Alt text → `"Capture d'écran du fil d'actualités ActuWorld avec un post sourcé sur la biodiversité"`
- Convertir `phone_img.jpg` en `phone_img.webp` (gain ~60% de taille)
- Ajouter `loading="lazy"` et `width`/`height` pour éviter le CLS

---

## 16. BASSE — Dates, presse, llms.txt

### 16a. Fichier `public/llms.txt`
```
# ActuWorld
> Réseau social éducatif de l'information vérifiée

## Description
ActuWorld est une plateforme où chaque publication est sourcée et évaluée par la communauté. Intègre ASV (Automatic Source Verification) pour détecter le cherry-picking.

## Pages principales
- Accueil : https://www.actuworld.fr/
- Plateforme : https://www.actuworld.fr/app
- ASV : https://www.actuworld.fr/reco-src
- Tarifs : https://www.actuworld.fr/pricing
- FAQ : https://www.actuworld.fr/faq
- Contact : https://www.actuworld.fr/contact
```

### 16b. Dates de contenu
Ajouter un `<time datetime="...">` avec une date de dernière mise à jour sur chaque page.

### 16c. PageLoader de 1.5s
**Fichier :** `src/App.tsx` — La ligne `setTimeout(() => { setIsLoading(false); }, 1500);` ajoute 1,5 seconde artificielle à chaque chargement. Réduire à 0 ou 300ms maximum.

---

## RÉCAPITULATIF DES FICHIERS À MODIFIER

| # | Fichier | Priorité | Action |
|---|---------|----------|--------|
| 1 | `vite.config.ts` | 🔴 CRITIQUE | Ajouter plugin prerender |
| 2 | `public/robots.txt` | 🔴 CRITIQUE | **CRÉER** |
| 3 | `public/sitemap.xml` | 🔴 CRITIQUE | **CRÉER** |
| 4 | `src/components/H2.tsx` | 🔴 CRITIQUE | Ajouter prop `as="h1"` |
| 5 | `src/pages/AppPage.tsx` | 🔴 CRITIQUE | Ajouter `PageMeta` + `as="h1"` sur premier H2 |
| 6 | `src/pages/PricingPage.tsx` | 🔴 CRITIQUE | Ajouter `PageMeta` + `as="h1"` |
| 7 | `src/pages/ContactPage.tsx` | 🔴 CRITIQUE | Ajouter `PageMeta` + `as="h1"` |
| 8 | `src/pages/HomePage.tsx` | 🔴 CRITIQUE | `as="h1"` sur premier H2 |
| 9 | `src/pages/FaqPage.tsx` | 🔴 CRITIQUE | `as="h1"` sur premier H2 |
| 10 | `src/pages/RecoSrcPage.tsx` | 🔴 CRITIQUE | `as="h1"` sur premier H2 |
| 11 | `src/components/PageMeta.tsx` | 🔴 CRITIQUE | Remplacer `actuworld.app` → `www.actuworld.fr` |
| 12 | `index.html` | 🟠 HAUTE | JSON-LD Organization + WebSite + fonts |
| 13 | `src/components/JsonLd.tsx` | 🟠 HAUTE | **CRÉER** composant |
| 14 | `vercel.json` | 🟠 HAUTE | Headers sécurité + cache + trailingSlash |
| 15 | `src/components/Footer.tsx` | 🟠 HAUTE | Remplacer liens `#` par vrais routes |
| 16 | `src/pages/PrivacyPage.tsx` | 🟠 HAUTE | **CRÉER** |
| 17 | `src/pages/TermsPage.tsx` | 🟠 HAUTE | **CRÉER** |
| 18 | `src/pages/AboutPage.tsx` | 🟠 HAUTE | **CRÉER** |
| 19 | `src/App.tsx` | 🟡 MOYENNE | Lazy loading routes + réduire PageLoader timer |
| 20 | Toutes les pages | 🟡 MOYENNE | Ajouter liens internes contextuels |
| 21 | `src/pages/AppPage.tsx` | 🟡 MOYENNE | Alt text image + format WebP |
| 22 | `public/llms.txt` | 🟢 BASSE | **CRÉER** |

---

## ORDRE D'IMPLÉMENTATION RECOMMANDÉ

```
Semaine 1 (CRITIQUE) :
  ├── robots.txt + sitemap.xml          → 30 min
  ├── PageMeta sur 3 pages manquantes   → 1h
  ├── Fix domaine canonical PageMeta    → 15 min
  ├── Composant H2 → H1 support        → 30 min
  ├── H1 sur chaque page               → 30 min
  └── Plugin prerender                  → 2h

Semaine 2 (HAUTE) :
  ├── JSON-LD dans index.html           → 30 min
  ├── Composant JsonLd + schemas pages  → 2h
  ├── vercel.json complet               → 30 min
  ├── Footer : liens réels              → 30 min
  ├── Pages Privacy + Terms (contenu)   → 3h
  └── Page À propos                     → 2h

Semaine 3-4 (MOYENNE) :
  ├── Lazy loading routes               → 1h
  ├── Optimisation fonts                → 30 min
  ├── Étoffement contenu pages          → 4h
  ├── Liens internes                    → 1h
  └── Image alt + WebP                  → 30 min
```
