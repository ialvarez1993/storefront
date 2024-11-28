<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
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
import SupermenusDigital from "./header/SupermenusDigial.vue";
import SideBar from "./ui/SideBar.vue";
import TreeViewItem from "./header/TreeViewItem.vue";

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
      <span class="items-center font-robotolight sm:inline whitespace-nowrap">
        {{ $t("HeaderUp.Shipping") }}
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
            <VsfLogo />
          </NuxtLink>
          <!-- Icon Menu Resposive - Esta en modo default -->
          <div v-if="!isCompact" class="grid grid-cols-2 lg:hidden">
            <SideBar />
            <ModalFavorites />
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
          <ModalFavorites />
        </div>

        <!-- Right section -->
        <div class="flex items-center gap-6">
          <!-- WhatsApp -->
          <NuxtLink
            external
            to="https://api.whatsapp.com/send?phone=584244062826&text=Hola%2C%20tu%20punto%20est%C3%A1%20cerca%20de%20ti%20%F0%9F%91%8D"
            class="hidden lg:flex items-center gap-2"
            target="_blank"
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
              <span class="text-xs !font-robotolight text-muted-foreground">
                {{ $t("sopport.write") }}
              </span>
            </div>
          </NuxtLink>

          <!-- User account -->
          <NuxtLink
            to="/login"
            class="hidden font-Gotham lg:flex items-center gap-2"
          >
            <UserIcon class="h-5 w-5" />
            <span v-if="!isCompact" class="text-sm">{{ $t("cuenta") }}</span>
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
          <Supermenus />
          <SupermenusDigital />
          <li
            v-for="item in [
              {
                name: 'headerCatalog.allProducts',
                url: '/category/52',
              },
              { name: 'headerCatalog.Highlights', url: '/Highlights' },
              { name: 'headerCatalog.Offers', url: '/Offers' },
              { name: 'headerCatalog.About', url: '/about' },
              { name: 'headerCatalog.Contact', url: '/contact' },
            ]"
            :key="item.name"
          >
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
@media (width <= 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

@media (width >= 768px) {
  .container {
    max-width: 768px;
  }
}

@media (width >= 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (width >= 1280px) {
  .container {
    max-width: 1280px;
  }
}
</style>
