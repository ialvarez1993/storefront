<template>
  <footer class="bg-black text-white px-6 py-12 md:py-16">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Social Media Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">
          Síguenos
        </h2>
        <div class="flex gap-4">
          <NuxtLink to="#" class="hover:opacity-80 transition-opacity">
            <Icon name="lucide:facebook" class="w-6 h-6 text-amber-400" />
            <span class="sr-only">Facebook</span>
          </NuxtLink>
          <NuxtLink to="#" class="hover:opacity-80 transition-opacity">
            <Icon name="lucide:instagram" class="w-6 h-6 text-amber-400" />
            <span class="sr-only">Instagram</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Tu Punto Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">
          Tu punto
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="/about" class="hover:text-gray-300 transition-colors">
              Acerca de nosotros
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/auth" class="hover:text-gray-300 transition-colors">
              Registro
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/user" class="hover:text-gray-300 transition-colors">
              Tu cuenta
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Comprar Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">Comprar</h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Ferretería
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Digital
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Todos los productos
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Ofertas
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Ayuda Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">Ayuda</h2>
        <ul class="space-y-2">
          <li>
            <a
              href="https://zoom.red/tracking-de-envios-personas/"
              onclick="window.open(this.href,'_blank');return false;"
              class="hover:text-gray-300 transition-colors"
            >
              Rastrea tu pedido
            </a>
          </li>
          <li>
            <NuxtLink
              to="/changes"
              class="hover:text-gray-300 transition-colors"
            >
              Cambios y devoluciones
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Preguntas frecuentes
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              class="hover:text-gray-300 transition-colors"
            >
              Contáctanos
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Información de envíos
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              Información de pagos
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No se requieren imports ya que Nuxt maneja los componentes automáticamente
</script>
