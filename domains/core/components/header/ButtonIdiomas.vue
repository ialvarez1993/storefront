<template>
  <div class="relative language-switcher">
    <button
      @click="toggleDropdown"
      class="lang-btn"
      type="button"
      :disabled="isChangingLocale"
    >
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
          :disabled="isChangingLocale"
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
const isChangingLocale = ref(false);
const currentFlag = ref(locale.value);

// Configuración mejorada de la cookie
const localeCookie = useCookie("i18n_redirected", {
  maxAge: 365 * 24 * 60 * 60,
  path: "/",
  secure: true,
  sameSite: "strict",
});

const currentLocale = computed(() => locale.value);

const flagClass = computed(() => currentLocale.value);

const availableLocales = computed(() => [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
]);

const toggleDropdown = () => {
  if (!isChangingLocale.value) {
    isOpen.value = !isOpen.value;
  }
};

// Función segura para localStorage
const saveToLocalStorage = (key, value) => {
  if (process.client) {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Error al guardar en localStorage:", error);
    }
  }
};

// Función segura para obtener de localStorage
const getFromLocalStorage = (key) => {
  if (process.client) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("Error al leer de localStorage:", error);
      return null;
    }
  }
  return null;
};

const changeLanguage = async (code) => {
  if (code === locale.value || isChangingLocale.value) return;

  try {
    isChangingLocale.value = true;
    await setLocale(code);
    await nextTick();

    currentFlag.value = code;
    localeCookie.value = code;
    saveToLocalStorage("user-locale", code);
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
  if (process.client) {
    const savedLocale =
      getFromLocalStorage("user-locale") || localeCookie.value;
    if (savedLocale && savedLocale !== locale.value) {
      changeLanguage(savedLocale);
    }

    document.addEventListener("click", closeDropdown);
    // Añadir soporte para cerrar con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        isOpen.value = false;
      }
    });
  }
});

watch(
  () => locale.value,
  (newLocale) => {
    if (newLocale) {
      saveToLocalStorage("user-locale", newLocale);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (process.client) {
    document.removeEventListener("click", closeDropdown);
    document.removeEventListener("keydown", handleEscape);
  }
});

const closeDropdown = (e) => {
  if (!e.target.closest(".language-switcher")) {
    isOpen.value = false;
  }
};

const handleEscape = (e) => {
  if (e.key === "Escape") {
    isOpen.value = false;
  }
};
</script>

<style scoped>
.lang-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: opacity 0.2s ease;
}

.lang-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background-color: black;
  border-radius: 0.375rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.lang-option {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s ease;
}

.lang-option:hover:not(:disabled) {
  background-color: rgba(0, 0, 0, 0.05);
}

.lang-option.active {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
