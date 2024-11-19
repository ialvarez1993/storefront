// plugins/vue-query-devtools.client.ts
import { defineNuxtPlugin } from '#app'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

export default defineNuxtPlugin((nuxtApp) => {
    // Solo registrar las devtools en desarrollo
    if (process.env.NODE_ENV === 'development') {
        nuxtApp.vueApp.component('VueQueryDevTools', VueQueryDevtools)
    }
})
