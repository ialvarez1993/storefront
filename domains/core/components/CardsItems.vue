<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useWindowSize } from "@vueuse/core";
import PromoCard from "./ui/PromoCard.vue";

const props = defineProps({
  heading: String,
  text: String,
  keyForComposable: { type: String, default: "" },
});

const { width } = useWindowSize();
const activeIndex = ref(0);
const touchStart = ref(0);
const autoPlayInterval = ref(null);

const { loadProductTemplateList, loading, productTemplateList } =
  useProductTemplateList(props.keyForComposable);
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const getVisibleProducts = computed(() => {
  if (width.value < 480) return 1; // Móviles pequeños
  if (width.value < 640) return 2; // Móviles grandes
  if (width.value < 768) return 3; // Tablets pequeñas
  if (width.value < 1024) return 4; // Tablets
  if (width.value < 1280) return 5; // Desktop pequeño
  return 6; // Desktop grande
});

const totalSlides = computed(() =>
  Math.ceil(
    (productTemplateList.value?.length || 0) / getVisibleProducts.value,
  ),
);

const slideWidth = computed(() => `${100 / getVisibleProducts.value}%`);
const translateX = computed(() => `-${activeIndex.value * 100}%`);

const handleNavigation = (direction: "prev" | "next") => {
  if (direction === "next") {
    activeIndex.value = (activeIndex.value + 1) % totalSlides.value;
  } else {
    activeIndex.value =
      activeIndex.value === 0 ? totalSlides.value - 1 : activeIndex.value - 1;
  }
};

const handleTouch = {
  start: (e: TouchEvent) => {
    touchStart.value = e.touches[0].clientX;
  },
  move: (e: TouchEvent) => {
    if (width.value < 640) e.preventDefault();
  },
  end: (e: TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.value - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(diff) > minSwipeDistance) {
      handleNavigation(diff > 0 ? "next" : "prev");
    }
  },
};

onMounted(async () => {
  await loadProductTemplateList({ pageSize: 12 }, true);
  autoPlayInterval.value = setInterval(() => {
    if (!document.hidden && productTemplateList.value?.length) {
      handleNavigation("next");
    }
  }, 5000);
});

onBeforeUnmount(() => {
  if (autoPlayInterval.value) clearInterval(autoPlayInterval.value);
});
</script>

<template>
  <section
    class="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
  >
    <div class="max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6">
      <div class="grid lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <!-- Promo Card -->
        <PromoCard />

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <h1
            class="text-lg font-header mt-20 sm:text-xl lg:text-2xl font-bold text-black mb-3 sm:mb-4 text-center px-2"
          >
            {{ $t("CardSlide") }}
          </h1>

          <div
            v-if="loading"
            class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          >
            <div
              v-for="n in getVisibleProducts"
              :key="n"
              class="animate-pulse space-y-3"
            >
              <div class="bg-gray-200 rounded-lg aspect-square"></div>
              <div class="space-y-2">
                <div class="h-3 bg-gray-200 rounded"></div>
                <div class="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>

          <div
            v-else
            class="relative mt-32 overflow-hidden"
            @touchstart="handleTouch.start"
            @touchmove="handleTouch.move"
            @touchend="handleTouch.end"
          >
            <div class="slider-container">
              <div
                class="slider-track"
                :style="{ transform: `translateX(${translateX})` }"
              >
                <div
                  v-for="product in productTemplateList"
                  :key="product.id"
                  class="slider-item"
                  :style="{ width: slideWidth }"
                >
                  <div class="product-card">
                    <div
                      class="relative aspect-square overflow-hidden rounded-t-lg bg-white p-2 sm:p-3"
                    >
                      <img
                        :src="
                          $getImage(
                            String(product.image),
                            250,
                            250,
                            String(product.imageFilename),
                          )
                        "
                        :alt="product.name"
                        class="w-full h-full object-contain transform transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                      <div
                        v-if="getSpecialPrice(product.firstVariant)"
                        class="absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                      >
                        -{{
                          calculateDiscount(
                            getRegularPrice(product.firstVariant),
                            getSpecialPrice(product.firstVariant),
                          )
                        }}%
                      </div>
                    </div>

                    <div class="p-2 sm:p-3 bg-white rounded-b-lg">
                      <h3
                        class="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2"
                      >
                        {{ product.name }}
                      </h3>
                      <div class="mt-1 sm:mt-2 space-y-0.5">
                        <div class="flex items-center justify-between">
                          <span class="text-gray-500 text-xs line-through">
                            {{
                              $currency(getRegularPrice(product.firstVariant))
                            }}
                          </span>
                          <span
                            class="text-sm sm:text-base font-bold text-gray-900"
                          >
                            {{
                              $currency(
                                getSpecialPrice(product.firstVariant) ||
                                  getRegularPrice(product.firstVariant),
                              )
                            }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div
              class="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none"
            >
              <button
                v-show="activeIndex > 0"
                @click="handleNavigation('prev')"
                class="pointer-events-auto p-1 rounded-full bg-white/80 shadow-lg hover:bg-white transition ml-0.5 sm:ml-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Icon
                  name="heroicons:chevron-left"
                  class="w-3 h-3 sm:w-4 sm:h-4"
                />
              </button>

              <button
                v-show="activeIndex < totalSlides - 1"
                @click="handleNavigation('next')"
                class="pointer-events-auto p-1 rounded-full bg-white/80 shadow-lg hover:bg-white transition mr-0.5 sm:mr-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Icon
                  name="heroicons:chevron-right"
                  class="w-3 h-3 sm:w-4 sm:h-4"
                />
              </button>
            </div>

            <!-- Pagination Dots -->
            <div class="flex justify-center gap-1 mt-2 sm:mt-3">
              <button
                v-for="n in totalSlides"
                :key="n"
                @click="activeIndex = n - 1"
                class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300"
                :class="
                  activeIndex === n - 1
                    ? 'bg-blue-500 w-3 sm:w-4'
                    : 'bg-gray-300'
                "
                :aria-label="`Go to slide ${n}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.slider-container {
  overflow: hidden;
  width: 100%;
  position: relative;
  touch-action: pan-y pinch-zoom;
}

.slider-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.slider-item {
  flex: 0 0 auto;
  padding: 0 0.375rem;

  @media (min-width: 480px) {
    width: 50%;
  }

  @media (min-width: 640px) {
    width: 33.333333%;
    padding: 0 0.5rem;
  }

  @media (min-width: 768px) {
    width: 25%;
  }

  @media (min-width: 1024px) {
    width: 20%;
  }

  @media (min-width: 1280px) {
    width: 16.666667%;
  }
}

.product-card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  height: 100%;
  transform: translateZ(0);

  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 479px) {
    max-width: calc(100vw - 2rem);
    margin: 0 auto;
  }

  @media (min-width: 480px) {
    max-width: 240px;
  }

  @media (min-width: 640px) {
    max-width: 280px;
  }

  @media (min-width: 768px) {
    max-width: 300px;
  }

  @media (min-width: 1024px) {
    max-width: 320px;
  }
}

// Optimizaciones de rendimiento
.slider-track,
.product-card {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}

// Estilos para dispositivos táctiles
@media (hover: none) {
  .slider-container {
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
  }
}

// Optimización de imágenes para pantallas retina
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .product-card img {
    image-rendering: -webkit-optimize-contrast;
  }
}
</style>
