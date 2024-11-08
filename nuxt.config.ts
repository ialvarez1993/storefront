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
    "shadcn-docs-nuxt",
  ],

  modules: [
    '@vueuse/nuxt',
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
  ],

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
    locales: [
      {
        code: "en",
        file: "en.json",
      },
      {
        code: "es",
        file: "es.json",
      },
    ],
    strategy: "no_prefix",
    lazy: true,
    langDir: "lang",
    defaultLocale: "en",
  },

  delayHydration: {
    mode: "init",
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_variables.scss" as *;'
        }
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
  device: {
    refreshOnResize: true,
  },
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
  ssr: true,
  compatibilityDate: "2024-10-27",
});
