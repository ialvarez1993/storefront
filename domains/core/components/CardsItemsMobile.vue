<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useWindowSize } from "@vueuse/core";

const props = defineProps({
  heading: String,
  text: String,
  keyForComposable: { type: String, default: "" },
});

const { width } = useWindowSize();
const activeIndex = ref(0);
const touchStart = ref({ x: 0, y: 0 });
const isSwiping = ref(false);
const showQuickView = ref(false);
const selectedProduct = ref(null);

const { loadProductTemplateList, loading, productTemplateList } =
  useProductTemplateList(props.keyForComposable);
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const isTablet = computed(() => width.value >= 640 && width.value < 1024);
const getVisibleProducts = computed(() => {
  if (width.value < 640) return 1.5; // Móviles: vista de catálogo con peek
  return 2.5; // Tablets: vista expandida con peek
});

const gridLayout = computed(() => {
  return width.value < 640 ? "grid-cols-2" : "grid-cols-3";
});

const handleTouch = {
  start: (e: TouchEvent) => {
    touchStart.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].pageY,
    };
    isSwiping.value = true;
  },
  move: (e: TouchEvent) => {
    if (!isSwiping.value) return;

    const deltaX = e.touches[0].clientX - touchStart.value.x;
    const deltaY = e.touches[0].pageY - touchStart.value.y;

    // Prevenir scroll vertical si el swipe es más horizontal
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }
  },
  end: (e: TouchEvent) => {
    isSwiping.value = false;
    const deltaX = e.changedTouches[0].clientX - touchStart.value.x;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0 && activeIndex.value > 0) {
        activeIndex.value--;
      } else if (
        deltaX < 0 &&
        activeIndex.value <
          Math.ceil(
            productTemplateList.value.length / getVisibleProducts.value,
          ) -
            1
      ) {
        activeIndex.value++;
      }
    }
  },
};

const showProductQuickView = (product) => {
  selectedProduct.value = product;
  showQuickView.value = true;
};

onMounted(async () => {
  await loadProductTemplateList({ pageSize: 20 }, true);
});
</script>

<template>
  <section class="mobile-catalog">
    <!-- Header Section -->
    <div class="catalog-header">
      <h2 class="catalog-title">{{ heading || "Ofertas Especiales" }}</h2>
      <div class="catalog-filters !hidden">
        <button class="filter-pill active">Todos</button>
        <button class="filter-pill">Populares</button>
        <button class="filter-pill">Ofertas</button>
      </div>
    </div>

    <!-- Main Content -->
    <div v-if="loading" class="loading-grid" :class="gridLayout">
      <div v-for="n in 6" :key="n" class="loading-card">
        <div class="loading-image"></div>
        <div class="loading-content">
          <div class="loading-line"></div>
          <div class="loading-line short"></div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="products-container"
      @touchstart="handleTouch.start"
      @touchmove="handleTouch.move"
      @touchend="handleTouch.end"
    >
      <div class="products-grid" :class="gridLayout">
        <div
          v-for="product in productTemplateList"
          :key="product.id"
          class="product-card"
          @click="showProductQuickView(product)"
        >
          <!-- Product Image Container -->
          <div class="product-image-container">
            <img
              :src="
                $getImage(
                  String(product.image),
                  200,
                  200,
                  String(product.imageFilename),
                )
              "
              :alt="product.name"
              class="product-image"
              loading="lazy"
            />
            <div class="product-badges">
              <span
                v-if="getSpecialPrice(product.firstVariant)"
                class="discount-badge"
              >
                -{{
                  calculateDiscount(
                    getRegularPrice(product.firstVariant),
                    getSpecialPrice(product.firstVariant),
                  )
                }}%
              </span>
              <span v-if="product.isNew" class="new-badge">Nuevo</span>
            </div>
            <button class="quick-view-btn">
              <span class="icon">👁</span>
            </button>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">
              <span
                class="original-price"
                v-if="getSpecialPrice(product.firstVariant)"
              >
                {{ $currency(getRegularPrice(product.firstVariant)) }}
              </span>
              <span class="final-price">
                {{
                  $currency(
                    getSpecialPrice(product.firstVariant) ||
                      getRegularPrice(product.firstVariant),
                  )
                }}
              </span>
            </div>
            <div class="product-meta">
              <div class="rating">
                <span class="stars">★★★★☆</span>
                <span class="rating-count">(45)</span>
              </div>
              <span class="stock-status in-stock">En stock</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick View Modal -->
    <div
      v-if="showQuickView"
      class="quick-view-modal"
      @click="showQuickView = false"
    >
      <div class="modal-content" @click.stop>
        <!-- Modal content here -->
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.mobile-catalog {
  background: #f8f9fa;
  padding: 1rem;
  min-height: 100vh;
}

.catalog-header {
  margin-bottom: 1rem;

  .catalog-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.75rem;
  }

  .catalog-filters {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .filter-pill {
    background: white;
    border: 1px solid #e2e8f0;
    padding: 0.35rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    white-space: nowrap;
    transition: all 0.2s;

    &.active {
      background: #2563eb;
      color: white;
      border-color: #2563eb;
    }
  }
}

.products-container {
  overflow: hidden;
}

.products-grid {
  display: grid;
  gap: 0.75rem;
  padding: 0.25rem;
}

.product-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative;

  &:active {
    transform: scale(0.98);
  }

  .product-image-container {
    position: relative;
    aspect-ratio: 1;
    background: #fff;
    overflow: hidden;

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.3s;
    }

    &:hover .product-image {
      transform: scale(1.05);
    }
  }

  .product-badges {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    display: flex;
    gap: 0.25rem;
    z-index: 2;

    .discount-badge {
      background: #dc2626;
      color: white;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
    }

    .new-badge {
      background: #059669;
      color: white;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
    }
  }

  .quick-view-btn {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    background: white;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    .icon {
      font-size: 1rem;
    }
  }

  &:hover .quick-view-btn {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-info {
  padding: 0.75rem;

  .product-name {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: 1.2;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .product-price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;

    .original-price {
      color: #6b7280;
      text-decoration: line-through;
      font-size: 0.7rem;
    }

    .final-price {
      color: #1a1a1a;
      font-weight: 700;
      font-size: 0.9rem;
    }
  }

  .product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.65rem;

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .stars {
        color: #fbbf24;
      }

      .rating-count {
        color: #6b7280;
      }
    }

    .stock-status {
      &.in-stock {
        color: #059669;
      }
    }
  }
}

.loading-grid {
  display: grid;
  gap: 0.75rem;
  padding: 0.25rem;
}

.loading-card {
  background: white;
  border-radius: 1rem;
  overflow: hidden;

  .loading-image {
    aspect-ratio: 1;
    background: #f3f4f6;
    animation: pulse 1.5s infinite;
  }

  .loading-content {
    padding: 0.75rem;

    .loading-line {
      height: 0.75rem;
      background: #f3f4f6;
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;
      animation: pulse 1.5s infinite;

      &.short {
        width: 60%;
      }
    }
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// Optimizaciones para dispositivos táctiles
@media (hover: none) {
  .product-card .quick-view-btn {
    opacity: 1;
    transform: translateY(0);
  }
}

// Media queries para diferentes tamaños de pantalla
@media (min-width: 640px) {
  .products-grid {
    gap: 1rem;
  }

  .product-card {
    .product-name {
      font-size: 0.9rem;
    }

    .product-price .final-price {
      font-size: 1rem;
    }
  }
}
</style>
