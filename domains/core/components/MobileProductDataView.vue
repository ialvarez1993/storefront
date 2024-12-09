<script lang="ts" setup>
import { ref, computed } from "vue";

const props = defineProps({
  data: Object,
});

interface Product {
  data: objects;
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
  return product.value.oldPrice && product.value.oldPrice > product.value.price;
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
</script>

<template>
  <div class="product-card__container">
    <!-- Título y Marca -->
    <div class="product-card__header">
      <h1 class="product-card__title">
        {{ data.name }}
      </h1>
      <div class="product-card__brand-container"></div>
    </div>

    <!-- Precios y Oferta -->
    <div class="product-card__pricing">
      <div class="product-card__price-container">
        <div class="product-card__current-price">
          <span class="product-card__price-label">Precio:</span>
          <span class="product-card__price-value">
            {{ formatPrice(data.price) }}
          </span>
        </div>
      </div>
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

    <!-- Botón Agregar al Carrito -->
    <button @click="addToCart" class="product-card__cart-btn">
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
    @apply w-full max-w-[100%] mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4;
    @apply sm:max-w-md sm:p-6;
  }

  &__header {
    @apply space-y-2 mb-4;
  }

  &__title {
    @apply text-xl font-bold text-gray-900;
    @apply sm:text-2xl;
  }

  &__brand-container {
    @apply flex flex-col space-y-2;
    @apply sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4;
  }

  &__brand {
    @apply text-sm text-gray-600;
  }

  &__rating {
    @apply flex items-center space-x-1 text-xs text-gray-500;
    @apply sm:text-sm;
  }

  &__pricing {
    @apply space-y-2 mb-4;
  }

  &__offer-badge {
    @apply inline-block bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold;
    @apply sm:px-3 sm:text-sm;
  }

  &__price-container {
    @apply space-y-1;
  }

  &__original-price {
    @apply text-xs text-gray-500 line-through;
    @apply sm:text-sm;
  }

  &__current-price {
    @apply flex flex-col space-y-1;
    @apply sm:flex-row sm:items-baseline sm:space-x-2 sm:space-y-0;
  }

  &__price-label {
    @apply text-xs text-gray-600;
    @apply sm:text-sm;
  }

  &__price-value {
    @apply text-xl font-bold text-gray-900;
    @apply sm:text-2xl;
  }

  &__quantity-section {
    @apply space-y-2 mb-4;
  }

  &__quantity-label {
    @apply block text-xs font-medium text-gray-700;
    @apply sm:text-sm;
  }

  &__quantity-controls {
    @apply flex items-center space-x-2 w-full max-w-[150px];
    @apply sm:max-w-[200px];
  }

  &__quantity-btn {
    @apply p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;
    @apply sm:p-2 sm:rounded-lg;

    &:focus {
      @apply outline-none ring-2 ring-blue-500;
    }
  }

  &__quantity-input {
    @apply block w-16 text-center rounded-md border-gray-300 shadow-sm text-gray-900 text-sm;
    @apply sm:w-20;
    @apply focus:border-blue-500 focus:ring-blue-500;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__cart-btn {
    @apply w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black;
    @apply sm:px-6 sm:py-3 sm:text-base;
    @apply hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200;
  }
}
</style>
