# 🌐 Déploiement du site vitrine sur le VPS OVH (France)

Objectif : servir `actuworld.fr` depuis le **VPS OVH de Gravelines (France)** au lieu
de Vercel (US) → 100 % France/UE, et un pipeline de déploiement automatisé.

Architecture (identique à l'API et RECO-SRC) :

```
Internet ──► Nginx Proxy Manager (NPM, ports 80/443, SSL Let's Encrypt)
                 │  proxy host: actuworld.fr ──► site-actuworld:80
                 ▼
          conteneur "site-actuworld" (nginx servant le build Vite statique)
                 (réseau Docker interne "app-network", aucun port publié)
```

---

## Ce qui est déjà fait (dans le repo)
- `actuworld-site/Dockerfile` — build Vite multi-stage → nginx alpine.
- `actuworld-site/nginx.conf` — SPA fallback + en-têtes sécurité + cache assets.
- `docker-compose.yml` — service `site` sur `app-network`, alias `site-actuworld`.
- `.github/workflows/deploy.yml` — build de garde-fou + SCP + `docker compose up` sur push `main`.

## Étapes manuelles (une seule fois)

### 1. Secrets GitHub (repo SITE)
Settings → Secrets and variables → Actions. Les 3 premiers existent déjà pour les autres repos (mêmes valeurs) :
- `VM_HOST` = `51.75.23.44` (ou `vps-b2c8c978.vps.ovh.net`)
- `VM_USER` = utilisateur SSH du VPS
- `SSH_PRIVATE_KEY` = clé privée de déploiement
- `VITE_GA_ID` = ton ID Google Analytics (ou laisser vide si pas d'analytics)
- `VITE_BREVO_API_KEY` = clé Brevo (formulaire waitlist/contact)

### 2. DNS (chez ton registrar du domaine actuworld.fr)
Faire pointer le domaine vers le VPS :
- `A`    `actuworld.fr`      → `51.75.23.44`
- `A`    `www.actuworld.fr`  → `51.75.23.44`
- `AAAA` `actuworld.fr`      → `2001:41d0:305:2100::e45c`
- `AAAA` `www.actuworld.fr`  → `2001:41d0:305:2100::e45c`

(Vérifier : `ping actuworld.fr` doit renvoyer `51.75.23.44`.)

### 3. Premier déploiement
Pousser sur `main` (le workflow tourne), OU manuellement sur le VPS :
```bash
cd /var/www/site-actuworld
docker network create app-network 2>/dev/null || true
export VITE_GA_ID=... VITE_BREVO_API_KEY=...
docker compose build && docker compose up -d
docker ps | grep site-actuworld   # doit être "Up"
```

### 4. Proxy host dans Nginx Proxy Manager
NPM → Hosts → Proxy Hosts → **Add Proxy Host** :
- Domain Names : `actuworld.fr`, `www.actuworld.fr`
- Forward Hostname : `site-actuworld`  (le nom/alias du conteneur sur app-network)
- Forward Port : `80`
- Block Common Exploits : ON · Websockets : OFF
- **Save** (sans SSL d'abord), vérifier que `http://actuworld.fr` répond.
- Puis onglet **SSL** → Request a new SSL Certificate → Force SSL + HTTP/2 → Save.

> ⚠️ Le pare-feu VPS doit laisser passer **80** et **443** (cf `api-actuWorld/docs/NPM-SSL-TROUBLESHOOTING.md`).

### 5. Couper Vercel
Une fois `https://actuworld.fr` servi par le VPS et vérifié, supprimer le projet/déploiement Vercel pour éviter deux sources. Puis je retire la mention « Vercel (US) » des pages légales → tout devient France/UE.

---

## Points d'attention
- **`@vercel/analytics`** a été **retiré** du code (`main.tsx`) car il ne fonctionne que sur Vercel — et la mention correspondante a été retirée de la politique de confidentialité. La mesure d'audience repose désormais sur **Google Analytics** (`VITE_GA_ID`, déposé après consentement via le bandeau cookies). Le package reste dans `package.json` (inoffensif, non importé) ; tu peux le retirer proprement plus tard avec `npm uninstall @vercel/analytics`.
- **Pré-rendu SEO** : laissé désactivé (pas de Chrome dans l'image de build), comme sur Vercel aujourd'hui. Pour l'activer un jour, builder avec `ENABLE_PRERENDER=true` dans une image contenant Chrome + libs.
- **`vercel.json`** devient inutile une fois hors Vercel (ses règles SPA/headers sont reprises dans `nginx.conf`). On peut le laisser ou le supprimer.
