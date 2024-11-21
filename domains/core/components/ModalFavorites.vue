<template>
  <div>
    <!-- Favorite Button with Counter -->
    <button
      aria-label="Open Favorites"
      class="relative rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      @click="toggleFavorites"
    >
      <Heart
        :class="[
          'h-6 w-6 transition-all duration-300',
          isOpen
            ? 'text-rose-500 fill-rose-500'
            : 'text-gray-700 dark:text-gray-300',
        ]"
      />
      <span
        v-if="mockFavorites.length"
        class="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ mockFavorites.length }}
      </span>
    </button>

    <!-- Modal -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="transform opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white dark:bg-gray-900 sm:max-w-[900px] max-h-[90vh] w-full rounded-2xl shadow-2xl overflow-hidden"
          :class="{ 'animate-shake': isShaking }"
        >
          <!-- Header -->
          <header class="relative p-6 border-b dark:border-gray-800">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold dark:text-white">
                  Your Favorites
                  <span class="text-rose-500"
                    >({{ mockFavorites.length }})</span
                  >
                </h2>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage your favorite items
                </p>
              </div>
              <button
                class="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                @click="closeModal"
              >
                <XIcon class="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </header>

          <!-- Content -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <TransitionGroup
              name="list"
              tag="div"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div
                v-for="item in mockFavorites"
                :key="item.id"
                class="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <!-- Image Container -->
                <div class="relative aspect-square overflow-hidden">
                  <NuxtImg
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div
                    class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>

                <!-- Content -->
                <div class="p-4">
                  <h3 class="font-semibold text-lg mb-1 dark:text-white">
                    {{ item.name }}
                  </h3>
                  <p
                    class="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
                  >
                    {{ item.description }}
                  </p>
                  <div class="flex items-center justify-between">
                    <p class="font-bold text-rose-500">{{ item.price }}</p>
                    <button
                      class="text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-500 transition-colors"
                      @click="removeFavorite(item.id)"
                    >
                      <Trash2Icon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div v-if="!mockFavorites.length" class="text-center py-12">
              <HeartOffIcon class="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                No favorites yet
              </h3>
              <p class="text-gray-500 dark:text-gray-400">
                Start adding items to your favorites!
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Heart,
  X as XIcon,
  Trash2Icon,
  HeartOff as HeartOffIcon,
} from "lucide-vue-next";

type FavoriteItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
};

const isOpen = ref(false);
const isShaking = ref(false);

const mockFavorites = ref<FavoriteItem[]>([
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "High-quality sound with noise cancellation and premium comfort for long listening sessions",
    price: "$199.99",
    image: "/images/display-1.png",
  },
  {
    id: "2",
    name: "Smart Watch",
    description:
      "Track your fitness and stay connected with this premium smartwatch featuring health monitoring",
    price: "$249.99",
    image: "/images/display-2.png",
  },
  {
    id: "3",
    name: "Portable Charger",
    description:
      "20000mAh capacity for multiple device charges with fast charging capability",
    price: "$49.99",
    image: "/images/display-3.png",
  },
]);

const toggleFavorites = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    document.body.style.overflow = "hidden";
  }
};

const closeModal = () => {
  isOpen.value = false;
  document.body.style.overflow = "auto";
};

const removeFavorite = (id: string) => {
  isShaking.value = true;
  setTimeout(() => {
    mockFavorites.value = mockFavorites.value.filter((item) => item.id !== id);
    isShaking.value = false;
  }, 300);
};
</script>

<style lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-move {
  transition: transform 0.5s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}

/* Custom Scrollbar */
.overflow-y-auto {
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    @apply bg-gray-100 dark:bg-gray-800 rounded-full;
  }

  &::-webkit-scrollbar-thumb {
    @apply bg-gray-300 dark:bg-gray-700 rounded-full;
    &:hover {
      @apply bg-gray-400 dark:bg-gray-600;
    }
  }
}

/* Improved Dark Mode Support */
@media (prefers-color-scheme: dark) {
  ::selection {
    @apply bg-rose-500/30 text-white;
  }
}
</style>
