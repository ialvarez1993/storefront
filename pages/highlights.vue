<!-- pages/destacados.vue -->
<template>
  <section class="featured mt-56">
    <div class="featured__container">
      {{ totalItems }}
      <h1 class="featured__title">Productos Destacados</h1>

      <div class="featured__grid">
        <article
          v-for="product in featuredProducts"
          :key="product.id"
          class="product-card"
          :class="{ 'product-card--sold-out': product.stock === 0 }"
        >
          <div class="product-card__badge" v-if="product.badge">
            {{ product.badge }}
          </div>

          <div class="product-card__media">
            <div class="product-card__image-container">
              <NuxtImg
                :src="product.image"
                :alt="product.name"
                class="product-card__image"
              />
              <div class="product-card__overlay">
                <button class="product-card__quick-view">
                  <i class="fas fa-eye"></i>
                  Vista rápida
                </button>
              </div>
            </div>

            <button
              class="product-card__wishlist"
              :class="{
                'product-card__wishlist--active': product.isWishlisted,
              }"
              @click="toggleWishlist(product.id)"
            >
              <i class="fas fa-heart"></i>
            </button>
          </div>

          <div class="product-card__content">
            <div class="product-card__category">{{ product.category }}</div>
            <h2 class="product-card__name">{{ product.name }}</h2>

            <div class="product-card__rating">
              <div class="stars">
                <i
                  v-for="n in 5"
                  :key="n"
                  class="fas fa-star"
                  :class="{ 'stars--filled': n <= product.rating }"
                ></i>
              </div>
              <span class="product-card__reviews">({{ product.reviews }})</span>
            </div>

            <div class="product-card__prices">
              <span
                v-if="product.originalPrice"
                class="product-card__original-price"
              >
                {{ formatPrice(product.originalPrice) }}
              </span>
              <span class="product-card__current-price">
                {{ formatPrice(product.price) }}
              </span>
            </div>

            <div class="product-card__stock">
              <div
                class="product-card__stock-bar"
                :style="{ width: `${product.stockPercentage}%` }"
              ></div>
              <span class="product-card__stock-text">
                {{ product.stock }} unidades disponibles
              </span>
            </div>
          </div>

          <div class="product-card__actions">
            <button
              class="product-card__add-to-cart"
              :disabled="product.stock === 0"
              @click="addToCart(product.id)"
            >
              <i class="fas fa-shopping-cart"></i>
              {{ product.stock === 0 ? "Agotado" : "Añadir al carrito" }}
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

const { loadProductTemplateList, loading, totalItems } =
  useProductTemplateList();

const featuredProducts = ref([
  {
    id: 1,
    name: "Auriculares Inalámbricos Pro Max",
    category: "Audio",
    price: 299.99,
    originalPrice: 399.99,
    image: "/images/display-1.png",
    rating: 4.8,
    reviews: 1234,
    stock: 45,
    stockPercentage: 65,
    badge: "¡Oferta!",
    isWishlisted: false,
  },
  {
    id: 2,
    name: "Smartwatch Series X",
    category: "Wearables",
    price: 449.99,
    originalPrice: null,
    image: "/images/display-1.png",
    rating: 4.9,
    reviews: 856,
    stock: 12,
    stockPercentage: 15,
    badge: "Nuevo",
    isWishlisted: true,
  },
  {
    id: 3,
    name: "Cámara Mirrorless 4K",
    category: "Fotografía",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "/images/display-1.png",
    rating: 4.7,
    reviews: 543,
    stock: 0,
    stockPercentage: 0,
    badge: null,
    isWishlisted: false,
  },
  // Añade más productos...
]);

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

const toggleWishlist = (productId) => {
  const product = featuredProducts.value.find((p) => p.id === productId);
  if (product) {
    product.isWishlisted = !product.isWishlisted;
  }
};

const addToCart = (productId) => {
  // Implementar lógica de carrito
  console.log(`Añadiendo producto ${productId} al carrito`);
};
</script>

<style scoped>
.featured {
  padding: 4rem 0;
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
}

.featured__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.featured__title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  background: black;
  -webkit-background-clip: text;
  color: transparent;
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.product-card__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 30px;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(45deg, #f7b013, #f7b013);
  z-index: 1;
  animation: fadeInLeft 0.5s ease-out;
}

.product-card__media {
  position: relative;
  padding-top: 100%;
}

.product-card__image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-card__image {
  transform: scale(1.08);
}

.product-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__quick-view {
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  background: white;
  color: black;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.product-card:hover .product-card__quick-view {
  transform: translateY(0);
}

.product-card__wishlist {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1;
}

.product-card__wishlist i {
  color: #868e96;
  transition: color 0.3s ease;
}

.product-card__wishlist--active i {
  color: #f7b013;
  animation: heartBeat 0.3s ease-out;
}

.product-card__content {
  padding: 1.5rem;
}

.product-card__category {
  font-size: 0.875rem;
  color: #868e96;
  margin-bottom: 0.5rem;
}

.product-card__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: black;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.product-card__rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
}

.stars i {
  color: #dee2e6;
}

.stars--filled {
  color: #fcc419;
}

.product-card__reviews {
  font-size: 0.875rem;
  color: #868e96;
}

.product-card__prices {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.product-card__original-price {
  color: #868e96;
  text-decoration: line-through;
  font-size: 0.875rem;
}

.product-card__current-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
}

.product-card__stock {
  position: relative;
  height: 4px;
  background: #e9ecef;
  border-radius: 2px;
  margin-bottom: 0.5rem;
}

.product-card__stock-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(45deg, #4c6ef5, #748ffc);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.product-card__stock-text {
  font-size: 0.875rem;
  color: #868e96;
}

.product-card__actions {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.product-card__add-to-cart {
  width: 100%;
  padding: 1rem;
  border-radius: 30px;
  border: none;
  background: linear-gradient(45deg, #f7b013, #f7b013);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.product-card__add-to-cart:hover:not(:disabled) {
  background: black;
  transform: translateY(-2px);
}

.product-card__add-to-cart:disabled {
  background: #dee2e6;
  border: 1px;
  cursor: not-allowed;
}

.product-card--sold-out {
  opacity: 0.8;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .featured {
    padding: 2rem 0;
  }

  .featured__container {
    padding: 0 1rem;
  }

  .featured__title {
    font-size: 2rem;
  }

  .featured__grid {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .product-card__content {
    padding: 1rem;
  }

  .product-card__name {
    font-size: 1.1rem;
  }

  .product-card__current-price {
    font-size: 1.25rem;
  }
}
</style>
