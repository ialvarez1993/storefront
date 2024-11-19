<template>
  <div class="slider-container pt-56 sm:pt-20 md:pt-36 pb-80 sm:pb-0">
    <!-- Background with curve -->
    <div class="slider-background">
      <div
        class="slider-gradient"
        :style="{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }"
      />
    </div>
    <div class="slider-content">
      <div
        class="slider-grid"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
        <div class="slider-info" :class="{ 'slide-enter': slideAnimation }">
          <div class="info-content">
            <h2
              class="info-title !text-black sm:!text-white pt-10 sm:pt-0 !font-header"
            >
              {{ slides[currentSlide].title }}
            </h2>
            <p class="info-subtitle">
              {{ slides[currentSlide].subtitle }}
            </p>
          </div>

          <button class="primary-button">{{ $t("banner.product") }}</button>
        </div>

        <div class="slider-media" :class="{ 'slide-enter': slideAnimation }">
          <NuxtImg
            :src="slides[currentSlide].url"
            :alt="slides[currentSlide].title"
            class="product-image"
            width="600"
            height="400"
            loading="lazy"
          />

          <div class="brand-logo">
            <NuxtImg
              :src="'/images/hero.png'"
              alt="Brand Logo"
              class="w-8 h-8"
              loading="lazy"
            />
          </div>

          <div class="price-tag">
            <div class="price-label">{{ $t("banner.priceBaner") }}</div>
            <div class="price-amount">${{ slides[currentSlide].price }}</div>
          </div>

          <div class="discount-badge">
            <span class="discount-amount"
              >{{ slides[currentSlide].discount }}%</span
            >
            <span class="discount-label">{{ $t("banner.discount") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="slider-navigation">
      <button
        @click="prevSlide"
        class="nav-button nav-prev"
        aria-label="Anterior"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          class="rotate-180"
        >
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <button
        @click="nextSlide"
        class="nav-button nav-next"
        aria-label="Siguiente"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 5l7 7-7 7"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </nav>

    <!-- Pagination -->
    <div class="slider-pagination">
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="setCurrentSlide(index)"
        :class="['pagination-dot', { active: currentSlide === index }]"
        :aria-label="`Ir a diapositiva ${index + 1}`"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";

// Interfaces actualizadas según la estructura real
interface Slide {
  id: number;
  title: string;
  subtitle: string;
  url: string | null;
  call: string | null;
    images: string | null;
}

interface BannerData {
  id: number;
  documentId: string;
  slide: Slide[];
  localizations: any[];
}

interface BannerResponse {
  data: BannerData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Estado
const currentSlide = ref(0);
const slideAnimation = ref(true);
const autoplayInterval = ref<NodeJS.Timeout | null>(null);
const touchStartX = ref(0);
const touchEndX = ref(0);

// Slides por defecto
const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "LA NUEVA NOTEBOOK QUE BUSCABAS YA ESTÁ AQUÍ..",
    subtitle: "Lenovo Legión 5 I5 8GB RAM",
    url: "/images/hero.png",
        images: "/images/hero.png",
    call: null
  },
  {
    id: 2,
    title: "ENCUENTRA LO ÚLTIMO EN CELULARES..",
    subtitle: "Celular Cubot P80 Dual Sim 256 Gb Global 8 Gb",
    url: "/images/display-1.png",
        images: "/images/hero.png",
    call: null
  }
];

const fetchBanners = async (): Promise<BannerResponse> => {
  const API_TOKEN = "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86";
  const API_URL = `http://localhost:1337/api/banners?populate=*`;

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

const {
  data: bannersData,
  isLoading,
  error,
} = useQuery({
  queryKey: ["banners"],
  queryFn: fetchBanners,
});

// Computed property actualizado
const slides = computed(() => {
  if (isLoading.value || !bannersData.value?.data?.[0]?.slide) {
    return defaultSlides;
  }

  return bannersData.value.data[0].slide;
});

// Funciones del slider
const nextSlide = () => {
  if (slides.value.length <= 1) return;
  slideAnimation.value = false;
  setTimeout(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
    slideAnimation.value = true;
  }, 300);
};

const prevSlide = () => {
  if (slides.value.length <= 1) return;
  slideAnimation.value = false;
  setTimeout(() => {
    currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length;
    slideAnimation.value = true;
  }, 300);
};

const setCurrentSlide = (index: number) => {
  if (index < 0 || index >= slides.value.length) return;
  slideAnimation.value = false;
  setTimeout(() => {
    currentSlide.value = index;
    slideAnimation.value = true;
  }, 300);
};

// Autoplay
const startAutoplay = () => {
  if (slides.value.length <= 1) return;
  stopAutoplay();
  autoplayInterval.value = setInterval(nextSlide, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

// Touch events
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  stopAutoplay();
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX;
};

const handleTouchEnd = () => {
  const swipeThreshold = 50;
  const swipeDistance = touchStartX.value - touchEndX.value;

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }
  startAutoplay();
};

// Debug watchers
watch(bannersData, (newData) => {
  console.log("Datos del banner actualizados:", newData);
});

watch(slides, (newSlides) => {
  console.log("Slides actualizados:", newSlides);
});

// Lifecycle hooks
onMounted(() => {
  startAutoplay();
});

onBeforeUnmount(() => {
  stopAutoplay();
});
</script>

<style lang="scss">
.slider-container {
  @apply relative my-5 w-full overflow-hidden mt-[12rem] sm:mt-[5rem] md:mt-0 xl:mt-16 lg:mt-[3rem] 2xl:mt-[12rem] 3xl:mt-[12rem] 4xl:mt-[10rem] h-[400px];

  @screen sm {
    height: 450px;
  }

  @screen lg {
    height: 500px;
  }
}

.slider-background {
  @apply absolute  inset-0 z-10;
}

.slider-gradient {
  @apply absolute inset-0 bg-gradient-to-r from-[#FDB813] via-[#FDB813]/90 to-transparent;
}

.slider-content {
  @apply relative z-20 h-full flex items-center px-4 sm:px-8 md:px-12;
}

.slider-grid {
  @apply grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-center w-full;
}

.slider-info {
  @apply space-y-4 sm:space-y-6;
  opacity: 0;
  transform: translateX(-20px);

  &.slide-enter {
    animation: slideIn 0.5s ease forwards;
  }
}

.info-content {
  @apply space-y-2;
}

.info-title {
  @apply text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight tracking-wide;
}

.info-subtitle {
  @apply text-white/90 mt-2 text-base sm:text-lg;
}

.primary-button {
  @apply bg-black text-white hover:bg-[#FDB813]/90 font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors;
}

.slider-media {
  @apply relative;
  opacity: 0;
  transform: translateX(20px);

  &.slide-enter {
    animation: slideIn 0.5s ease forwards;
  }
}

.product-image {
  @apply w-full h-auto object-contain 4xl:max-w-[70rem];
}

.brand-logo {
  @apply absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg;
}

.price-tag {
  @apply absolute top-20 right-4 bg-white px-4 py-2 rounded-xl shadow-lg;
}

.price-label {
  @apply text-xs text-gray-600 font-medium;
}

.price-amount {
  @apply text-xl sm:text-2xl font-bold;
}

.discount-badge {
  @apply absolute top-40 right-4 bg-red-500 text-white px-3 sm:px-4 py-2 rounded-xl shadow-lg flex items-center gap-1;
}

.discount-amount {
  @apply text-xl sm:text-2xl font-bold;
}

.discount-label {
  @apply text-xs font-medium;
}

.slider-navigation {
  @apply absolute top-1/2 -translate-y-1/2 z-30 w-full px-4;
}

.nav-button {
  @apply absolute bg-white/90 w-10 h-10 flex items-center justify-center rounded-lg shadow-lg hover:bg-white transition-colors;

  &.nav-prev {
    @apply left-4;
  }

  &.nav-next {
    @apply right-4;
  }
}

.slider-pagination {
  @apply absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2;
}

.pagination-dot {
  @apply w-2 h-2 rounded-full transition-colors bg-white/50;

  &.active {
    @apply bg-white;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
