import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig(() => {
  // Pré-rendu activé par défaut sur tous les builds de production (y compris Vercel)
  // afin que le HTML servi contienne le contenu et les balises SEO de chaque page.
  // Porte de sortie : si l'environnement de build n'a pas accès à Chrome/Chromium,
  // définir DISABLE_PRERENDER=true pour livrer la SPA sans pré-rendu.
  const shouldPrerender = process.env.DISABLE_PRERENDER !== 'true'

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
