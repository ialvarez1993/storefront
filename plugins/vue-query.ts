// plugins/vue-query.ts
import { VueQueryPlugin, QueryClient, dehydrate, hydrate } from '@tanstack/vue-query'
import type { DehydratedState } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 3,
                retryDelay: 1000,
                staleTime: 1000 * 60,
                refetchOnWindowFocus: false,
                refetchOnMount: true
            },
        },
    })

    nuxtApp.vueApp.use(VueQueryPlugin, {
        queryClient,
        queryClientConfig: {
            defaultOptions: {
                queries: {
                    retry: 3,
                    retryDelay: 1000,
                },
            },
        },
    })

    // Manejo de hidratación SSR
    if (process.client) {
        const state = useState<DehydratedState>('vue-query')
        if (state.value) {
            hydrate(queryClient, state.value)
        }
    }

    return {
        provide: {
            queryClient,
        },
    }
})
