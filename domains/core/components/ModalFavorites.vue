<template>
  <div>
    <button
      aria-label="Open Favorites"
      class="rounded-full p-2 hover:bg-gray-100"
      @click="isOpen = true"
    >
      <Heart class="h-6 w-6" />
    </button>

    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      >
        <div
          class="bg-white sm:max-w-[900px] max-h-[80vh] w-full rounded-lg shadow-lg overflow-y-auto p-6"
        >
          <header class="mb-4">
            <h2 class="text-2xl font-bold">Your Favorite Items</h2>
          </header>
          <button
            class="absolute top-4 right-4 text-white bg-black p-4 rounded-full hover:text-yellow-300"
            @click="isOpen = false"
          >
            ✕
          </button>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in mockFavorites"
              :key="item.id"
              class="bg-card text-card-foreground rounded-lg shadow-md p-4"
            >
              <NuxtImg
                :src="item.image"
                :alt="item.name"
                class="w-full h-32 object-cover rounded-md mb-2"
              />
              <h3 class="font-semibold text-lg mb-1">{{ item.name }}</h3>
              <p class="text-sm text-muted-foreground mb-2">
                {{ item.description }}
              </p>
              <p class="font-bold">{{ item.price }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Heart } from "lucide-vue-next";

// Tipo para los items de favoritos
type FavoriteItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
};

// Datos mock para los items favoritos
const mockFavorites: FavoriteItem[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality sound with noise cancellation",
    price: "$199.99",
    image: "/images/display-1.png",
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Track your fitness and stay connected",
    price: "$249.99",
    image: "/images/display-2.png",
  },
  {
    id: "3",
    name: "Portable Charger",
    description: "20000mAh capacity for multiple device charges",
    price: "$49.99",
    image: "/images/display-3.png",
  },
];

const isOpen = ref(false);
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bg-card {
  @apply bg-white dark:bg-gray-800;
}

.text-card-foreground {
  @apply text-gray-900 dark:text-gray-100;
}

.text-muted-foreground {
  @apply text-gray-600 dark:text-gray-400;
}
</style>
