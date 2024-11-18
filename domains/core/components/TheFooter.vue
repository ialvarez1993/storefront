<template>
  <footer class="bg-black text-white px-6 py-12 md:py-16">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Social Media Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">
          {{ $t("footer.navegacion.informacion.siguenos") }}
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
              {{ $t("footer.navegacion.informacion.quienes_somos") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/auth" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.informacion.registro") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.informacion.cuenta") }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Comprar Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">
          {{ $t("footer.navegacion.acciones.comprar") }}
        </h2>
        <ul class="space-y-2">
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.categorias.ferreteria") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.categorias.digital") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.categorias.todos_productos") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="#" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.categorias.ofertas") }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Ayuda Column -->
      <div>
        <h2 class="font-bold text-lg mb-4 uppercase tracking-wider">
          {{ $t("categories.help.label") }}
        </h2>
        <ul class="space-y-2">
          <li>
            <a
              href="https://zoom.red/tracking-de-envios-personas/"
              onclick="window.open(this.href,'_blank');return false;"
              class="hover:text-gray-300 transition-colors"
            >
              {{ $t("footer.navegacion.informacion.rastrear_pedido") }}
            </a>
          </li>
          <li>
            <NuxtLink
              to="/cambios_devoluciones"
              class="hover:text-gray-300 transition-colors"
            >
              {{ $t("footer.navegacion.informacion.cambios_devoluciones") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/preguntas_frecuentes"
              class="hover:text-gray-300 transition-colors"
            >
              {{ $t("footer.navegacion.informacion.preguntas_frecuentes") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              class="hover:text-gray-300 transition-colors"
            >
              {{ $t("footer.navegacion.informacion.contacto") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/envios"
              class="hover:text-gray-300 transition-colors"
            >
              {{ $t("footer.navegacion.informacion.envios") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/pagos" class="hover:text-gray-300 transition-colors">
              {{ $t("footer.navegacion.informacion.pagos") }}
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
