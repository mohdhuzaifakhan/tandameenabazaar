import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt'],
      manifest: {
        name: 'Digital Meena Bazaar Rampur',
        short_name: 'MeenaBazaar',
        description: 'Digital marketplace connecting local city shops with customers via WhatsApp.',
        theme_color: '#056839',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '.',
        icons: [
          {
            src: 'https://img.icons8.com/color/192/shopping-bag--v1.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://img.icons8.com/color/512/shopping-bag--v1.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
