<!-- components/ExpandableMenu.vue -->
<template>
  <div class="menu-wrapper" ref="menuRef">
    <!-- Botón mejorado -->
    <NuxtLink
      @click.prevent="toggleMenu"
      class="menu-button border-none cursor-pointer group"
      :class="{ 'menu-button-active': isOpen }"
    >
      <div class="button-content">
        <Icon
          name="heroicons:bars-3"
          class="button-icon !text-black group-hover:!text-[#FFC107] !font-black"
        />
        <span class="button-text group-hover:!text-[#FFC107] font-medium"
          >Digital</span
        >
        <Icon
          name="heroicons:chevron-down"
          class="button-arrow !text-black group-hover:!text-[#FFC107] !font-black"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </NuxtLink>

    <!-- Menú desplegable -->
    <div
      v-show="isOpen"
      class="menu-dropdown"
      :class="{ 'menu-dropdown-active': isOpen }"
    >
      <div class="menu-content">
        <div class="menu-items">
          <template v-for="(item, index) in menuItems" :key="getItemId(item)">
            <div class="menu-item">
              <button
                @click="toggleItem(item)"
                class="item-button"
                :class="{
                  'item-button-active':
                    isExpanded(item) || isActiveParent(item),
                }"
              >
                <div class="item-button-content">
                  <Icon v-if="item.icon" :name="item.icon" class="item-icon" />
                  <span class="item-text">{{ item.label }}</span>
                </div>
                <Icon
                  v-if="hasChildren(item)"
                  name="heroicons:chevron-right"
                  class="item-expand-icon"
                  :class="{ 'rotate-90': isExpanded(item) }"
                />
              </button>

              <div
                v-if="hasChildren(item)"
                v-show="isExpanded(item)"
                class="submenu"
              >
                <button
                  v-for="child in item.children"
                  :key="getItemId(child)"
                  @click="handleItemClick(child)"
                  class="submenu-button"
                  :class="{ 'submenu-button-active': isActiveItem(child) }"
                >
                  <Icon
                    v-if="child.icon"
                    :name="child.icon"
                    class="submenu-icon"
                  />
                  <span class="submenu-text">{{ child.label }}</span>
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface MenuItem {
  id?: string | number;
  label: string;
  icon?: string;
  children?: MenuItem[];
  action?: () => void;
}

const props = withDefaults(
  defineProps<{
    title: string;
    initialActiveId?: string | number;
    closeOnOutsideClick?: boolean;
    persistentMenu?: boolean;
  }>(),
  {
    closeOnOutsideClick: true,
    persistentMenu: false,
  },
);

const emit = defineEmits<{
  (e: "select", item: MenuItem): void;
  (e: "open"): void;
  (e: "close"): void;
}>();

const menuRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const expandedItems = ref(new Set<string | number>());
const activeItemId = ref<string | number | null>(props.initialActiveId || null);

// Datos del menú (igual que antes)
const menuItems = [
  {
    id: "menu1",
    label: "Computación",
    icon: "heroicons-outline:computer-desktop",
    children: [
      {
        id: "submenu1",
        label: "Accesorios",
        icon: "mdi:memory", // Icono de Iconify (Material Design)
      },
      {
        id: "submenu2",
        label: "All in one",
        icon: "heroicons-outline:computer-desktop",
      },
      {
        id: "submenu3",
        label: "Monitores",
        icon: "mdi:monitor", // Icono de Iconify (Material Design)
      },
      {
        id: "submenu6",
        label: "Routers y conectividad",
        icon: "heroicons-outline:wifi",
      },
    ],
  },
  {
    id: "menu2",
    label: "Impresoras",
    icon: "heroicons-outline:printer",
    children: [
      {
        id: "submenu7",
        label: "Impresoras",
        icon: "heroicons-outline:printer",
      },
      {
        id: "submenu8",
        label: "Accesorios de impresoras",
        icon: "mdi:cog-outline", // Icono de Iconify (Material Design Outline)
      },
    ],
  },
  {
    id: "menu3",
    label: "Móviles",
    icon: "heroicons-outline:device-phone-mobile",
    children: [
      {
        id: "submenu9",
        label: "Celulares",
        icon: "heroicons-outline:device-phone-mobile",
      },
      {
        id: "submenu10",
        label: "Accesorios de celulares",
        icon: "mdi:headphones", // Icono de Iconify (Material Design)
      },
    ],
  },
  {
    id: "menu4",
    label: "Smartwatches",
    icon: "heroicons-outline:clock",
    children: [
      {
        id: "submenu11",
        label: "Smartwatches",
        icon: "heroicons-outline:clock",
      },
    ],
  },
  {
    id: "menu5",
    label: "Fotografía",
    icon: "heroicons-outline:camera",
    children: [
      {
        id: "submenu12",
        label: "Cámaras fotográficas",
        icon: "heroicons-outline:camera",
      },
      {
        id: "submenu13",
        label: "Accesorios de cámaras",
        icon: "mdi:cog-outline", // Icono de Iconify (Material Design Outline)
      },
    ],
  },
  {
    id: "menu6",
    label: "Smart home",
    icon: "heroicons-outline:home",
    children: [
      {
        id: "submenu14",
        label: "Asistente de voz",
        icon: "mdi:microphone-outline", // Icono de Iconify (Material Design Outline)
      },
    ],
  },
  {
    id: "menu7",
    label: "Videojuegos",
    icon: "mdi:gamepad-variant-outline", // Icono de Iconify (Material Design Outline)
    children: [
      {
        id: "submenu15",
        label: "Consolas",
        icon: "mdi:console", // Icono de Iconify (Material Design)
      },
      {
        id: "submenu16",
        label: "Accesorios de consolas",
        icon: "mdi:cog-outline", // Icono de Iconify (Material Design Outline)
      },
      {
        id: "submenu17",
        label: "Controles",
        icon: "mdi:controller", // Icono de Iconify (Material Design)
      },
    ],
  },
];

// Funciones de utilidad mejoradas
const getItemId = (item: MenuItem): string | number => {
  return item.id || item.label;
};

const hasChildren = (item: MenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

const isExpanded = (item: MenuItem): boolean => {
  return expandedItems.value.has(getItemId(item));
};

const isActiveItem = (item: MenuItem): boolean => {
  return getItemId(item) === activeItemId.value;
};

const isActiveParent = (item: MenuItem): boolean => {
  if (!item.children) return false;
  return item.children.some(
    (child) => isActiveItem(child) || isActiveParent(child),
  );
};

// Manejadores de eventos mejorados
const toggleMenu = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    emit("open");
  } else {
    emit("close");
  }
};

const toggleItem = (item: MenuItem) => {
  const itemId = getItemId(item);

  if (hasChildren(item)) {
    if (expandedItems.value.has(itemId)) {
      expandedItems.value.delete(itemId);
    } else {
      expandedItems.value.add(itemId);
    }
  } else {
    handleItemClick(item);
  }
};

const handleItemClick = (item: MenuItem) => {
  activeItemId.value = getItemId(item);
  emit("select", item);

  if (item.action) {
    item.action();
  }

  if (!props.persistentMenu && !hasChildren(item)) {
    closeMenu();
  }
};

const closeMenu = () => {
  if (!props.persistentMenu) {
    isOpen.value = false;
    if (!props.persistentMenu) {
      expandedItems.value.clear();
    }
    emit("close");
  }
};

// Manejo mejorado de clicks fuera del menú
const handleClickOutside = (event: MouseEvent) => {
  if (
    props.closeOnOutsideClick &&
    menuRef.value &&
    !menuRef.value.contains(event.target as Node)
  ) {
    closeMenu();
  }
};

// Lifecycle hooks
onMounted(() => {
  if (props.closeOnOutsideClick) {
    document.addEventListener("click", handleClickOutside);
  }
});

onUnmounted(() => {
  if (props.closeOnOutsideClick) {
    document.removeEventListener("click", handleClickOutside);
  }
});
</script>

<style lang="scss" scoped>
.menu-wrapper {
  @apply relative inline-block;
}

.menu-button {
  @apply relative w-full inline-flex items-center justify-between px-4 py-2.5
         bg-white dark:bg-gray-800 rounded-lg border border-gray-200
         dark:border-gray-700  transition-all duration-200
         hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none
         focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-600;

  &-active {
    @apply bg-gray-50 dark:bg-gray-700 border-gray-300
           dark:border-gray-600;
  }
}

.button-content {
  @apply flex items-center gap-3;
}

.button-icon {
  @apply w-5 h-5 text-gray-500 dark:text-gray-400;
}

.button-arrow {
  @apply w-4 h-4 text-gray-400 transition-transform duration-300;
}

.menu-dropdown {
  @apply absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800
         rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
         z-50 transform transition-all duration-200 ease-out;

  &-active {
    @apply opacity-100 translate-y-0;
  }
}

.menu-content {
  @apply py-2;
}

.menu-items {
  @apply px-2 space-y-1;
}

.item-button {
  @apply w-full flex items-center justify-between px-3 py-2.5 rounded-lg
         transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700
         focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700;

  &-active {
    @apply bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700
           dark:text-yellow-300;
  }
}

.item-button-content {
  @apply flex items-center gap-3;
}

.item-icon {
  @apply w-5 h-5 text-gray-400 dark:text-gray-500;
}

.item-text {
  @apply text-sm font-medium text-gray-700 dark:text-gray-200;
}

.item-expand-icon {
  @apply w-4 h-4 text-gray-400 transition-transform duration-300;
}

.submenu {
  @apply pl-4 mt-1 space-y-1;
}

.submenu-button {
  @apply w-full flex items-center gap-2 px-3 py-2 rounded-lg
         transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700
         focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700;

  &-active {
    @apply bg-yellow-50 dark:bg-yellow-900/50 text-yellow-700
           dark:text-yellow-300;
  }
}

.submenu-icon {
  @apply w-4 h-4 text-gray-400 dark:text-gray-500;
}

.submenu-text {
  @apply text-sm text-gray-600 dark:text-gray-300;
}
</style>
