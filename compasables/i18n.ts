export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        // Verificar y sincronizar el idioma al cargar la aplicación
        const savedLocale = localStorage.getItem('user-locale');
        const cookieLocale = useCookie('i18n_redirected').value;

        // Priorizar cookie sobre localStorage
        const finalLocale = cookieLocale || savedLocale;

        if (finalLocale) {
            const i18n = useI18n();
            i18n.locale.value = finalLocale;
        }
    });
});
