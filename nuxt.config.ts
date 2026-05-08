// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://3.88.50.172:5000',
    },
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://3.88.50.172:5000',
        changeOrigin: true,
      },
    },
  },
  app: {
    head: {
      title: 'Amazon Reviews Intelligence',
      meta: [
        {
          name: 'description',
          content:
            'Modern analytics dashboard for Amazon reviews with live sentiment and offline insights.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/project-mark.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
  css: ['./app/assets/css/input.css'],
})
