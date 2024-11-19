<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PropType } from "vue";
import type { Product, QueryProductsArgs } from "~/graphql";
import { useProductTemplateList } from "../../product/composables/useProductTemplateList";
import { useCart } from "../../cart-odoo/composables/useCart";
import { useProductAttributes } from "../../product/composables/useProductAttributes";
import { useWishlist } from "../../wishlist/composables/useWishlist";
const { cartAdd } = useCart();

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

const { loadProductTemplateList, loading, productTemplateList } =
  useProductTemplateList(props.keyForComposable, props.keyForComposable);
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const scrollAmount = 1200; // Ajustado para mostrar 5 productos

const handlePrev = () => {
  if (sliderContainer.value) {
    sliderContainer.value.scrollLeft -= scrollAmount;
  }
};

const handleNext = () => {
  if (sliderContainer.value) {
    sliderContainer.value.scrollLeft += scrollAmount;
  }
};

const calculateDiscount = (regular: number, special: number) => {
  return Math.round(((regular - special) / regular) * 100);
};

const loadProducts = async () => {
  const params: QueryProductsArgs = {
    pageSize: 15, // Aumentado para cargar más productos
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
  <section class="px-2 py-6 w-full max-w-[1440px] mx-auto">
    <h2
      v-if="heading"
      class="text-xl !font-header font-bold text-center mb-6 uppercase tracking-wide"
    >
      {{ heading }}
    </h2>

    <div v-if="loading" class="flex justify-center items-center py-4">
      <span class="loading-spinner"></span>
    </div>

    <div v-else-if="productTemplateList.length > 0" class="relative">
      <div class="flex justify-center items-center">
        <button @click="handlePrev" class="nav-btn left-0">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div
          ref="sliderContainer"
          class="flex overflow-x-hidden scroll-smooth gap-3 px-8"
        >
          <div
            v-for="productTemplate in productTemplateList"
            :key="productTemplate.id"
            class="product-card"
          >
            <div class="card-content">
              <!-- Badges -->
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
                <span v-if="productTemplate.isNew" class="badge new">
                  New
                </span>
              </div>

              <!-- Image -->
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

                <!-- Hover Actions -->
                <div class="hover-overlay">
                  <div class="action-buttons">
                    <NuxtLink :to="productTemplate?.slug">
                      <button class="action-btn preview">
                        <i class="fas fa-eye"></i>
                      </button>
                    </NuxtLink>
                    <button
                      class="action-btn cart"
                      @click="cartAdd(productTemplate.firstVariant?.id, 1)"
                    >
                      <i class="fas fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Info -->
              <div class="product-info">
                <p class="brand">{{ productTemplate.brand }}</p>
                <h3 class="title">{{ productTemplate?.name }}</h3>

                <!-- Rating -->
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

                <!-- Price -->
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

                <!-- Stock -->
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

        <button @click="handleNext" class="nav-btn right-0">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.product-card {
  @apply flex-none w-[220px];

  .card-content {
    @apply relative bg-white rounded-lg overflow-hidden transition-all duration-300
           hover:shadow-lg border border-gray-100;
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
    @apply absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300
           flex items-center justify-center backdrop-blur-sm;
  }

  .action-buttons {
    @apply flex gap-2 transform translate-y-4 transition-transform duration-300;
  }

  .action-btn {
    @apply w-10 h-10 rounded-full bg-white flex items-center justify-center
           transition-transform duration-300 hover:scale-110;

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
  @apply p-3 space-y-1;

  .brand {
    @apply text-xs text-gray-500 font-medium;
  }

  .title {
    @apply text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem];
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
      @apply text-base font-bold text-black;
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
  @apply absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full
         border border-gray-200 bg-white/90 backdrop-blur-sm
         flex items-center justify-center transition-all duration-300
         hover:bg-gray-50 hover:scale-110;
}

.loading-spinner {
  @apply w-8 h-8  border-gray-200 border-t-blue-600 rounded-full animate-spin;
}
</style>
