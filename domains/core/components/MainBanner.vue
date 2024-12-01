<template>
  <div v-if="isLoading" class="flex items-center justify-center mt-52 w-full min-h-[200px] bg-black backdrop-blur-sm">
    <div class="flex flex-col items-center gap-4">
      <!-- Spinner Animation -->
      <div class="relative w-16 h-16">
        <div class="absolute w-16 h-16 border-4 border-primary-500 rounded-full animate-ping opacity-75"></div>
        <div class="absolute w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin">
        </div>
      </div>

      <!-- Loading Text -->
      <div class="flex flex-col items-center">
        <span class="text-lg font-medium text-white animate-pulse">
          {{ $t("loadingBanner") }}
        </span>
        <span class="mt-1 text-sm text-gray-300">
          {{ $t("loadingBannerDescripcion") }}
        </span>
      </div>

      <!-- Optional Progress Bar -->
      <div class="w-48 h-1 mt-2 overflow-hidden bg-gray-700 rounded-full">
        <div class="h-full bg-primary-500 animate-[loading_1s_ease-in-out_infinite]" style="width: 50%"></div>
      </div>
    </div>
  </div>
  <div v-else class="slider-container pt-[19rem] !mt-[13rem] lg:!mt-[8rem] sm:pt-20 md:pt-36 pb-80 sm:pb-0">
    <!-- Background with curve -->
    <div class="slider-background">
      <div class="slider-gradient" :style="{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }" />
    </div>
    <div class="slider-content">
      <div class="slider-grid" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
        <div class="slider-info" :class="{ 'slide-enter': slideAnimation }">
          <div class="info-content">
            <h2 class="info-title !text-black sm:!text-white pt-10 sm:pt-0 !font-header">
              {{ slides[currentSlide].title }}
            </h2>
            <p class="info-subtitle">
              {{ slides[currentSlide].subtitle }}
            </p>
          </div>
          <NuxtLink :to="slides[currentSlide].url">
            <button class="primary-button"> {{ $t("banner.product") }}</button>
          </NuxtLink>
        </div>

        <div v-if="slides && slides.length && slides[currentSlide]" class="slider-media"
          :class="{ 'slide-enter': slideAnimation }">
          <NuxtImg v-if="slides[currentSlide].image?.url" :src="slides[currentSlide].image.url"
            :alt="slides[currentSlide].title || ''" width="500" height="600" loading="lazy" />

          <div v-if="slides[currentSlide].price && slides[currentSlide].price > 0" class="price-tag">
            <div class="price-label">{{ $t("banner.priceBaner") }}</div>
            <div class="price-amount">$ {{ slides[currentSlide].price }}</div>
          </div>

          <div v-if="
            slides[currentSlide].discount && slides[currentSlide].discount > 0
          " class="discount-badge">
            <span class="discount-amount">{{ slides[currentSlide].discount }}%</span>
            <span class="discount-label">{{ $t("banner.discount") }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="slider-navigation">
      <button @click="prevSlide" class="nav-button nav-prev" aria-label="Anterior">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="rotate-180">
          <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>

      <button @click="nextSlide" class="nav-button nav-next" aria-label="Siguiente">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
    </nav>

    <!-- Pagination -->
    <div class="slider-pagination">
      <button v-for="(slide, index) in slides" :key="index" @click="setCurrentSlide(index)"
        :class="['pagination-dot', { active: currentSlide === index }]" :aria-label="`Ir a diapositiva ${index + 1}`" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";

// Interfaces
interface Slide {
  id?: number;
  title?: string;
  subtitle?: string;
  url?: string;
  price?: string;
  discount?: string;
  image?: Brand;
  brand?: Brand;
}

interface Brand {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: null;
  provider: string;
  provider_metadata: null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: null;
}

interface Formats {
  thumbnail: Large;
  small: Large;
  medium: Large;
  large: Large;
}

interface Large {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: null;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
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

// Debug flags
const DEBUG = true;
const log = (...args: any[]) => {
  if (DEBUG) console.log(...args);
};

// Slides por defecto
const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "Sin Data",
    subtitle: "SIN DATA",
    url: "/images/hero.png",
    discount: "SIN DATA",
    price: "SIN DATA",
  },
  {
    id: 2,
    title: "Sin Data",
    subtitle: "SIN DATA",
    url: "SIN DATA",
  },
];

// API Configuration
const API_CONFIG = {
  TOKEN:
    "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86",
  BASE_URL: "http://localhost:1337/api",
  ENDPOINTS: {
    BANNERS: "/banners",
  },
};

// Fetch banners with error handling
const fetchBanners = async (): Promise<BannerResponse> => {
  try {
    const { locale } = useI18n();
    const currentLang = locale.value; // 'es' o 'en'
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BANNERS}?populate[slide][populate]=*&locale=${currentLang === "es" ? "es-VE" : "en"}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_CONFIG.TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`[MAINBANNER]HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    log("[MAINBANNER]Error fetching banners:", error);
    throw error;
  }
};

// Query hook
const {
  data: bannersData,
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: ["banners"],
  queryFn: fetchBanners,
  retry: 5,
});

const BASE_IMAGE_URL = "http://localhost:1337";

const slides = computed(() => {
  if (isLoading.value || !bannersData.value?.data?.[0]?.slide) {
    log("Using default slides");
    return defaultSlides;
  }

  return bannersData.value.data[0].slide.map((slide) => ({
    ...slide,
    image: slide.image
      ? {
        ...slide.image,
        url: slide.image.url.startsWith("http")
          ? slide.image.url
          : `${BASE_IMAGE_URL}${slide.image.url}`,
      }
      : undefined,
    brand: slide.brand
      ? {
        ...slide.brand,
        url: slide.brand.url.startsWith("http")
          ? slide.brand.url
          : `${BASE_IMAGE_URL}${slide.brand.url}`,
        formats: {
          ...slide.brand.formats,
          thumbnail: {
            ...slide.brand.formats.thumbnail,
            url: slide.brand.formats.thumbnail.url.startsWith("http")
              ? slide.brand.formats.thumbnail.url
              : `${BASE_IMAGE_URL}${slide.brand.formats.thumbnail.url}`,
          },
          small: {
            ...slide.brand.formats.small,
            url: slide.brand.formats.small.url.startsWith("http")
              ? slide.brand.formats.small.url
              : `${BASE_IMAGE_URL}${slide.brand.formats.small.url}`,
          },
          medium: {
            ...slide.brand.formats.medium,
            url: slide.brand.formats.medium.url.startsWith("http")
              ? slide.brand.formats.medium.url
              : `${BASE_IMAGE_URL}${slide.brand.formats.medium.url}`,
          },
          large: {
            ...slide.brand.formats.large,
            url: slide.brand.formats.large.url.startsWith("http")
              ? slide.brand.formats.large.url
              : `${BASE_IMAGE_URL}${slide.brand.formats.large.url}`,
          },
        },
      }
      : undefined,
  }));
});

// Slider controls
const nextSlide = () => {
  if (slides.value.length <= 1) {
    log("Not enough slides to move next");
    return;
  }

  slideAnimation.value = false;
  setTimeout(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.value.length;
    slideAnimation.value = true;
    log("Moving to next slide:", currentSlide.value);
  }, 300);
};

const prevSlide = () => {
  if (slides.value.length <= 1) {
    log("Not enough slides to move prev");
    return;
  }

  slideAnimation.value = false;
  setTimeout(() => {
    currentSlide.value =
      (currentSlide.value - 1 + slides.value.length) % slides.value.length;
    slideAnimation.value = true;
    log("Moving to previous slide:", currentSlide.value);
  }, 300);
};

const setCurrentSlide = (index: number) => {
  if (index < 0 || index >= slides.value.length) {
    log("Invalid slide index:", index);
    return;
  }

  slideAnimation.value = false;
  setTimeout(() => {
    currentSlide.value = index;
    slideAnimation.value = true;
    log("Setting current slide to:", index);
  }, 300);
};

// Autoplay controls
const startAutoplay = () => {
  if (slides.value.length <= 1) {
    log("Not enough slides for autoplay");
    return;
  }

  stopAutoplay();
  log("Starting autoplay");
  autoplayInterval.value = setInterval(nextSlide, 5000);
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    log("Stopping autoplay");
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = null;
  }
};

// Touch handlers
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
  stopAutoplay();
  log("Touch start at:", touchStartX.value);
};

const handleTouchMove = (e: TouchEvent) => {
  touchEndX.value = e.touches[0].clientX;
  log("Touch move to:", touchEndX.value);
};

const handleTouchEnd = () => {
  const swipeThreshold = 50;
  const swipeDistance = touchStartX.value - touchEndX.value;

  log("Swipe distance:", swipeDistance);

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      nextSlide();
      log("Swiped left");
    } else {
      prevSlide();
      log("Swiped right");
    }
  }

  startAutoplay();
};

// Watchers for debugging
if (DEBUG) {
  watch(bannersData, (newData) => {
    log("Banner data updated:", newData);
  });

  watch(slides, (newSlides) => {
    log("Slides updated:", newSlides);
  });

  watch(currentSlide, (newSlide) => {
    log("Current slide changed to:", newSlide);
  });

  watch(slideAnimation, (newValue) => {
    log("Slide animation state:", newValue);
  });
}

// Lifecycle hooks
onMounted(() => {
  log("Component mounted");
  startAutoplay();
});

onBeforeUnmount(() => {
  log("Component unmounting");
  stopAutoplay();
});
</script>

<style lang="scss">
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }

  50% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}

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
  @apply absolute inset-0 z-10;
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
  @apply bg-black text-white hover:bg-white/50 hover:text-black font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-md transition-colors;
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
