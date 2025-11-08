import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*'],
      manifest: {
        name: 'Deep Work',              // Nom complet
        short_name: 'DeepWork',         // Nom affiché sous l’icône
        description: "Deep Work Tracker App",
        theme_color: '#4b0082',         // Couleur barre + splash
        background_color: '#ffffff',
        display: 'standalone',          // ✅ Pas de barre d'adresse
        icons: [
          {
            src: '/icons/icon.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
        ]
      }
    })
  ]
})
