import { tailwindConfig } from '@storefront-ui/vue/tailwind-config'
import sfTypography from '@storefront-ui/typography'


/** @type {import('tailwindcss').Config} */
const config = {
  presets: [tailwindConfig],
  darkMode: ['class'],
content: [
  './components/**/*.{vue,js,ts}',          // Escanea archivos Vue, JS y TS dentro de la carpeta components
  './layouts/**/*.vue',                    // Solo archivos .vue dentro de layouts
  './pages/**/*.vue',                      // Solo archivos .vue dentro de pages
  './plugins/**/*.{js,ts}',                // Archivos JS y TS dentro de plugins
  './nuxt.config.{js,ts}',                 // El archivo de configuración de Nuxt
  './app.vue',                             // El archivo principal de la app
  './node_modules/@storefront-ui/vue/**/*.{js,mjs}', // Módulos específicos de `@storefront-ui`
  './node_modules/@nuxt/ui/dist/**/*.{vue,js,ts}',  // Módulos específicos de `@nuxt/ui`
  'docs/content/**/*.md'
],
plugins: [sfTypography],
  theme: {
    extend: {}
  }
}

export default config
