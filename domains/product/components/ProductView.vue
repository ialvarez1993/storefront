<template>
    <div class="container mx-auto px-4 py-8">
      <nav class="breadcrumb-container">
        <NuxtLink to="/" class="breadcrumb-link">
          <Icon name="lucide:home" class="w-4 h-4 mr-1" />
          Inicio
        </NuxtLink>
        <Icon name="lucide:chevron-right" class="w-4 h-4 mx-2 text-gray-400" />
        <span class="text-gray-600">Aire acondicionado 24.000 BTU Split</span>
      </nav>

      <div class="grid md:grid-cols-2 gap-12 mt-6">
        <!-- Contenedor de imagen con zoom -->
        <div class="image-zoom-container">
          <div
            ref="imageContainer"
            class="main-image-container"
            @mousemove="handleZoom"
            @mouseleave="handleMouseLeave"
            @mouseenter="handleMouseEnter"
          >
            <NuxtImg
              ref="mainImage"
              :src="currentImage"
              alt="Aire acondicionado 24.000 BTU Split"
              class="main-image"
              :class="{ zoomed: isZoomed }"
            />
            <div
              v-show="isZoomed"
              ref="zoomLens"
              class="zoom-lens"
              :style="lensStyle"
            />
            <div v-show="isZoomed" class="zoom-result" :style="zoomStyle" />
          </div>

          <!-- Miniaturas -->
          <div class="thumbnails-container">
            <button
              v-for="(image, index) in images"
              :key="index"
              class="thumbnail-btn"
              :class="{ active: currentImage === image }"
              @click="setCurrentImage(image)"
            >
              <NuxtImg
                :src="image"
                :alt="`Thumbnail ${index + 1}`"
                class="thumbnail-img"
              />
            </button>
          </div>
        </div>
        <!-- Información del producto -->
        <div class="product-info">
          <h1 class="product-title">Aire acondicionado 24.000 BTU Split</h1>

          <div class="price-container !mt-2">
            <span class="currency">$</span>
            <span class="amount">750</span>
            <span class="decimals">.00</span>
          </div>

          <div class="rating !mt-3">
            <div class="stars">
              <Icon
                v-for="n in 5"
                :key="n"
                name="lucide:star"
                class="star-icon"
                :class="{ filled: n <= 4 }"
              />
            </div>
          </div>

          <div class="stock-status">
            <Icon name="lucide:check-circle" class="w-5 h-5 mr-2" />
            <span>En stock, listo para ser enviado</span>
          </div>

          <div class="quantity-selector">
            <span class="quantity-label">Cantidad</span>
            <div class="quantity-controls">
              <button
                class="quantity-btn"
                :disabled="quantity <= 1"
                @click="decrementQuantity"
              >
                <Icon name="lucide:minus" class="w-4 h-4" />
              </button>
              <input
                type="number"
                :value="quantity"
                min="1"
                class="quantity-input"
                @input="(e) => (quantity = parseInt(e.target.value, 10) || 1)"
              />
              <button class="quantity-btn" @click="incrementQuantity">
                <Icon name="lucide:plus" class="w-4 h-4" />
              </button>
            </div>
          </div>

          <button class="add-to-cart-btn">
            <Icon name="lucide:shopping-cart" class="w-5 h-5 mr-2" />
            Agregar al carrito
          </button>

          <button class="whatsapp-btn">
            <Icon name="lucide:message-circle" class="w-5 h-5 mr-2" />
            Contáctanos por WhatsApp
          </button>

          <!-- Características del producto -->
          <div class="features">
            <div class="feature-item">
              <Icon name="lucide:truck" class="feature-icon" />
              <div class="feature-text">
                <strong>Envío Gratis</strong>
                <span>Entrega estimada: 2-4 días</span>
              </div>
            </div>
            <div class="feature-item">
              <Icon name="lucide:shield-check" class="feature-icon" />
              <div class="feature-text">
                <strong>Garantía de 2 años</strong>
                <span>Garantía oficial del fabricante</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
// Estado para las imágenes

console.log('Images prop:', props.images);
const images = ref(["/images/display-1.png", "/images/display-2.png"]);
const currentImage = ref(images.value[0]);

// Referencias y estado para el zoom
const imageContainer = ref(null);
const mainImage = ref(null);
const zoomLens = ref(null);
const isZoomed = ref(false);
const lensStyle = ref({});
const zoomStyle = ref({});

// Agregar estado para la cantidad
const quantity = ref(1);

// Funciones para el control de cantidad
const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Constantes para el zoom
const LENS_SIZE = 100;
const ZOOM_MULTIPLIER = 9;

// Cambiar imagen actual
const setCurrentImage = (image) => {
  currentImage.value = image;
};

// Manejar entrada del mouse
const handleMouseEnter = () => {
  isZoomed.value = true;
};

// Manejar salida del mouse
const handleMouseLeave = () => {
  isZoomed.value = false;
  lensStyle.value = {};
  zoomStyle.value = {};
};

// Calcular posición del zoom
const handleZoom = (event) => {
  if (!imageContainer.value || !mainImage.value) return;

  const rect = imageContainer.value.getBoundingClientRect();
  const image = mainImage.value;

  // Calcular posición relativa del mouse
  let mouseX = event.clientX - rect.left;
  let mouseY = event.clientY - rect.top;

  // Calcular límites
  const halfLens = LENS_SIZE / 2;
  mouseX = Math.max(halfLens, Math.min(mouseX, rect.width - halfLens));
  mouseY = Math.max(halfLens, Math.min(mouseY, rect.height - halfLens));

  // Actualizar posición de la lente
  lensStyle.value = {
    left: `${mouseX - halfLens}px`,
    top: `${mouseY - halfLens}px`,
    width: `${LENS_SIZE}px`,
    height: `${LENS_SIZE}px`,
  };

  // Calcular posición del zoom
  const xRatio = (mouseX / rect.width) * 100;
  const yRatio = (mouseY / rect.height) * 100;

  // Actualizar estilo del zoom
  zoomStyle.value = {
    backgroundImage: `url('${currentImage.value}')`,
    backgroundSize: `${rect.width * ZOOM_MULTIPLIER}px ${rect.height * ZOOM_MULTIPLIER}px`,
    backgroundPosition: `${xRatio}% ${yRatio}%`,
  };
};

// Observar cambios en la imagen actual para reiniciar el zoom
watch(currentImage, () => {
  isZoomed.value = false;
  lensStyle.value = {};
  zoomStyle.value = {};
});
</script>

<style lang="scss" scoped>
.breadcrumb {
  &-container {
    @apply flex items-center text-sm;
  }

  &-link {
    @apply flex items-center text-yellow-400 hover:text-yellow-500 transition-colors;
  }
}

.image-zoom-container {
  @apply relative;

  .main-image-container {
    @apply relative bg-white rounded-lg overflow-hidden cursor-zoom-in;
    aspect-ratio: 1;

    .main-image {
      @apply w-full h-full object-contain transition-opacity duration-200;

      &.zoomed {
        @apply opacity-80;
      }
    }

    .zoom-lens {
      @apply absolute pointer-events-none border-2 border-black;
      background: rgba(255, 255, 255, 0.4);
      transition: all 0.1s ease-out;
    }

    .zoom-result {
      @apply absolute left-full top-0 ml-4 border border-gray-200 rounded-lg overflow-hidden bg-white;
      width: 800px;
      height: 800px;
      background-repeat: no-repeat;
      z-index: 20;
      box-shadow:
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -1px rgba(0, 0, 0, 0.06);

      @media (max-width: 1280px) {
        @apply hidden;
      }
    }
  }
}

.thumbnails-container {
  @apply flex gap-2 mt-4 flex-wrap;

  .thumbnail-btn {
    @apply p-1 border-2 border-transparent rounded-lg overflow-hidden transition-all;
    width: 80px;
    height: 80px;

    &:hover {
      @apply border-yellow-300;
    }

    &.active {
      @apply border-black;
    }

    .thumbnail-img {
      @apply w-full h-full object-contain;
    }
  }
}
@media (max-width: 768px) {
  .image-zoom-container {
    .main-image-container {
      @apply cursor-default;

      .main-image {
        &.zoomed {
          @apply opacity-100;
        }
      }
    }
  }

  .thumbnails-container {
    @apply justify-center;

    .thumbnail-btn {
      width: 60px;
      height: 60px;
    }
  }

  .product-info {
    .product-title {
      @apply text-2xl;
    }

    .price-container {
      .amount {
        @apply text-3xl;
      }

      .currency,
      .decimals {
        @apply text-xl;
      }
    }
  }
}

.product-info {
  @apply space-y-6;

  .product-title {
    @apply text-3xl font-bold text-gray-900;
  }

  .rating {
    @apply flex items-center gap-2;

    .stars {
      @apply flex;

      .star-icon {
        @apply w-5 h-5 text-gray-300;

        &.filled {
          @apply text-yellow-400;
        }
      }
    }

    .reviews-link {
      @apply text-sm text-blue-600 hover:text-blue-800 hover:underline;
    }
  }
}

.price-container {
  @apply flex items-baseline;

  .currency {
    @apply text-2xl font-medium text-gray-900;
  }

  .amount {
    @apply text-4xl font-bold text-gray-900;
  }

  .decimals {
    @apply text-2xl font-medium text-gray-900;
  }
}

.stock-status {
  @apply flex items-center text-green-600 text-sm;

  .icon {
    @apply w-5 h-5 mr-2;
  }
}

.quantity-selector {
  @apply flex items-center gap-4;

  .quantity-label {
    @apply text-gray-700;
  }

  .quantity-controls {
    @apply flex items-center border border-gray-300 rounded-lg overflow-hidden;

    .quantity-btn {
      @apply p-2 hover:bg-gray-50 transition-colors;

      &:disabled {
        @apply opacity-50 cursor-not-allowed;
      }

      &:first-child {
        @apply border-r border-gray-300;
      }

      &:last-child {
        @apply border-l border-gray-300;
      }
    }

    .quantity-input {
      @apply w-16 text-center border-none focus:ring-0;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }
  }
}

.add-to-cart-btn {
  @apply w-full flex items-center justify-center px-6 py-3 text-white bg-black
         rounded-lg hover:bg-yellow-500 focus:ring-4 focus:ring-black
         transition-colors font-medium;

  .icon {
    @apply w-5 h-5 mr-2;
  }
}

.whatsapp-btn {
  @apply w-full flex items-center justify-center px-6 py-3 text-black
         bg-white border border-black bg-yellow-300/50 rounded-lg hover:bg-black
         transition-colors mt-3 font-medium;

  .icon {
    @apply w-5 h-5 mr-2;
  }
}

.features {
  @apply space-y-4 border-t border-gray-200 pt-6 mt-6;

  .feature-item {
    @apply flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors;

    .feature-icon {
      @apply w-6 h-6 text-black flex-shrink-0;
    }

    .feature-text {
      @apply flex flex-col;

      strong {
        @apply text-gray-900 font-medium;
      }

      span {
        @apply text-sm text-gray-600;
      }
    }
  }
}

// Estilos adicionales para mejorar la experiencia móvil
@media (max-width: 768px) {
  .image-zoom-container {
    .main-image-container {
      @apply cursor-default;

      .main-image {
        &.zoomed {
          @apply opacity-100;
        }
      }
    }
  }

  .thumbnails-container {
    @apply justify-center;

    .thumbnail-btn {
      width: 60px;
      height: 60px;
    }
  }

  .product-info {
    .product-title {
      @apply text-2xl;
    }

    .price-container {
      .amount {
        @apply text-3xl;
      }

      .currency,
      .decimals {
        @apply text-xl;
      }
    }
  }
}

// Animaciones
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

// Clases de utilidad para animaciones
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

.scale-in {
  animation: scaleIn 0.3s ease-out;
}

// Mejoras en la accesibilidad
.quantity-input,
.add-to-cart-btn,
.whatsapp-btn,
.thumbnail-btn {
  &:focus {
    @apply outline-none ring-2 ring-black/10 ring-offset-2;
  }
}

// Estilos para estados de carga y error
.loading {
  @apply animate-pulse bg-gray-200;
}

.error-state {
  @apply border-red-500 text-red-500;
}

// Tooltips personalizados
[data-tooltip] {
  @apply relative;

  &:hover::before {
    content: attr(data-tooltip);
    @apply absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
           px-3 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap;
  }

  &:hover::after {
    content: "";
    @apply absolute bottom-full left-1/2 transform -translate-x-1/2
           border-4 border-transparent border-t-gray-900 mb-1;
  }
}

// Mejoras en el contraste y legibilidad
.text-muted {
  @apply text-gray-600;
}

.text-highlight {
  @apply text-yellow-300 font-medium;
}

// Estilos para estados de hover mejorados
.hover-effect {
  @apply transition-all duration-200 ease-in-out;

  &:hover {
    @apply transform scale-105;
  }
}

// Sombras personalizadas
.custom-shadow {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
}
</style>
