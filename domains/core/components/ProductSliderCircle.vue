<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { PropType } from "vue";
import type { Product, QueryProductsArgs } from "~/graphql";
import { useProductTemplateList } from "../../product/composables/useProductTemplateList";
import { useCart } from "../../cart-odoo/composables/useCart";
import { useProductAttributes } from "../../product/composables/useProductAttributes";
import { useWishlist } from "../../wishlist/composables/useWishlist";
import { useQuery } from "@tanstack/vue-query";

const { locale } = useI18n();
const { cartAdd } = useCart();
const currentLang = locale.value;

const API_URL_CATEGORY = `http://localhost:1337/api/home-titulo-popular?locale=${currentLang === "es" ? "es-VE" : "en"}`;
const API_TOKEN =
  "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86";

const fetchDataTitlePopulate = async (): Promise<any> => {
  try {
    const response = await fetch(API_URL_CATEGORY, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const { data: titleProduct } = useQuery({
  queryKey: ["titlePopulate"],
  queryFn: fetchDataTitlePopulate,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

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

const titleOne = computed(() => {
  return titleProduct.value?.data ?? "Cargando";
});
</script>

<template>
  <section class="px-2 py-6 w-full max-w-[1440px] mx-auto">
    <h2
      class="text-center font-bold !font-header uppercase mb-10 typography-headline-3 md:typography-headline-2"
    >
      {{ titleOne.Title }}
    </h2>
    <div v-if="loading" class="flex justify-center items-center py-4">
      <span class="loading-spinner"></span>
    </div>

    <div v-else-if="productTemplateList.length > 0" class="relative">
      <div class="flex justify-center items-center">
        <button @click="handlePrev" class="nav-btn left-4">
          <i class="fas fa-chevron-left"></i>
        </button>

        <div
          ref="sliderContainer"
          class="flex overflow-x-hidden scroll-smooth gap-6 px-12"
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
                  class="badge"
                >
                  -{{
                    calculateDiscount(
                      getRegularPrice(productTemplate.firstVariant as Product),
                      getSpecialPrice(productTemplate.firstVariant as Product),
                    )
                  }}%
                </span>
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
                    <NuxtLink :to="productTemplate?.slug">
                      <button class="action-btn !bg-yellow-500">Ver</button>
                    </NuxtLink>
                  </div>
                </div>
              </div>

              <div class="product-info">
                <h3 class="title">{{ productTemplate?.name }}</h3>
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
              </div>
            </div>
          </div>
        </div>

        <button @click="handleNext" class="nav-btn right-4">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.product-card {
  @apply flex-none  w-[250px];
  box-shadow : none;
  .card-content {
    @apply relative transition-all duration-300;
  }
}

.badges-container {
  @apply absolute top-2 right-2 z-10;

  .badge {
    @apply px-2 py-1 text-xs font-medium bg-black text-white rounded-full;
  }
}

.img-container {
  @apply relative rounded-full aspect-square overflow-hidden bg-gray-50;

  .product-img {
    @apply w-full h-full object-contain transition-transform duration-300 p-4;
  }

  .hover-overlay {
    @apply absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300

flex items-center justify-center backdrop-blur-sm;
  }

  .action-buttons {
    @apply transform scale-95 transition-transform duration-300;
  }

  .action-btn {
    @apply px-6 py-2 rounded-full bg-white text-sm font-medium

transition-all duration-300 hover:scale-105;
  }

  &:hover {
    .hover-overlay {
      @apply opacity-100;
    }

    .action-buttons {
      @apply scale-100;
    }
  }
}

.product-info {
  @apply text-center mt-4 space-y-2;

  .title {
    @apply text-sm font-medium text-gray-800 line-clamp-1;
  }

  .price-container {
    @apply flex items-center justify-center gap-2;

    .original-price {
      @apply text-xs text-gray-400 line-through;
    }

    .final-price {
      @apply text-sm font-semibold text-gray-900;
    }
  }
}

.nav-btn {
  @apply absolute top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full

bg-white/90  flex items-center justify-center

transition-all duration-300 hover:bg-gray-50;
}

.loading-spinner {
  @apply w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin;
}
</style>
