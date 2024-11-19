<template>
  <div class="relative language-switcher">
    <button @click="toggleDropdown" class="lang-btn" type="button">
      <span class="flag" :class="currentLocale"></span>
      <ChevronDownIcon
        class="w-4 h-4 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <transition
      enter-active-class="animate-fadeIn"
      leave-active-class="animate-fadeOut"
    >
      <div v-if="isOpen" class="lang-dropdown">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="changeLanguage(locale.code)"
          class="lang-option"
          :class="{ active: currentLocale === locale.code }"
        >
          <span class="flag" :class="locale.code"></span>
          <span class="text-sm">{{ locale.name }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "vue-i18n";

const { locale, setLocale } = useI18n();
const isOpen = ref(false);
const localeCookie = useCookie("i18n_redirected", {
  maxAge: 365 * 24 * 60 * 60, // 365 días
  path: "/",
});

const currentLocale = computed(() => locale.value);

const availableLocales = computed(() => {
  return [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
  ];
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const changeLanguage = async (code) => {
  try {
    await setLocale(code);
    // Guardar en cookie con una expiración larga (365 días)
    localeCookie.value = code;
    isOpen.value = false;

    // Actualizar localStorage como respaldo
    localStorage.setItem("user-locale", code);

    // Recargar la página para asegurar que todos los componentes se actualicen
    window.location.reload();
  } catch (error) {
    console.error("Error al cambiar el idioma:", error);
  }
};

onMounted(() => {
  // Recuperar idioma guardado
  const savedLocale = localStorage.getItem("user-locale") || localeCookie.value;
  if (savedLocale && savedLocale !== locale.value) {
    changeLanguage(savedLocale);
  }

  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});

const closeDropdown = (e) => {
  if (!e.target.closest(".language-switcher")) {
    isOpen.value = false;
  }
};
</script>

<style lang="scss">
// El estilo se mantiene igual que en tu código original
.language-switcher {
  @apply relative inline-block;

  .lang-btn {
    @apply flex items-center gap-1 px-2  rounded-md
           bg-opacity-20 hover:bg-opacity-30 transition-all
           bg-yellow-900 dark:bg-gray-800;
  }

  .lang-dropdown {
    @apply absolute right-0 mt-1 py-1 min-w-[120px]
           bg-black dark:bg-gray-800 rounded-md shadow-lg
           ring-1 ring-black ring-opacity-5 z-50;

    .lang-option {
      @apply flex items-center gap-2 w-full px-3 py-1.5
             hover:bg-slate-900 dark:hover:bg-gray-700 transition-colors;

      &.active {
        @apply bg-gray-800 dark:bg-gray-700;
      }
    }
  }

  .flag {
    @apply w-5 h-5 rounded-sm bg-cover bg-center inline-block;

    &.en {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23f0f0f0' d='M0 0h512v512H0z'/%3E%3Cpath fill='%23d80027' d='M0 0h512v39.4H0zM0 78.8h512v39.4H0zM0 157.6h512V197H0zM0 236.4h512v39.4H0zM0 315.2h512v39.4H0zM0 394h512v39.4H0zM0 472.8h512v39.4H0z'/%3E%3Cpath fill='%232e3560' d='M0 0h275.5v275.5H0z'/%3E%3Cpath fill='%23f0f0f0' d='m24.2 22.3 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15H93l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm-169.6 48.4 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm-169.6 48.4 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm-169.6 48.4 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7zm48.4 0 4.9 15h15.7l-12.7 9.2 4.9 15-12.8-9.2-12.7 9.2 4.9-15-12.7-9.2h15.7z'/%3E%3C/svg%3E");
    }

    &.es {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23ffda44' d='M0 256c0 31.3 5.6 61.3 16 89l240 22.3L496 345a255.5 255.5 0 0 0 0-178l-240-22.3L16 167a255.5 255.5 0 0 0-16 89z'/%3E%3Cpath fill='%23d80027' d='M496 167a256 256 0 0 0-480 0h480zM16 345a256 256 0 0 0 480 0H16z'/%3E%3C/svg%3E");
    }
  }
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

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out forwards;
}

.animate-fadeOut {
  animation: fadeOut 0.2s ease-in forwards;
}
</style>
