<!-- components/SuperMenu/SuperMenu.vue -->
<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRouter } from "nuxt/app";
import { useSupermenuStore } from "~/stores/supermenu";
import MegaPanel from "./MenuPanel.vue";
import FeaturedCard from "./FeaturedCard.vue";

const store = useSupermenuStore();
const router = useRouter();
const { width: windowWidth } = useWindowSize();

const props = defineProps({
  menuConfig: {
    type: Object,
    required: true,
    validator: (config) => {
      return config.sections && Array.isArray(config.sections);
    },
  },
  theme: {
    type: String,
    default: "light",
    validator: (value) => ["light", "dark"].includes(value),
  },
  layout: {
    type: String,
    default: "standard",
    validator: (value) => ["standard", "mega", "cascade"].includes(value),
  },
  customClass: {
    type: String,
    default: "",
  },
  animationType: {
    type: String,
    default: "fade",
    validator: (value) => ["fade", "slide", "scale"].includes(value),
  },
});

const emit = defineEmits(["menuOpen", "menuClose", "itemClick", "panelChange"]);

// Refs
const menuContainerRef = ref(null);
const activeSection = ref(null);
const activePanel = ref(null);
const isOpen = ref(false);
const isMobile = computed(() => windowWidth.value < 1024);
const menuPosition = ref({ x: 0, y: 0 });
const touchStartY = ref(0);

// Estado para tracking de analytics
const menuInteractions = ref({
  openCount: 0,
  sectionViews: {},
  clickedItems: [],
});

// Computed properties
const menuClasses = computed(() => ({
  supermenu: true,
  [`supermenu--${props.theme}`]: true,
  [`supermenu--${props.layout}`]: true,
  "supermenu--mobile": isMobile.value,
  "is-open": isOpen.value,
  [props.customClass]: props.customClass,
}));

const currentPanelComponent = computed(() => {
  if (!activeSection.value) return null;
  return props.layout === "mega" ? MegaPanel : MenuPanel;
});

// Métodos para manejo de interacciones
const handleSectionHover = async (section) => {
  if (isMobile.value) return;

  activeSection.value = section;
  activePanel.value = await store.fetchPanelContent(section.id);
  trackSectionView(section.id);

  emit("panelChange", {
    sectionId: section.id,
    panelType: props.layout,
  });
};

const handleSectionClick = (section) => {
  if (!isMobile.value) return;

  if (activeSection.value?.id === section.id) {
    closeMenu();
  } else {
    activeSection.value = section;
    isOpen.value = true;
    emit("menuOpen", { sectionId: section.id });
  }
};

const handleItemClick = (item) => {
  trackItemClick(item);
  emit("itemClick", item);

  if (isMobile.value) {
    closeMenu();
  }
};

// Gestión de posición y dimensiones
const updateMenuPosition = () => {
  if (!menuContainerRef.value) return;

  const rect = menuContainerRef.value.getBoundingClientRect();
  menuPosition.value = {
    x: rect.left,
    y: rect.bottom,
  };
};

// Animaciones y transiciones
const getTransitionProps = computed(() => {
  const transitions = {
    fade: {
      enterActiveClass: "transition ease-out duration-200",
      enterFromClass: "opacity-0",
      enterToClass: "opacity-100",
      leaveActiveClass: "transition ease-in duration-150",
      leaveFromClass: "opacity-100",
      leaveToClass: "opacity-0",
    },
    slide: {
      enterActiveClass: "transition ease-out duration-300",
      enterFromClass: "transform -translate-y-2 opacity-0",
      enterToClass: "transform translate-y-0 opacity-100",
      leaveActiveClass: "transition ease-in duration-200",
      leaveFromClass: "transform translate-y-0 opacity-100",
      leaveToClass: "transform -translate-y-2 opacity-0",
    },
    scale: {
      enterActiveClass: "transition ease-out duration-200",
      enterFromClass: "transform scale-95 opacity-0",
      enterToClass: "transform scale-100 opacity-100",
      leaveActiveClass: "transition ease-in duration-150",
      leaveFromClass: "transform scale-100 opacity-100",
      leaveToClass: "transform scale-95 opacity-0",
    },
  };

  return transitions[props.animationType];
});

// Gestión táctil para móviles
const handleTouchStart = (e) => {
  touchStartY.value = e.touches[0].clientY;
};

const handleTouchMove = (e) => {
  if (!isOpen.value) return;

  const touchCurrentY = e.touches[0].clientY;
  const deltaY = touchCurrentY - touchStartY.value;

  if (deltaY > 50) {
    closeMenu();
  }
};

// Analytics y tracking
const trackSectionView = (sectionId) => {
  if (!menuInteractions.value.sectionViews[sectionId]) {
    menuInteractions.value.sectionViews[sectionId] = 0;
  }
  menuInteractions.value.sectionViews[sectionId]++;
};

const trackItemClick = (item) => {
  menuInteractions.value.clickedItems.push({
    itemId: item.id,
    timestamp: new Date(),
    sectionId: activeSection.value?.id,
  });
};

// Método de cierre
const closeMenu = () => {
  isOpen.value = false;
  activeSection.value = null;
  activePanel.value = null;
  emit("menuClose");
};

// Lifecycle hooks
onMounted(() => {
  updateMenuPosition();
  window.addEventListener("resize", updateMenuPosition);
  document.addEventListener("click", handleClickOutside);

  // Precarga de contenido para mejorar performance
  if (props.menuConfig.sections) {
    props.menuConfig.sections.forEach((section) => {
      store.prefetchPanelContent(section.id);
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateMenuPosition);
  document.removeEventListener("click", handleClickOutside);
});

// Watch para cambios de ruta
watch(
  () => router.currentRoute.value,
  () => closeMenu(),
);
</script>

<template>
  <div ref="menuContainerRef" :class="menuClasses">
    <!-- Navegación principal -->
    <nav class="supermenu__nav" role="navigation">
      <ul class="supermenu__sections">
        <li
          v-for="section in menuConfig.sections"
          :key="section.id"
          class="supermenu__section"
          :class="{ 'is-active': activeSection?.id === section.id }"
        >
          <button
            class="supermenu__section-btn"
            @mouseenter="handleSectionHover(section)"
            @click="handleSectionClick(section)"
          >
            <span class="supermenu__section-icon" v-if="section.icon">
              <component :is="section.icon" />
            </span>
            {{ section.title }}
            <IconChevronDown
              class="supermenu__section-arrow"
              :class="{ 'is-rotated': activeSection?.id === section.id }"
            />
          </button>
        </li>
      </ul>
    </nav>

    <!-- Panel de contenido -->
    <Transition v-bind="getTransitionProps">
      <div
        v-if="isOpen && activeSection"
        class="supermenu__panel-container"
        @mouseenter="handlePanelMouseEnter"
        @mouseleave="handlePanelMouseLeave"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
      >
        <component
          :is="currentPanelComponent"
          :section="activeSection"
          :panel-data="activePanel"
          :layout="layout"
          @item-click="handleItemClick"
        >
          <!-- Slots para contenido personalizado -->
          <template #featured-top v-if="$slots['featured-top']">
            <slot name="featured-top" />
          </template>

          <template #featured-bottom v-if="$slots['featured-bottom']">
            <slot name="featured-bottom" />
          </template>
        </component>

        <!-- Panel promocional -->
        <div v-if="activeSection.promotions" class="supermenu__promo">
          <FeaturedCard
            v-for="promo in activeSection.promotions"
            :key="promo.id"
            :promo="promo"
            @click="handlePromoClick(promo)"
          />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.supermenu {
  --supermenu-bg: var(--white, #ffffff);
  --supermenu-text: var(--gray-900, #111827);
  --supermenu-hover: var(--primary-500, #3b82f6);
  --supermenu-border: var(--gray-200, #e5e7eb);
  --supermenu-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);

  position: relative;
  width: 100%;

  &--dark {
    --supermenu-bg: var(--gray-900, #111827);
    --supermenu-text: var(--white, #ffffff);
    --supermenu-hover: var(--primary-400, #60a5fa);
    --supermenu-border: var(--gray-700, #374151);
  }

  &__nav {
    position: relative;
    background-color: var(--supermenu-bg);
    border-bottom: 1px solid var(--supermenu-border);
  }

  &__sections {
    display: flex;
    gap: 1rem;
    padding: 0 1rem;
    margin: 0;
    list-style: none;

    @media (max-width: 1023px) {
      flex-direction: column;
      padding: 0.5rem;
    }
  }

  &__section {
    position: relative;

    &.is-active {
      .supermenu__section-btn {
        color: var(--supermenu-hover);
      }
    }
  }

  &__section-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    color: var(--supermenu-text);
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: var(--supermenu-hover);
    }

    @media (max-width: 1023px) {
      width: 100%;
      justify-content: space-between;
    }
  }

  &__section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
  }

  &__section-arrow {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s ease;

    &.is-rotated {
      transform: rotate(-180deg);
    }
  }

  &__panel-container {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: var(--supermenu-bg);
    box-shadow: var(--supermenu-shadow);
    z-index: 50;

    @media (max-width: 1023px) {
      position: fixed;
      height: calc(100vh - var(--header-height, 4rem));
      overflow-y: auto;
    }
  }

  &--mega {
    .supermenu__panel-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      padding: 2rem;
    }
  }

  &__promo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    padding: 1rem;
    background: var(--gray-50, #f9fafb);

    @media (max-width: 1023px) {
      grid-template-columns: 1fr;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Utilidades
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
