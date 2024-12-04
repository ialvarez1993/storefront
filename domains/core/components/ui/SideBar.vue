<template>
  <div class="card flex justify-center">
    <Drawer v-model:visible="visible" class="sidebar-drawer">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <div class="flex items-center justify-between px-6 pt-4 shrink-0">
            <span class="inline-flex items-center gap-2">
              <VsfLogo />
            </span>
            <Button
              type="button"
              @click="closeCallback"
              icon="pi pi-times"
              class="!text-yellow-600 !border-yellow-600 hover:!bg-black"
              rounded
              outlined
            />
          </div>

          <div class="overflow-y-auto">
            <div class="p-4">
              <div class="flex flex-col gap-2">
                <NuxtLink to="/login" class="menu-item">Mi cuenta</NuxtLink>
                <NuxtLink to="#" class="menu-item">Cerrar</NuxtLink>
              </div>
            </div>

            <div class="menu-section">
              <div class="shipping-banner p-4">
                Envíos gratis a todo Venezuela
              </div>

              <ul class="list-none p-0 m-0">
                <li v-for="(category, index) in categories" :key="index">
                  <div
                    v-ripple
                    @click="toggleCategory(index)"
                    class="category-header p-4 flex items-center justify-between cursor-pointer"
                  >
                    <span class="font-medium">{{ category.name }}</span>
                    <i
                      :class="[
                        'pi',
                        category.expanded ? 'pi-chevron-up' : 'pi-chevron-down',
                      ]"
                    ></i>
                  </div>

                  <ul v-show="category.expanded" class="subcategory-list">
                    <li
                      v-for="(subcategory, subIndex) in category.subcategories"
                      :key="subIndex"
                    >
                      <NuxtLink
                        v-ripple
                        @click="toggleSubcategory(index, subIndex)"
                        class="subcategory-item p-3 flex items-center justify-between"
                      >
                        <span>{{ subcategory.name }}</span>
                        <i
                          v-if="subcategory.items"
                          :class="[
                            'pi',
                            subcategory.expanded
                              ? 'pi-chevron-up'
                              : 'pi-chevron-down',
                          ]"
                        ></i>
                      </NuxtLink>

                      <ul
                        v-if="subcategory.items && subcategory.expanded"
                        class="item-list pl-6"
                      >
                        <li
                          v-for="(item, itemIndex) in subcategory.items"
                          :key="itemIndex"
                        >
                          <NuxtLink :to="`/search?search=${item.toLowerCase().replace(/ /g, '-')}`" v-ripple class="menu-item p-2">{{
                            item
                          }}</NuxtLink>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div class="menu-footer p-4">
              <NuxtLink to="/category/52" class="menu-item"
                >Todos los productos</NuxtLink
              >
              <NuxtLink to="/highlights" class="menu-item"
                >Los más destacados</NuxtLink
              >
              <NuxtLink to="/offers" class="menu-item">Ofertas</NuxtLink>
              <NuxtLink to="/about" class="menu-item"
                >Acerca de nosotros</NuxtLink
              >
              <NuxtLink to="/contact" class="menu-item">Contacto</NuxtLink>
              <div class="customer-service mt-4">
                <LinkWhasapp />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Drawer>

    <Button
      class="!bg-transparent !text-black !border-0"
      icon="pi pi-bars"
      @click="visible = true"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import LinkWhasapp from "../LinkWhasapp.vue";

const visible = ref(false);

const categories = reactive([
  {
    name: "Ferretería",
    expanded: false,
    subcategories: [
      {
        name: "Construcción",
        items: [
          "Techos",
          "Pavimentos",
          "Escaleras",
          "Herramientas",
          "Mantos",
          "Tuberías",
          "Tornillos",
        ],
      },
      {
        name: "Electricidad",
        items: [
          "Bombillos",
          "Herramientas",
          "Máquinas",
          "Cables",
          "Energías renovables",
          "Termostatos",
        ],
      },
      {
        name: "Baño y fontanería",
        items: ["Lavamanos", "Pocetas", "Grifería", "Accesorios"],
      },
      {
        name: "Jardín",
        items: ["Maquinas", "Riego", "Piscina", "Muebles"],
      },
      {
        name: "Pintura",
        items: [
          "Esmaltes",
          "Brochas",
          "Adhesivos y pegamentos",
          "Limpieza",
          "Pinturas",
        ],
      },
    ],
  },
  {
    name: "Digital",
    expanded: false,
    subcategories: [
      {
        name: "Computación",
        items: [
          "Accesorios",
          "All in one",
          "Monitores",
          "Laptop",
          "Tablets",
          "Routers y conectividad",
        ],
      },
      {
        name: "Impresoras",
        items: ["Impresoras", "Accesorios de impresoras"],
      },
      {
        name: "Móviles",
        items: ["Celulares", "Accesorios de celulares"],
      },
      {
        name: "Smartwatches",
        items: ["Smartwatches"],
      },
      {
        name: "Fotografía",
        items: ["Cámaras fotográficas", "Accesorios de cámaras"],
      },
      {
        name: "Smart home",
        items: ["Asistente de voz"],
      },
      {
        name: "Videojuegos",
        items: ["Consolas", "Accesorios de consolas", "Controles"],
      },
    ],
  },
]);

const toggleCategory = (index) => {
  categories[index].expanded = !categories[index].expanded;
};

const toggleSubcategory = (categoryIndex, subcategoryIndex) => {
  if (categories[categoryIndex].subcategories[subcategoryIndex].items) {
    categories[categoryIndex].subcategories[subcategoryIndex].expanded =
      !categories[categoryIndex].subcategories[subcategoryIndex].expanded;
  }
};
</script>

<style scoped>
.sidebar-drawer {
  max-width: 90vw;
}

.menu-item {
  @apply flex items-center cursor-pointer p-2 rounded text-black/70 hover:bg-blue-100 duration-150 transition-colors;
}

.category-header {
  @apply bg-gray-50 text-gray-800 font-semibold;
}

.subcategory-item {
  @apply flex items-center cursor-pointer hover:bg-gray-100 text-gray-700;
}

.item-list {
  @apply bg-white border-l-2 border-gray-200;
}

.shipping-banner {
  @apply bg-yellow-100 text-yellow-800 text-center font-medium;
}

.menu-footer {
  @apply border-t mt-4 pt-4;
}
</style>
