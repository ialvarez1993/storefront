<script lang="ts" setup>
import { ref } from "vue";
import "primeicons/primeicons.css";
import type { Category } from "~/graphql";

const props = defineProps({
  title: String,
  keyForComposable: { type: String, default: "" },
});

const filteredCategories = inject<Category[]>("filteredTopCategories");
const menuData = ref(null);
const { $fetchApi } = useNuxtApp();

const fetchMenuData = async () => {
  try {
    const data = await $fetchApi(
      "/api/inicio-menu-categorias-de-busquedas?locale=es-VE",
    );
    return data.data;
  } catch (error) {
    console.error("[SUPERMENU] Error fetching menu data:", error);
    return [];
  }
};

const items = ref([
  {
    label: "",
    icon: "pi pi-building",
    root: true,
    items: [
      [
        {
          items: [
            {
              label: "",
              icon: "pi pi-star",
              subtext: "",
              link1: "",
              link2: "",
              link3: "",
              link4: "",
              link5: "",
              title1: "",
              title2: "",
              title3: "",
              title4: "",
              title5: "",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: "",
              icon: "pi pi-compass",
              subtext: "",
              link1: "",
              link2: "",
              link3: "",
              link4: "",
              link5: "",
              title1: "",
              title2: "",
              title3: "",
              title4: "",
              title5: "",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              label: "",
              icon: "pi pi-users",
              title1: "",
              title2: "",
              title3: "",
              title4: "",
              title5: "",
              link1: "",
              link2: "",
              link3: "",
              link4: "",
              link5: "",
              subtext: "",
            },
          ],
        },
      ],
      [
        {
          items: [
            {
              image: "/images/lavadora.png",
              label: "superMenu.detailsSuperMenuButton",
              subtext: "superMenu.detailsSuperMenu",
            },
          ],
        },
      ],
    ],
  },
]);

onMounted(async () => {
  const menuDataResponse = await fetchMenuData();

  // Actualizar los items del menú con los datos del fetch
  if (menuDataResponse && menuDataResponse.length >= 3) {
    items.value[0].items[0][0].items[0] = {
      ...items.value[0].items[0][0].items[0],
      label: menuDataResponse[0].titleCategory,
      link1: menuDataResponse[0].listaCategorias[0].enlace,
      link2: menuDataResponse[0].listaCategorias[1].enlace,
      link3: menuDataResponse[0].listaCategorias[2].enlace,
      link4: menuDataResponse[0].listaCategorias[3].enlace,
      link5: menuDataResponse[0].listaCategorias[4].enlace,
      title1: menuDataResponse[0].listaCategorias[0].nombre,
      title2: menuDataResponse[0].listaCategorias[1].nombre,
      title3: menuDataResponse[0].listaCategorias[2].nombre,
      title4: menuDataResponse[0].listaCategorias[3].nombre,
      title5: menuDataResponse[0].listaCategorias[4].nombre,
    };

    items.value[0].items[1][0].items[0] = {
      ...items.value[0].items[1][0].items[0],
      label: menuDataResponse[1].titleCategory,
      link1: menuDataResponse[1].listaCategorias[0].enlace,
      link2: menuDataResponse[1].listaCategorias[1].enlace,
      link3: menuDataResponse[1].listaCategorias[2].enlace,
      link4: menuDataResponse[1].listaCategorias[3].enlace,
      link5: menuDataResponse[1].listaCategorias[4].enlace,
      title1: menuDataResponse[1].listaCategorias[0].nombre,
      title2: menuDataResponse[1].listaCategorias[1].nombre,
      title3: menuDataResponse[1].listaCategorias[2].nombre,
      title4: menuDataResponse[1].listaCategorias[3].nombre,
      title5: menuDataResponse[1].listaCategorias[4].nombre,
    };

    items.value[0].items[2][0].items[0] = {
      ...items.value[0].items[2][0].items[0],
      label: menuDataResponse[2].titleCategory,
      link1: menuDataResponse[2].listaCategorias[0].enlace,
      link2: menuDataResponse[2].listaCategorias[1].enlace,
      link3: menuDataResponse[2].listaCategorias[2].enlace,
      link4: menuDataResponse[2].listaCategorias[3].enlace,
      link5: menuDataResponse[2].listaCategorias[4].enlace,
      title1: menuDataResponse[2].listaCategorias[0].nombre,
      title2: menuDataResponse[2].listaCategorias[1].nombre,
      title3: menuDataResponse[2].listaCategorias[2].nombre,
      title4: menuDataResponse[2].listaCategorias[3].nombre,
      title5: menuDataResponse[2].listaCategorias[4].nombre,
    };
  }
});
</script>

<template>
  <div class="mega-menu-wrapper">
    <MegaMenu
      :model="items"
      class="!border-none !text-black !border-transparent !static"
    >
      <template #item="{ item }">
        <!-- Root Menu Items -->
        <a
          v-if="item.root"
          class="root-item group/hovero flex items-center cursor-pointer px-6 py-[0.5rem] overflow-hidden relative"
        >
          <i
            v-if="item.icon"
            :class="[
              item.icon,
              'mr-2 !text-black group-hover/hovero:!text-[#FFC107] text-xl ',
            ]"
          ></i>
          <span
            class="font-medium !text-black group-hover/hovero:!text-[#FFC107] hover:text-teal-50"
          >
            {{ props.title }}
          </span>
          <i
            class="pi !text-black pi-chevron-down ml-2 group-hover/hovero:!text-[#FFC107] text-sm"
          ></i>
        </a>

        <!-- Regular Menu Items -->
        <a
          v-else-if="!item.image"
          class="menu-item !bg-black/5 flex items-center p-4 cursor-pointer mb-2 gap-3 transition-all duration-200"
        >
          <span
            class="icon-wrapper inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary w-12 h-12 transition-all duration-200"
          >
            <i :class="[item.icon, 'text-xl']"></i>
          </span>
          <span class="inline-flex flex-col gap-1">
            <NuxtLink
              to="/"
              class="font-bold text-lg text-black hover:text-yellow-500 hover:text-primary transition-colors duration-200"
            >
              {{ $t(item.label) }}
            </NuxtLink>
            <!-- Lista de Links -->
            <ul>
              <NuxtLink :to="item.link1">
                <li
                  v-if="item.title1"
                  class="text-gray-600 py-1 hover:text-yellow-500 text-sm"
                >
                  {{ $t(item.title1) }}
                </li>
              </NuxtLink>
              <NuxtLink :to="item.link2">
                <li
                  :to="item.link2"
                  v-if="item.title2"
                  class="text-gray-600 py-1 hover:text-yellow-500 text-sm"
                >
                  {{ $t(item.title2) }}
                </li>
              </NuxtLink>
              <NuxtLink :to="item.link3">
                <li
                  :to="item.link3"
                  v-if="item.title3"
                  class="text-gray-600 py-1 text-sm hover:text-yellow-500"
                >
                  {{ $t(item.title3) }}
                </li>
              </NuxtLink>
              <NuxtLink :to="item.link4">
                <li
                  :to="item.link4"
                  v-if="item.title4"
                  class="text-gray-600 py-1 text-sm hover:text-yellow-500"
                >
                  {{ $t(item.title4) }}
                </li>
              </NuxtLink>

              <NuxtLink class="py-14" :to="item.link5">
                <li
                  :to="item.link5"
                  v-if="item.title5"
                  class="text-gray-600 py-1 text-sm hover:text-yellow-500"
                >
                  {{ $t(item.title5) }}
                </li>
              </NuxtLink>
            </ul>
          </span>
        </a>

        <!-- Image Items -->
        <div
          v-else
          class="promo-item flex flex-col items-start gap-4 p-4 rounded-xl bg-gray-50"
        >
          <div class="relative w-full overflow-hidden rounded-lg">
            <NuxtImg
              :src="item.image"
              class="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span class="text-gray-700">{{ $t(item.subtext) }}</span>
          <Button
            :label="$t(item.label)"
            class="custom-button w-full justify-center"
            severity="primary"
            raised
          >
            <template #icon>
              <i class="pi pi-arrow-right ml-2"></i>
            </template>
          </Button>
        </div>
      </template>
    </MegaMenu>
  </div>
</template>

<style scoped>
.mega-menu-wrapper {
  --primary-color: #ffc107;
  --primary-light: #ffc107;
}

.custom-megamenu {
  box-shadow:
    0 4px 6px -1px rgb(0 0 0 / 0.1),
    0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.root-item {
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.root-item:hover {
  background-color: #f3f4f6;
  color: #000000;
}

.menu-item:hover {
  background-color: #d7d9db;
  transform: translateX(4px);
  border-radius: 1rem;
}

.menu-item:hover .icon-wrapper {
  background-color: var(--primary-color);
  color: white;
}

.custom-button {
  border: none;
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--primary-light)
  );
  transition: all 0.3s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
}

.promo-item {
  transition: all 0.3s ease;
}

.promo-item:hover {
  transform: translateY(-4px);
}
</style>
