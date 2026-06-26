import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig(() => {
  // Pré-rendu DÉSACTIVÉ par défaut : l'environnement de build Vercel n'a pas les
  // bibliothèques système nécessaires à Chrome (libnspr4, libnss3…), ce qui fait
  // échouer Puppeteer. Le SEO de la home repose sur les balises statiques de
  // index.html ; Google rend le JS pour les sous-pages.
  // Pour générer le HTML pré-rendu dans un environnement compatible (Chrome + libs),
  // lancer le build avec ENABLE_PRERENDER=true.
  const shouldPrerender = process.env.ENABLE_PRERENDER === 'true'

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        plugins: shouldPrerender
          ? [
              prerender({
                routes: ['/', '/about', '/app', '/reco-src', '/faq', '/partenaires', '/contact', '/pricing', '/privacy', '/terms', '/mentions-legales', '/press'],
                renderer: new PuppeteerRenderer({
                  // Attente DÉTERMINISTE : le composant <PageMeta>, rendu par CHAQUE
                  // page à l'intérieur de son chunk lazy, émet l'événement
                  // 'prerender-ready' une fois le contenu de la route monté. On
                  // capture le HTML à ce moment précis. Évite de figer l'écran de
                  // chargement (fallback Suspense) comme le faisait l'attente par
                  // temps fixe — critique pour la home (plus gros chunk).
                  renderAfterDocumentEvent: 'prerender-ready',
                  timeout: 20000,
                  // --no-sandbox : requis quand le build tourne en root (Docker).
                  args: ['--no-sandbox', '--disable-setuid-sandbox'],
                  // Borne la concurrence pour éviter un pic mémoire en CI/conteneur.
                  maxConcurrentRoutes: 4,
                }),
              }),
            ]
          : [],
      },
    },
  }
})
