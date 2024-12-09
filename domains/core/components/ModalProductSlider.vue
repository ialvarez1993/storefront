<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import ImageSlider from "./ImageSlider.vue";
import ProductDataView from "./ProductDataView.vue";
import { defineAsyncComponent, computed } from "vue";
import { useScreenSize } from "../../../compasables/useScreenSize.ts";

const { isMobile } = useScreenSize();

const MobileViewSlider = defineAsyncComponent(
  () => import("./ImageSliderMobile.vue"),
);
const DesktopViewSlider = defineAsyncComponent(
  () => import("./ImageSliderDesktop.vue"),
);

const MobileViewData = defineAsyncComponent(
  () => import("../components/MobileProductDataView.vue"),
);
const DesktopViewData = defineAsyncComponent(
  () => import("../components/ProductDataView.vue"),
);

// Refs y estado
const isModalOpen = ref(false);
const modalRoot = ref<HTMLElement | null>(null);

// Lifecycle hooks
onMounted(() => {
  modalRoot.value = document.createElement("div");
  modalRoot.value.id = "modal-root";
  document.body.appendChild(modalRoot.value);
});

onUnmounted(() => {
  if (modalRoot.value && document.body.contains(modalRoot.value)) {
    document.body.removeChild(modalRoot.value);
  }
});

// Métodos
const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = "auto";
};

const props = defineProps({
  data: Object,
});

// Data
const images: Image[] = [
  {
    id: 1,
    url: "https://static.vecteezy.com/system/resources/thumbnails/047/082/969/small_2x/fashion-shoes-on-transparent-background-png.png",
    thumbnail:
      "https://static.vecteezy.com/system/resources/thumbnails/047/082/969/small_2x/fashion-shoes-on-transparent-background-png.png",
  },
  {
    id: 2,
    url: "https://static.nike.com/a/images/f_auto/61818ef6-4a3b-4fc8-b7fe-feef5b6a7820/W+NIKE+AIR+MAX+NUAXIS.png",
    thumbnail:
      "https://static.nike.com/a/images/f_auto/61818ef6-4a3b-4fc8-b7fe-feef5b6a7820/W+NIKE+AIR+MAX+NUAXIS.png",
  },
  {
    id: 3,
    url: "https://static.nike.com/a/images/w_1280,q_auto,f_auto/ejedulmng5d8wwcekzvn/nike-af-1-low-nba-amarillo-black-white-release-date.jpg",
    thumbnail:
      "https://static.nike.com/a/images/w_1280,q_auto,f_auto/ejedulmng5d8wwcekzvn/nike-af-1-low-nba-amarillo-black-white-release-date.jpg",
  },
];
</script>

<template>
  <div class="gallery-container">
    <button @click="openModal" class="action-btn preview">
      <i class="fas fa-eye"></i>
      <span class="btn-tooltip">Vista previas</span>
    </button>

    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="isModalOpen" class="modal" @click.self="closeModal">
          <div class="modal-content">
            <button
              @click="closeModal"
              class="close-button"
              aria-label="Cerrar"
            >
              <span aria-hidden="true">&times;</span>
            </button>

            <div class="modal-grid">
              <Suspense>
                <template #default>
                  <component
                    :is="isMobile ? MobileViewSlider : DesktopViewSlider"
                    :data="data"
                    :images="images"
                  />
                </template>
                <template #fallback>
                  <div>Cargando...</div>
                </template>
              </Suspense>

              <Suspense>
                <template #default>
                  <component
                    :is="isMobile ? MobileViewData : DesktopViewData"
                    :data="data"
                    :product-data="productData"
                  />
                </template>
                <template #fallback>
                  <div>Cargando...</div>
                </template>
              </Suspense>
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
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
  position: relative;
}

.action-btn {
  position: relative;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.action-btn:hover {
  transform: translateY(-2px) scale(1.05);
  background: #ffffff;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.btn-tooltip {
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
}

.action-btn:hover .btn-tooltip {
  opacity: 1;
  visibility: visible;
  bottom: -2.5rem;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 1200px;
  background: white;
  padding: 2.5rem;
  border-radius: 1rem;
  position: relative;
  height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform-origin: center;
  animation: modalEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 2.5rem;
  height: 100%;
}

.close-button {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(0, 0, 0, 0.1);
  border: none;
  width: 2.5rem;
  z-index: 10;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  font-size: 1.5rem;
}

.close-button:hover {
  background: #ff4444;
  color: white;
  transform: rotate(90deg);
}

/* Animaciones */
@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-fade-enter-active {
  animation: modalFadeIn 0.3s ease-out;
}

.modal-fade-leave-active {
  animation: modalFadeOut 0.3s ease-in;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes modalFadeOut {
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Scrollbar personalizado */
.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Media Queries */
@media (max-width: 1024px) {
  .modal-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .modal-content {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    padding: 1.5rem;
  }

  .close-button {
    top: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    padding: 1rem;
  }

  .close-button {
    width: 2rem;
    height: 2rem;
    font-size: 1.25rem;
  }
}

/* Soporte para modo oscuro */
</style>
