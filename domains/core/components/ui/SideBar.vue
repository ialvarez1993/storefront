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
            <!-- Usuario y cuenta -->
            <div class="p-4">
              <div class="flex flex-col gap-2">
                <a href="/login" class="menu-item">Mi cuenta</a>
                <a href="#" class="menu-item">Cerrar</a>
              </div>
            </div>

            <!-- Menú principal -->
            <div class="menu-section">
              <div class="shipping-banner p-4">
                Envíos gratis a todo Venezuela
              </div>

              <!-- Categorías principales -->
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
                      <a
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
                      </a>

                      <ul
                        v-if="subcategory.items && subcategory.expanded"
                        class="item-list pl-6"
                      >
                        <li
                          v-for="(item, itemIndex) in subcategory.items"
                          :key="itemIndex"
                        >
                          <a v-ripple class="menu-item p-2">
                            {{ item }}
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <!-- Footer links -->
            <div class="menu-footer p-4">
              <a href="/category/52" class="menu-item">Todos los productos</a>
              <a href="/highlights" class="menu-item">Los más destacados</a>
              <a href="/offers" class="menu-item">Ofertas</a>
              <a href="/about" class="menu-item">Acerca de nosotros</a>
              <a href="/contact" class="menu-item">Contacto</a>
              <div class="customer-service mt-4">
                <NuxtLink
                  external
                  target="_blank"
                  to="https://api.whatsapp.com/send?phone=584244062826&text=Hola%2C%20tu%20punto%20est%C3%A1%20cerca%20de%20ti%20%F0%9F%91%8D"
                  class="hidden lg:flex items-center gap-2"
                >
                  <svg
                    version="1.0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="43px"
                    height="50px"
                    viewBox="0 0 43 50"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <g fill="#000000">
                      <path
                        d="M21.30 39.40 c-0.45 -0.60 -0.80 -1.80 -0.80 -2.70 l0 -1.55 -2.75 0.25 -2.75 0.20 0 -2.05 0 -2.05 -2.90 0 c-4.10 0 -4.60 -0.65 -4.60 -5.90 0 -3.75 0.10 -4.10 1.30 -5.05 0.75 -0.60 1.80 -1.05 2.40 -1.05 0.65 -0.05 1.55 -0.80 2.40 -2 0.75 -1.05 2.40 -2.55 3.75 -3.35 2.20 -1.25 2.85 -1.40 7.15 -1.40 4.15 0 5.05 0.15 7 1.25 1.20 0.70 2.90 2.20 3.75 3.35 1 1.35 1.90 2.10 2.65 2.10 0.65 0.05 1.70 0.60 2.35 1.30 1.10 1.05 1.25 1.65 1.25 4.85 0 4.30 -0.80 5.90 -2.95 5.90 -1 0 -1.70 0.40 -2.35 1.40 -1.40 2.10 -3.75 4.15 -6 5.15 -1.15 0.55 -2.35 1.30 -2.70 1.70 -0.40 0.50 -1.50 0.75 -3.05 0.75 -1.90 0 -2.55 -0.20 -3.15 -1.10z m5.20 -9.90 l1.25 -1 -3.60 0 c-2.10 0 -3.65 0.20 -3.65 0.50 0 0.30 0.55 0.50 1.20 0.50 0.70 0 1.40 0.25 1.55 0.50 0.50 0.80 1.90 0.55 3.25 -0.50z m0.40 -7.35 c-1.10 -1.05 -3.70 -1.05 -4.80 0 -0.75 0.80 -0.60 0.85 2.40 0.85 3 0 3.15 -0.05 2.40 -0.85z"
                      />
                    </g>
                    <g fill="#ffffff">
                      <path
                        d="M0 25 l0 -25 21.50 0 21.50 0 0 25 0 25 -21.50 0 -21.50 0 0 -25z m26 13.25 c0.35 -0.40 1.55 -1.15 2.70 -1.70 2.25 -1 4.60 -3.05 6 -5.15 0.65 -1 1.35 -1.40 2.35 -1.40 4.10 0 3.90 -8.60 -0.20 -8.75 -0.90 -0.05 -1.80 -0.75 -2.95 -2.30 -5 -6.50 -14.30 -6.35 -19.05 0.35 -1.05 1.50 -1.80 2.10 -2.35 1.95 -0.45 -0.15 -1.45 0.20 -2.15 0.80 -1.15 0.85 -1.35 1.40 -1.35 3.55 0 3.30 0.95 4.40 3.70 4.40 l2.10 0 0 -3.85 c0 -3.20 0.20 -4.25 1.15 -5.80 3.70 -6 13.40 -6 17.10 0 1.70 2.80 1.70 8.20 -0.05 10.65 -1.65 2.40 -2.80 3.35 -4.80 4 -1.35 0.45 -1.90 0.45 -2.45 0 -0.95 -0.75 -3.05 -0.25 -3.45 0.80 -0.45 1.10 1 3.20 2.15 3.20 0.50 0 1.20 -0.35 1.55 -0.75z m-6.10 -5.10 c0.65 -0.15 2 0 3 0.30 1.60 0.55 2.15 0.50 4.10 -0.35 2.90 -1.25 4.45 -3 5.05 -5.60 1.15 -5.15 -2.30 -9.50 -7.50 -9.50 -2.80 0 -4.90 1 -6.60 3.20 -1.10 1.40 -1.20 2.70 -0.85 8.45 0.05 0.60 -0.10 1.85 -0.30 2.80 -0.40 1.60 -0.35 1.70 0.75 1.35 0.65 -0.20 1.75 -0.50 2.35 -0.65z"
                      />
                      <path
                        d="M24 36.75 c0 -0.80 0.80 -1 1.20 -0.30 0.15 0.25 -0.05 0.55 -0.45 0.75 -0.45 0.15 -0.75 0 -0.75 -0.45z"
                      />
                      <path
                        d="M10.70 27.80 c-0.15 -0.40 -0.20 -1.55 -0.10 -2.60 0.10 -1.60 0.35 -2 1.30 -2.10 1.05 -0.15 1.10 0 1.10 2.60 0 2.50 -0.10 2.80 -1 2.80 -0.55 0 -1.15 -0.30 -1.30 -0.70z"
                      />
                      <path
                        d="M36 25.75 c0 -2.65 0.05 -2.80 1.15 -2.65 0.95 0.15 1.10 0.45 1.10 2.65 0 2.20 -0.15 2.50 -1.10 2.65 -1.10 0.15 -1.15 0 -1.15 -2.65z"
                      />
                      <path
                        d="M18.65 30.15 c0 -1.05 -0.20 -2.50 -0.40 -3.25 -0.80 -2.90 1.35 -6.25 4.60 -7.35 1.70 -0.55 2.20 -0.55 3.90 0.30 4.95 2.30 5.60 8.05 1.30 11.10 -1.60 1.15 -5.45 1.45 -6.40 0.50 -0.40 -0.40 -0.85 -0.40 -1.55 0 -1.40 0.75 -1.40 0.80 -1.45 -1.30z m3.25 -4.30 c0.20 -1.10 -1.35 -1.75 -1.90 -0.80 -0.50 0.75 0.35 2.10 1.20 1.80 0.30 -0.10 0.60 -0.55 0.70 -1z m3.45 0.35 c0.40 -1.05 -0.65 -2.10 -1.40 -1.35 -0.65 0.65 -0.25 2.15 0.55 2.15 0.30 0 0.65 -0.35 0.85 -0.80z m3.60 0.10 c0.45 -0.50 0.40 -0.80 -0.20 -1.30 -0.95 -0.80 -2.05 0.05 -1.60 1.20 0.40 1 1.05 1 1.80 0.10z"
                      />
                    </g>
                  </svg>
                  <div v-if="!isCompact" class="flex flex-col">
                    <span class="font-semibold text-sm">{{
                      $t("sopport.attention")
                    }}</span>
                    <span
                      class="text-xs !font-robotolight text-muted-foreground"
                    >
                      {{ $t("sopport.write") }}
                    </span>
                  </div>
                </NuxtLink>
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
      { name: "Jardín", items: ["Maquinas", "Riego", "Piscina", "Muebles"] },
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
      { name: "Impresoras", items: ["Impresoras", "Accesorios de impresoras"] },
      { name: "Móviles", items: ["Celulares", "Accesorios de celulares"] },
      { name: "Smartwatches", items: ["Smartwatches"] },
      {
        name: "Fotografía",
        items: ["Cámaras fotográficas", "Accesorios de cámaras"],
      },
      { name: "Smart home", items: ["Asistente de voz"] },
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
  @apply flex items-center cursor-pointer p-2 rounded text-black/70 hover:bg-blue-100
           duration-150 transition-colors;
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
