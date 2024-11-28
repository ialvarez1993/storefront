<!-- components/ExpandableMenu.vue -->
<template>
  <div class="relative" ref="menuRef">
    <!-- Trigger Button -->
    <button @click="toggleMenu"
      class="expand-trigger-btn group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
      :class="{ active: isOpen }">
      <Icon name="heroicons:bars-3" class="w-6 h-6" />
      <span class="font-medium">{{ title }}</span>
      <Icon name="heroicons:chevron-down" class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Expandable Menu -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-show="isOpen" class="expandable-menu">
        <div class="menu-container">
          <div class="menu-section">
            <ul class="menu-list">
              <li v-for="(item, index) in menuItems" :key="getItemId(item)">
                <div @click.stop="toggleItem(item)" class="menu-item-parent" :class="{
                  active: isExpanded(item) || isActiveParent(item),
                }">
                  <div class="item-content">
                    <Icon v-if="item.icon" :name="item.icon" class="item-icon" />
                    <span class="item-label">{{ item.label }}</span>
                  </div>
                  <Icon v-if="hasChildren(item)" name="heroicons:chevron-right" class="item-arrow"
                    :class="{ 'rotate-90': isExpanded(item) }" />
                </div>

                <Transition enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[500px] opacity-100"
                  leave-active-class="transition-all duration-200 ease-in" leave-from-class="max-h-[500px] opacity-100"
                  leave-to-class="max-h-0 opacity-0">
                  <ul v-show="isExpanded(item) && hasChildren(item)" class="menu-children">
                    <li v-for="child in item.children" :key="getItemId(child)" @click.stop="handleItemClick(child)"
                      class="menu-item-child" :class="{ active: isActiveItem(child) }">
                      <Icon v-if="child.icon" :name="child.icon" class="child-icon" />
                      <span class="child-label">{{ child.label }}</span>
                    </li>
                  </ul>
                </Transition>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Transition>
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

const props = defineProps<{
  title: string;
  initialActiveId?: string | number;
}>();

const emit = defineEmits<{
  (e: "select", item: MenuItem): void;
  (e: "open"): void;
  (e: "close"): void;
}>();

// Estado
const menuRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const expandedItems = ref(new Set<string | number>());
const activeItemId = ref<string | number | null>(props.initialActiveId || null);

const menuItems: MenuItem[] = [
  {
    id: "menu1",
    label: "Comercial",
    icon: "heroicons:briefcase",
    children: [
      {
        id: "submenu1",
        label: "Clientes",
        icon: "heroicons:users",
        children: [
          {
            id: "subsubmenu1",
            label: "Listado de Clientes",
            icon: "heroicons:list-bullet",
          },
          {
            id: "subsubmenu2",
            label: "Nuevo Cliente",
            icon: "heroicons:user-plus",
          },
        ],
      },
      {
        id: "submenu2",
        label: "Ventas",
        icon: "heroicons:shopping-cart",
        children: [
          {
            id: "subsubmenu3",
            label: "Pedidos",
            icon: "heroicons:shopping-bag",
          },
          {
            id: "subsubmenu4",
            label: "Facturas",
            icon: "heroicons:document-text",
          },
        ],
      },
    ],
  },
  {
    id: "menu2",
    label: "Administración",
    icon: "heroicons:cog-6-tooth",
    children: [
      {
        id: "submenu3",
        label: "Usuarios",
        icon: "heroicons:users",
        children: [
          {
            id: "subsubmenu5",
            label: "Gestión de Usuarios",
            icon: "heroicons:user-group",
          },
          {
            id: "subsubmenu6",
            label: "Roles y Permisos",
            icon: "heroicons:key",
          },
        ],
      },
      {
        id: "submenu4",
        label: "Configuración",
        icon: "heroicons:adjustments-horizontal",
        children: [
          {
            id: "subsubmenu7",
            label: "General",
            icon: "heroicons:cog",
          },
          {
            id: "subsubmenu8",
            label: "Empresa",
            icon: "heroicons:building-office",
          },
        ],
      },
    ],
  },
  {
    id: "menu3",
    label: "Reportes",
    icon: "heroicons:chart-bar",
    children: [
      {
        id: "submenu5",
        label: "Ventas",
        icon: "heroicons:presentation-chart-line",
      },
      {
        id: "submenu6",
        label: "Clientes",
        icon: "heroicons:user-circle",
      },
    ],
  },
];

// Utilidades
const getItemId = (item: MenuItem): string | number => {
  return item.id || item.label;
};

const hasChildren = (item: MenuItem): boolean => {
  return !!item.children && item.children.length > 0;
};

// Manejo de estado
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

// Manejadores de eventos
const toggleMenu = (event: Event) => {
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

  // Solo cerrar si es un ítem final sin hijos
  if (!hasChildren(item)) {
    closeMenu();
  }
};

const closeMenu = () => {
  isOpen.value = false;
  expandedItems.value.clear();
  emit("close");
};

// Manejo de clicks fuera del menú
const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu();
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style lang="scss" scoped>
.expand-trigger-btn {
  @apply bg-white border border-gray-200 shadow-sm;

  &.active {
    @apply bg-gray-50 border-gray-300;
  }
}

.expandable-menu {
  @apply absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50;
}

.menu-container {
  @apply py-2;
}

.menu-section {
  @apply px-2;
}

.menu-list {
  @apply space-y-1;
}

.menu-item-parent {
  @apply flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200;

  &:hover {
    @apply bg-gray-50;
  }

  &.active {
    @apply bg-white text-yellow-700;

    .item-icon {
      @apply text-yellow-500;
    }
  }
}

.item-content {
  @apply flex items-center gap-3;
}

.item-icon {
  @apply w-5 h-5 text-gray-400;
}

.item-label {
  @apply text-sm font-medium text-gray-700;
}

.item-arrow {
  @apply w-4 h-4 text-gray-400 transition-transform duration-200;
}

.menu-children {
  @apply pl-4 overflow-hidden;
}

.menu-item-child {
  @apply flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-50 transition-all duration-200;

  &:hover {
    @apply text-yellow-600;

    .child-icon {
      @apply text-yellow-500;
    }
  }

  &.active {
    @apply bg-yellow-50 text-yellow-700;

    .child-icon {
      @apply text-yellow-500;
    }
  }
}

.child-icon {
  @apply w-4 h-4 text-gray-400;
}

.child-label {
  @apply text-sm;
}
</style>
