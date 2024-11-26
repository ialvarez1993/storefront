<script setup>
import { ref, computed, onMounted, watch } from 'vue';
const { $sdk, $getImage } = useNuxtApp();


const props = defineProps({
  images: {
    type: Array,
    required: true,
    validator: (images) => images.every(img => img.url && img.thumbnail)
  },
  aspectRatio: {
    type: String,
    default: '16/9'
  },
  thumbnailPosition: {
    type: String,
    default: 'bottom',
    validator: (value) => ['top', 'right', 'bottom', 'left'].includes(value)
  },
  data: Object,
});

console.log(props.data)

// Referencias y estado
const sliderRef = ref(null);
const mainImageRef = ref(null);
const currentIndex = ref(0);
const isLoading = ref(true);
const isZoomed = ref(false);
const zoomLevel = ref(2);
const isDragging = ref(false);
const dragPosition = ref({ x: 0, y: 0 });
const dragStart = ref({ x: 0, y: 0 });

// Computed properties
const currentImage = computed(() => props.images[currentIndex.value]);
const canShowPrevious = computed(() => currentIndex.value > 0);
const canShowNext = computed(() => currentIndex.value < props.images.length - 1);
const thumbnailsClass = computed(() => `thumbnails--${props.thumbnailPosition}`);

// Métodos de navegación
const navigate = async (index) => {
  if (index === currentIndex.value) return;

  isLoading.value = true;
  currentIndex.value = index;
  resetZoom();

  // Precarga de imagen
  const img = new Image();
  img.src = props.images[index].url;

  img.onload = () => {
    isLoading.value = false;
  };

  img.onerror = () => {
    console.error('Error loading image');
    isLoading.value = false;
  };
};

const prev = () => {
  if (canShowPrevious.value) {
    navigate(currentIndex.value - 1);
  }
};

const next = () => {
  if (canShowNext.value) {
    navigate(currentIndex.value + 1);
  }
};

// Manejo del zoom
const handleZoom = (event) => {
  if (isLoading.value) return;

  if (!isZoomed.value) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    dragPosition.value = {
      x: (rect.width / 2 - x) * zoomLevel.value,
      y: (rect.height / 2 - y) * zoomLevel.value
    };
  } else {
    resetZoom();
  }

  isZoomed.value = !isZoomed.value;
};

const resetZoom = () => {
  isZoomed.value = false;
  isDragging.value = false;
  dragPosition.value = { x: 0, y: 0 };
};

// Manejo del arrastre (drag)
const startDrag = (event) => {
  if (!isZoomed.value) return;

  isDragging.value = true;
  dragStart.value = {
    x: event.clientX - dragPosition.value.x,
    y: event.clientY - dragPosition.value.y
  };
};

const doDrag = (event) => {
  if (!isDragging.value) return;

  dragPosition.value = {
    x: event.clientX - dragStart.value.x,
    y: event.clientY - dragStart.value.y
  };
};

const stopDrag = () => {
  isDragging.value = false;
};

// Manejo de eventos del teclado
const handleKeyDown = (event) => {
  if (isZoomed.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      prev();
      break;
    case 'ArrowRight':
      next();
      break;
    case 'Escape':
      resetZoom();
      break;
  }
};

// Lifecycle hooks
onMounted(() => {
  // Carga inicial de la primera imagen
  if (props.images.length > 0) {
    const preloadImage = new Image(); // props.data.smallImage
    preloadImage.src = props.images[0].url;

    preloadImage.onload = () => {
      isLoading.value = false;
    };

    preloadImage.onerror = () => {
      console.error('Error loading initial image');
      isLoading.value = false;
    };
  }

  // Event listeners
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('mousemove', doDrag);
  window.addEventListener('mouseup', stopDrag);

  if (mainImageRef.value) {
    mainImageRef.value.addEventListener('mousedown', startDrag);
  }
});

// Cleanup
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('mousemove', doDrag);
  window.removeEventListener('mouseup', stopDrag);

  if (mainImageRef.value) {
    mainImageRef.value.removeEventListener('mousedown', startDrag);
  }
});

// Observadores
watch(() => props.images, () => {
  currentIndex.value = 0;
  isLoading.value = true;
  resetZoom();
}, { deep: true });
</script>

<template>
  <div class="slider" ref="sliderRef" :class="[
    `slider--${thumbnailPosition}`,
    { 'slider--zoomed': isZoomed }
  ]">

    <div class="slider__container">
      <div class="slider__main" :style="{ aspectRatio }">
        <div class="slider__viewport">
          <Transition name="fade" mode="out-in">
            <div v-if="isLoading" class="slider__loader">
              <div class="loader"></div>
            </div>
            <NuxtImg v-else ref="mainImageRef" :key="currentImage.url" :src="$getImage(
              String(data.image),
              370,
              370,
              String(data.imageFilename),
            )
              " :alt="currentImage.alt || `Image ${currentIndex + 1}`" class="slider__image" :class="{
                'slider__image--zoomed': isZoomed,
                'slider__image--dragging': isDragging
              }" :style="{
                transform: isZoomed ? `scale(${zoomLevel}) translate(${dragPosition.x}px, ${dragPosition.y}px)` : ''
              }" @click="handleZoom" draggable="false" />
          </Transition>

          <button v-show="canShowPrevious && !isZoomed" class="slider__nav slider__nav--prev" @click="prev"
            aria-label="Previous image">
            <svg viewBox="0 0 24 24" class="slider__nav-icon">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          <button v-show="canShowNext && !isZoomed" class="slider__nav slider__nav--next" @click="next"
            aria-label="Next image">
            <svg viewBox="0 0 24 24" class="slider__nav-icon">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>

          <div class="slider__counter !hidden">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>

      <div class="slider__thumbnails-wrapper !hidden" :class="thumbnailsClass">
        <div class="slider__thumbnails">
          <button v-for="(image, index) in images" :key="image.id" class="slider__thumbnail"
            :class="{ 'slider__thumbnail--active': index === currentIndex }" @click="navigate(index)">
            <img :src="image.thumbnail" :alt="`Thumbnail ${index + 1}`" loading="lazy" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider {
  --slider-primary: #007bff;
  --slider-background: #f8f9fa;
  --slider-border: #dee2e6;
  --thumbnail-size: 60px;
  --thumbnail-gap: 4px;
  --slider-padding: 8px;

  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--slider-background);
  border-radius: 8px;
  overflow: hidden;
}

.slider__container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.slider--left .slider__container,
.slider--right .slider__container {
  flex-direction: row;
}

.slider--right .slider__container {
  flex-direction: row-reverse;
}

.slider__main {
  flex: 1;
  min-height: 0;
  position: relative;
  background: var(--slider-background);
}

.slider__viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.slider__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
  user-select: none;
}

.slider__thumbnails-wrapper {
  position: relative;
  background: white;
  padding: var(--slider-padding);
}

.slider__thumbnails {
  display: grid;
  gap: var(--thumbnail-gap);
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--slider-primary) var(--slider-background);
}

.slider__thumbnails::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.slider__thumbnails::-webkit-scrollbar-track {
  background: var(--slider-background);
}

.slider__thumbnails::-webkit-scrollbar-thumb {
  background: var(--slider-primary);
  border-radius: 3px;
}

/* Thumbnails bottom */
.thumbnails--bottom .slider__thumbnails {
  grid-auto-flow: column;
  grid-auto-columns: var(--thumbnail-size);
  max-width: 100%;
  height: var(--thumbnail-size);
}

/* Thumbnails left/right */
.thumbnails--left .slider__thumbnails,
.thumbnails--right .slider__thumbnails {
  grid-auto-flow: row;
  width: var(--thumbnail-size);
  max-height: 100%;
}

.slider__thumbnail {
  position: relative;
  width: var(--thumbnail-size);
  height: var(--thumbnail-size);
  padding: 0;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: none;
}

.slider__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slider__thumbnail--active {
  border-color: var(--slider-primary);
}

/* Resto de los estilos se mantienen igual, pero ajustamos algunos valores para móvil */
@media (max-width: 768px) {
  .slider {
    --thumbnail-size: 50px;
    --thumbnail-gap: 3px;
    --slider-padding: 6px;
  }

  .slider__nav {
    width: 32px;
    height: 32px;
  }

  .slider__counter {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .slider {
    --thumbnail-size: 40px;
    --thumbnail-gap: 2px;
    --slider-padding: 4px;
  }

  .thumbnails--left .slider__thumbnails-wrapper,
  .thumbnails--right .slider__thumbnails-wrapper {
    display: none;
  }
}

/* Los estilos del modo oscuro y reduced motion se mantienen igual */

.slider__counter {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  z-index: 10;
}

.slider__loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--slider-background);
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid var(--slider-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
