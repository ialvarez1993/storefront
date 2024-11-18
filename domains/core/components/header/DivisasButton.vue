<template>
  <div class="currency-switcher">
    <button
      @click="toggleDropdown"
      class="currency-btn"
      :class="{ 'btn-expanded': isExpanded }"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
      :aria-label="'Cambiar divisa actual: ' + currentCurrency.code"
    >
      <div class="btn-content">
        <div class="currency-flag" :class="currentCurrency.code.toLowerCase()">
          <span class="currency-symbol"> {{ currentCurrency.symbol }}</span>
        </div>
        <div class="currency-info-compact">
          <span class="current-code">{{ currentCurrency.code }}</span>
          <transition name="fade">
            <span v-if="isExpanded" class="current-rate">
              {{ formatCompactRate(exchangeRate) }}
            </span>
          </transition>
        </div>
        <ChevronDownIcon
          class="chevron-icon"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </button>

    <transition
      enter-active-class="animate-slideDown"
      leave-active-class="animate-slideUp"
    >
      <div v-if="isOpen" class="currency-dropdown" role="listbox">
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="Buscar divisa..."
            @click.stop
          />
          <MagnifyingGlassIcon class="search-icon" />
        </div>

        <div class="currencies-list">
          <div
            v-for="currency in filteredCurrencies"
            :key="currency.code"
            class="currency-option"
            :class="{
              active: currentCurrency.code === currency.code,
              'live-rate': currency.hasLiveRate,
            }"
            @click="changeCurrency(currency.code)"
            role="option"
            :aria-selected="currentCurrency.code === currency.code"
          >
            <div class="option-content">
              <div class="currency-flag" :class="currency.code.toLowerCase()">
                <span class="currency-symbol !text-black">{{
                  currency.symbol
                }}</span>
              </div>
              <div class="currency-details">
                <span class="currency-name">{{ currency.name }}</span>
                <div class="rate-container">
                  <span class="currency-code">{{ currency.code }}</span>
                  <span v-if="currency.hasLiveRate" class="live-badge">
                    <span class="live-dot"></span>
                    Live
                  </span>
                </div>
              </div>
              <div class="rate-value" v-if="currency.rate">
                {{ formatRate(currency.rate) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/vue/24/outline";

const isOpen = ref(false);
const isExpanded = ref(false);
const searchQuery = ref("");
const exchangeRate = ref(1.08); // Tasa inicial para EUR a USD

// Lista de monedas disponibles
const currencies = ref([
  {
    code: "USD",
    name: "Dólar estadounidense",
    symbol: "$",
    rate: 1.0,
    hasLiveRate: true,
  },
  {
    code: "BS",
    name: "Bolívar",
    symbol: "Bs",
    rate: 44.0, // Tasa aproximada actualizada
    hasLiveRate: true,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    rate: 1.08, // Tasa actualizada del Euro frente al USD
    hasLiveRate: true,
  },
]);

// Moneda actual seleccionada
const currentCurrency = ref(currencies.value[0]);

// Filtrar monedas según la búsqueda
const filteredCurrencies = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  return currencies.value.filter(
    (currency) =>
      currency.name.toLowerCase().includes(query) ||
      currency.code.toLowerCase().includes(query),
  );
});

// Función para abrir/cerrar el dropdown
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// Función para cambiar la moneda seleccionada y actualizar la tasa de cambio
const changeCurrency = (code: string) => {
  const newCurrency = currencies.value.find((c) => c.code === code);
  if (newCurrency) {
    currentCurrency.value = newCurrency;
    exchangeRate.value = newCurrency.rate;
  }
  isOpen.value = false;
};

// Función para formatear tasas de cambio de forma compacta
const formatCompactRate = (rate: number | null): string => {
  if (!rate) return "";
  return new Intl.NumberFormat("es-VE", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(rate);
};

// Función para formatear tasas de cambio completas
const formatRate = (rate: number): string => {
  return new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rate);
};

// Cerrar el dropdown cuando se hace click fuera
const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".currency-switcher")) {
    isOpen.value = false;
  }
};

// Agregar y remover event listener para cerrar el dropdown
onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener("click", closeDropdown);
});
</script>

<style lang="scss" scoped>
.currency-switcher {
  @apply relative inline-flex;

  .currency-btn {
    @apply relative overflow-hidden
           h-8 min-w-[4rem]
           rounded-full
           bg-white dark:bg-gray-800
           border border-gray-200 dark:border-gray-700
           shadow-sm hover:shadow-md
           transition-all duration-300 ease-in-out;

    &:hover {
      @apply transform -translate-y-0.5;
    }

    &.btn-expanded {
      @apply min-w-[7rem];

      .currency-info-compact {
        @apply w-auto opacity-100;
      }
    }

    .btn-content {
      @apply flex items-center gap-1 px-2
             h-full w-full;
    }

    .currency-flag {
      @apply w-6 h-6 rounded-full
             flex items-center justify-center
             shadow-inner
             transform transition-transform duration-300
             text-xs font-medium;

      &.bs {
        @apply bg-gradient-to-br from-yellow-400 to-yellow-500;
      }
      &.usd {
        @apply bg-gradient-to-br from-green-600 to-green-950 text-white;
      }
      &.eur {
        @apply bg-gradient-to-br from-blue-400 to-blue-500 text-white;
      }

      .currency-symbol {
        @apply text-[0.7rem] font-bold;
      }
    }

    .currency-info-compact {
      @apply flex flex-col items-start
             ml-1 overflow-hidden
             transition-all duration-300;

      .current-code {
        @apply text-sm font-medium
               text-gray-800 dark:text-gray-200;
      }

      .current-rate {
        @apply text-xs text-gray-500 dark:text-gray-400
               whitespace-nowrap;
      }
    }

    .chevron-icon {
      @apply w-4 h-4 ml-1
             text-gray-400 dark:text-gray-500
             transition-transform duration-300;
    }
  }

  .currency-dropdown {
    @apply absolute right-0 mt-2
           w-[280px] max-h-[400px]
           bg-white dark:bg-gray-800
           rounded-2xl
           border border-gray-200 dark:border-gray-700
           shadow-xl
           overflow-hidden
           z-50;

    .search-wrapper {
      @apply p-3 border-b border-gray-200 dark:border-gray-700
             relative;

      .search-input {
        @apply w-full px-8 py-2
               text-sm text-black
               bg-gray-50 dark:bg-gray-700
               border border-gray-200 dark:border-gray-600
               rounded-lg
               focus:ring-2 focus:ring-blue-500
               placeholder-gray-400 dark:placeholder-gray-500;
      }

      .search-icon {
        @apply absolute left-5 top-1/2 transform -translate-y-1/2
               w-4 h-4
               text-gray-400 dark:text-gray-500;
      }
    }

    .currencies-list {
      @apply overflow-y-auto max-h-[300px];
    }

    .currency-option {
      @apply relative px-3 py-2.5
             hover:bg-gray-50 dark:hover:bg-gray-700
             cursor-pointer
             transition-colors duration-200;

      &.active {
        @apply bg-blue-50/50 dark:bg-blue-900/20;
      }

      .option-content {
        @apply flex items-center gap-3;
      }

      .currency-details {
        @apply flex flex-col flex-1 min-w-0;

        .currency-name {
          @apply text-sm font-medium
                 text-gray-800 dark:text-gray-200
                 truncate;
        }

        .rate-container {
          @apply flex items-center gap-2;

          .currency-code {
            @apply text-xs text-gray-500 dark:text-gray-400;
          }
        }
      }

      .live-badge {
        @apply flex items-center gap-1
               text-[0.65rem] font-medium
               text-green-600 dark:text-green-400;

        .live-dot {
          @apply w-1.5 h-1.5 rounded-full bg-green-500;
          animation: pulse 2s infinite;
        }
      }

      .rate-value {
        @apply text-sm text-gray-600 dark:text-gray-300
               font-medium tabular-nums;
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(34, 197, 94, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-slideDown {
  animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slideUp {
  animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
}

// Responsive adjustments
@media (max-width: 640px) {
  .currency-switcher {
    .currency-btn {
      @apply h-9 min-w-[3.5rem];

      &.btn-expanded {
        @apply min-w-[6rem];
      }

      .currency-flag {
        @apply w-5 h-5;
      }
    }

    .currency-dropdown {
      @apply w-[260px] right-0;
    }
  }
}
</style>
