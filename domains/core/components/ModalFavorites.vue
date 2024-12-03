<template>
  <div>
    <!-- Favorite Button with Counter -->
    <button aria-label="Open Favorites"
      class="relative rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
      @click="handleOpenWishListSidebar">
      <Heart :class="[
        'h-6 w-6 transition-all duration-300',
        isOpen
          ? 'text-rose-500 fill-rose-500'
          : 'text-gray-700 dark:text-gray-300',
      ]" />
      <span v-if="mockFavorites.length"
        class="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {{ mockFavorites.length }}
      </span>
    </button>

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
</style>
