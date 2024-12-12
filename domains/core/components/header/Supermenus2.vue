<script lang="ts" setup>
import { ref } from "vue";
import "primeicons/primeicons.css";
import type { Category } from "~/graphql";

const filteredCategories = inject<Category[]>("filteredTopCategories");

const menuData = ref(null);
const { $fetchApi } = useNuxtApp();
import { useI18n } from "vue-i18n";

const props = defineProps({
  title: String,
  titlelink: String,
  keyForComposable: { type: String, default: "" },
});

// Función para obtener los datos
const fetchMenuData = async () => {
  try {
    const { locale } = useI18n();
    const currentLang = locale.value;
    const data = await $fetchApi(
      `/api/cabecera-menu-interior-categorias-dos?locale=${currentLang === "es" ? "es-VE" : "en"}`,
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
    icon: "pi pi-desktop",
    root: true,
    items: [
      [
        {
          items: [
            {
              label: "",
              labelLink: "",
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
              labelLink: "",
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
              labelLink: "",
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
      labelLink: menuDataResponse[0].titleLink,
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
      labelLink: menuDataResponse[0].titleLink,
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
      labelLink: menuDataResponse[0].titleLink,
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

<style scoped>
.mega-menu-wrapper {
  --primary-color: #ffc107;
  --primary-light: #ffd54f;
  --animation-timing: 300ms;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.5s ease-out;
}

.root-item {
  border-radius: 0.5rem;
  transition: all var(--animation-timing) cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.root-item::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle,
    var(--primary-light) 0%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity var(--animation-timing);
}

.root-item:hover::after {
  opacity: 0.1;
}

.menu-item {
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    var(--primary-color/0.1),
    transparent
  );
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.menu-item:hover::before {
  transform: translateX(100%);
}

.menu-item:hover {
  background-color: #f8f9fa;
  transform: translateX(4px);
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  transition: all var(--animation-timing);
  box-shadow: 0 0 0 rgba(255, 193, 7, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0);
  }
}

.link-item {
  display: flex;
  align-items: center;
  position: relative;
}

.link-dot {
  width: 4px;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 50%;
  opacity: 0;
  transform: scale(0);
  transition: all var(--animation-timing);
  margin-right: 8px;
}

.link-item:hover .link-dot {
  opacity: 1;
  transform: scale(1);
}

.custom-button {
  border: none;
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--primary-light)
  );
  transition: all var(--animation-timing);
  position: relative;
  overflow: hidden;
}

.custom-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: all 0.6s;
}

.custom-button:hover::before {
  left: 100%;
}

.custom-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
}

.promo-item {
  transition: all var(--animation-timing);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.promo-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>

<template>
  <div class="mega-menu-wrapper">
    <MegaMenu
      :model="items"
      class="!border-none !text-black !border-transparent !static animate-fadeIn"
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
              'mr-2 !text-black group-hover/hovero:!text-[#FFC107] text-xl transition-transform duration-300 group-hover/hovero:scale-110',
            ]"
          ></i>
          <span
            class="font-medium !text-black group-hover/hovero:!text-[#FFC107] relative overflow-hidden before:absolute before:left-0 before:bottom-0 before:w-full before:h-[2px] before:bg-[#FFC107] before:transform before:scale-x-0 before:origin-right before:transition-transform before:duration-300 group-hover/hovero:before:scale-x-100 before:origin-left"
          >
            {{ props.title }}
          </span>
          <i
            class="pi !text-black pi-chevron-down ml-2 group-hover/hovero:!text-[#FFC107] text-sm transition-transform duration-300 group-hover/hovero:rotate-180"
          ></i>
        </a>

        <!-- Regular Menu Items -->
        <a
          v-else-if="!item.image"
          class="menu-item !bg-black/5 flex items-center p-4 cursor-pointer mb-2 gap-3 transition-all duration-300 hover:shadow-lg"
        >
          <span
            class="icon-wrapper inline-flex items-center justify-center rounded-xl bg-primary/10 text-primary w-12 h-12 transition-all duration-300 group-hover:rotate-12"
          >
            <i
              :class="[
                item.icon,
                'text-xl transition-transform duration-300 hover:scale-125',
              ]"
            ></i>
          </span>
          <span class="inline-flex flex-col gap-1">
            <NuxtLink
              :to="item.labelLink"
              class="font-bold text-lg text-black hover:text-yellow-500 transition-all duration-300 relative group"
            >
              <span class="relative z-10">{{ $t(item.label) }} </span>
              <span
                class="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
              ></span>
            </NuxtLink>
            <!-- Lista de Links -->
            <ul class="links-container">
              <NuxtLink v-for="i in 5" :key="i" :to="item[`link${i}`]">
                <li
                  v-if="item[`title${i}`]"
                  class="link-item text-gray-600 py-1 hover:text-yellow-500 text-sm transform transition-all duration-300 hover:translate-x-2 flex items-center space-x-2"
                >
                  <span class="link-dot"></span>
                  <span>{{ $t(item[`title${i}`]) }}</span>
                </li>
              </NuxtLink>
            </ul>
          </span>
        </a>

        <!-- Image Items -->
        <div
          v-else
          class="promo-item flex flex-col items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-white"
        >
          <div class="relative w-full overflow-hidden rounded-lg group">
            <NuxtImg
              :src="item.image"
              class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            ></div>
          </div>
          <span class="text-gray-700 animate-slideUp">{{
            $t(item.subtext)
          }}</span>
          <Button
            :label="$t(item.label)"
            class="custom-button w-full justify-center group"
            severity="primary"
            raised
          >
            <template #icon>
              <i
                class="pi pi-arrow-right ml-2 transition-transform duration-300 group-hover:translate-x-2"
              ></i>
            </template>
          </Button>
        </div>
      </template>
    </MegaMenu>
  </div>
</template>
