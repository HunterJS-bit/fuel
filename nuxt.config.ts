import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: ['~/assets/css/index.css', '~/assets/css/animations.css'],
  modules: ['@nuxtjs/i18n', '@nuxtjs/sitemap', 'nuxt-security', '@nuxt/image'],
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
  image: {
    quality: 80,
    format: ['webp', 'avif', 'jpeg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    domains: ['unpkg.com']
  },
  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'https://*.openstreetmap.org', 'https://server.arcgisonline.com', 'https://unpkg.com'],
      },
      referrerPolicy: 'no-referrer-when-downgrade',
      crossOriginEmbedderPolicy: 'unsafe-none'
    }
  },
  vite: {
    optimizeDeps: {
      // exclude: ['vue-router'],
      include: ['leaflet', 'leaflet.markercluster']
    }
  }
})
