// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss'],

  // For GitHub Pages deployment
  ssr: false,
  app: {
    baseURL: '/pokemon_ttrpg/', // Change this to match your GitHub repo name
    head: {
      title: 'PTU Pokedex',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Pokemon Tabletop United Pokedex' }
      ]
    }
  },

  // Generate static site
  nitro: {
    preset: 'static'
  }
})
