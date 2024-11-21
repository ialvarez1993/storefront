<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const images = [
  {
    id: 1,
    url: "https://static.vecteezy.com/system/resources/thumbnails/047/082/969/small_2x/fashion-shoes-on-transparent-background-png.png",
    thumbnail:
      "https://static.vecteezy.com/system/resources/thumbnails/047/082/969/small_2x/fashion-shoes-on-transparent-background-png.png",
  },
  {
    id: 2,
    url: "https://images.vexels.com/content/122780/preview/nike-air-shoes-vector-3-7fda2a.png",
    thumbnail:
      "https://images.vexels.com/content/122780/preview/nike-air-shoes-vector-3-7fda2a.png",
  },
];

const currentIndex = ref(0);
const isModalOpen = ref(false);
const isZoomed = ref(false);
const modalRoot = ref(null);

const currentImage = computed(() => images[currentIndex.value]);

const handleKeydown = (event) => {
  if (!isModalOpen.value) return;

  switch (event.key) {
    case "ArrowLeft":
      prev();
      break;
    case "ArrowRight":
      next();
      break;
    case "Escape":
      closeModal();
      break;
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);

  // Crear el elemento root del modal
  modalRoot.value = document.createElement("div");
  modalRoot.value.id = "modal-root";
  document.body.appendChild(modalRoot.value);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  if (modalRoot.value && document.body.contains(modalRoot.value)) {
    document.body.removeChild(modalRoot.value);
  }
});

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
};

const selectImage = (index) => {
  currentIndex.value = index;
};

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value;
};

const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  isZoomed.value = false;
  document.body.style.overflow = "auto";
};
</script>

<template>
  <div class="gallery-container">
    <button @click="openModal" class="action-btn preview">
      <i class="fas fa-eye"></i>
    </button>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="modal" @click.self="closeModal">
          <div class="modal-content" :class="{ 'is-zoomed': isZoomed }">
            <!-- Controles superiores -->
            <div class="controls">
              <span class="counter"
                >{{ currentIndex + 1 }} / {{ images.length }}</span
              >
              <button
                @click="closeModal"
                class="close-button"
                aria-label="Cerrar"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <!-- Imagen principal -->
            <div class="main-image-container">
              <Transition name="fade" mode="out-in">
                <img
                  :key="currentImage.url"
                  :src="currentImage.url"
                  :class="['main-image', { zoomed: isZoomed }]"
                  @click="toggleZoom"
                  :alt="`Imagen ${currentIndex + 1}`"
                />
              </Transition>

              <button
                @click="prev"
                class="nav-button prev"
                aria-label="Anterior"
              >
                <span aria-hidden="true">&lt;</span>
              </button>
              <button
                @click="next"
                class="nav-button next"
                aria-label="Siguiente"
              >
                <span aria-hidden="true">&gt;</span>
              </button>
            </div>

            <!-- Miniaturas -->
            <div class="thumbnails" role="list">
              <img
                v-for="(image, index) in images"
                :key="image.id"
                :src="image.thumbnail"
                :class="['thumbnail', { active: index === currentIndex }]"
                @click="selectImage(index)"
                :alt="`Miniatura ${index + 1}`"
                role="button"
                :aria-label="`Seleccionar imagen ${index + 1}`"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.gallery-container {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    sans-serif;
}

.open-button {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.open-button:hover {
  background: #0056b3;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  width: 90%;
  max-width: 1200px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.modal-content.is-zoomed {
  width: 100%;
  height: 100vh;
  border-radius: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.counter {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px 10px;
  color: #333;
  transition: color 0.2s ease;
}

.close-button:hover {
  color: #ff0000;
}

.main-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  overflow: hidden;
}

.main-image {
  max-width: 100%;
  max-height: calc(100vh - 200px);
  object-fit: contain;
  transition: transform 0.3s ease;
}

.main-image.zoomed {
  transform: scale(1.5);
  cursor: zoom-out;
}

.action-btn {
  @apply w-10 h-10 rounded-full bg-white flex items-center justify-center
           transition-transform duration-300 hover:scale-110;

  &.preview {
    @apply text-black hover:bg-blue-50;
  }

  &.cart {
    @apply text-black hover:bg-green-50;
  }
}

.nav-button {
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 15px;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
  z-index: 2;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.8);
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.thumbnails {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: #007bff #f0f0f0;
}

.thumbnails::-webkit-scrollbar {
  height: 6px;
}

.thumbnails::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.thumbnails::-webkit-scrollbar-thumb {
  background-color: #007bff;
  border-radius: 6px;
}

.thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.thumbnail:hover {
  transform: translateY(-2px);
}

.thumbnail.active {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.3);
}

/* Animaciones */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }

  .main-image {
    max-height: calc(100vh - 250px);
  }

  .thumbnail {
    width: 60px;
    height: 60px;
  }

  .nav-button {
    padding: 10px;
    width: 40px;
    height: 40px;
  }
}

@media (hover: none) {
  .nav-button {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
