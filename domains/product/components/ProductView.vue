<script setup lang="ts">
import { ref, computed } from "vue";
import type { Product } from "~/graphql";

const props = defineProps<{
  product: Product;
}>();

const isLoading = ref(false);
const error = ref(null);

// Computed properties para la data principal
const productData = computed(() => ({
  id: props.product?.id,
  name: props.product?.name,
  description: props.product?.description,
  regularPrice: props.product?.regularPrice,
  specialPrice: props.product?.specialPrice,
  images: props.product?.images || [],
  variants: props.product?.variants || [],
  ratings: {
    average: 4,
    count: 26,
  },
}));

// Manejo de errores
const handleError = (err: any) => {
  error.value = err;
  isLoading.value = false;
};
</script>

<template>
  <div class="product-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-state">
      <span>Loading product information...</span>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <h2>{{ error.message || "Something went wrong" }}</h2>
      <button @click="retryLoading">Try Again</button>
    </div>

    <!-- Product data -->
    <div v-else class="product-content">
      <!-- Product Header -->
      <div class="product-header">
        <h1 class="product-title">{{ productData.name }}</h1>

        <!-- Pricing Section -->
        <div class="pricing">
          <span v-if="productData.specialPrice" class="special-price">
            {{ productData.specialPrice }}
          </span>
          <span :class="{ 'regular-price': productData.specialPrice }">
            {{ productData.regularPrice }}
          </span>
        </div>

        <!-- Rating Section -->
        <div class="rating">
          <span>★ {{ productData.ratings.average }}</span>
          <span>({{ productData.ratings.count }} reviews)</span>
        </div>
      </div>

      <!-- Product Images -->
      <div class="product-images">
        <template v-if="productData.images.length">
          <img
            v-for="image in productData.images"
            :key="image.id"
            :src="image.url"
            :alt="image.alt"
          />
        </template>
        <div v-else class="no-image">No images available</div>
      </div>

      <!-- Product Description -->
      <div class="product-description">
        <h2>Description</h2>
        <p>{{ productData.description }}</p>
      </div>

      <!-- Product Variants -->
      <div v-if="productData.variants.length" class="variants">
        <h2>Available Variants</h2>
        <div class="variants-grid">
          <div
            v-for="variant in productData.variants"
            :key="variant.id"
            class="variant-item"
          >
            {{ variant.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
}

.product-content {
  display: grid;
  gap: 20px;
}

.product-header {
  margin-bottom: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.pricing {
  margin: 10px 0;
}

.special-price {
  color: #ff0000;
  font-weight: bold;
  margin-right: 10px;
}

.regular-price {
  text-decoration: line-through;
  color: #666;
}

.rating {
  display: flex;
  gap: 10px;
  align-items: center;
}

.product-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.product-images img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.no-image {
  padding: 40px;
  text-align: center;
  background: #f5f5f5;
}

.product-description {
  margin: 20px 0;
}

.variants {
  margin-top: 20px;
}

.variants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.variant-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

@media (max-width: 768px) {
  .product-container {
    padding: 10px;
  }

  .product-title {
    font-size: 20px;
  }
}
</style>
