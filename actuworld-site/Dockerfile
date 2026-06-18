# --- Build (Vite) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Variables VITE_ : inlinées au build (site statique). Fournies en build-args
# par le compose / la CI. Le pré-rendu Puppeteer reste désactivé (pas de Chrome
# dans node:alpine) — comportement identique à l'ancien build Vercel.
ARG VITE_GA_ID
ARG VITE_BREVO_API_KEY
ENV VITE_GA_ID=$VITE_GA_ID
ENV VITE_BREVO_API_KEY=$VITE_BREVO_API_KEY
RUN npm run build

# --- Serve (nginx) ---
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
