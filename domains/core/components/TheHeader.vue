<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

import type { Feature } from "@/types/content-header";
const runtimeConfig = useRuntimeConfig();

import {
  MagnifyingGlassIcon,
  UserIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowUpIcon,
} from "@heroicons/vue/24/outline";
import ButtonIdiomas from "./header/ButtonIdiomas.vue";
import DivisasButton from "./header/DivisasButton.vue";
import Supermenus from "./header/Supermenus.vue";
import Supermenus2 from "./header/Supermenus2.vue";
import SupermenusDigital from "./header/SupermenusDigial.vue";
import SideBar from "./ui/SideBar.vue";
import TreeViewItem from "./header/TreeViewItem.vue";
import ButtonWishlist from "./header/ButtonWishlist.vue";

const { loadCategoryList, categories: categoriesData } = useCategory();
const { loadWishlist } = useWishlist();

provide(
  "filteredTopCategories",
  categoriesData.value?.filter(
    (category) => category.name === "WOMEN" || category.name === "MEN",
  ),
);

const { loadCart, totalItemsInCart } = useCart();

onMounted(async () => {
  await loadCart(true);
});

const isCompact = ref(false);
const isMenuOpen = ref(false);
const activeDropdown = ref(null);
const currency = ref("VES");

const menuItems = computed(() => {
  const categories = menuContent.value?.data?.data?.categories || [];
  return [
    {
      name: categories[2] || "",
      url: "/category/52",
    },
    { name: categories[3] || "", url: "/Highlights" },
    { name: categories[4] || "", url: "/Offers" },
    {
      name: menuContent.value?.data?.data?.information?.aboutUs || "",
      url: "/about",
    },
    {
      name: menuContent.value?.data?.data?.information?.contact || "",
      url: "/contact",
    },
  ];
});

const baseUrl = runtimeConfig.public.apiUrlStrapi.endsWith("/")
  ? runtimeConfig.public.apiUrlStrapi.slice(0, -1)
  : runtimeConfig.public.apiUrlStrapi;

const categories = {
  ferreteria: [
    { name: "sopport.write", href: "/category/15" },
    { name: "Electricidad", href: "/category/15" },
    { name: "JardÃ­n", href: "/category/15" },
    { name: "BaÃ±o y fontanerÃ­a", href: "/category/15" },
  ],
  digital: [
    { name: "ComputaciÃ³n", href: "/category/15" },
    { name: "Impresoras", href: "/category/15" },
    { name: "MÃ³viles", href: "/category/15" },
    { name: "Smartwatches", href: "/category/15" },
    { name: "FotografÃ­a", href: "/category/15" },
    { name: "Smart home", href: "/category/15" },
    { name: "Videojuegos", href: "/category/15" },
  ],
};

const handleScroll = () => {
  isCompact.value = window.scrollY > 50;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  activeDropdown.value = null;
};

const handleDropdownToggle = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
import { useI18n } from "vue-i18n";
const { locale, setLocale } = useI18n();
const currentLang = locale.value; // 'es' o 'en'
const { $fetchApi } = useNuxtApp();
const menuContent = ref<Feature | null>(null);

const fetchDataMenuContent = async (): Promise<any> => {
  try {
    const API_URL = `/api/cabecera-texto-y-link?populate=logocabecera&locale=${currentLang === "es" ? "es-VE" : "en"}`;
    const data = await $fetchApi(API_URL);
    menuContent.value = data as Feature;
    return data;
  } catch (error) {
    throw error;
  }
};

onMounted(() => {
  fetchDataMenuContent();
});
</script>

<template>
  <header
    :class="[
      'w-full fixed top-0 left-0 z-50 bg-white transition-all duration-300',
      { 'shadow-md': isCompact },
    ]"
  >
    <!-- Top banner -->
    <div
      v-if="!isCompact"
      class="bg-black text-white px-4 py-2 flex items-center justify-between text-sm w-full"
    >
      <span
        class="hidden lg:block items-center font-robotolight sm:inline whitespace-nowrap"
      >
        {{ menuContent?.data?.data?.title }}
      </span>
      <div class="flex items-center justify-end gap-8 w-full">
        <div class="flex items-center justify-end w-full my-auto">
          <ButtonIdiomas />
          <DivisasButton class="ml-4" />
        </div>
      </div>
    </div>

    <!-- Main header -->
    <div
      :class="[
        'container mx-auto px-4 transition-all duration-300',
        isCompact ? 'py-2' : 'py-4',
      ]"
    >
      <div class="flex items-center justify-between gap-4">
        <!-- Left section - Esta en modo mobile -->
        <div class="flex items-center gap-4">
          <div v-if="isCompact">
            <SideBar />
          </div>
          <NuxtLink to="/" class="flex-shrink-0">
            <img
              width="205"
              height="50"
              :src="`${baseUrl}${menuContent?.data?.logocabecera?.url}`"
            />
          </NuxtLink>
          <!-- Icon Menu Resposive - Esta en modo default -->
          <div v-if="!isCompact" class="grid grid-cols-2 lg:hidden">
            <SideBar />
            <ButtonWishlist />
          </div>
        </div>

        <!-- Search bar -->
        <div
          :class="[
            'flex-1 max-w-2xl transition-all duration-300',
            isCompact ? 'px-4' : '',
            'hidden md:block',
          ]"
        >
          <SearchInput />
        </div>

        <!-- Favorites -->
        <div v-if="!isCompact" class="hidden lg:block">
          <ButtonWishlist />
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-6">
          <!-- WhatsApp -->
          <LinkWhasapp />
          <!-- User account -->
          <NuxtLink
            to="/login"
            class="hidden font-Gotham lg:flex items-center gap-2"
          >
            <UserIcon class="h-5 w-5" />
            <span v-if="!isCompact" class="text-sm">
              {{ menuContent?.data?.data?.user?.myAccount }}</span
            >
          </NuxtLink>

          <!-- Shopping cart -->
          <NuxtLink to="/cart" class="relative">
            <ShoppingCartIcon class="h-6 w-6" />
            <span
              class="absolute -top-2 -right-2 bg-[#FFC107] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ totalItemsInCart }}
            </span>
          </NuxtLink>

          <!-- Scroll to top -->
          <button
            v-if="isCompact"
            class="p-2 hover:bg-gray-100"
            @click="scrollToTop"
          >
            <ArrowUpIcon class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Mobile search -->
      <div class="mt-4 md:hidden">
        <SearchInput />
      </div>
    </div>

    <!-- Navigation -->
    <nav v-if="!isCompact" class="border-t border-b hidden lg:block">
      <div class="container mx-auto px-4">
        <ul class="flex items-center gap-8">
          <Supermenus :title="menuContent?.data?.data?.categories[0]" />
          <Supermenus2 :title="menuContent?.data?.data?.categories[1]" />
          <li v-for="item in menuItems" :key="item.name">
            <NuxtLink
              :to="item.url"
              class="h-12 px-3 rounded-lg text-base py-3 hover:bg-gray-200/50 hover:text-[#FFC107]"
            >
              {{ $t(item.name) }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Mobile menu -->
    <div
      v-if="isMenuOpen && isCompact"
      class="absolute top-full left-0 w-full bg-white shadow-lg lg:hidden"
    >
      <div class="container mx-auto py-4">
        <ul class="space-y-2">
          <li v-for="(items, key) in categories" :key="key">
            <button
              class="w-full text-left px-4 py-2 flex items-center justify-between"
              @click="handleDropdownToggle(key)"
            >
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}
              <ChevronDownIcon
                :class="[
                  'h-4 w-4 transition-transform',
                  { 'rotate-180': activeDropdown === key },
                ]"
              />
            </button>
            <ul v-if="activeDropdown === key" class="pl-8 space-y-2 mt-2">
              <li v-for="item in items" :key="item.name">
                <NuxtLink
                  :to="item.href"
                  class="block px-4 py-2 hover:bg-gray-100"
                >
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li
            v-for="item in [
              'Todos los productos',
              'Los mÃ¡s destacados',
              'Ofertas',
            ]"
            :key="item"
          >
            <NuxtLink
              to="/category/15"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              {{ item }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
@media (width <=640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (width >=768px) {
  .container {
    max-width: 768px;
  }
}

@media (width >=1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (width >=1280px) {
  .container {
    max-width: 1280px;
  }
}
</style>
