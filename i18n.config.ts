// i18n.config.ts
export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'es',
  messages: {
    es: {
      welcome: 'Bienvenido',
      nav: {
        home: 'Inicio',
        about: 'Acerca de',
        contact: 'Contacto'
      }
    },
    en: {
      welcome: 'Welcome',
      nav: {
        home: 'Home',
        about: 'About',
        contact: 'Contact'
      }
    }
  }
}))
