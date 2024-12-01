<template>
  <section class="brands-banner" :class="{ 'dark-mode': isDarkMode }">
    <div class="container">



      <h2
        class="title text-center font-bold !font-header uppercase mt-12 typography-headline-3 md:typography-headline-2"
        v-if="showTitle">{{ $t("marcasTitulo") }}</h2>

      <div class="brands-grid">
        <div v-for="brand in brandsData" :key="brand.id" class="brand-item" :class="{ animated: isAnimated }">
          <NuxtImg v-if="brand.icono" :src="`http://localhost:1337${brand.icono.url}`" :alt="brand.nombre"
            loading="lazy" class="brand-logo" />
          <div v-else class="brand-logo-placeholder">
            {{ brand.nombre.charAt(0) }}
          </div>

          <div class="brand-tooltip">
            {{ brand.nombre }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";

const API_TOKEN =
  "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86";

const API_URL = computed(() => {
  return `http://localhost:1337/api/marcas?pagination%5BwithCount%5D=true&populate=%2A`;
});

const fetchDataTitleCategory = async () => {
  try {
    const response = await fetch(API_URL.value, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const { data: DataCard, isLoading } = useQuery({
  queryKey: ["MarcasHome"],
  queryFn: fetchDataTitleCategory,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

const brandsData = computed(() => {
  return DataCard.value?.data || [];
});

interface Props {
  title?: string;
  showTitle?: boolean;
  isAnimated?: boolean;
  isDarkMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Tecnología de las Mejores Marcas",
  showTitle: true,
  isAnimated: true,
  isDarkMode: false,
});
</script>

<style lang="scss" scoped>
.brands-banner {
  @apply relative w-full py-16 px-4 bg-white transition-colors duration-300;

  &.dark-mode {
    @apply bg-gray-900;

    .title {
      @apply text-white;
    }

    .brand-logo {
      @apply brightness-90;
    }
  }
}

.container {
  @apply max-w-7xl mx-auto;
}

.title {
  @apply text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 tracking-wider uppercase;
}

.brands-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 place-items-center;
}

.brand-item {
  @apply relative w-full max-w-[160px] aspect-[3/2] p-4 flex items-center justify-center bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105;

  &.animated {
    @apply opacity-0 translate-y-4;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  &:hover .brand-tooltip {
    @apply opacity-100 visible translate-y-0;
  }
}

.brand-logo {
  @apply w-full h-full object-contain transition-all duration-300 grayscale hover:grayscale-0;
}

.brand-logo-placeholder {
  @apply w-full h-full flex items-center justify-center text-3xl font-bold text-gray-300;
}

.brand-tooltip {
  @apply absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-4 px-3 py-1 text-sm text-white bg-gray-800 rounded-md opacity-0 invisible transition-all duration-300 whitespace-nowrap;

  &::before {
    content: "";
    @apply absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-gray-800;
  }
}

@keyframes fadeInUp {
  to {
    @apply opacity-100 translate-y-0;
  }
}

// Optimizaciones para dispositivos móviles
@media (max-width: 640px) {
  .brands-grid {
    @apply gap-4;
  }

  .brand-item {
    @apply max-w-[120px];
  }

  .brand-tooltip {
    @apply hidden;
  }
}

// Soporte para preferencias de reducción de movimiento
@media (prefers-reduced-motion: reduce) {
  .brand-item {
    animation: none;
  }

  .brand-item,
  .brand-tooltip {
    transition: none;
  }
}
</style>
