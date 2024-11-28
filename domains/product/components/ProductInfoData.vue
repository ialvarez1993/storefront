<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import gsap from "gsap";

// Estados y refs
const route = useRoute();
const productDetailsOpen = ref(true);
const quantitySelectorValue = ref(1);
const isLoading = ref(false);
const productSection = ref(null);
const imageGallery = ref(null);
const addToCartButton = ref(null);

// Composables
const {
  productTemplate,
  loadProductTemplate,
  getAllColors,
  getAllMaterials,
  getAllSizes,
} = useProductTemplate(route.path);
const {
  loadProductVariant,
  productVariant,
  getImages,
  getRegularPrice,
  getSpecialPrice,
} = useProductVariant(route.fullPath);
const { addProductToRecentViews } = useRecentViewProducts();
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist();
const { cart, cartAdd } = useCart();
const { t } = useI18n();

// Computed Properties
const params = computed(() => ({
  combinationId: Object.values(route.query)?.map((v) => parseInt(v as string)),
  productTemplateId: productTemplate?.value?.id,
}));

const selectedFilters = computed(() => ({
  size: Number(route.query.Size) || getAllSizes?.value?.[0]?.value,
  color: Number(route.query.Color) || getAllColors?.value?.[0]?.value,
  material: Number(route.query.Material) || getAllMaterials?.value?.[0]?.value,
}));

const tomorrow = computed(() =>
  new Date(Date.now() + 86400000).toDateString().slice(0, 10),
);

const discountPercentage = computed(() => {
  if (getSpecialPrice && getRegularPrice) {
    return Math.round(
      ((getRegularPrice - getSpecialPrice) / getRegularPrice) * 100,
    );
  }
  return 0;
});

// Métodos
const handleCartAdd = async () => {
  isLoading.value = true;
  let id = productVariant?.value.id;
  if (!productVariant.value.combinationInfoVariant) {
    id = Number(productVariant?.value.firstVariant?.id);
  }

  await cartAdd(id, quantitySelectorValue.value);

  gsap.to(addToCartButton.value, {
    scale: 1.05,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
  });
};

const updateFilter = (filter) => {
  navigateTo({
    query: { ...route.query, ...filter },
  });
};

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadProductTemplate({ slug: route.path }),
    loadProductVariant(params.value),
  ]);
  addProductToRecentViews(productTemplate.value?.id);

  gsap.from(productSection.value, {
    opacity: 0,
    y: 20,
    duration: 0.6,
  });
});

const { stop } = useIntersectionObserver(
  imageGallery,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      gsap.to(imageGallery.value, {
        backgroundPosition: "50% 100%",
        ease: "none",
        scrollTrigger: {
          trigger: imageGallery.value,
          scrub: true,
        },
      });
    }
  },
);
</script>

<template>
  <NuxtErrorBoundary>
    <div
      v-if="productTemplate?.id"
      ref="productSection"
      class="product-container"
    >
      <div class="product-grid">
        <!-- Galería de imágenes -->
        <section ref="imageGallery" class="gallery-section">
          <div class="gallery-wrapper">
            <LazyUiGallery :images="getImages" class="gallery" />
          </div>
        </section>

        <!-- Detalles del producto -->
        <section class="details-section">
          <div class="details-card">
            <!-- Badges y título -->
            <div class="header-section">
              <div class="badges-container">
                <div
                  v-if="
                    productVariant?.combinationInfoVariant?.has_discounted_price
                  "
                  class="discount-badge"
                >
                  <i class="fas fa-tag"></i>
                  -{{ discountPercentage }}%
                </div>
                <div v-if="productVariant?.isNew" class="new-badge">
                  {{ t("new") }}
                </div>
              </div>

              <h1 class="product-title uppercase">
                {{ productVariant?.name }}
              </h1>
            </div>

            <div class="price-rating-container mt-3">
              <div class="price-wrapper mx-2">
                <span class="current-price !text-xs">
                  {{ $currency(getSpecialPrice || getRegularPrice) }}
                </span>
                <span v-if="getSpecialPrice" class="original-price !text-xs">
                  {{ $currency(getRegularPrice) }}
                </span>
              </div>
            </div>

            <div class="mt-2">
              <span>Disponible:</span>
              <span class="mx-3 text-green-700"
                >En stock, listo para ser enviado</span
              >
            </div>

            <!-- Variantes -->
            <div class="variants-section">
              <div
                v-for="(options, type) in {
                  size: getAllSizes,
                  color: getAllColors,
                  material: getAllMaterials,
                }"
                :key="type"
                v-if="options?.length"
                class="variant-group"
              >
                <label class="variant-label">{{ type }}</label>
                <div class="variants-grid">
                  <button
                    v-for="{ label, value } in options"
                    :key="value"
                    class="variant-button"
                    :class="{
                      'variant-button--selected':
                        value === selectedFilters[type],
                    }"
                    @click="updateFilter({ [type]: value })"
                  >
                    <span
                      v-if="type === 'color'"
                      class="color-preview"
                      :style="{ backgroundColor: label }"
                    ></span>
                    <span>{{ label }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div class="actions-section">
              <div class="primary-actions">
                <div class="quantity-wrapper">
                  <button class="quantity-btn" @click="quantitySelectorValue--">
                    <i class="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    v-model="quantitySelectorValue"
                    class="quantity-input"
                    min="1"
                  />
                  <button class="quantity-btn" @click="quantitySelectorValue++">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <button
                  ref="addToCartButton"
                  class="add-cart-btn"
                  :disabled="isLoading"
                  @click="handleCartAdd"
                >
                  <i class="fas fa-shopping-cart"></i>
                  {{ t("addToCart") }}
                </button>
              </div>

              <button
                class="wishlist-btn"
                @click="isInWishlist ? wishlistRemoveItem : wishlistAddItem"
              >
                <i
                  :class="['fas', isInWishlist ? 'fa-heart' : 'fa-heart-o']"
                ></i>
                {{ t("addToWishlist") }}
              </button>
            </div>

            <!-- Información adicional -->
            <div class="info-section">
              <div class="info-card">
                <i class="fas fa-truck"></i>
                <span>{{ t("deliveryEstimate", { date: tomorrow }) }}</span>
              </div>
              <div class="info-card">
                <i class="fas fa-undo"></i>
                <span>{{ t("freeReturns") }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </NuxtErrorBoundary>
</template>

<style lang="scss">
// Variables
:root {
  --primary-color: #2a2a2a;
  --secondary-color: #f8f8f8;
  --accent-color: #f7b013;
  --success-color: #4caf50;
  --text-color: #333;
  --border-radius: 12px;
  --transition: all 0.3s ease;
}

// Container y Grid
.product-container {
  @apply max-w-[1440px] mx-auto px-6 py-12;
}

.product-grid {
  @apply grid grid-cols-1 lg:grid-cols-12 gap-12;
}

// Galería
.gallery-section {
  @apply lg:col-span-7;
}

.gallery-wrapper {
  @apply sticky top-24;

  .gallery {
    @apply rounded-2xl overflow-hidden;
    box-shadow: var(--shadow);
    transition: var(--transition);

    img {
      @apply rounded-2xl;
      transition: var(--transition);
    }
  }
}

// Detalles
.details-section {
  @apply lg:col-span-5;
}

.details-card {
  @apply sticky top-24 bg-white rounded-2xl p-8;
  box-shadow: var(--shadow);
}

// Header Section
.header-section {
  @apply space-y-6;
}

.badges-container {
  @apply flex gap-3;
}

.discount-badge,
.new-badge {
  @apply px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2;
  transition: var(--transition);
}

.discount-badge {
  background: linear-gradient(135deg, #ff6b6b, #ff8585);
  color: white;
}

.new-badge {
  background: linear-gradient(135deg, #2a2a2a, #404040);
  color: white;
}

.product-title {
  @apply text-3xl font-bold text-gray-900;
}

// Precio y Rating
.price-rating-container {
  @apply flex justify-between items-center;
}

.price-wrapper {
  @apply flex items-baseline gap-3;
}

.current-price {
  @apply text-2xl font-bold text-gray-900;
}

.original-price {
  @apply text-2xl text-gray-500 line-through;
}

.rating-wrapper {
  @apply flex items-center gap-2;

  .fa-star {
    color: #ffd700;
  }
}

// Variantes
.variants-section {
  @apply space-y-6 my-8;
}

.variant-group {
  @apply space-y-3;
}

.variant-label {
  @apply text-sm font-semibold uppercase tracking-wider text-gray-700;
}

.variants-grid {
  @apply grid grid-cols-4 gap-3;
}

.variant-button {
  @apply px-4 py-3 rounded-lg flex items-center justify-center;
  border: 2px solid #e5e5e5;
  transition: var(--transition);

  &:hover {
    border-color: var(--accent-color);
  }

  &--selected {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }
}

// Acciones
.actions-section {
  @apply space-y-4;
}

.primary-actions {
  @apply flex gap-4;
}

.quantity-wrapper {
  @apply flex items-center border-2 border-gray-200 rounded-lg;
}

.quantity-btn {
  @apply px-4 py-3 text-gray-500;
  transition: var(--transition);

  &:hover {
    color: var(--accent-color);
  }
}

.quantity-input {
  @apply w-16 text-center border-none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
}

.add-cart-btn {
  @apply flex-1 py-3 px-6 rounded-lg text-white font-semibold;
  background: linear-gradient(135deg, var(--accent-color), #f7b013);
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  }
}

.wishlist-btn {
  @apply w-full py-3 rounded-lg font-semibold;
  border: 2px solid var(--accent-color);
  color: var(--accent-color);
  transition: var(--transition);

  &:hover {
    background-color: var(--accent-color);
    color: white;
  }
}

// Información adicional
.info-section {
  @apply mt-8 space-y-4;
}

.info-card {
  @apply flex items-center gap-3 p-4 rounded-lg bg-gray-50;
  transition: var(--transition);

  &:hover {
    background-color: #f5f5f5;
  }

  i {
    @apply text-gray-600;
  }
}
</style>
