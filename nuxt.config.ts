import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: ['~/assets/css/index.css', '~/assets/css/animations.css'],
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap'],
  devtools: { enabled: false },
  site: {
    url: 'https://123fuel.rs', // Example production URL for sitemap
    name: '1-2-3 Fuel Serbia'
  },
  sitemap: {
    autoI18n: true
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'sr',
        name: 'Srpski',
        file: 'sr.json'
      }
    ],
    defaultLocale: 'sr',
    lazy: true,
    langDir: 'locales',
    strategy: 'prefix_except_default'
  },
  app: {
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap' }
      ]
    }
  },
  compatibilityDate: '2024-11-01',
  vite: {
    optimizeDeps: {
      // exclude: ['vue-router'],
      include: ['leaflet', 'leaflet.markercluster']
    }
  }
})
