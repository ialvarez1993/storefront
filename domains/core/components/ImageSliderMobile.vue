<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true,
    validator: (images) => images.every(img => img.url && img.thumbnail)
  },
  aspectRatio: {
    type: String,
    default: '1/1'
  }
});

// Referencias y estado
const sliderRef = ref(null);
const currentIndex = ref(0);
const isLoading = ref(true);
const touchStart = ref(null);
const touchEnd = ref(null);

// Computed properties
const currentImage = computed(() => props.images[currentIndex.value]);
const canShowPrevious = computed(() => currentIndex.value > 0);
const canShowNext = computed(() => currentIndex.value < props.images.length - 1);

// Métodos de navegación
const navigate = async (index) => {
  if (index === currentIndex.value) return;

  isLoading.value = true;
  currentIndex.value = index;

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

// Manejo de gestos táctiles
const handleTouchStart = (event) => {
  touchStart.value = event.touches[0].clientX;
};

const handleTouchMove = (event) => {
  touchEnd.value = event.touches[0].clientX;
};

const handleTouchEnd = () => {
  if (!touchStart.value || !touchEnd.value) return;

  const distance = touchStart.value - touchEnd.value;
  const minSwipeDistance = 50;

  if (Math.abs(distance) >= minSwipeDistance) {
    if (distance > 0) {
      next();
    } else {
      prev();
    }
  }

  touchStart.value = null;
  touchEnd.value = null;
};

// Lifecycle hooks
onMounted(() => {
  if (props.images.length > 0) {
    const preloadImage = new Image();
    preloadImage.src = props.images[0].url;

    preloadImage.onload = () => {
      isLoading.value = false;
    };

    preloadImage.onerror = () => {
      console.error('Error loading initial image');
      isLoading.value = false;
    };
  }
});

watch(() => props.images, () => {
  currentIndex.value = 0;
  isLoading.value = true;
}, { deep: true });
</script>

<template>
  <div class="mobile-slider" ref="sliderRef">
    <div class="mobile-slider__container">
      <div class="mobile-slider__main" :style="{ aspectRatio }">
        <div class="mobile-slider__viewport" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
          @touchend="handleTouchEnd">
          <Transition name="fade" mode="out-in">
            <div v-if="isLoading" class="mobile-slider__loader">
              <div class="loader"></div>
            </div>
            <NuxtImg v-else :key="currentImage.url" :src="currentImage.url"
              :alt="currentImage.alt || `Image ${currentIndex + 1}`" class="mobile-slider__image" />
          </Transition>
        </div>
      </div>

      <div class="mobile-slider__dots">
        <button v-for="(image, index) in images" :key="image.id" class="mobile-slider__dot"
          :class="{ 'mobile-slider__dot--active': index === currentIndex }" @click="navigate(index)"
          :aria-label="`Go to image ${index + 1}`"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-slider {
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  position: relative;
}

.mobile-slider__container {
  width: 100%;
}

.mobile-slider__main {
  position: relative;
  width: 100%;
}

.mobile-slider__viewport {
  position: relative;
  width: 100%;
  height: 100%;
  touch-action: pan-x;
}

.mobile-slider__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mobile-slider__loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.mobile-slider__dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
}

.mobile-slider__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ddd;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.mobile-slider__dot--active {
  background-color: #333;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
