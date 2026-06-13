# Statut Narratif des Pages — actuworld.fr

**Date de mise à jour :** Mai 2026  
**Périmètre :** `SITE-Actuworld/actuworld-site/src/pages/`  
**Référentiel :** `FICHE-REPOSITIONNEMENT-TEXTES.md`

---

## Promesse centrale à respecter sur toutes les pages

| Étape | Texte de référence |
|---|---|
| **Promesse** | "Partage des infos. Prouve qu'elles sont vraies." |
| **Mécanique** | "Chaque post cite sa source, l'IA vérifie le contexte, la communauté attribue un score." |
| **Preuve** | "Lauréat Valio'Tech · accompagné PEPITE · infrastructure en Europe (Paris) · RGPD by design" |

**Ton :** toujours "pour" (affirmation, crédibilité) — jamais "contre" (peur, lutte, manipulation).

---

## Légende

| Indicateur | Sens |
|---|---|
| ✅ | Aligné avec la promesse |
| ⚠️ | Partiellement aligné — ajustement léger |
| ❌ | Non aligné — réécriture nécessaire |

---

## Pages

---

### 1. HomePage — `/`
**Fichier :** `pages/HomePage.tsx`  
**Rôle narratif :** Première impression. Doit installer la promesse en moins de 5 secondes, capturer l'inscription beta.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | "ActuWorld — L'information vérifiée par tous, accessible à tous" | "ActuWorld — Partage des infos. Prouve qu'elles sont vraies." | ⚠️ |
| Meta description | "Le réseau social de l'information fiable où chaque publication est sourcée" | Intégrer le triptyque promesse/mécanique/preuve | ⚠️ |
| H1 | "L'information fiable **enfin mise en avant**" | "Partage des infos. **Prouve qu'elles sont vraies.**" | ❌ |
| Paragraphe hero | "ActuWorld réinvente la façon dont nous nous informons…" | "Sur ActuWorld, chaque publication cite sa source. Notre IA vérifie que la source n'est pas sortie de son contexte, puis la communauté lui attribue un score de confiance visible." | ❌ |
| CTA principal | À vérifier | "Rejoindre la beta privée" | ⚠️ |
| CTA secondaire | À vérifier | "Voir comment le score fonctionne" | ⚠️ |
| Section Problèmes | "Désinformation incontrôlée", "Absence de sourcage" — ton peur | Basculer vers ton transformation : "Publier avec certitude", "Des preuves visibles en 3 secondes" | ❌ |
| Chips sous hero | Absentes | "Source obligatoire · Score visible (0-100) · Lecture gratuite" | ❌ |
| Barre de preuves | Absente | "Lauréat Valio'Tech · PEPITE · Europe · RGPD by design" | ❌ |
| Bloc fondateur | Absent | 5-6 lignes, 1 photo, CTA "Lire notre vision" | ❌ |

**Priorité de correction : 🔴 Critique**

---

### 2. ActuWorldLanding — `/` (landing alternative) ou route dédiée
**Fichier :** `pages/ActuWorldLanding.tsx`  
**Rôle narratif :** Landing secondaire d'acquisition. Doit détailler la mécanique et convaincre les sceptiques. Public : 18-35 ans cherchant une alternative éthique.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | "ActuWorld — Le réseau social de l'information fiable" | "ActuWorld — Le seul réseau où publier, c'est prouver." | ❌ |
| Meta description | "combat la désinformation avec le sourcing obligatoire…" | Supprimer "combat" — reformuler en affirmation | ❌ |
| Badge hero | À vérifier | "Le réseau du sourcing citoyen" | ⚠️ |
| H1 | À vérifier | "Le seul réseau où publier, c'est prouver." | ❌ |
| Paragraphe hero | À vérifier | "ActuWorld n'ajoute pas une correction après coup : la preuve est demandée avant publication." | ❌ |
| Section Problèmes | "Désinformation incontrôlée" · "Aucune vérification des sources" · "Créateurs mal rémunérés" — ton négatif | → "Publier avec certitude" · "Des preuves visibles en 3 secondes" · "Des créateurs qui gagnent en crédibilité" | ❌ |
| Features | OK sur le fond (sourcing, score, ASV) | Harmoniser le vocabulaire : "Prouver" plutôt que "vérifier les sources" | ⚠️ |
| Différenciateurs | "Monétisation éthique", "IA intégrée" — bons | OK, garder | ✅ |

**Priorité de correction : 🔴 Critique**

---

### 3. AppPage — `/app`
**Fichier :** `pages/AppPage.tsx`  
**Rôle narratif :** Présentation de la plateforme. Doit expliquer concrètement ce qu'on fait sur l'app (publier, sourcer, scorer) et donner envie de rejoindre la beta.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | "La Plateforme — Réseau social de l'information fiable" | "L'app — Publie. Source. Prouve." | ❌ |
| Meta description | "Découvrez ActuWorld : sourcing obligatoire, score de confiance…" | Intégrer la promesse de façon active | ⚠️ |
| H1 | À vérifier | Ancrer sur la promesse utilisateur : "Publie avec preuves. Gagne en crédibilité." | ❌ |
| Features | Sourcing obligatoire, Confiance communautaire, Catégorisation, ASV, Lecture gratuite | Bon fond · Reformuler les titres en bénéfices utilisateur | ⚠️ |
| Différenciateurs | "IA intégrée", "Validé par la communauté", "Monétisation éthique" | OK — Ajouter la barre de preuves institutionnelles | ⚠️ |
| CTA | "Rejoindre la beta" | Uniformiser : "Rejoindre la beta privée" | ⚠️ |

**Priorité de correction : 🟠 Haute**

---

### 4. RecoSrcPage — `/reco-src`
**Fichier :** `pages/RecoSrcPage.tsx`  
**Rôle narratif :** Page dédiée à l'outil ASV (Analyse Sémantique et Vérification). Doit expliquer l'outil sans jargon et positionner son bénéfice : "source cohérente, pas juste source présente".

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | À vérifier | "ASV — Vérifie que ta source dit vraiment ce que tu affirmes." | ❌ |
| Positionnement d'ouverture | Non présent / générique | "ASV t'aide à vérifier que la source soutient vraiment ce qui est affirmé. Pas juste 'source présente', mais 'source cohérente'." | ❌ |
| Feature "Détection Cherry-Picking" | Titre brut "Détection Cherry-Picking" | → "ASV détecte quand une source est utilisée hors contexte" + tooltip pour le terme | ❌ |
| Feature "Analyse Sémantique" | Jargon | → "ASV vérifie que la source dit bien ce que tu affirmes" | ⚠️ |
| Section piliers de scoring | Fiabilité source / Avis communauté / Sécurité site | OK sur le fond, bon vocabulaire | ✅ |
| USPs | "Vérification complète : sources + contenu" | OK · Harmoniser le ton "pour" | ⚠️ |

**Priorité de correction : 🟠 Haute**

---

### 5. FaqPage — `/faq`
**Fichier :** `pages/FaqPage.tsx`  
**Rôle narratif :** Lever les objections et clarifier la mission. Doit utiliser les Q/R pour renforcer la promesse, pas pour se défendre.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | À vérifier | "FAQ — ActuWorld · Vos questions sur la plateforme de sourcing citoyen" | ⚠️ |
| Q "Pourquoi le sourcing est-il obligatoire ?" | "C'est le cœur de notre mission. Cela combat la désinformation à la source…" | "Parce qu'ActuWorld est conçu pour publier avec preuve, pas pour corriger après coup. La source obligatoire transforme une simple opinion en information vérifiable." | ❌ |
| Q "Comment fonctionne le système de confiance ?" | "Les utilisateurs votent sur la qualité et fiabilité…" | "Chaque publication reçoit des votes de la communauté. Ces votes sont agrégés en score visible (0-100) pour donner un niveau de fiabilité lisible immédiatement." | ❌ |
| Q "ASV remplace-t-il les fact-checkers ?" | Réponse correcte dans l'esprit | Reformuler : commencer par l'affirmation d'usage, pas par "Non" | ⚠️ |
| Q "Qui peut devenir créateur ?" | "Tout le monde !" | OK · ajouter la notion de score et de crédibilité acquise | ⚠️ |
| Q "Quand ActuWorld sera-t-il disponible ?" | "Nous finalisons la bêta fermée" | OK · ajouter la CTA "Rejoindre la liste d'attente" | ⚠️ |

**Priorité de correction : 🟠 Haute**

---

### 6. PricingPage — `/pricing`
**Fichier :** `pages/PricingPage.tsx`  
**Rôle narratif :** Clarifier le modèle économique sans bloquer l'inscription. Doit rassurer sur la gratuité et positionner la valeur de chaque plan.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | À vérifier | "Tarifs — ActuWorld · Gratuit pour lire, gratuit pour publier." | ❌ |
| Intro pricing | Absente | "Commence gratuitement, publie avec preuves, et monte en puissance selon tes besoins." | ❌ |
| Plan Lecteur | Prix "0€", desc "Pour toujours" | OK | ✅ |
| Plan Créateur | Prix "0€", desc "Gratuit pour publier" | OK | ✅ |
| Plan ASV Pro | Titre OK · Sous-titre absent | Ajouter : "Vérification avancée pour médias, institutions et entreprises" | ⚠️ |
| CTA global | "Commencer gratuitement" | Uniformiser sur "Rejoindre la beta privée" | ⚠️ |

**Priorité de correction : 🟡 Moyenne**

---

### 7. ContactPage — `/contact`
**Fichier :** `pages/ContactPage.tsx`  
**Rôle narratif :** Convertir les visiteurs indécis. Doit rassurer et créer un sentiment de proximité avec l'équipe.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Meta title | À vérifier | "Contact — ActuWorld · On se parle ?" | ⚠️ |
| H1 / ouverture | À vérifier | Ton humain, direct · Mentionner la beta et l'accompagnement | ⚠️ |
| Liens réseaux | Instagram, X présents | Garder, vérifier URLs | ⚠️ |

**Priorité de correction : 🟡 Moyenne**

---

### 8. NewsletterPage — `/newsletter`
**Fichier :** `pages/NewsletterPage.tsx`  
**Rôle narratif :** Capture de leads newsletter. Doit vendre la valeur de la newsletter (ce que le lecteur reçoit, pourquoi ça vaut son email).

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Proposition de valeur | À vérifier | "Reçois chaque semaine les meilleurs contenus sourcés, les avancées du projet et les accès beta." | ❌ |
| Fréquence annoncée | À vérifier | Préciser : hebdo, bi-mensuel ? | ⚠️ |

**Priorité de correction : 🟡 Moyenne**

---

### 9. PressPage — `/press`
**Fichier :** `pages/PressPage.tsx`  
**Rôle narratif :** Dossier de presse. Doit présenter ActuWorld de façon claire et citable pour les journalistes.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Pitch 1 phrase | À vérifier | "ActuWorld est le premier réseau social où publier, c'est prouver : chaque post cite sa source, l'IA vérifie la cohérence, la communauté attribue un score." | ❌ |
| Chiffres clés | À vérifier | Lauréat Valio'Tech, accompagné PEPITE, liste d'attente X personnes | ⚠️ |
| Téléchargements | Kit presse disponible ? | Ajouter si absent | ⚠️ |

**Priorité de correction : 🟡 Moyenne**

---

### 10. PrivacyPage et TermsPage — `/privacy`, `/terms`
**Fichiers :** `pages/PrivacyPage.tsx`, `pages/TermsPage.tsx`  
**Rôle narratif :** Pages légales. Peuvent renforcer la confiance si elles soulignent "RGPD by design" et "infrastructure en Europe".

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Mention RGPD | À vérifier | Mentionner "Infrastructure hébergée en Europe (Paris), RGPD by design" dans l'intro | ⚠️ |

**Priorité de correction : 🟢 Faible**

---

### 11. NotFoundPage — `/404`
**Fichier :** `pages/NotFoundPage.tsx`  
**Rôle narratif :** Rebondir un visiteur perdu. Ton léger, CTA vers accueil ou beta.

| Élément | État actuel | Cible | Statut |
|---|---|---|---|
| Ton / message | À vérifier | Humour léger · "Cette page n'est pas sourcée… Retourne à l'accueil !" | ⚠️ |
| CTA | À vérifier | Vers `/` ou vers le formulaire d'inscription beta | ⚠️ |

**Priorité de correction : 🟢 Faible**

---

## Synthèse — Tableau de bord de cohérence narrative

| Page | Alignement global | Priorité |
|---|---|---|
| HomePage | ❌ Non aligné | 🔴 Critique |
| ActuWorldLanding | ❌ Non aligné | 🔴 Critique |
| AppPage | ⚠️ Partiel | 🟠 Haute |
| RecoSrcPage | ⚠️ Partiel | 🟠 Haute |
| FaqPage | ⚠️ Partiel | 🟠 Haute |
| PricingPage | ⚠️ Partiel | 🟡 Moyenne |
| ContactPage | ⚠️ À vérifier | 🟡 Moyenne |
| NewsletterPage | ❌ À vérifier | 🟡 Moyenne |
| PressPage | ❌ À vérifier | 🟡 Moyenne |
| PrivacyPage / TermsPage | ⚠️ Mineurs | 🟢 Faible |
| NotFoundPage | ⚠️ À vérifier | 🟢 Faible |

---

## Ordre d'exécution recommandé

### Sprint 1 — Critique (J1-J2)
1. `HomePage.tsx` — H1 + para hero + section problèmes → ton transformation
2. `ActuWorldLanding.tsx` — H1 + meta desc + section problèmes → ton affirmation

### Sprint 2 — Haut impact (J3-J5)
3. `AppPage.tsx` — H1 + meta title + harmoniser CTA
4. `RecoSrcPage.tsx` — Intro + renommer "Cherry-Picking" en texte accessible
5. `FaqPage.tsx` — 2 Q/R prioritaires (sourcing + système de confiance)

### Sprint 3 — Consolidation (J6-J7)
6. `PricingPage.tsx` — Intro + sous-titre ASV Pro
7. `ContactPage.tsx` — Vérifier ouverture et ton
8. `NewsletterPage.tsx` — Proposition de valeur
9. `PressPage.tsx` — Pitch 1 phrase + chiffres clés

### Sprint 4 — Finition
10. `PrivacyPage.tsx` / `TermsPage.tsx` — Mention RGPD by design
11. `NotFoundPage.tsx` — Ton + CTA

---

## Règles éditoriales transverses (rappel)

### ✅ Mots à utiliser
`Prouver` · `Source` · `Vérifié` · `Confiance` · `Score` · `Crédibilité` · `Partager sans doute` · `Tes preuves`

### ❌ Mots à bannir
`Fake news` · `Lutte contre` · `Désinformation incontrôlée` · `Plateforme responsable` · `Naïf / trompé` · `Combat`

### Structure obligatoire par page
1. **Promesse** — visible dans les 2 premiers écrans
2. **Mécanique** — expliquée sans jargon
3. **Preuve** — institutionnelle, technique ou réglementaire
4. **CTA unique** — "Rejoindre la beta privée" (principal) · "Comment ça marche" (secondaire)
