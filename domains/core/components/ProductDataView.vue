<script lang="ts" setup>
import { ref, computed } from 'vue';

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
    value: 4
  }
});

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: 'VES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

const discount = computed(() => {
  if (!product.value.oldPrice) return 0;
  return Math.round(
    ((product.value.oldPrice - product.value.price) / product.value.oldPrice) * 100
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

const props = defineProps({
  data: Object,
});



</script>

<template>
  <div class="product-card__container s">
    <!-- Título y Marca -->
    <div class="product-card__header">
      <h1 class="product-card__title">
        {{ data.name }}
      </h1>
      <div class="product-card__brand-container">
        <span class="product-card__brand !hidden">por </span>
        <div v-if="product.rating" class="product-card__rating">
          <span class="hidden">{{ product.rating.count }} review</span>
        </div>
      </div>
    </div>

    <!-- Precios y Oferta -->
    <div class="product-card__pricing">
      <div v-if="hasDiscount" class="product-card__offer-badge">
        Oferta
      </div>

      <div class="product-card__price-container">
        <div v-if="hasDiscount" class="product-card__original-price">
          Precio original {{ data.price }}
        </div>
        <div class="product-card__current-price">
          <span class="product-card__price-label">Precio actual</span>
          <span class="product-card__price-value">
            {{ data.price - data.combinationInfo.discount }}
          </span>
        </div>
      </div>
    </div>

    <!-- Selector de Cantidad -->
    <div class="product-card__quantity-section">
      <label class="product-card__quantity-label">Cantidad</label>
      <div class="product-card__quantity-controls">
        <button @click="decrementQuantity" class="product-card__quantity-btn" :disabled="quantity <= 1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <input type="number" v-model="quantity" class="product-card__quantity-input" min="1" :max="product.stock">
        <button @click="incrementQuantity" class="product-card__quantity-btn" :disabled="quantity >= product.stock">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>

    <div>
      {{ data.description }}
    </div>

    <!-- Botón Agregar al Carrito -->
    <button @click="addToCart" class="product-card__cart-btn">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      Agregar al carrito
    </button>
  </div>
</template>

<style scoped lang="scss">
.product-card {
  &__container {
    @apply max-w-md bg-white rounded-xl overflow-hidden p-6 space-y-4;
  }

  &__header {
    @apply space-y-2;
  }

  &__title {
    @apply text-2xl font-bold text-gray-900;
  }

  &__brand-container {
    @apply flex items-center space-x-4;
  }

  &__brand {
    @apply text-gray-600;
  }

  &__rating {
    @apply flex items-center space-x-1 text-sm text-gray-500;
  }

  &__pricing {
    @apply space-y-2;
  }

  &__offer-badge {
    @apply inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold;
  }

  &__price-container {
    @apply space-y-1;
  }

  &__original-price {
    @apply text-gray-500 line-through text-sm;
  }

  &__current-price {
    @apply flex items-baseline space-x-2;
  }

  &__price-label {
    @apply text-gray-600 text-sm;
  }

  &__price-value {
    @apply text-2xl font-bold text-gray-900;
  }

  &__quantity-section {
    @apply space-y-2;
  }

  &__quantity-label {
    @apply block text-sm font-medium text-gray-700;
  }

  &__quantity-controls {
    @apply flex items-center space-x-2 max-w-[200px];
  }

  &__quantity-btn {
    @apply p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200;

    &:focus {
      @apply outline-none ring-2 ring-blue-500;
    }
  }

  &__quantity-input {
    @apply block w-20 text-center rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__cart-btn {
    @apply w-full mt-6 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200;
  }
}
</style>
