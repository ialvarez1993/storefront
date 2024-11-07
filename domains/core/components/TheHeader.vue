<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
  MagnifyingGlassIcon,
  HeadphonesIcon,
  UserIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowUpIcon
} from '@heroicons/vue/24/outline'

const isCompact = ref(false)
const isMenuOpen = ref(false)
const activeDropdown = ref(null)
const currency = ref('VES')

const categories = {
  ferreteria: [
    { name: 'Construcción', href: '#construccion' },
    { name: 'Electricidad', href: '#electricidad' },
    { name: 'Jardín', href: '#jardin' },
    { name: 'Baño y fontanería', href: '#bano-fontaneria' },
  ],
  digital: [
    { name: 'Computación', href: '#computacion' },
    { name: 'Impresoras', href: '#impresoras' },
    { name: 'Móviles', href: '#moviles' },
    { name: 'Smartwatches', href: '#smartwatches' },
    { name: 'Fotografía', href: '#fotografia' },
    { name: 'Smart home', href: '#smart-home' },
    { name: 'Videojuegos', href: '#videojuegos' },
  ],
}

const handleScroll = () => {
  isCompact.value = window.scrollY > 50
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  activeDropdown.value = null
}

const handleDropdownToggle = (dropdown) => {
  activeDropdown.value = activeDropdown.value === dropdown ? null : dropdown
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="[
    'w-full fixed top-0 left-0 z-50 bg-white transition-all duration-300',
    { 'shadow-md': isCompact }
  ]">
    <div v-if="!isCompact" class="bg-black text-white px-4 py-2 flex justify-between items-center text-sm">
      <span class="hidden sm:inline">Envíos gratis a todo Venezuela</span>
      <div class="relative">
        <button @click="currency = currency === 'VES' ? 'USD' : 'VES'"
                class="text-white text-sm p-0 hover:bg-transparent flex items-center">
          {{ currency === 'VES' ? 'Bolívares (VES)' : 'Dólares (USD)' }}
          <ChevronDownIcon class="ml-1 h-4 w-4" />
        </button>
      </div>
    </div>

    <div :class="['container mx-auto px-4 transition-all duration-300', isCompact ? 'py-2' : 'py-4']">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button v-if="isCompact"
                  class="p-2 hover:bg-gray-100"
                  @click="toggleMenu">
            <component :is="isMenuOpen ? XMarkIcon : Bars3Icon" class="h-6 w-6" />
          </button>
          <NuxtLink to="/" class="flex-shrink-0">
            <VsfLogo />
          </NuxtLink>
        </div>

        <div :class="['flex-1 max-w-2xl transition-all duration-300', isCompact ? 'px-4' : '']">
          <div class="relative">
            <input type="search"
                   placeholder="Busca dentro de la tienda productos y marcas"
                   :class="[
                     'w-full pl-4 pr-12 transition-all duration-300 rounded-md border-2 border-gray-200 focus:border-[#FFC107]',
                     isCompact ? 'h-10' : 'h-11'
                   ]" />
            <button :class="[
                      'absolute right-0 top-0 transition-all duration-300 px-4 bg-[#FFC107] hover:bg-[#FFA000] text-black',
                      isCompact ? 'h-10' : 'h-11'
                    ]">
              <MagnifyingGlassIcon class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <NuxtLink to="/atencion" class="hidden md:flex items-center gap-2">
            <HeadphonesIcon class="h-5 w-5" />
            <div v-if="!isCompact" class="flex flex-col">
              <span class="font-semibold text-sm">Atención al cliente</span>
              <span class="text-xs text-muted-foreground">Escríbenos / Llámanos</span>
            </div>
          </NuxtLink>

          <NuxtLink to="/cuenta" class="hidden md:flex items-center gap-2">
            <UserIcon class="h-5 w-5" />
            <span v-if="!isCompact" class="text-sm">Mi cuenta</span>
          </NuxtLink>

          <NuxtLink to="/carrito" class="relative">
            <ShoppingCartIcon class="h-6 w-6" />
            <span class="absolute -top-2 -right-2 bg-[#FFC107] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </NuxtLink>

          <button v-if="isCompact"
                  class="p-2 hover:bg-gray-100"
                  @click="scrollToTop">
            <ArrowUpIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <nav v-if="!isCompact" class="border-t border-b">
      <div class="container mx-auto px-4">
        <ul class="flex items-center gap-8">
          <li v-for="(items, key) in categories"
              :key="key"
              class="relative group">
            <button class="h-12 px-3 text-base hover:bg-transparent hover:text-[#FFC107] group flex items-center">
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}
              <ChevronDownIcon class="ml-1 h-4 w-4" />
            </button>
            <div class="absolute top-full left-0 w-64 bg-white shadow-lg rounded-b-md py-2 z-50 hidden group-hover:block">
              <NuxtLink v-for="item in items"
                        :key="item.name"
                        :to="item.href"
                        class="block px-4 py-2 hover:bg-gray-100">
                {{ item.name }}
              </NuxtLink>
            </div>
          </li>
          <li v-for="item in ['Todos los productos', 'Los más destacados', 'Ofertas']"
              :key="item">
            <button class="h-12 px-3 text-base hover:bg-transparent hover:text-[#FFC107]">
              {{ item }}
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <div v-if="isMenuOpen && isCompact"
         class="absolute top-full left-0 w-full bg-white shadow-lg">
      <div class="container mx-auto py-4">
        <ul class="space-y-2">
          <li v-for="(items, key) in categories" :key="key">
            <button class="w-full text-left px-4 py-2 flex items-center justify-between"
                    @click="handleDropdownToggle(key)">
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}
              <ChevronDownIcon :class="[
                'h-4 w-4 transition-transform',
                { 'rotate-180': activeDropdown === key }
              ]" />
            </button>
            <ul v-if="activeDropdown === key" class="pl-8 space-y-2 mt-2">
              <li v-for="item in items" :key="item.name">
                <NuxtLink :to="item.href" class="block px-4 py-2 hover:bg-gray-100">
                  {{ item.name }}
                </NuxtLink>
              </li>
            </ul>
          </li>
          <li v-for="item in ['Todos los productos', 'Los más destacados', 'Ofertas']"
              :key="item">
            <NuxtLink to="#" class="block px-4 py-2 hover:bg-gray-100">
              {{ item }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
