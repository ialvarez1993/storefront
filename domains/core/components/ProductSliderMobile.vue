<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PropType } from "vue";
import type { Product, QueryProductsArgs } from "~/graphql";

const sliderContainer = ref<HTMLElement | null>(null);
const currentIndex = ref(0);

const props = defineProps({
  heading: String,
  text: String,
  ids: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  keyForComposable: {
    type: String,
    default: "",
  },
  firstVariant: {
    type: Object,
    required: false,
  },
});

const { loadProductTemplateList, loading, productTemplateList } = useProductTemplateList(props.keyForComposable);
const { getRegularPrice, getSpecialPrice } = useProductAttributes();
const { cartAdd } = useCart();

const calculateDiscount = (regular: number, special: number) => {
  return Math.round(((regular - special) / regular) * 100);
};

const scrollToIndex = (index: number) => {
  currentIndex.value = index;
  const element = sliderContainer.value?.children[index] as HTMLElement;
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }
};

const handleScroll = () => {
  if (sliderContainer.value) {
    const scrollPosition = sliderContainer.value.scrollLeft;
    const cardWidth = sliderContainer.value.offsetWidth;
    currentIndex.value = Math.round(scrollPosition / cardWidth);
  }
};

const loadProducts = async () => {
  const params: QueryProductsArgs = {
    pageSize: 15,
    filter: props.ids?.length > 0 ? { ids: props.ids } : undefined,
  };
  await loadProductTemplateList(params);
};

onMounted(() => {
  loadProducts();
  sliderContainer.value?.addEventListener('scroll', handleScroll);
});
</script>

<template>
  <section class="mobile-product-section">
    <h2 v-if="heading" class="mobile-heading">
      {{ heading }}
    </h2>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="productTemplateList.length > 0" class="product-slider-container">
      <div ref="sliderContainer" class="mobile-product-slider" @scroll.passive="handleScroll">
        <div v-for="(productTemplate, index) in productTemplateList" :key="productTemplate.id"
          class="mobile-product-card">
          <div class="card-inner">
            <!-- Badges -->
            <div class="badge-wrapper" v-if="productTemplate.firstVariant">
              <span v-if="getSpecialPrice(productTemplate.firstVariant)" class="discount-badge">
                -{{ calculateDiscount(
                  getRegularPrice(productTemplate.firstVariant),
                  getSpecialPrice(productTemplate.firstVariant)
                ) }}%
              </span>
              <span v-if="productTemplate.isNew" class="new-badge">
                Nuevo
              </span>
            </div>

            <!-- Image -->
            <div class="image-wrapper">
              <NuxtImg :src="$getImage(productTemplate.image, 250, 250, productTemplate.imageFilename)"
                class="product-image" loading="lazy" alt="Product Image" />

              <!-- Actions -->
              <div class="action-buttons">
                <button class="action-btn view">
                  <ModalProductSlider />
                </button>
                <button @click="cartAdd(productTemplate.firstVariant?.id, 1)" class="action-btn cart">
                  <i class="fas fa-shopping-cart"></i>
                </button>
              </div>
            </div>

            <!-- Info -->
            <div class="product-info">
              <p class="brand-name">{{ productTemplate.brand }}</p>
              <h3 class="product-name">{{ productTemplate.name }}</h3>

              <div v-if="productTemplate.firstVariant" class="price-wrapper">
                <span v-if="getSpecialPrice(productTemplate.firstVariant)" class="original-price">
                  {{ $currency(getRegularPrice(productTemplate.firstVariant)) }}
                </span>
                <span class="final-price">
                  {{ $currency(getSpecialPrice(productTemplate.firstVariant) ||
                    getRegularPrice(productTemplate.firstVariant)) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dots -->
      <div class="slider-dots">
        <button v-for="(_, index) in productTemplateList" :key="index"
          :class="['dot', { active: currentIndex === index }]" @click="scrollToIndex(index)" type="button"
          :aria-label="`Go to slide ${index + 1}`">
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.mobile-product-section {
  @apply w-full px-4 py-6;
}

.mobile-heading {
  @apply text-xl font-bold text-center mb-6;
  font-family: var(--font-header, sans-serif);
}

.loading-container {
  @apply flex justify-center items-center min-h-[200px];
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-gray-200 rounded-full animate-spin;
  border-top-color: #3B82F6;
}

.product-slider-container {
  @apply relative;
}

.mobile-product-slider {
  @apply flex overflow-x-auto snap-x snap-mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.mobile-product-card {
  @apply flex-none w-[85vw] snap-center px-2;
}

.card-inner {
  @apply bg-white rounded-xl shadow-sm overflow-hidden relative;
}

.badge-wrapper {
  @apply absolute top-2 left-2 z-10 flex flex-col gap-1;
}

.discount-badge,
.new-badge {
  @apply px-2 py-1 text-xs font-bold rounded-full text-white;
}

.discount-badge {
  @apply bg-red-500;
}

.new-badge {
  @apply bg-yellow-500;
}

.image-wrapper {
  @apply relative aspect-square;
}

.product-image {
  @apply w-full h-full object-cover;
  transition: transform 0.3s ease;
}

.action-buttons {
  @apply absolute bottom-2 right-2 flex gap-2;
}

.action-btn {
  @apply w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md;
  transition: transform 0.2s ease;

  &:active {
    @apply transform scale-95;
  }

  &.view {
    @apply text-black;
  }

  &.cart {
    @apply text-black;
  }
}

.product-info {
  @apply p-4 space-y-2;
}

.brand-name {
  @apply text-sm text-gray-500;
}

.product-name {
  @apply text-base font-medium line-clamp-2;
}

.price-wrapper {
  @apply flex items-center gap-2 mt-2;
}

.original-price {
  @apply text-sm text-gray-400 line-through;
}

.final-price {
  @apply text-lg font-bold text-black;
}

.slider-dots {
  @apply flex justify-center gap-2 mt-4;
}

.dot {
  @apply w-2 h-2 rounded-full bg-gray-300 transition-all duration-300;

  &.active {
    @apply w-4 bg-black;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-inner {
  animation: fadeIn 0.3s ease-out;
}
</style>
