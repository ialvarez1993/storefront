import Aura from '@primevue/themes/aura';

// htts://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },



  robots: {
    allow: "/category/*",
  },

  app: {
    head: {
      viewport: "minimum-scale=1, initial-scale=1, width=device-width",
      title: "Tupunto.com",
      htmlAttrs: {
        lang: "en",
      },
      meta: [{ name: "robots", content: "index, follow" }],
    },
  },
  plugins: ['./plugins/apiStrapi.ts'],
  extends: [
    "./domains/auth",
    "./domains/recent-view-products",
    //"./domains/cart-odoo",
    "./domains/cart-redis",
    "./domains/category",
    "./domains/checkout",
    "./domains/core",
    "./domains/my-account",
    "./domains/product",
    //"./domains/search-algolia",
    "./domains/search-default",
    "./domains/wishlist",
  ],

  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/i18n",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@nuxt/scripts",
    "nuxt-lazy-hydrate",
    "nuxt-lodash",
    "nuxt-delay-hydration",
    "nuxt-typed-router",
    "@vueuse/motion/nuxt",
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "nuxt-lucide-icons",
    "@nuxtjs/storybook",
    "@nuxtjs/device",
    "@nuxt/icon",
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false || 'none',
        }
      },
      ripple: true,
    },
    autoImport: true,
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    shouldByPassCacheQueryNames: [
      "LoadCartQuery",
      "WishlistLoadQuery",
      "GetAddressesQuery",
    ],
    public: {
      NUXT_CLARITY_ID: process.env.NUXT_CLARITY_ID,
      odooBaseImageUrl: "",
      odooBaseUrl: "",
      currencySymbol: "",
      currencySeparator: "",
      currencyDecimal: "",
      currencyPrecision: "",
      apiUrlStrapi: "",
      apiStrapiToken: "",
      NUXT_PUBLIC_API_STRAPI_TOKEN: process.env.NUXT_PUBLIC_API_STRAPI_TOKEN,
    },
  },


  i18n: {
    strategy: 'no_prefix',  // Cambiado para mejor SEO
    locales: [
      {
        code: "es",
        name: "Español",
        file: "es.json",
      },
      {
        code: "en",
        name: "English",
        file: "en.json",
      },
    ],
    defaultLocale: "es",
    lazy: true,
    langDir: "lang/",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      cookieSecure: process.env.NODE_ENV === 'production',
      redirectOn: 'root',
      alwaysRedirect: true,
      fallbackLocale: 'es'
    },
    vueI18n: "./i18n.config.ts",
  },


  delayHydration: {
    mode: "init",
  },

  vite: {
    optimizeDeps: {
      include: ['@tanstack/vue-query']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_variables.scss" as *;',
          implementation: require("sass"),
        },
      },
    },
  },

  build: {
    transpile: [
      "tslib",
      "@apollo/client",
      "@apollo/client/core",
      "@vue/apollo-composable",
      "@vue/apollo-option",
      "ts-invariant",
      "vue-toastification",
      "@erpgap/odoo-sdk-api-client",
      '@tanstack/vue-query'
    ],
  },

  image: {
    providers: {
      odooProvider: {
        name: "odooProvider",
        provider: "~/providers/odoo-provider.ts",
      },
    },
    screens: {
      "2xl": 1536,
      xxl: 1440,
      xl: 1280,
      lg: 1024,
      md: 768,
      sm: 640,
      xs: 376,
    },
  },

  routeRules: {
    "/": { swr: Number(process.env?.NUXT_SWR_CACHE_TIME) },
    "/category/*": {
      swr: Number(process.env?.NUXT_SWR_CACHE_TIME),
    },
    "/product/*": {
      swr: Number(process.env?.NUXT_SWR_CACHE_TIME),
    },
  },

  nitro: {
    compressPublicAssets: false,
    storage: {
      redis: {
        driver: "redis",
        url: "redis://localhost:6379",
      },
    },
    devStorage: {
      cache: {
        driver: "redis",
        url: "redis://localhost:6379",
      },
    },
  },

  tailwindcss: {
    viewer: false,
  },


  experimental: {
    asyncContext: false,
  },

  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  lucide: {
    namePrefix: "Icon",
  },
  ssr: true,
  compatibilityDate: "2024-10-27",
  css: [
    "@fortawesome/fontawesome-free/css/all.css", "~/assets/css/tailwind.css",
  ],
});
