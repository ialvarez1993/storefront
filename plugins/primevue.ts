// plugins/primevue.ts
import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    inputStyle: 'filled',
    // Forzar modo claro
    theme: 'lara-light-blue',
    darkTheme: 'lara-light-blue', // Esto fuerza el tema claro incluso cuando se intenta cambiar a oscuro
  })
})
