import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig(() => {
  const isVercel = process.env.VERCEL === '1'
  const isCi = process.env.CI === 'true'
  const enablePrerender = process.env.ENABLE_PRERENDER === 'true'

  const shouldPrerender = enablePrerender || (!isVercel && !isCi)

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        plugins: shouldPrerender
          ? [
              prerender({
                routes: ['/', '/app', '/pricing', '/faq', '/reco-src', '/contact', '/privacy', '/terms', '/press'],
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
