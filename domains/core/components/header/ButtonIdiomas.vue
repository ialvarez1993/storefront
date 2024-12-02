<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const { locale, setLocale, t } = useI18n();
const isOpen = ref(false);
const isChangingLanguage = ref(false);
const loadingError = ref<string | null>(null);

// Tipado fuerte para las configuraciones de idiomas
type LocaleConfig = {
  code: 'es' | 'en';
  name: string;
  flag?: string;
};

// Cookie con configuración mejorada
const localeCookie = useCookie('user-locale', {
  maxAge: 365 * 24 * 60 * 60,
  path: '/',
  watch: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
});

const availableLocales: LocaleConfig[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

const currentLocale = computed(() => {
  const current = availableLocales.find(l => l.code === locale.value);
  return current || availableLocales[0];
});

const toggleDropdown = () => {
  if (!isChangingLanguage.value) {
    isOpen.value = !isOpen.value;
  }
};

const detectUserLanguage = (): string => {
  try {
    // Sistema de fallback en cascada
    const sources = [
      localeCookie.value,
      navigator.language.split('-')[0],
      window.localStorage.getItem('preferred-locale'),
      'es'
    ];

    for (const source of sources) {
      if (source && availableLocales.some(l => l.code === source)) {
        return source;
      }
    }

    return 'es';
  } catch (error) {
    console.warn('Error detecting user language:', error);
    return 'es';
  }
};

const changeLanguage = async (newLocale: string) => {
  try {
    if (newLocale === locale.value || isChangingLanguage.value) return;

    isChangingLanguage.value = true;
    loadingError.value = null;
    isOpen.value = false;

    // Guardar estado actual
    const currentPath = route.fullPath;

    await setLocale(newLocale);
    localeCookie.value = newLocale;
    window.localStorage.setItem('preferred-locale', newLocale);

    // Emitir evento personalizado
    window.dispatchEvent(new CustomEvent('language-changed', {
      detail: {
        locale: newLocale,
        previousLocale: locale.value,
        timestamp: new Date().toISOString()
      }
    }));

    // Recargar solo si es necesario
    if (process.client) {
      if (route.name) {
        // Si estamos usando vue-router, intentamos primero una navegación suave
        await router.replace({ path: currentPath });
      } else {
        // Fallback a recarga completa
        window.location.reload();
      }
    }
  } catch (error) {
    console.error('Error changing language:', error);
    loadingError.value = t('errors.languageChange');
  } finally {
    isChangingLanguage.value = false;
  }
};

const closeDropdown = (e: MouseEvent) => {
  if (!e.target || !(e.target as Element).closest('.language-switcher')) {
    isOpen.value = false;
  }
};

// Gestión de eventos del ciclo de vida
onMounted(() => {
  const userLanguage = detectUserLanguage();
  if (userLanguage !== locale.value) {
    changeLanguage(userLanguage);
  }

  document.addEventListener('click', closeDropdown);

  // Listener para cambios de idioma desde otras partes de la aplicación
  window.addEventListener('storage', (event) => {
    if (event.key === 'preferred-locale' && event.newValue) {
      changeLanguage(event.newValue);
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  window.removeEventListener('storage', changeLanguage);
});
</script>

<template>
  <div class="language-switcher relative" :class="{ 'is-changing': isChangingLanguage }">
    <button
      @click="toggleDropdown"
      class="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      :disabled="isChangingLanguage"
      :aria-expanded="isOpen"
      aria-haspopup="true"
    >
      <span>{{ currentLocale.flag }} {{ currentLocale.name }}</span>
      <ChevronDownIcon class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <button
            v-for="locale in availableLocales"
            :key="locale.code"
            @click="changeLanguage(locale.code)"
            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            role="menuitem"
            :disabled="isChangingLanguage"
          >
            {{ locale.flag }} {{ locale.name }}
          </button>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <p v-if="loadingError" class="text-red-500 text-sm mt-2">{{ loadingError }}</p>
    </transition>
  </div>
</template>

<style lang="scss">
// El estilo se mantiene igual que en tu código original
.language-switcher {
  @apply relative inline-block;

  .lang-btn {
    @apply flex items-center gap-1 px-2 rounded-md bg-opacity-20 hover:bg-opacity-30 transition-all bg-yellow-900 dark:bg-gray-800;
  }

  .lang-dropdown {
    @apply absolute right-0 mt-1 py-1 min-w-[120px] bg-black dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50;

    .lang-option {
      @apply flex items-center gap-2 w-full px-3 py-1.5 hover:bg-slate-900 dark:hover:bg-gray-700 transition-colors;

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
