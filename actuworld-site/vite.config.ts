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
                  renderAfterTime: 3000,
                }),
              }),
            ]
          : [],
      },
    },
  }
})
