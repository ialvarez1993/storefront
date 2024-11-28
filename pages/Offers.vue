<!-- pages/destacados.vue -->
<template>
  <section class="featured !mt-52">
    <h2 class="ml-16 font-bold text-3xl">Ofertas</h2>
    <div class="featured__container">
      <TransitionGroup
        name="featured-fade"
        tag="div"
        appear
        class="featured__grid"
      >
        <article
          v-for="product in featuredProducts"
          :key="product.id"
          class="featured__card product-card"
          :class="{ 'product-card--hover': product.isHovered }"
          @mouseenter="product.isHovered = true"
          @mouseleave="product.isHovered = false"
        >
          <div class="product-card__image-wrapper">
            <div
              v-if="product.discount"
              class="product-card__discount"
              :class="{ 'product-card__discount--high': product.discount > 25 }"
            >
              <span class="product-card__discount-text"
                >-{{ product.discount }}%</span
              >
            </div>

            <div v-if="product.isNew" class="product-card__badge">
              <span class="product-card__badge-text">NUEVO</span>
            </div>

            <NuxtImg
              :src="product.image"
              :alt="product.name"
              class="product-card__image"
            />

            <div
              class="product-card__overlay"
              :class="{ 'product-card__overlay--visible': product.isHovered }"
            >
              <div class="product-card__actions">
                <button
                  class="product-card__action-btn"
                  aria-label="Añadir al carrito"
                >
                  <i class="fas fa-shopping-cart"></i>
                  <span class="product-card__tooltip">Añadir al carrito</span>
                </button>
                <button
                  class="product-card__action-btn"
                  aria-label="Añadir a favoritos"
                >
                  <i class="fas fa-heart"></i>
                  <span class="product-card__tooltip">Añadir a favoritos</span>
                </button>
                <button
                  class="product-card__action-btn"
                  aria-label="Vista rápida"
                >
                  <i class="fas fa-eye"></i>
                  <span class="product-card__tooltip">Vista rápida</span>
                </button>
              </div>
            </div>
          </div>

          <div class="product-card__content">
            <div class="product-card__category">{{ product.category }}</div>
            <h3 class="product-card__title">{{ product.name }}</h3>

            <div class="product-card__price">
              <span
                v-if="product.discount"
                class="product-card__price-original"
              >
                ${{ product.originalPrice.toLocaleString() }}
              </span>
              <span class="product-card__price-final">
                ${{ calculateFinalPrice(product).toLocaleString() }}
              </span>
            </div>

            <div class="product-card__stock" v-if="product.stock < 10">
              ¡Solo quedan {{ product.stock }} unidades!
            </div>

            <div class="product-card__footer">
              <div class="product-card__shipping" v-if="product.freeShipping">
                <i class="fas fa-truck"></i> Envío gratis
              </div>
              <div class="product-card__timer" v-if="product.limitedOffer">
                <i class="fas fa-clock"></i> Oferta limitada
              </div>
            </div>
          </div>
        </article>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup>
const {
  loadProductTemplateList,
  organizedAttributes,
  loading,
  productTemplateList,
  totalItems,
  categories,
} = useProductTemplateList("");
import { ref } from "vue";

const featuredProducts = ref([
  {
    id: 1,
    name: 'Smart TV OLED 65" 4K',
    category: "Electrónica",
    originalPrice: 1999.99,
    discount: 30,
    image: "/images/tvImage.jpg",
    rating: 4.8,
    reviews: 328,
    isHovered: false,
    stock: 5,
    freeShipping: true,
    limitedOffer: true,
    isNew: true,
  },
  {
    id: 2,
    name: "Smartphone Pro Max Ultra",
    category: "Móviles",
    originalPrice: 1299.99,
    discount: 15,
    image: "/images/tvImage.jpg",
    rating: 5,
    reviews: 456,
    isHovered: false,
    stock: 15,
    freeShipping: true,
    limitedOffer: false,
    isNew: false,
  },
  {
    id: 3,
    name: "Auriculares Noise Cancelling",
    category: "Audio",
    originalPrice: 399.99,
    discount: 25,
    image: "/images/tvImage.jpg",
    rating: 4.7,
    reviews: 189,
    isHovered: false,
    stock: 8,
    freeShipping: true,
    limitedOffer: true,
    isNew: true,
  },
  // Añade más productos...
]);

const calculateFinalPrice = (product) => {
  if (product.discount) {
    return (product.originalPrice * (1 - product.discount / 100)).toFixed(2);
  }
  return product.originalPrice.toFixed(2);
};
</script>

<style scoped>
.featured {
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  padding: 3rem 0;
}

.featured__container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.featured__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2.5rem;
}

.product-card {
  background: #ffffff;
  border-radius: 1.5rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.product-card--hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.product-card__image-wrapper {
  position: relative;
  padding-top: 100%;
  background: #f8f9fa;
  overflow: hidden;
}

.product-card__image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-card__image {
  transform: scale(1.08);
}

.product-card__discount {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f7b013;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  z-index: 2;
  transform: translateZ(0);
  transition: transform 0.3s ease;
}

.product-card__discount--high {
  background: #f7b013;
  animation: pulse 2s infinite;
}

.product-card__badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #f7b013;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  z-index: 2;
}

.product-card__overlay {
  position: absolute;
  bottom: -100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  transition: bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card__overlay--visible {
  bottom: 0;
}

.product-card__actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.product-card__action-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  background: white;
  color: #2d3436;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.product-card__action-btn:hover {
  background: #f7b013;
  color: white;
  transform: translateY(-3px);
}

.product-card__tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #2d3436;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.product-card__action-btn:hover .product-card__tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(-10px);
}

.product-card__content {
  padding: 1.5rem;
}

.product-card__category {
  color: #868e96;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.product-card__title {
  font-size: 1.2rem;
  color: #2d3436;
  margin-bottom: 1rem;
  font-weight: 600;
  line-height: 1.4;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating__stars {
  position: relative;
  color: #ffd700;
  --percent: calc(var(--rating) / 5 * 100%);
}

.rating__star {
  color: #e9ecef;
}

.rating__stars::before {
  content: "";
  position: absolute;
  left: 0;
  width: var(--percent);
  height: 100%;
  background: #ffd700;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rating__count {
  color: #868e96;
  font-size: 0.9rem;
}

.product-card__price {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-card__price-original {
  color: #adb5bd;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.product-card__price-final {
  color: #f7b013;
  font-size: 1.4rem;
  font-weight: 700;
}

.product-card__stock {
  color: #f7b013;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.product-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f1f3f5;
  font-size: 0.9rem;
}

.product-card__shipping,
.product-card__timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.featured-fade-enter-active,
.featured-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.featured-fade-enter-from,
.featured-fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.featured-fade-move {
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive */
@media (max-width: 1024px) {
  .featured__grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
}

@media (max-width: 768px) {
  .featured__container {
    padding: 0 1.5rem;
  }

  .featured__grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .product-card__content {
    padding: 1.25rem;
  }

  .product-card__title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .featured__container {
    padding: 0 1rem;
  }

  .featured__grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .product-card__overlay {
    display: none;
  }
}

@media (hover: none) {
  .product-card__overlay {
    display: none;
  }
}
</style>
