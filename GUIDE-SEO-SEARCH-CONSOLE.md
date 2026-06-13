# Guide SEO — Être trouvé sur Google quand on tape « ActuWorld »

> Objectif : faire indexer `actuworld.fr` et apparaître pour la recherche de marque.
> Dernière mise à jour : juin 2026.

---

## 0. Pré-requis (déjà fait côté code ✅)
- `index.html` enrichi : titre, description, canonical, Open Graph + Twitter (en français)
  → la page d'accueil et les aperçus de liens sont corrects sans JavaScript.
- `og-image.png` (aperçu de partage 1200×630) créé.
- `robots.txt`, `sitemap.xml`, `llms.txt` à jour.
- Données structurées Organization + WebSite (avec lien Instagram) dans `index.html`.
- Site servi en SPA (fallback `vercel.json`) ; Google rend le JavaScript pour indexer les
  sous-pages et leurs balises propres.

> ℹ️ **Pré-rendu :** désactivé sur Vercel (l'environnement de build n'a pas les bibliothèques
> système requises par Chrome). Le SEO repose sur les balises statiques de `index.html` + le
> rendu JS de Google — suffisant pour un site de cette taille. Pour générer du HTML pré-rendu
> plus tard, lancer le build avec `ENABLE_PRERENDER=true` dans un environnement disposant de
> Chrome et de ses dépendances.

---

## 1. Google Search Console (LE point décisif)

### a) Accéder / vérifier la propriété
1. Va sur https://search.google.com/search-console
2. Connecte-toi avec ton compte Google.
3. Il y a déjà un fichier de vérification (`public/google9ebb4a10b83efae6.html`) → la propriété
   **`https://www.actuworld.fr`** est probablement déjà vérifiée. Vérifie qu'elle apparaît
   dans la liste des propriétés.
4. Si elle n'y est pas : « Ajouter une propriété » → **Préfixe d'URL** → `https://www.actuworld.fr`
   → méthode « Fichier HTML » (le fichier est déjà en ligne) → Valider.
   - Astuce : crée **aussi** une propriété « Domaine » (`actuworld.fr`) via un enregistrement
     DNS TXT — ça couvre www, non-www, http et https d'un coup.

### b) Soumettre le sitemap
1. Menu de gauche → **Sitemaps**.
2. Saisis `sitemap.xml` → **Envoyer**.
3. Statut attendu : « Réussite » sous quelques heures/jours.

### c) Forcer l'indexation de la page d'accueil
1. En haut, colle `https://www.actuworld.fr/` dans la barre **« Inspecter une URL »**.
2. Clique **« Demander une indexation »**.
3. Répète pour les pages clés : `/about`, `/app`, `/reco-src`, `/partenaires`.

### d) Surveiller (reviens dans 3–7 jours)
- **Pages** → vérifie que les URLs passent en « Indexée ».
- **Résultats de recherche** → tape « actuworld » pour suivre l'apparition et la position.
- L'indexation d'un site neuf prend **quelques jours à 2–3 semaines**. C'est normal.

---

## 2. Renforcer la marque « ActuWorld »
Le terme « actuworld » est utilisé par d'autres comptes ; il faut envoyer des signaux clairs
que `actuworld.fr` est LA référence.

1. **Instagram `@actuworld_fr`** : mets `https://www.actuworld.fr` en lien de bio.
   (Le site pointe déjà vers ton Insta → le lien doit être réciproque.)
2. **Cohérence du nom** partout : « ActuWorld » (un seul mot, A et W majuscules).
3. **Backlinks de départ** : annuaire de startups (ex. BetaList, Product Hunt à terme),
   ton école, médias partenaires (Territoire(s)), un article de blog qui te cite.
4. **Fiche Google Business** si pertinent (optionnel pour un produit en ligne).
5. Plus tard : créer une page Wikidata / demander des mentions presse → aide au « Knowledge Panel ».

---

## 3. Partage social (aperçus de liens)
- L'image `og-image.png` est en place → quand tu partages `actuworld.fr` sur WhatsApp / X /
  LinkedIn / iMessage, un bel aperçu s'affiche.
- Teste l'aperçu : https://www.opengraph.xyz/ (colle ton URL) ou le débogueur
  Facebook : https://developers.facebook.com/tools/debug/

---

## 4. À corriger plus tard (non bloquant)
- **Bannière cookies** : déjà en place ✅.
- Vérifier que le `og-image.png` s'affiche bien après déploiement (URL :
  `https://www.actuworld.fr/og-image.png`).
- Ajouter progressivement du contenu (FAQ, page À propos riche) — Google aime le contenu
  utile et régulier.

---

### Résumé : les 3 actions qui débloquent tout
1. **Search Console → soumettre le sitemap + demander l'indexation de la home.**
2. **Déployer** la version pré-rendue (vérifier que le build Vercel passe).
3. **Lien site ↔ Instagram** réciproque pour la cohérence de marque.
