<script lang="ts" setup>
import { ref, computed } from 'vue';
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
  return props.data?.combinationInfo?.has_discounted_price || false;
});

const finalPrice = computed(() => {
  if (!props.data) return 0;
  return props.data.price - (props.data.combinationInfo?.discount || 0);
});

const discountPercentage = computed(() => {
  if (!hasDiscount.value || !props.data) return 0;
  return Math.round(
    (props.data.combinationInfo.discount / props.data.price) * 100
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
    <!-- Título y Marca -->
    <div class="product-card__header">
      <h1 class="product-card__title">
        {{ data.name }}
      </h1>
      <div class="product-card__brand-container">
        <div v-if="hasDiscount" class="product-card__discount-badge">
          -{{ discountPercentage }}%
        </div>
      </div>
    </div>

    <!-- Precios y Oferta -->
    <div class="product-card__pricing">
      <div class="product-card__price-container">
        <div v-if="hasDiscount" class="product-card__original-price">
          {{ formatPrice(props.data.price) }}
        </div>
        <div class="product-card__current-price">
          <span class="product-card__price-value">
            {{ formatPrice(finalPrice) }}
          </span>
        </div>
      </div>
    </div>

    <div class="product-card__description">
      {{ data.description }}
    </div>

    <!-- Selector de Cantidad -->
    <div class="product-card__quantity-section !mt-[3rem]">
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

    <button @click="cartAdd(data.firstVariant?.id, quantity)" class="product-card__cart-btn !mt-[9rem]">
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
    @apply bg-white rounded-2xl overflow-hidden p-8 space-y-6 shadow-lg border border-gray-100;
    animation: fadeIn 0.3s ease-in-out;
  }

  &__header {
    @apply space-y-4 relative;
  }

  &__title {
    @apply text-3xl font-bold text-gray-900 leading-tight;
    font-family: 'Inter', sans-serif;
  }

  &__discount-badge {
    @apply absolute -top-2 right-0 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold transform rotate-2 shadow-md;
    animation: bounce 0.5s ease-in-out;
  }

  &__pricing {
    @apply mt-6;
  }

  &__price-container {
    @apply flex flex-col items-start;
  }

  &__original-price {
    @apply text-gray-400 line-through text-lg font-medium;
    transform: scale(0.9);
  }

  &__current-price {
    @apply flex items-baseline gap-2;
  }

  &__price-value {
    @apply text-4xl font-bold text-black tracking-tight;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.1);
  }

  &__description {
    @apply text-gray-600 leading-relaxed mt-4 text-sm;
  }

  &__quantity-section {
    @apply space-y-3 mt-8;
  }

  &__quantity-label {
    @apply block text-sm font-semibold text-gray-700 uppercase tracking-wide;
  }

  &__quantity-controls {
    @apply flex items-center space-x-3 bg-gray-50 p-2 rounded-lg w-fit;
  }

  &__quantity-btn {
    @apply p-2 rounded-lg bg-white text-black hover:bg-yellow-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105;

    &:focus {
      @apply outline-none ring-2 ring-yellow-300;
    }
  }

  &__quantity-input {
    @apply block w-16 text-center rounded-lg border-2 border-gray-200 text-gray-900 focus:border-yellow-500 focus:ring-yellow-500 text-lg font-medium;
    transition: all 0.2s ease-in-out;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &__cart-btn {
    @apply w-full mt-8 flex items-center justify-center px-6 py-4 border-2 border-black text-base font-bold rounded-xl text-white bg-black hover:bg-yellow-500 hover:text-black hover:border-yellow-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl;

    &:active {
      @apply transform scale-95;
    }
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

@keyframes bounce {

  0%,
  100% {
    transform: rotate(2deg);
  }

  50% {
    transform: rotate(-1deg) scale(1.05);
  }
}

// Añadir hover effects
.product-card__container:hover {
  @apply shadow-xl transform transition-all duration-300;
  transform: translateY(-2px);
}
</style>
