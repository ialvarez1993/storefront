<template>
  <div class="relative language-switcher">
    <button @click="toggleDropdown" class="lang-btn" type="button">
      <span>{{ flagClass }}</span>
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

const currentFlag = ref(locale.value);

const currentLocale = computed(() => {
  console.log("[BUTTONIDIOMAS] locale changed:", locale.value);
  return locale.value;
});

const flagClass = computed(() => {
  return `${currentLocale.value}`;
});

const availableLocales = computed(() => {
  return [
    { code: "es", name: "Español" },
    { code: "en", name: "English" },
  ];
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const isChangingLocale = ref(false);

const changeLanguage = async (code) => {
  try {
    isChangingLocale.value = true;
    await setLocale(code);
    await nextTick();

    currentFlag.value = code; // Actualizar la bandera inmediatamente
    localeCookie.value = code;
    localStorage.setItem("user-locale", code);
    isOpen.value = false;
  } catch (error) {
    console.error("[BUTTONIDIOMAS] Error al cambiar el idioma:", error);
  } finally {
    isChangingLocale.value = false;
    if (process.client) {
      window.location.reload();
    }
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

watch(
  () => locale.value,
  (newLocale) => {
    localStorage.setItem("user-locale", newLocale);
  },
  { immediate: true }, // Esto hace que se ejecute inmediatamente
);

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
    @apply absolute right-0 mt-1 py-1
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
    @apply mx-auto rounded-sm bg-cover bg-center inline-block;
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
