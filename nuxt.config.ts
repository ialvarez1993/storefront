// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      viewport: "minimum-scale=1, initial-scale=1, width=device-width",
      title: "tupunto.com",
      htmlAttrs: {
        lang: "en",
      },
      meta: [{ name: "robots", content: "index, follow" }],
    },
  },

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
    "@nuxtjs/device",
    "@nuxtjs/google-fonts",
    "nuxt-lazy-hydrate",
    "nuxt-lodash",
    "nuxt-icon",
    "nuxt-delay-hydration",
    "nuxt-typed-router",
    "@vueuse/motion/nuxt",
    "@nuxt/eslint",
    "@primevue/nuxt-module",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "nuxt-lucide-icons",
  ],
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
    },
  },

  googleFonts: {
    families: {
      "Red Hat Display": [400, 500, 700],
    },
  },
  i18n: {
    baseUrl: "http://localhost:3000",
    strategy: "prefix_except_default",
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
      redirectOn: "root",
    },
    vueI18n: "./i18n.config.ts",
  },
  delayHydration: {
    mode: "init",
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_variables.scss" as *;',
          implementation: require("sass"),
        },
      },
      optimizeDeps: {
        include: ["lodash-es"],
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
    "/": { swr: Number(process.env?.NUXT_SWR_CACHE_TIME), prerender: true },
    "/category/*": {
      swr: Number(process.env?.NUXT_SWR_CACHE_TIME),
      prerender: true,
    },
    "/product/*": {
      swr: Number(process.env?.NUXT_SWR_CACHE_TIME),
      prerender: true,
    },
    "/carrito": { prerender: true },
  },

  nitro: {
    prerender: {
      failOnError: false,
    },
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

  device: {
    refreshOnResize: true,
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
    "@fortawesome/fontawesome-free/css/all.css", // Asegúrate de que la ruta sea correcta
  ],
});
