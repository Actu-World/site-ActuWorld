# --- Build (Vite + pré-rendu Puppeteer) ---
# Image Debian (et non alpine) : Puppeteer télécharge un Chromium glibc lors du
# `npm ci`, et les libs système ci-dessous lui permettent de tourner pour générer
# le HTML pré-rendu (SEO). Cette lourdeur reste confinée à l'étage de build :
# l'image servie finale est nginx:alpine.
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Dépendances système requises par le Chromium de Puppeteer (rendu headless).
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates fonts-liberation \
      libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
      libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 \
      libgbm1 libpango-1.0-0 libcairo2 libasound2 libatspi2.0-0 libxext6 libx11-6 \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
# `npm ci` déclenche le téléchargement par Puppeteer de son Chromium (dans le cache
# du conteneur). On le garde activé : c'est ce binaire qu'utilise le pré-rendu.
RUN npm ci

COPY . .
# Variables VITE_ : inlinées au build (site statique). Fournies en build-args
# par le compose / la CI.
ARG VITE_GA_ID
ENV VITE_GA_ID=$VITE_GA_ID
# ENABLE_PRERENDER=true : génère un index.html par route avec le contenu + les
# balises <head> propres à chaque page (titres, canonical, description, JSON-LD).
ENV ENABLE_PRERENDER=true
RUN npm run build

# --- Serve (nginx) ---
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
