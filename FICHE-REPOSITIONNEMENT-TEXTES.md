# Fiche de Repositionnement - Textes et Ajustements Site

Date: Mars 2026  
Perimetre: `SITE-Actuworld/actuworld-site`

## 1. Objectif
Remplacer un message "outil anti-desinformation" par une promesse orientee utilisateur:

**Promesse ancre:**
"Partage des informations. Prouve qu'elles sont vraies."

## 2. Regles editoriales (a appliquer partout)

### Mots a privilegier
- Prouver
- Source
- Verifie
- Confiance
- Score
- Partager sans doute
- Credibilite
- Tes preuves

### Mots a eviter
- Fake news
- Lutte contre
- Detection semantique contextuelle
- Plateforme responsable
- Naif / trompe

### Structure de message (toujours dans cet ordre)
1. Promesse
2. Mecanique
3. Preuve

Exemple:
- Promesse: "Partage des informations. Prouve qu'elles sont vraies."
- Mecanique: "Chaque post cite sa source, l'IA verifie le contexte, la communaute attribue un score."
- Preuve: "Projet laureat Valio'Tech, accompagne PEPITE, infrastructure hebergee en Europe."

## 3. Remplacements prioritaires (copier-coller)

## 3.1 Accueil principal
Fichier cible: `SITE-Actuworld/actuworld-site/src/pages/HomePage.tsx`

### Hero - H1
**Remplacer par:**
`Partage des infos. Prouve qu'elles sont vraies.`

### Hero - paragraphe
**Remplacer par:**
`Sur ActuWorld, chaque publication cite sa source. Notre IA verifie que la source n'est pas sortie de son contexte, puis la communaute lui attribue un score de confiance visible. Tu lis, publies et partages en sachant exactement a quoi t'en tenir.`

### CTA principal
**Texte:** `Rejoindre la beta privee`

### CTA secondaire
**Texte:** `Voir comment le score fonctionne`

### Chips sous hero
- `Source obligatoire`
- `Score visible (0-100)`
- `Lecture gratuite`

## 3.2 Landing ActuWorld
Fichier cible: `SITE-Actuworld/actuworld-site/src/pages/ActuWorldLanding.tsx`

### Badge hero
**Remplacer par:**
`Le reseau du sourcing citoyen`

### H1
**Remplacer par:**
`Le seul reseau ou publier, c'est prouver.`

### Paragraphe hero
**Remplacer par:**
`ActuWorld n'ajoute pas une correction apres coup: la preuve est demandee avant publication. Resultat: une information plus solide, des debats plus justes, et une parole qui gagne en credibilite.`

### Bloc "problemes"
Basculer d'un ton peur vers un ton transformation:
- Avant: "Desinformation incontrôlee"
- Apres: "Publier avec certitude"

- Avant: "Absence de sourcage"
- Apres: "Des preuves visibles en 3 secondes"

## 3.3 Page FAQ
Fichier cible: `SITE-Actuworld/actuworld-site/src/pages/FaqPage.tsx`

### Q/R a reecrire en priorite
Question:
`Pourquoi le sourcing est-il obligatoire ?`

Reponse proposee:
`Parce qu'ActuWorld est concu pour publier avec preuve, pas pour corriger apres coup. La source obligatoire transforme une simple opinion en information verifiable.`

Question:
`Comment fonctionne le systeme de confiance ?`

Reponse proposee:
`Chaque publication recoit des votes de la communaute. Ces votes sont agreges en score visible (0-100) pour donner un niveau de fiabilite lisible immediatement.`

## 3.4 Page ASV / RECO-SRC
Fichier cible: `SITE-Actuworld/actuworld-site/src/pages/RecoSrcPage.tsx`

### Positionnement d'ouverture
**Remplacer par:**
`ASV t'aide a verifier que la source soutient vraiment ce qui est affirme. Pas juste "source presente", mais "source coherente".`

### Eviter le jargon brut
- Eviter: `Detection cherry-picking` seul
- Preferer: `ASV detecte quand une source est utilisee hors contexte`

## 3.5 Page Tarifs
Fichier cible: `SITE-Actuworld/actuworld-site/src/pages/PricingPage.tsx`

### Intro pricing (a ajouter si absente)
`Commence gratuitement, publie avec preuves, et monte en puissance selon tes besoins.`

### Nom de plan B2B
- Garder `ASV Pro`
- Ajouter sous-titre: `Verification avancee pour medias, institutions et entreprises`

## 4. Ajustements non-textes (fort impact conversion)

1. Ajouter une barre de preuves sous le hero (desktop + mobile):
- `Laureat Valio'Tech`
- `Accompagne par PEPITE`
- `Infrastructure en Europe (Paris)`
- `RGPD by design`

2. Ajouter un compteur social proof des que disponible:
- `X personnes en liste d'attente beta`

3. Ajouter un bloc "Pourquoi ActuWorld existe" (histoire fondateur) sur l'accueil:
- Format court: 5-6 lignes, 1 photo, 1 CTA `Lire notre vision`

4. Uniformiser tous les CTA d'acquisition:
- CTA principal global: `Rejoindre la beta privee`
- CTA secondaire global: `Comment ca marche`

5. Ajouter une section audience (3 cartes) pour clarifier pour qui:
- Etudiants
- Createurs educatifs
- Enseignants / EMI

## 5. Plan de deploiement en 7 jours

Jour 1:
- Remplacer hero + CTA sur `HomePage.tsx`

Jour 2:
- Remplacer hero + sections clefs sur `ActuWorldLanding.tsx`

Jour 3:
- Reecriture FAQ prioritaire sur `FaqPage.tsx`

Jour 4:
- Clarifier messaging ASV sur `RecoSrcPage.tsx`

Jour 5:
- Harmoniser `PricingPage.tsx` avec la nouvelle promesse

Jour 6:
- Ajouter barre de preuves + bloc fondateur

Jour 7:
- QA mobile/desktop + coherence FR/EN

## 6. KPIs a suivre (avant/apres)
- CTR du bouton hero principal
- Taux d'inscription beta
- Taux de scroll jusqu'a section preuve
- Temps moyen sur page d'accueil
- Taux de clic vers `/reco-src`

## 7. Check final de coherence
Avant publication, verifier que chaque page respecte:
1. Promesse claire dans les 2 premiers ecrans
2. Mecanique expliquee sans jargon
3. Preuve visible (institutionnelle, technique, reglementaire)
4. CTA unique et coherent
5. Ton "pour" (affirmation, credibilite), jamais "contre"
