import { tailwindConfig } from "@storefront-ui/vue/tailwind-config";
import sfTypography from "@storefront-ui/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  safelist: [
    "text-white",
    "text-black",
    "bg-amber-500",
    "bg-neutral-900",
    "bg-rose-500",
    // Agrega aquí todas las clases de color que necesites
    {
      pattern:
        /bg-(amber|rose|neutral|white|black)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ["hover", "focus", "active"],
    },
    {
      pattern:
        /text-(amber|rose|neutral|white|black)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ["hover", "focus", "active"],
    },
  ],
  presets: [tailwindConfig],
  darkMode: ["class"],
  content: [
    "./components/**/*.{vue,js,ts}", // Escanea archivos Vue, JS y TS dentro de la carpeta components
    "./layouts/**/*.vue", // Solo archivos .vue dentro de layouts
    "./pages/**/*.vue", // Solo archivos .vue dentro de pages
    "./plugins/**/*.{js,ts}", // Archivos JS y TS dentro de plugins
    "./nuxt.config.{js,ts}", // El archivo de configuración de Nuxt
    "./app.vue", // El archivo principal de la app
    "./node_modules/@storefront-ui/vue/**/*.{js,mjs}", // Módulos específicos de `@storefront-ui`
    "./node_modules/@nuxt/ui/dist/**/*.{vue,js,ts}", // Módulos específicos de `@nuxt/ui`
    "docs/content/**/*.md",
    "./components/**/*.{vue,js,ts}", // Escanea archivos Vue, JS y TS dentro de la carpeta components
    "./layouts/**/*.vue", // Solo archivos .vue dentro de layouts
    "./pages/**/*.vue", // Solo archivos .vue dentro de pages
    "./plugins/**/*.{js,ts}", // Archivos JS y TS dentro de plugins
    "./nuxt.config.{js,ts}", // El archivo de configuración de Nuxt
    "./app.vue", // El archivo principal de la app
    "./node_modules/@storefront-ui/vue/**/*.{js,mjs}", // Módulos específicos de `@storefront-ui`
    "./node_modules/@nuxt/ui/dist/**/*.{vue,js,ts}", // Módulos específicos de `@nuxt/ui`
    "docs/content/**/*.md",
  ],
  plugins: [sfTypography],
  theme: {
    screens: {
      sm: "640px",
      md: "769px",
      lg: "1024px",
      xl: "1280px",
      // Agrega tus propios breakpoints aquí
      "2xl": "1536px",
      "3xl": "2000px",
      "4xl": "3000px",
    },
    fontFamily: {
      sass: ["Roboto"],
      robotolight: ["robotolight"],
      header: ["Designer"],
    },
    extend: {},
  },
};

export default config;
