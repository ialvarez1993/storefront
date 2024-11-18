<!-- components/BrandsBanner.vue -->
<template>
  <section class="brands-banner" :class="{ 'dark-mode': isDarkMode }">
    <div class="container">
      <h2 class="title" v-if="showTitle">{{ title }}</h2>

      <div class="brands-grid">
        <div
          v-for="(brand, index) in brandsData"
          :key="brand.id || index"
          class="brand-item"
          :class="{ animated: isAnimated }"
          :style="{ 'animation-delay': `${index * 0.1}s` }"
        >
          <NuxtImg
            v-if="brand.image"
            :src="brand.image"
            :alt="brand.name"
            loading="lazy"
            class="brand-logo"
          />
          <div v-else class="brand-logo-placeholder">
            {{ brand.name.charAt(0) }}
          </div>

          <div class="brand-tooltip">
            {{ brand.name }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Brand {
  id?: string | number;
  name: string;
  image?: string;
}

interface Props {
  title?: string;
  brands: Brand[];
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

// Ejemplo de brands con tipos definidos
const brandsData = [
  {
    id: 1,
    name: "Samsung",
    image: "/images/samsung.png",
  },
  {
    id: 2,
    name: "Xiaomi",
    image: "/images/xiaomi.png",
  },
  {
    id: 3,
    name: "whirlpool",
    image: "/images/whirlpool.png",
  },
  {
    id: 4,
    name: "HP",
    image: "/images/hp.png",
  },
  {
    id: 4,
    name: "Lenovo",
    image: "/images/lenovo.png",
  },
  // ... más marcas
] as Brand[];
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
  @apply text-2xl md:text-3xl font-bold text-center mb-12
         text-gray-800 tracking-wider uppercase;
}

.brands-grid {
  @apply grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
         gap-8 md:gap-12 place-items-center;
}

.brand-item {
  @apply relative w-full max-w-[160px] aspect-[3/2] p-4
         flex items-center justify-center
         bg-white rounded-lg shadow-sm
         transition-all duration-300
         hover:shadow-md hover:scale-105;

  &.animated {
    @apply opacity-0 translate-y-4;
    animation: fadeInUp 0.6s ease-out forwards;
  }

  &:hover .brand-tooltip {
    @apply opacity-100 visible translate-y-0;
  }
}

.brand-logo {
  @apply w-full h-full object-contain
         transition-all duration-300
         grayscale hover:grayscale-0;
}

.brand-logo-placeholder {
  @apply w-full h-full flex items-center justify-center
         text-3xl font-bold text-gray-300;
}

.brand-tooltip {
  @apply absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-4
         px-3 py-1 text-sm text-white bg-gray-800
         rounded-md opacity-0 invisible
         transition-all duration-300
         whitespace-nowrap;

  &::before {
    content: "";
    @apply absolute -top-1 left-1/2 -translate-x-1/2
           border-4 border-transparent
           border-b-gray-800;
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
