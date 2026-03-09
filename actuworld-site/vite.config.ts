import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from '@prerenderer/rollup-plugin'
import PuppeteerRenderer from '@prerenderer/renderer-puppeteer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      plugins: [
        prerender({
          routes: ['/', '/app', '/pricing', '/faq', '/reco-src', '/contact', '/privacy', '/terms', '/press'],
          renderer: new PuppeteerRenderer({
            renderAfterTime: 3000,
          }),
        }),
      ],
    },
  },
})
