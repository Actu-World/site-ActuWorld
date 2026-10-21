# SITE-Actuworld

Site vitrine `actuworld.fr` (React + Vite + Tailwind), avec le Studio rédaction (`/studio`, éditeur web pour les créateurs).

## Arborescence

```
SITE-Actuworld/
├── actuworld-site/
│   ├── src/
│   │   ├── pages/          # Une page par route (accueil, app, tarifs, FAQ, légal, studio/…)
│   │   ├── components/     # Composants partagés
│   │   ├── lib/            # Client Supabase et API pour le Studio, helpers
│   │   ├── hooks/, i18n/, types/
│   │   └── assets/         # Visuels importés par les pages
│   ├── public/             # Favicons, OG, robots, sitemap, llms.txt, logos partenaires
│   ├── DESIGN.md           # Design system du site (référence unique)
│   ├── Dockerfile          # Build Vite puis nginx (nginx.conf)
│   └── .env.example        # VITE_GA_ID + surcharges Studio pour un env local
├── docker-compose.yml      # Conteneur site-actuworld sur app-network (derrière NPM)
└── .github/workflows/      # Déploiement auto sur push main
```

## Démarrage local

```bash
cd actuworld-site
npm install
cp .env.example .env
npm run dev
```

`npm run build` enchaîne `tsc -b` et `vite build` ; `npm run lint` lance ESLint.

## Déploiement

Chaque push sur `main` copie `actuworld-site/` et `docker-compose.yml` sur le VPS OVH (`/var/www/site-actuworld`), rebuild l'image avec `VITE_GA_ID` en build-arg et recrée le conteneur. Nginx Proxy Manager fait le routage et le SSL vers `site-actuworld:80`.
