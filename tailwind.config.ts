import type { Config } from "tailwindcss";
import { tailwindConfig } from "@storefront-ui/vue/tailwind-config";
import sfTypography from "@storefront-ui/typography";

export default <Config>{
  presets: [tailwindConfig],
  darkMode: ["class"],
  content: ["./**/*.vue", "node_modules/@storefront-ui/vue/**/*.{js,mjs}"],
  plugins: [sfTypography],
  css: [
    "~/assets/css/tailwind.css",
    "primevue/resources/themes/lara-light-blue/theme.css",
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.min.css',
    'primeicons/primeicons.css',
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

  theme: {
    screens: {
      sm: '640px',
      md: '769px',
      lg: '1024px',
      xl: '1280px',
      // Agrega tus propios breakpoints aquí
      '2xl': '1536px',
      '3xl': '2000px',
      '4xl': '3000px',

    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      sass: ["Roboto"],
      robotolight: ["Robotolight"],

      header: ["Designer"]

    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          "50": "#fffdea",
          "100": "#fff7c5",
          "200": "#fff085",
          "300": "#ffe146",
          "400": "#ffcf1b",
          "500": "#ffae00",
          "600": "#e28400",
          "700": "#000",
          "800": "#f7b013",
          "900": "#000",
          "950": "#000",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      screens: {
        xxl: "1440px",
        xs: "376px",
      },
      zindex: {
        60: "60",
        80: "60",
        100: "100",
      },
    },
  },
};
