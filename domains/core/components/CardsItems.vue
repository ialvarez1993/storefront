<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import PromoCard from "./ui/PromoCard.vue";

const props = defineProps({
  heading: String,
  text: String,
  keyForComposable: { type: String, default: "" },
});

const currentSlide = ref(0);
const itemsPerSlide = ref(calculateItemsPerSlide());

const { loadProductTemplateList, loading, productTemplateList } =
  useProductTemplateList(props.keyForComposable);
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

function calculateItemsPerSlide() {
  if (typeof window === "undefined") return 12;
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1536) return 15;
  if (screenWidth >= 1280) return 12;
  if (screenWidth >= 1024) return 9;
  if (screenWidth >= 768) return 6;
  return 4;
}

const handleResize = () => {
  itemsPerSlide.value = calculateItemsPerSlide();
};

const chunks = computed(() => {
  if (!productTemplateList.value) return [];
  const result = [];
  for (
    let i = 0;
    i < productTemplateList.value.length;
    i += itemsPerSlide.value
  ) {
    result.push(productTemplateList.value.slice(i, i + itemsPerSlide.value));
  }
  return result;
});

const totalSlides = computed(() => chunks.value.length);
const canSlideLeft = computed(() => currentSlide.value > 0);
const canSlideRight = computed(
  () => currentSlide.value < totalSlides.value - 1,
);

const slideLeft = () => {
  if (canSlideLeft.value) {
    currentSlide.value--;
  }
};

const slideRight = () => {
  if (canSlideRight.value) {
    currentSlide.value++;
  }
};

onMounted(async () => {
  await loadProductTemplateList({ pageSize: 24 }, true);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <section class="product-slider-section">
    <div class="product-slider-container">
      <div class="product-slider-grid">
        <PromoCard />

        <div class="product-slider-content">
          <h1 class="product-slider-heading">
            {{ $t("CardSlide") }}
          </h1>

          <div v-if="loading" class="product-slider-loading">
            <div v-for="n in 12" :key="n" class="product-slider-skeleton">
              <div class="product-slider-skeleton-image"></div>
              <div class="product-slider-skeleton-text">
                <div class="skeleton-line"></div>
                <div class="skeleton-line-short"></div>
              </div>
            </div>
          </div>

          <div v-else class="product-slider-wrapper">
            <button
              class="product-slider-nav-btn product-slider-prev"
              @click="slideLeft"
              v-show="canSlideLeft"
            >
              <i class="fas fa-chevron-left"></i>
            </button>

            <div class="product-slider-track-container">
              <div
                class="product-slider-track"
                :style="{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }"
              >
                <div
                  v-for="(chunk, index) in chunks"
                  :key="index"
                  class="product-slider-slide"
                >
                  <div class="product-slider-grid-layout">
                    <div
                      v-for="product in chunk"
                      :key="product.id"
                      class="product-slider-card"
                    >
                      <div class="product-slider-image-container">
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
                          class="product-slider-image"
                          loading="lazy"
                        />
                        <div
                          v-if="getSpecialPrice(product.firstVariant)"
                          class="product-slider-discount"
                        >
                          -{{
                            calculateDiscount(
                              getRegularPrice(product.firstVariant),
                              getSpecialPrice(product.firstVariant),
                            )
                          }}%
                        </div>
                      </div>

                      <div class="product-slider-details">
                        <NuxtLink :to="product.slug">
                          <h3 class="product-slider-title">
                            {{ product.name }}
                          </h3>
                        </NuxtLink>
                        <div class="product-slider-price">
                          <span
                            v-if="getSpecialPrice(product.firstVariant)"
                            class="product-slider-regular-price"
                          >
                            {{
                              $currency(getRegularPrice(product.firstVariant))
                            }}
                          </span>
                          <span class="product-slider-special-price">
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

            <button
              class="product-slider-nav-btn product-slider-next"
              @click="slideRight"
              v-show="canSlideRight"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.product-slider {
  &-section {
    @apply relative  overflow-hidden;
  }

  &-container {
    @apply max-w-[1920px] mx-auto px-2 sm:px-4 lg:px-6 w-full;
  }

  &-grid {
    @apply grid lg:grid-cols-[300px_1fr] gap-3 sm:gap-4 lg:gap-6;
  }

  &-content {
    @apply w-full;
  }

  &-heading {
    @apply text-lg font-header sm:text-xl lg:text-2xl font-bold text-black mb-3 sm:mb-4 text-center px-2;
  }

  &-loading {
    @apply grid gap-3;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  &-skeleton {
    @apply animate-pulse space-y-3;

    &-image {
      @apply bg-gray-200 rounded-lg aspect-square;
    }

    &-text {
      @apply space-y-2;
    }
  }

  &-wrapper {
    @apply relative overflow-hidden;
  }

  &-nav-btn {
    @apply absolute top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 w-10 h-10 flex items-center justify-center;

    &.product-slider-prev {
      @apply left-2;
    }

    &.product-slider-next {
      @apply right-2;
    }
  }

  &-track-container {
    @apply overflow-hidden w-full;
  }

  &-track {
    @apply flex transition-transform duration-500 ease-in-out;
  }

  &-slide {
    @apply w-full flex-shrink-0;
  }

  &-grid-layout {
    @apply grid gap-3 p-2;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  &-card {
    @apply bg-white rounded-lg shadow-sm transition-all duration-300 h-full transform-gpu flex flex-col;
    min-width: 200px;
    max-width: 300px;
    margin: 0 auto;
    width: 100%;

    &:hover {
      @apply shadow-lg -translate-y-0.5;
    }
  }

  &-image-container {
    @apply relative overflow-hidden rounded-t-lg bg-white p-2;
    aspect-ratio: 1 / 1;
  }

  &-image {
    @apply w-full h-full object-contain transition-transform duration-300;

    .product-slider-card:hover & {
      @apply scale-110;
    }
  }

  &-discount {
    @apply absolute top-1 left-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full;
  }

  &-details {
    @apply p-2 bg-white rounded-b-lg flex-grow;
  }

  &-title {
    @apply text-xs sm:text-sm font-medium text-gray-800 line-clamp-2;
  }

  &-price {
    @apply mt-1 flex items-center gap-2;
  }

  &-regular-price {
    @apply text-gray-500 text-xs line-through;
  }

  &-special-price {
    @apply text-sm font-bold text-gray-900;
  }
}

// Optimizaciones
.product-slider-track,
.product-slider-card {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
