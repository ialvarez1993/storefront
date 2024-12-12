<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { useToast } from "vue-toastification";

let confetti:
  | typeof import("canvas-confetti")
  | ((arg0: {
      particleCount: number;
      spread: number;
      origin: { y: number };
      colors: string[];
    }) => void)
  | null = null;

// Importación dinámica para evitar problemas de SSR
onMounted(async () => {
  confetti = (await import("canvas-confetti")).default;
});

const lanzarConfeti = () => {
  if (confetti) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"],
    });
  }
};

import gsap from "gsap";
import {
  SfButton,
  SfChip,
  SfCounter,
  SfIconCompareArrows,
  SfIconFavorite,
  SfIconFavoriteFilled,
  SfIconPackage,
  SfIconSafetyCheck,
  SfIconSell,
  SfIconShoppingCart,
  SfIconShoppingCartCheckout,
  SfIconWarehouse,
  SfLink,
  SfRating,
  SfThumbnail,
} from "@storefront-ui/vue";
import type { LocationQueryRaw } from "vue-router";
import type { OrderLine, Product } from "~/graphql";

// Composables initialization
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { list } = useRecentViewProducts();

// Refs
const productDetailsOpen = ref(true);
const quantitySelectorValue = ref(1);
const isLoading = ref(false);
const productSection = ref(null);
const imageGallery = ref(null);
const addToCartButton = ref(null);
const isWishlistProcessing = ref(false);
const wishlistError = ref<string | null>(null);

// Product composables
const {
  loadProductTemplate,
  productTemplate,
  loadingProductTemplate,
  getAllColors,
  getAllMaterials,
  getAllSizes,
} = useProductTemplate(route.path);

const {
  loadProductVariant,
  loadingProductVariant,
  productVariant,
  getImages,
  breadcrumbs,
  getRegularPrice,
  getSpecialPrice,
} = useProductVariant(route.fullPath);

const { addProductToRecentViews } = useRecentViewProducts();
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist();
const { cart, cartAdd } = useCart();

const toast = useToast();

useHead(productHead(productVariant.value, String(route.fullPath)));

// Computed properties
const params = computed(() => ({
  combinationId: Object.values(route.query)?.map((value) =>
    parseInt(value as string),
  ),
  productTemplateId: productTemplate?.value?.id,
}));

const selectedFilters = computed(() => ({
  size: Number(route.query.Size) || getAllSizes?.value?.[0]?.value,
  color: Number(route.query.Color) || getAllColors?.value?.[0]?.value,
  material: Number(route.query.Material) || getAllMaterials?.value?.[0]?.value,
}));

const tomorrow = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toDateString().slice(0, 10);
});

const productsInCart = computed(() => {
  return (
    cart.value?.order?.orderLines?.find(
      (orderLine: OrderLine) =>
        orderLine.product?.id === productVariant?.value.id,
    )?.quantity || 0
  );
});

const discountPercentage = computed(() => {
  if (!getSpecialPrice || !getRegularPrice) return 0;
  return Math.round(
    ((getRegularPrice - getSpecialPrice) / getRegularPrice) * 100,
  );
});

// Methods
const handleWishlistAddItem = async (product: Product) => {
  try {
    toast.success("Se ha agregado a Favorito");
    lanzarConfeti();
    isWishlistProcessing.value = true;
    wishlistError.value = null;
    await wishlistAddItem(product.id);
  } catch (error) {
    wishlistError.value = error.message || "Error adding to wishlist";
  } finally {
    isWishlistProcessing.value = false;
  }
};

const handleWishlistRemoveItem = async (product: Product) => {
  try {
    isWishlistProcessing.value = true;
    wishlistError.value = null;
    await wishlistRemoveItem(product.id);
  } catch (error) {
    wishlistError.value = error.message || "Error removing from wishlist";
  } finally {
    isWishlistProcessing.value = false;
  }
};

const handleCartAdd = async () => {
  const id = productVariant?.value.combinationInfoVariant
    ? productVariant?.value.id
    : Number(productVariant?.value.firstVariant?.id);
  await cartAdd(id, quantitySelectorValue.value);
};

const updateFilter = async (filter: LocationQueryRaw | undefined) => {
  const query: LocationQueryRaw = {
    ...(selectedFilters.value.material && {
      Material: selectedFilters.value.material,
    }),
    ...(selectedFilters.value.color && { Color: selectedFilters.value.color }),
    ...(selectedFilters.value.size && { Size: selectedFilters.value.size }),
    ...filter,
  };
  await navigateTo({ query });
};

// Lifecycle hooks
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

// Intersection observer
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
        <section ref="imageGallery" class="gallery-section">
          <div class="gallery-wrapper">
            <LazyUiGallery :images="getImages" class="gallery" />
          </div>
        </section>

        <section class="details-section">
          <div class="details-card">
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
              <div class="price-wrapper">
                <span class="current-price">
                  {{ $currency(getSpecialPrice || getRegularPrice) }}
                </span>
                <span v-if="getSpecialPrice" class="original-price !text-xs">
                  {{ $currency(getRegularPrice) }}
                </span>
              </div>
            </div>

            <div class="mt-2">
              <span>{{ $t("stockProductTypes") }}</span>
              <span class="mx-1 text-green-700" style="display: inline">
                <svg
                  style="display: inline-block; vertical-align: middle"
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    d="M3.5 6.43688L5.62488 8.56188C6.90372 6.99748 10.9823 2.25069 12 1"
                    stroke="currentColor"
                    stroke-width="1.25"
                  ></path>
                  <path
                    d="M10.8744 5.88869C11.3941 8.16809 10.2647 10.5033 8.15522 11.5112C6.04571 12.5191 3.51938 11.9305 2.0725 10.0942C0.625616 8.25777 0.644548 5.6639 2.11808 3.84882C3.59161 2.03375 6.12627 1.48215 8.22083 2.52073"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
                <span style="display: inline-block; vertical-align: middle">
                  {{ $t("stockProduct") }}
                </span>
              </span>
            </div>

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

            <div class="actions-section">
              <div class="primary-actions">
                <div class="quantity-wrapper">
                  <button
                    class="quantity-btn"
                    @click="
                      quantitySelectorValue > 1 && quantitySelectorValue--
                    "
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    v-model="quantitySelectorValue"
                    class="quantity-input"
                    min="1"
                    @input="
                      (e) =>
                        (quantitySelectorValue = Math.max(
                          1,
                          parseInt(e.target.value) || 1,
                        ))
                    "
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

              <div class="flex w-full items-center justify-center">
                <SfButton
                  type="button"
                  size="sm"
                  variant="tertiary"
                  :class="[
                    'flex items-center justify-center space-x-2',
                    productVariant?.isInWishlist
                      ? 'bg-primary-100'
                      : 'bg-white',
                  ]"
                  @click="
                    isInWishlist(productVariant?.id as number)
                      ? handleWishlistRemoveItem(productVariant)
                      : handleWishlistAddItem(productVariant)
                  "
                >
                  <SfIconFavoriteFilled
                    v-show="isInWishlist(productVariant?.id as number)"
                    size="sm"
                    class="shrink-0"
                  />
                  <SfIconFavorite
                    v-show="!isInWishlist(productVariant?.id as number)"
                    size="sm"
                    class="shrink-0"
                  />
                  <span class="ml-2">
                    {{
                      isInWishlist(productVariant?.id as number)
                        ? $t("wishlist.removeFromWishlist")
                        : $t("wishlist.addToWishlist")
                    }}
                  </span>
                </SfButton>
              </div>
            </div>

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
  @apply lg:col-span-5 -mt-[4rem];
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
