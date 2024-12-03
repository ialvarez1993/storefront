export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const baseURL = config.public.apiUrlStrapi || 'http://localhost:1337'

  const fetchApi = async (endpoint: string, options = {}) => {
    // Asegurarse de que baseURL no termine en '/' y endpoint no empiece con '/'
    const cleanBaseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint

    // Construir URL completa
    const url = `${cleanBaseURL}/${cleanEndpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  return {
    provide: {
      fetchApi
    }
  }
})
