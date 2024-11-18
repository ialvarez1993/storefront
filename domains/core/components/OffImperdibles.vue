<template>
  <section class="showcase">
    <div class="showcase__container">
      <h1 class="showcase__title">DESCUENTOS IMPERDIBLES</h1>

      <div class="showcase__grid">
        <!-- Card 1 -->
        <article class="product-card">
          <div class="product-card__badge">-25%</div>

          <div class="product-card__image-container">
            <NuxtImg
              src="/images/display-1.png"
              alt="Product 1"
              class="product-card__image"
            />
            <div class="product-card__overlay">
              <button class="product-card__button">
                Ver Producto
                <ArrowRight class="product-card__icon" />
              </button>
            </div>
          </div>

          <div class="product-card__content">
            <h2 class="product-card__title">Pioneer Audio System</h2>
            <p class="product-card__description">
              Sistema de audio premium para vehículos
            </p>

            <div class="product-card__price">
              <span class="product-card__current">$599</span>
              <span class="product-card__original">$799</span>
            </div>

            <div class="product-card__features">
              <span class="product-card__feature">
                <Music class="product-card__feature-icon" />
                HD Audio
              </span>
              <span class="product-card__feature">
                <Bluetooth class="product-card__feature-icon" />
                Bluetooth 5.0
              </span>
            </div>
          </div>
        </article>

        <!-- Card 2 -->
        <article class="product-card">
          <div class="product-card__badge product-card__badge--new">Nuevo</div>

          <div class="product-card__image-container">
            <NuxtImg
              src="/images/display-1.png"
              alt="Product 2"
              class="product-card__image"
            />
            <div class="product-card__overlay">
              <button class="product-card__button">
                Ver Producto
                <ArrowRight class="product-card__icon" />
              </button>
            </div>
          </div>

          <div class="product-card__content">
            <h2 class="product-card__title">Smart Camera Pro</h2>
            <p class="product-card__description">
              Cámara de seguridad inteligente
            </p>

            <div class="product-card__price">
              <span class="product-card__current">$299</span>
            </div>

            <div class="product-card__features">
              <span class="product-card__feature">
                <Camera class="product-card__feature-icon" />
                4K Ultra HD
              </span>
              <span class="product-card__feature">
                <Wifi class="product-card__feature-icon" />
                WiFi 6
              </span>
            </div>
          </div>
        </article>

        <!-- Card 3 -->
        <article class="product-card">
          <div class="product-card__badge product-card__badge--special">
            Premium
          </div>

          <div class="product-card__image-container">
            <NuxtImg
              src="/images/display-1.png"
              alt="Product 3"
              class="product-card__image"
            />
            <div class="product-card__overlay">
              <button class="product-card__button">
                Ver Producto
                <ArrowRight class="product-card__icon" />
              </button>
            </div>
          </div>

          <div class="product-card__content">
            <h2 class="product-card__title">Smart Washer X1</h2>
            <p class="product-card__description">
              Lavadora inteligente de última generación
            </p>

            <div class="product-card__price">
              <span class="product-card__current">$899</span>
            </div>

            <div class="product-card__features">
              <span class="product-card__feature">
                <Droplet class="product-card__feature-icon" />
                Eco Wash
              </span>
              <span class="product-card__feature">
                <Zap class="product-card__feature-icon" />
                Smart Control
              </span>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ArrowRight,
  Music,
  Bluetooth,
  Camera,
  Wifi,
  Droplet,
  Zap,
} from "lucide-vue-next";
</script>

<style lang="scss" scoped>
.showcase {
  @apply min-h-screen bg-gradient-to-b from-gray-50 to-white py-20;

  &__container {
    @apply max-w-7xl mx-auto px-6;
  }

  &__title {
    @apply text-4xl font-bold text-center mb-16 text-gray-900;
    font-family: "Inter", sans-serif;
  }

  &__grid {
    @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8;
  }
}

.product-card {
  @apply bg-white rounded-2xl overflow-hidden relative;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

    .product-card__image {
      transform: scale(1.05);
    }

    .product-card__overlay {
      opacity: 1;
    }
  }

  &__badge {
    @apply absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full text-sm font-medium;
    background: linear-gradient(135deg, #ff4b6e, #ff8450);
    color: white;

    &--new {
      background: linear-gradient(135deg, #3b82f6, #2dd4bf);
    }

    &--special {
      background: linear-gradient(135deg, #8b5cf6, #d946ef);
    }
  }

  &__image-container {
    @apply relative overflow-hidden;
    aspect-ratio: 4/3;
  }

  &__image {
    @apply w-full h-full object-cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__overlay {
    @apply absolute inset-0 bg-black/40 flex items-center justify-center opacity-0;
    transition: opacity 0.3s ease;
  }

  &__button {
    @apply flex items-center gap-2 bg-white px-6 py-3 rounded-full text-sm font-medium text-gray-900;
    transition: all 0.2s ease;

    &:hover {
      @apply bg-blue-500 text-white transform scale-105;
    }
  }

  &__icon {
    @apply w-4 h-4;
  }

  &__content {
    @apply p-6 space-y-4;
  }

  &__title {
    @apply text-xl font-semibold text-gray-900;
  }

  &__description {
    @apply text-sm text-gray-600;
  }

  &__price {
    @apply flex items-baseline gap-2;
  }

  &__current {
    @apply text-2xl font-bold text-gray-900;
  }

  &__original {
    @apply text-sm text-gray-400 line-through;
  }

  &__features {
    @apply flex items-center gap-4 pt-4 border-t border-gray-100;
  }

  &__feature {
    @apply flex items-center gap-1.5 text-sm text-gray-600;
  }

  &__feature-icon {
    @apply w-4 h-4 text-blue-500;
  }
}

@media (max-width: 768px) {
  .showcase {
    @apply py-12;

    &__title {
      @apply text-3xl mb-10;
    }

    &__grid {
      @apply gap-6;
    }
  }

  .product-card {
    @apply mx-auto max-w-sm;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.product-card {
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: both;

  @for $i from 1 through 3 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.1}s;
    }
  }
}
</style>
