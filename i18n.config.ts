export default defineI18nConfig(() => ({
  legacy: false,
  locale: "es",
  fallbackLocale: "es",
  sync: true,
  silentTranslationWarn: true,
  silentFallbackWarn: true,
  messages: {
    es: {
      welcome: "Bienvenido",
      nav: {
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
      },
    },
    en: {
      welcome: "Welcome",
      nav: {
        home: "Home",
        about: "About",
        contact: "Contact",
      },
    },
  },
}));
