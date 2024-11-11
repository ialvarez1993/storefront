<template>
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
        :alt="altText"
        class="main-image"
        :class="{ zoomed: isZoomed }"
        loading="eager"
      />
      <div v-show="isZoomed" ref="zoomLens" class="zoom-lens" />
      <div v-show="isZoomed" class="zoom-result" :style="zoomStyle" />
    </div>

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
          loading="lazy"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
  altText?: string
}>()

const emit = defineEmits<{
  (e: 'image-click', image: string): void
}>()

// Estado local
const currentImage = ref(props.images[0])
const imageContainer = ref<HTMLElement | null>(null)
const mainImage = ref<HTMLImageElement | null>(null)
const zoomLens = ref<HTMLElement | null>(null)
const isZoomed = ref(false)
const lensStyle = ref({})
const zoomStyle = ref({})

// Constantes
const LENS_SIZE = 100
const ZOOM_MULTIPLIER = 9

// Métodos del zoom
const handleZoom = (event: MouseEvent) => {
  if (!imageContainer.value || !mainImage.value) return

  const rect = imageContainer.value.getBoundingClientRect()
  let mouseX = event.clientX - rect.left
  let mouseY = event.clientY - rect.top

  const halfLens = LENS_SIZE / 2

  mouseX = Math.max(halfLens, Math.min(mouseX, rect.width - halfLens))
  mouseY = Math.max(halfLens, Math.min(mouseY, rect.height - halfLens))

  lensStyle.value = {
    left: `${mouseX - halfLens}px`,
    top: `${mouseY - halfLens}px`,
    width: `${LENS_SIZE}px`,
    height: `${LENS_SIZE}px`
  }

  const xRatio = (mouseX / rect.width) * 100
  const yRatio = (mouseY / rect.height) * 100

  zoomStyle.value = {
    backgroundImage: `url('${currentImage.value}')`,
    backgroundSize: `${rect.width * ZOOM_MULTIPLIER}px ${rect.height * ZOOM_MULTIPLIER}px`,
    backgroundPosition: `${xRatio}% ${yRatio}%`
  }
}

// Otros métodos
const setCurrentImage = (image: string) => {
  currentImage.value = image
  emit('image-click', image)
}

const handleMouseEnter = () => {
  isZoomed.value = true
}

const handleMouseLeave = () => {
  isZoomed.value = false
  lensStyle.value = {}
  zoomStyle.value = {}
}

// Watchers
watch(currentImage, () => {
  isZoomed.value = false
  lensStyle.value = {}
  zoomStyle.value = {}
})
</script>
