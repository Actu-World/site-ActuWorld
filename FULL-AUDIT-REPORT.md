# Audit SEO Complet — actuworld.fr

**Date :** 9 mars 2026  
**URL :** https://www.actuworld.fr/  
**Type d'activité :** SaaS / EdTech — Réseau social d'information éducative vérifiée  
**Stack technique :** React SPA (Vite) + Vercel — 100% Client-Side Rendering  
**Pages analysées :** 6 (`/`, `/app`, `/pricing`, `/faq`, `/reco-src`, `/contact`)

---

## Score SEO Global : 24/100 🔴

| Catégorie | Poids | Score | Pondéré |
|-----------|-------|-------|---------|
| SEO Technique | 25% | 18/100 | 4.5 |
| Qualité de Contenu | 25% | 42/100 | 10.5 |
| SEO On-Page | 20% | 25/100 | 5.0 |
| Schema / Données Structurées | 10% | 0/100 | 0.0 |
| Performance (CWV) | 10% | 15/100 | 1.5 |
| Images | 5% | 30/100 | 1.5 |
| Visibilité IA (GEO) | 5% | 28/100 | 1.4 |
| **TOTAL** | **100%** | — | **24.4/100** |

---

## Résumé Exécutif

### 🔴 Top 5 problèmes critiques

1. **100% Client-Side Rendering (CSR)** — Le serveur renvoie un shell HTML vide (`<div id="root"></div>`) pour toutes les URLs. Googlebot peut rendre le JS avec un délai important, mais les crawlers IA (GPTBot, PerplexityBot, ClaudeBot) ne verront rien.
2. **Pas de robots.txt ni de sitemap.xml** — Les deux URLs retournent le shell HTML SPA au lieu de fichiers valides. Les moteurs de recherche n'ont aucune directive de crawl.
3. **Titre et description identiques sur toutes les pages** — Le HTML source contient le même `<title>` et `<meta description>` pour toutes les routes. Aucune différenciation.
4. **Aucune balise H1 sur aucune page** — Le composant `H2` rend toujours un `<h2>`. Aucune page n'a de H1.
5. **Zéro données structurées (Schema.org)** — Pas de JSON-LD, Microdata ou RDFa sur aucune page. Aucun rich result possible.

### ✅ Top 5 quick wins (impact rapide)

1. Ajouter `robots.txt` + `sitemap.xml` dans le dossier `/public` (30 min)
2. Ajouter `PageMeta` (titre, description, canonical, OG) aux 3 pages manquantes (`/app`, `/pricing`, `/contact`) (1h)
3. Corriger le composant H2 pour permettre un H1 par page (30 min)
4. Injecter les schemas Organization + WebSite dans `index.html` (30 min)
5. Configurer les headers de sécurité et le cache des assets dans `vercel.json` (30 min)

---

## 1. SEO Technique — 18/100 🔴

### Crawlabilité — 10/100

| Sévérité | Problème | Détails |
|----------|----------|---------|
| **CRITIQUE** | Pas de robots.txt | `/robots.txt` retourne le shell HTML SPA |
| **CRITIQUE** | Pas de sitemap XML | `/sitemap.xml` retourne le shell HTML SPA |
| **CRITIQUE** | Pas de contenu crawlable dans le HTML | Le serveur renvoie un `<div id="root"></div>` vide |
| **HAUTE** | Aucun lien interne dans le HTML source | Zéro `<a href>` dans le HTML brut |
| **MOYENNE** | Pas de gestion des crawlers IA | Aucune règle pour GPTBot, ClaudeBot, PerplexityBot |

### Indexabilité — 5/100

| Sévérité | Problème | Détails |
|----------|----------|---------|
| **CRITIQUE** | Pas de balise canonical | Aucun `<link rel="canonical">` dans le HTML |
| **CRITIQUE** | HTML identique sur toutes les URLs | Même ETag, même contenu pour les 6 pages + robots.txt + sitemap.xml |
| **CRITIQUE** | Même `<title>` partout | Toutes les pages : "ActuWorld — L'information vérifiée par tous..." |
| **CRITIQUE** | Même `<meta description>` partout | Description identique sur chaque URL |
| **HAUTE** | Pas de meta robots | Pas de `<meta name="robots">` explicite |
| **HAUTE** | Pas de balises Open Graph | Pas de `og:title`, `og:description`, `og:image` |
| **MOYENNE** | Trailing slash non normalisé | `/pricing` et `/pricing/` retournent tous les deux 200 |

### Sécurité — 50/100

**Ce qui fonctionne :**
- ✅ HTTPS forcé (HTTP → HTTPS 308)
- ✅ HSTS activé (`max-age=63072000`)
- ✅ Certificat SSL valide (Let's Encrypt)
- ✅ Redirection non-www → www

**Manquant :**

| Sévérité | Problème |
|----------|----------|
| **HAUTE** | Pas de Content-Security-Policy (CSP) |
| **HAUTE** | Pas de X-Frame-Options |
| **MOYENNE** | Pas de X-Content-Type-Options |
| **MOYENNE** | Pas de Referrer-Policy |
| **MOYENNE** | Pas de Permissions-Policy |

### Structure URLs — 55/100

- ✅ URLs propres et courtes (`/reco-src`, `/pricing`, `/faq`)
- ✅ Hiérarchie plate et logique
- ⚠️ Redirection non-www → www en 307 (devrait être 301/308)
- ⚠️ `/favicon.ico` retourne du HTML

### Rendu JavaScript — 5/100

| Sévérité | Problème |
|----------|----------|
| **CRITIQUE** | 100% CSR — aucun contenu pré-rendu |
| **CRITIQUE** | Pas de SSR ni SSG |
| **HAUTE** | Bundle JS monolithique de 438 Ko (pas de code splitting) |
| **HAUTE** | Même HTML pour toutes les routes |

**Stack détectée :** React + Vite + React Router + Tailwind CSS

---

## 2. Qualité de Contenu — 42/100 🟠

### Analyse par page

| Page | Mots estimés | Minimum | Statut | H1 | PageMeta |
|------|-------------|---------|--------|-----|----------|
| `/` (Accueil) | ~350 | 500 | ⚠️ SOUS SEUIL | ❌ | ✅ |
| `/app` | ~550 | 800 | ⚠️ SOUS SEUIL | ❌ | ❌ MANQUANT |
| `/pricing` | ~300 | 500 | ⚠️ SOUS SEUIL | ❌ | ❌ MANQUANT |
| `/faq` | ~900 | 800 | ✅ OK | ❌ | ✅ |
| `/reco-src` | ~1 000 | 800 | ✅ OK | ❌ | ✅ |
| `/contact` | ~200 | 300 | ⚠️ SOUS SEUIL | ❌ | ❌ MANQUANT |

**4 pages sur 6 sont sous les seuils de contenu minimum.**

### E-E-A-T — 33/100

| Facteur | Score | Signaux clés |
|---------|-------|--------------|
| **Experience** | 8/25 | Un seul user journey ("Emma"). Pas de témoignages, pas de cas réels |
| **Expertise** | 10/25 | Explication technique ASV solide. Mais : pas de page équipe, pas de credentials |
| **Authoritativeness** | 5/25 | Aucune citation externe, pas de mentions presse, lien "Presse" pointe vers `#` |
| **Trustworthiness** | 10/25 | HTTPS OK. Mais : email Outlook (pas domaine), privacy/terms pointent vers `#`, pas d'entité légale |

### Points forts du contenu
- ✅ Page `/reco-src` (ASV) est la meilleure page — exemple concret de cherry-picking, bien structurée
- ✅ FAQ bien organisée en 3 sections (Général, ASV, Créateurs) avec 14 questions
- ✅ Parcours utilisateur "Emma" — narrative engageante
- ✅ Message de marque clair et différenciant

### Problèmes majeurs de contenu
- ❌ Pas de page "À propos" / Équipe
- ❌ Pas de section blog/ressources
- ❌ Pas de témoignages ni de preuve sociale
- ❌ Privacy Policy et CGU = liens morts (`#`)
- ❌ Email non professionnel (`actuworld.app@outlook.fr` au lieu de `contact@actuworld.fr`)
- ❌ Incohérence de domaine dans les canonical (`actuworld.app` vs `actuworld.fr`)

---

## 3. SEO On-Page — 25/100 🔴

### Balises Title

| Page | Title serveur | Title JS | Longueur |
|------|--------------|----------|----------|
| `/` | "ActuWorld — L'information vérifiée..." | ✅ | 62 chars ✅ |
| `/app` | Identique | ❌ Pas de PageMeta | — |
| `/pricing` | Identique | ❌ Pas de PageMeta | — |
| `/faq` | Identique | ✅ | OK |
| `/reco-src` | Identique | ✅ | OK |
| `/contact` | Identique | ❌ Pas de PageMeta | — |

### Balises H1

**Aucune page n'a de H1.** Le composant React `H2` rend systématiquement un `<h2>`.

### Liens internes

| Page | Liens internes | Évaluation |
|------|---------------|------------|
| `/` | 2 | ⚠️ FAIBLE |
| `/app` | 1 | ⚠️ TRÈS FAIBLE |
| `/pricing` | 2 | ⚠️ FAIBLE |
| `/faq` | 1 | ⚠️ FAIBLE |
| `/reco-src` | 2 | OK |
| `/contact` | 4 | ✅ BON |

---

## 4. Schema / Données Structurées — 0/100 🔴

**Aucun markup Schema.org détecté sur aucune page.**

### Schemas recommandés (prêts à implémenter)

| Priorité | Type | Page(s) | Rich Result |
|----------|------|---------|-------------|
| **P0** | `Organization` | Toutes (`index.html`) | Knowledge Panel |
| **P0** | `WebSite` | Toutes (`index.html`) | Sitelinks Searchbox |
| **P1** | `SoftwareApplication` | `/app` | Fiche logiciel |
| **P1** | `SoftwareApplication` | `/reco-src` | Fiche outil ASV |
| **P1** | `Product` + `Offer` (×3) | `/pricing` | Résultats produit |
| **P1** | `BreadcrumbList` | Toutes | Fil d'Ariane SERP |
| **P2** | `WebPage` | `/`, `/faq` | — |
| **P2** | `ContactPage` | `/contact` | — |

> ⚠️ **Ne PAS utiliser `FAQPage`** — Depuis août 2023, ce schema est restreint aux sites gouvernementaux et de santé.

### JSON-LD à injecter dans `index.html` (immédiat)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ActuWorld",
  "url": "https://www.actuworld.fr",
  "logo": "https://www.actuworld.fr/logo.svg",
  "description": "Réseau social éducatif de l'information vérifiée",
  "foundingDate": "2024",
  "email": "actuworld.app@outlook.fr",
  "sameAs": ["https://instagram.com/actuworld8"]
}
</script>
```

```json
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

---

## 5. Performance (Core Web Vitals) — 15/100 🔴

| Métrique | Estimation | Seuil "Bon" | Statut |
|----------|-----------|-------------|--------|
| **LCP** | >4s (mobile) | <2.5s | 🔴 Mauvais |
| **INP** | >200ms (hydratation React) | <200ms | 🔴 Mauvais |
| **CLS** | >0.1 (contenu pop-in JS) | <0.1 | 🟠 À risque |

### Problèmes identifiés

| Sévérité | Problème |
|----------|----------|
| **CRITIQUE** | LCP dépend du téléchargement + exécution de 438 Ko de JS |
| **CRITIQUE** | Cache-Control des assets : `max-age=0, must-revalidate` au lieu de `immutable` |
| **HAUTE** | Bundle JS monolithique — pas de code splitting |
| **HAUTE** | Google Fonts CSS bloque le rendu |
| **HAUTE** | INP probable >200ms (hydratation React avec gros bundle) |
| **MOYENNE** | Pas de `<link rel="preload">` pour les ressources critiques |

### Recommandation cache `vercel.json`

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 6. Images — 30/100 🟠

- 1 seule image détectée : `phone_img-DCHsEiW7.jpg` sur `/app`
- Alt text : "Post nature" — **trop générique**, devrait décrire le screenshot de l'app
- Pas d'images sur les autres pages
- Format : JPG (devrait être WebP/AVIF)
- Pas de `<img>` dans le HTML source (tout rendu par JS)
- Pas de `loading="lazy"` vérifable côté serveur

### Recommandations
- Convertir en WebP avec fallback JPG
- Ajouter des alt text descriptifs (ex: "Capture d'écran du fil d'actualités ActuWorld avec un post sourcé sur la biodiversité")
- Ajouter des images sur la homepage (illustrations du fonctionnement, screenshots)
- Ajouter des photos d'équipe sur une future page "À propos"

---

## 7. Visibilité IA (GEO) — 28/100 🔴

| Critère | Score | Notes |
|---------|-------|-------|
| Faits/stats citables | 3/15 | Seulement ~4 stats sur tout le site |
| Données structurées | 0/20 | Zéro JSON-LD |
| Hiérarchie H1/H2/H3 | 8/15 | Bons H2/H3 mais aucun H1 |
| Format "réponse directe" | 5/15 | FAQ OK, autres pages manquent |
| Tableaux/listes | 5/10 | Listes de features bien structurées |
| Citations de sources | 2/10 | Exemple Le Monde OK, mais aucune source pour les propres claims |
| Clarté entité | 5/15 | Nom de marque clair, mais pas de page équipe |

### Problèmes IA spécifiques
- Les crawlers IA (GPTBot, ClaudeBot, PerplexityBot) ne peuvent **pas lire le contenu** — le site est 100% CSR
- Pas de fichier `llms.txt`
- Pas de gestion des crawlers IA dans robots.txt

---

## Headers de sécurité recommandés (`vercel.json`)

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
