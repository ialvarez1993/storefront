<script lang="ts" setup>
import { ref, computed } from "vue";
import { useCart } from "../../cart-odoo/composables/useCart";
const { cartAdd } = useCart();

interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating?: {
    count: number;
    value: number;
  };
  stock: number;
}

const quantity = ref(1);
const product = ref<Product>({
  id: 1,
  name: "Bicicleta estática spinning",
  brand: "MaxKare",
  price: 9311.29,
  oldPrice: 23278.23,
  stock: 10,
  rating: {
    count: 1,
    value: 4,
  },
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

const discount = computed(() => {
  if (!product.value.oldPrice) return 0;
  return Math.round(
    ((product.value.oldPrice - product.value.price) / product.value.oldPrice) *
      100,
  );
});

const hasDiscount = computed(() => {
  return props.data?.combinationInfo?.has_discounted_price || false;
});

const finalPrice = computed(() => {
  if (!props.data) return 0;
  return props.data.price - (props.data.combinationInfo?.discount || 0);
});

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !props.data) return 0;
  return Math.round(
    (props.data.combinationInfo.discount / props.data.price) * 100,
  );
});

const incrementQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  // Aquí iría la lógica para agregar al carrito
  console.log(`Agregando ${quantity.value} unidades al carrito`);
};

const props = defineProps({
  data: Object,
});
</script>


<template>
  <div class="product-card__container">
    <!-- Disponible/Agotado -->
    <div class="stock-status" :class="{ 'in-stock': data.inStock }">
      <span class="status-dot"></span>
      <span class="status-text">
        {{ data.inStock ? $t("products.StatusAvailable") : $t("products.statusOff") }}
      </span>
    </div>

    <!-- Título -->
    <div class="product-card__header">
      <h1 class="product-card__title">{{ data.name }}</h1>
    </div>

    <!-- Categorías -->
    <div class="product-card__categories">
      <NuxtLink
        v-for="categories in data.categories"
        :key="categories.id"
        :to="categories.slug"
      >
        <span class="category-tag">
          {{ categories.name }}
        </span>
      </NuxtLink>
    </div>

    <!-- Precio -->
    <div class="product-card__pricing">
      <div class="product-card__price-container">
        <span class="price-label">Price:</span>
        <span class="product-card__price-value">
          ${{ finalPrice }}
        </span>
      </div>
    </div>

    <!-- Descripción -->
    <div class="product-card__description">
      {{ data.description }}
    </div>

    <!-- Selector de Cantidad -->
    <div class="product-card__quantity-section">
      <label class="product-card__quantity-label">Cantidad</label>
      <div class="product-card__quantity-controls">
        <button
          @click="decrementQuantity"
          class="product-card__quantity-btn"
          :disabled="quantity <= 1"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <input
          type="number"
          v-model="quantity"
          class="product-card__quantity-input"
          min="1"
          :max="product.stock"
        />
        <button
          @click="incrementQuantity"
          class="product-card__quantity-btn"
          :disabled="quantity >= product.stock"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Botón de Agregar al Carrito -->
    <button
      @click="cartAdd(data.firstVariant?.id, quantity)"
      class="product-card__cart-btn"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      Agregar al carrito
    </button>
  </div>
</template>

<style scoped lang="scss">
.product-card {
  &__container {
    @apply bg-white rounded-2xl overflow-hidden p-8 flex flex-col items-center max-w-2xl mx-auto;
    animation: fadeIn 0.3s ease-in-out;
  }

  &__header {
    @apply text-center mb-6;
  }

  &__title {
    @apply text-3xl font-bold text-gray-900 leading-tight;
    font-family: "Inter", sans-serif;
  }

  &__categories {
    @apply flex flex-wrap justify-center gap-2 mb-6;
  }

  &__pricing {
    @apply mb-6 text-center;
  }

  &__price-container {
    @apply flex items-center justify-center gap-2;
  }

  &__price-value {
    @apply text-4xl font-bold text-black;
  }

  &__description {
    @apply text-gray-600 text-center mb-8 max-w-xl;
  }

  &__quantity-section {
    @apply w-full max-w-xs flex flex-col items-center mb-8;
  }

  &__quantity-label {
    @apply text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2;
  }

  &__quantity-controls {
    @apply flex items-center space-x-3 bg-gray-50 p-2 rounded-lg;
  }

  &__quantity-btn {
    @apply p-2 rounded-lg bg-white text-black hover:bg-yellow-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300;
  }

  &__quantity-input {
    @apply w-16 text-center rounded-lg border-2 border-gray-200 text-gray-900 focus:border-yellow-500 focus:ring-yellow-500 text-lg font-medium;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__cart-btn {
    @apply w-full max-w-md flex items-center justify-center px-6 py-4 border-2 border-black text-base font-bold rounded-xl text-white bg-black hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300;

    &:active {
      @apply transform scale-95;
    }
  }
}

.stock-status {
  @apply flex items-center justify-center gap-1.5 text-xs mb-4;

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

.category-tag {
  @apply inline-block px-3 py-1 text-sm font-semibold text-black bg-yellow-400 rounded-full capitalize;
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
</style>
