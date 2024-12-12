<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { PropType } from "vue";
import type { Product, QueryProductsArgs } from "~/graphql";
import { useProductTemplateList } from "../../product/composables/useProductTemplateList";
import ModalProductSlider from "../components/ModalProductSlider.vue";
import { useCart } from "../../cart-odoo/composables/useCart";
import { useProductAttributes } from "../../product/composables/useProductAttributes";
import { useWishlist } from "../../wishlist/composables/useWishlist";

const capitalize = (str: string): string => {
  if (typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const { cartAdd } = useCart();
const sliderContainer = ref<HTMLElement | null>(null);
const currentIndex = ref(0);

const props = defineProps({
  data: Object,
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
  isModal: {
    type: Boolean,
    default: false,
  },
  isButton: {
    type: Boolean,
    default: true,
  },
});

const { loadProductTemplateList, loading, productTemplateList } =
  useProductTemplateList(props.keyForComposable, props.keyForComposable);
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const scrollAmount = computed(() => {
  if (typeof window !== "undefined") {
    return window.innerWidth < 768 ? 220 : 1200;
  }
  return 1200;
});

const handlePrev = () => {
  if (sliderContainer.value) {
    sliderContainer.value.scrollLeft -= scrollAmount.value;
  }
};

const handleNext = () => {
  if (sliderContainer.value) {
    sliderContainer.value.scrollLeft += scrollAmount.value;
  }
};

const calculateDiscount = (regular: number, special: number) => {
  return Math.round(((regular - special) / regular) * 100);
};

const loadProducts = async () => {
  const params: QueryProductsArgs = {
    pageSize: 15,
  };

  if (props.ids?.length > 0) {
    params.filter = { ids: props.ids } as any;
  }

  await loadProductTemplateList(params, true);
};

const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist();

const handleWishlistAddItem = async (firstVariant: Product) => {
  await wishlistAddItem(firstVariant.id);
};

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id);
};

onMounted(() => {
  loadProducts();
});
</script>

<template>
  <section
    :class="[
      'px-2 py-6 w-full mx-auto',
      isModal ? 'max-w-full' : 'max-w-[1440px]',
    ]"
  >
    <h2
      v-if="heading"
      class="text-center font-bold !font-header uppercase mb-10 typography-headline-3 md:typography-headline-2"
    >
      {{ heading }}
    </h2>

    <div v-if="loading" class="flex justify-center items-center py-4">
      <span class="loading-spinner"></span>
    </div>

    <div v-else-if="productTemplateList.length > 0" class="relative">
      <div class="flex justify-center items-center">
        <button @click="handlePrev" class="nav-btn left-0 md:left-2">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div
          ref="sliderContainer"
          class="flex overflow-x-hidden scroll-smooth gap-2 md:gap-3 px-2 md:px-8"
        >
          <div
            v-for="productTemplate in productTemplateList"
            :key="productTemplate.id"
            class="product-card"
          >
            <div class="card-content">
              <div class="badges-container">
                <span
                  v-if="
                    getSpecialPrice(productTemplate.firstVariant as Product)
                  "
                  class="badge discount"
                >
                  -{{
                    calculateDiscount(
                      getRegularPrice(productTemplate.firstVariant as Product),
                      getSpecialPrice(productTemplate.firstVariant as Product),
                    )
                  }}%
                </span>
                <span v-if="productTemplate.isNew" class="badge new">New</span>
              </div>

              <div class="img-container">
                <NuxtImg
                  :src="
                    $getImage(
                      String(productTemplate.image),
                      250,
                      250,
                      String(productTemplate.imageFilename),
                    )
                  "
                  class="product-img"
                />

                <div class="hover-overlay">
                  <div class="action-buttons">
                    <ModalProductSlider :data="productTemplate" />
                    <button
                      class="action-btn cart"
                      @click="cartAdd(productTemplate.firstVariant?.id, 1)"
                    >
                      <i class="fas fa-shopping-cart"></i>
                      <span class="btn-tooltip">Comprar Ahora</span>
                    </button>
                  </div>
                </div>
              </div>

              <div class="product-info">
                <p class="brand">{{ productTemplate.brand }}</p>
                <NuxtLink :to="productTemplate.slug">
                  <h3 class="title">{{ productTemplate?.name }}</h3>
                </NuxtLink>

                <div>
                  <NuxtLink
                    v-for="categories in productTemplate.categories"
                    :key="categories.id"
                    :to="categories.slug"
                    class="inline-block"
                  >
                    <span
                      class="inline-block px-3 mr-4 mb-1 py-1 text-sm font-semibold text-black bg-yellow-400 rounded-full capitalize"
                    >
                      {{ capitalize(categories.name) }}
                    </span>
                  </NuxtLink>
                </div>

                <div v-if="productTemplate.rating" class="rating">
                  <div class="stars">
                    <i
                      v-for="n in 5"
                      :key="n"
                      class="fas fa-star"
                      :class="n <= productTemplate.rating ? 'active' : ''"
                    ></i>
                  </div>
                  <span class="reviews"
                    >({{ productTemplate.ratingCount }})</span
                  >
                </div>

                <div class="price-container">
                  <span
                    v-if="
                      getSpecialPrice(productTemplate.firstVariant as Product)
                    "
                    class="original-price"
                  >
                    {{
                      $currency(
                        getRegularPrice(
                          productTemplate.firstVariant as Product,
                        ),
                      )
                    }}
                  </span>
                  <span class="final-price">
                    {{
                      $currency(
                        getSpecialPrice(
                          productTemplate.firstVariant as Product,
                        ) ||
                          getRegularPrice(
                            productTemplate.firstVariant as Product,
                          ),
                      )
                    }}
                  </span>
                </div>

                <div
                  class="stock-status"
                  :class="{ 'in-stock': productTemplate.inStock }"
                >
                  <span class="status-dot"></span>
                  <span class="status-text">
                    {{
                      productTemplate.inStock
                        ? $t("products.StatusAvailable")
                        : $t("products.statusOff")
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button @click="handleNext" class="nav-btn right-0 md:right-2">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
  <div v-if="isButton" class="flex justify-center">
    <NuxtLink to="/search?search=">
      <Button
        :label="$t('ButtonExplorar')"
        severity="warn"
        class="!bg-yellow-500 !text-black !border-none hover:!bg-black hover:!text-white"
        icon="pi pi-search"
        iconPos="left"
      />
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>
.product-card {
  @apply flex-none;
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  position: relative;

  @apply w-[140px] sm:w-[160px] md:w-[200px] lg:w-[220px];

  .card-content {
    @apply relative bg-white rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100;
  }
}

.badges-container {
  @apply absolute top-2 left-2 z-10 flex flex-col gap-1;

  .badge {
    @apply px-2 py-0.5 text-xs font-semibold rounded-md;

    &.discount {
      @apply bg-red-500 text-white;
    }

    &.new {
      @apply bg-green-500 text-white;
    }
  }
}

.img-container {
  @apply relative aspect-square overflow-hidden;

  .product-img {
    @apply w-full h-full object-contain transition-transform duration-300;
  }

  .hover-overlay {
    @apply absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm;

    // En móvil, mostrar siempre
    @apply opacity-100 md:opacity-0;

    // En móvil, reducir el oscurecimiento del fondo
    @apply bg-black/20 md:bg-black/40;
  }

  .action-buttons {
    // En móvil, no aplicar transformación inicial
    @apply flex gap-2 transition-transform duration-300;
    @apply transform-none md:translate-y-4;
  }

  .action-btn {
    position: relative;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px) scale(1.05);
      background: #ffffff;
      box-shadow:
        0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    &.preview {
      @apply text-black hover:bg-blue-50;
    }

    &.cart {
      @apply text-black hover:bg-green-50;
    }
  }

  &:hover {
    .product-img {
      @apply scale-105;
    }

    .hover-overlay {
      @apply opacity-100;
    }

    .action-buttons {
      @apply translate-y-0;
    }
  }
}

.product-info {
  @apply p-2 md:p-3 space-y-1;

  .brand {
    @apply text-xs text-gray-500 font-medium;
  }

  .title {
    @apply text-xs md:text-sm font-medium text-gray-800 line-clamp-2;
  }

  .rating {
    @apply flex items-center gap-1;

    .stars {
      @apply flex text-xs;

      i {
        @apply text-gray-300;

        &.active {
          @apply text-yellow-400;
        }
      }
    }

    .reviews {
      @apply text-xs text-gray-500;
    }
  }

  .price-container {
    @apply flex items-baseline gap-2;

    .original-price {
      @apply text-xs text-gray-400 line-through;
    }

    .final-price {
      @apply text-sm md:text-base font-bold text-black;
    }
  }

  .stock-status {
    @apply flex items-center gap-1.5 text-xs;

    .status-dot {
      @apply w-1.5 h-1.5 rounded-full bg-red-500;
    }

    &.in-stock {
      @apply text-green-600;

      .status-dot {
        @apply bg-green-500;
      }
    }
  }
}

.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 z-10 w-6 h-6 md:w-8 md:h-8 rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:scale-110;
}

.loading-spinner {
  @apply w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin;
}

.btn-tooltip {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.action-btn:hover .btn-tooltip {
  opacity: 1;
  visibility: visible;
  bottom: -2.5rem;
}
</style>
