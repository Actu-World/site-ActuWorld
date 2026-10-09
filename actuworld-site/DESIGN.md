# Design system du site ActuWorld

Référence unique pour le site vitrine (`actuworld.fr`, hors `/studio`). Format inspiré
d'awesome-design-md ; règles issues de la Web Interface Guidelines (Vercel) et du
Taste / Redesign skill, adaptées à l'identité de l'app.

## 1. Atmosphère

Un journal sérieux, pas une startup qui brille. Fond papier chaud, vert forêt
ActuWorld, titres en Platypi comme dans l'app. La confiance vient de la sobriété :
pas de halo, pas de dégradé animé, pas d'effet « waouh » gratuit. Le produit
(carte de post, bouclier ASV, filet de confiance) est le seul élément graphique fort.

Réglages Taste : `DESIGN_VARIANCE 5` (asymétrie mesurée), `MOTION_INTENSITY 3`
(entrées discrètes, aucune boucle infinie), `VISUAL_DENSITY 3` (on respire).

## 2. Couleurs et rôles

Tokens dans `src/index.css` (`:root` et `.dark`). Ne jamais écrire un hex en dur
dans une page, sauf dans les aperçus produit (cartes de post) qui reproduisent l'app.

| Token | Clair | Sombre | Rôle |
|---|---|---|---|
| `--aw-bg` | `#FAF4EB` | `#0F1512` | fond de page |
| `--aw-surface` | `#F5E9DA` | `#1A2420` | sections alternées, panneaux |
| `--aw-text` | `#1B3528` | `#E8F0EC` | texte principal |
| `--aw-text-muted` | `#4A6B5A` | `#A0B8A8` | texte secondaire (AA sur bg et surface) |
| `--aw-primary` | `#2E5F4A` | `#A8D5BA` | **seul accent** : CTA, liens, éléments actifs |
| `--aw-primary-strong` | `#1B3528` | `#C9E6D4` | survol des CTA |
| `--aw-secondary` | `#94C9AA` | `#5A8A6A` | aplats doux, sélection |
| `--aw-accent` | `#00A896` | `#00D4BE` | petits signaux (jamais du texte sur fond clair : contraste 2,7) |
| `--aw-focus` | `#2E5F4A` | `#00D4BE` | anneau de focus (≥ 3:1) |
| `--aw-border` | vert 10 % | blanc 8 % | filets |

Couleurs sémantiques (feu tricolore ASV, cf. app `labels.py`) : vert `#16a34a`,
ambre `#f59e0b`, rouge `#dc2626`. Réservées aux scores et aux aperçus produit,
jamais en décoration.

Interdits : texte en dégradé, dégradé violet/bleu, halos flous (`blur-3xl` décoratif),
ombres noires pures, deuxième couleur d'accent sur un CTA.

## 3. Typographie

- **Platypi** (serif, 500/600/700) : `h1`, `h2`, `h3` et citations. Justifié : identité
  éditoriale de l'app (convention Platypi/Urbanist).
- **Urbanist** (sans, 400/500/600/700) : tout le reste. Pas de 800/900 sur le site.

| Rôle | Taille | Interlignage | Graisse | Classe |
|---|---|---|---|---|
| Hero | `clamp(2.25rem, 4vw, 3.25rem)` | 1.05 | 700, tracking -0.02em | `.display` |
| Titre de section | `clamp(1.75rem, 3.2vw, 2.5rem)` | 1.12 | 700, tracking -0.015em | `H2` |
| Titre de bloc | 1.25rem | 1.3 | 600 | `h3` |
| Chapeau | 1.125-1.25rem | 1.6 | 400, muted | `.lead` |
| Corps | 1rem | 1.6 | 400 | |
| Légende | 0.8125rem | 1.4 | 500 | `.caption` |
| Sur-titre | 0.8125rem | 1 | 600, majuscules, +0.08em | `.eyebrow` |

Règles : paragraphe ≤ 65 caractères (`max-w-prose`), `text-wrap: balance` sur les titres,
`pretty` sur les paragraphes, chiffres tabulaires pour les scores.
**Sur-titres : 1 pour 3 sections maximum.** Pas de numérotation « 01 · 02 ».

## 4. Composants

**Boutons** (rayon 12 px, une ligne, 3 mots max)
- `.btn-primary` : fond `--aw-primary`, texte `--aw-on-primary`. Survol : `--aw-primary-strong`.
  Appui : `translateY(1px)`. Pas de reflet, pas de halo.
- `.btn-outline` : filet `--aw-border`, survol filet `--aw-primary` + fond surface.
- `.btn-link` : lien texte + chevron, pour les actions tertiaires.
- Un seul libellé par intention sur une page (ex. tout lien vers `/app` = « Découvrir l'app »).

**Cartes** (rayon 20 px) : uniquement quand l'élévation a un sens. Fond surface, filet,
ombre teintée verte. Sinon : filets `divide-y` ou espace.

**Formulaires** : label visible au-dessus du champ, `autocomplete`, `type` correct,
`spellCheck={false}` sur l'e-mail, erreur sous le champ en `aria-live`, placeholder
d'exemple finissant par `…`.

**Navigation** : 64 px, une seule ligne, lien actif souligné. Footer : 2 groupes
(navigation, légal), pas de ferme de liens.

## 5. Mise en page

- Conteneur `max-w-6xl` (1152 px) pour le contenu, `max-w-7xl` pour la nav.
- Gouttière 20 px mobile, 32 px desktop.
- Sections : `py-20 md:py-28` (bas optiquement un peu plus grand si besoin).
- Une famille de mise en page par section : split hero, liste éditoriale, sticky-scroll,
  manifeste centré, portrait + citation, bandeau logos, panneau CTA. Pas deux fois la même.
- Pas de trio de cartes identiques. Chaque grille multi-colonnes déclare son repli mobile.

## 6. Profondeur

| Niveau | Usage | Valeur |
|---|---|---|
| 0 | sections | aucune ombre |
| 1 | cartes | `--aw-shadow-sm` |
| 2 | aperçus produit, panneau CTA | `--aw-shadow-lg` |

Ombres teintées vert sombre (`rgb(27 53 40 / x)`). Grain papier léger (SVG noise,
opacité 0.035) autorisé sur le fond, figé.

## 7. Mouvement

- Entrée au scroll : fondu + 16 px, 0,5 s, `ease-out-quint`, une fois.
- `MotionConfig reducedMotion="user"` à la racine + garde CSS `prefers-reduced-motion`.
- Animer `transform` et `opacity` seulement. Jamais `transition: all`.
- Aucune boucle infinie décorative (pas de flottement, pas de ping, pas de pulse).

## 8. Rédaction (FR)

- Tutoiement partout, y compris légal.
- Typographie française : `« … »`, espace insécable avant `: ; ? !`, `…` et non `...`,
  apostrophe typographique `'` acceptée.
- **Zéro tiret cadratin (—) ou demi-cadratin (–) comme ponctuation** : point, virgule,
  deux-points ou parenthèses. Séparateur de titre de page : ` | `.
- Pas de point d'exclamation dans les confirmations. Pas de « révolutionner », « booster »,
  « seamless », « next-gen ». Pas de chiffre non sourcé.
- Statut actuel : **bientôt sur l'App Store et Google Play**. On ne parle plus de « bêta » ;
  le formulaire sert à être prévenu de la sortie.
- Pas d'émoji.

## 9. Accessibilité

Focus visible (`:focus-visible`, anneau `--aw-focus`), lien d'évitement vers `#main`,
icônes décoratives `aria-hidden`, boutons icônes avec `aria-label`, images avec
`width`/`height`, contraste AA vérifié en clair et en sombre, `color-scheme` et
`theme-color` synchronisés avec le thème.
