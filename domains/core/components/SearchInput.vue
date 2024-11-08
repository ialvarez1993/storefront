<!-- SearchInput.vue -->
<script setup>
import { watch, ref, computed, onMounted, nextTick } from 'vue';
import { SfInput, SfButton, SfLoaderCircular } from '@storefront-ui/vue';
import { useDebounceFn,useIntersectionObserver } from '@vueuse/core';
import gsap from 'gsap';

const formSearchTemplateRef = ref(null);
const searchResultsRef = ref(null);
const recentSearchesKey = 'recent-searches';
const maxRecentSearches = 5;

// Estados locales
const isInputFocused = ref(false);
const showTrendingSearches = ref(false);
const recentSearches = ref([]);

// Trending searches (ejemplo - idealmente vendría del backend)
const trendingSearches = [
  { id: 1, term: 'Nuevos productos', icon: '🆕' },
  { id: 2, term: 'Más vendidos', icon: '🔥' },
  { id: 3, term: 'Ofertas', icon: '💎' },
];

const {
  searchInputValue,
  highlightedIndex,
  search,
  searchHits,
  selectHit,
  enterPress,
  showResultSearch,
  loading,
} = useSearch(formSearchTemplateRef);

// Debounce para la búsqueda
const debouncedSearch = useDebounceFn(() => {
  if (searchInputValue.value.length >= 3) {
    search();
  }
}, 300);

// Computed properties
const hasResults = computed(() => searchHits.value.length > 0);
const shouldShowSuggestions = computed(() =>
  isInputFocused.value && !showResultSearch.value && !loading.value
);

// Intersection Observer para lazy loading
const { stop } = useIntersectionObserver(
  searchResultsRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      // Implementar infinite scroll si es necesario
    }
  },
);

// Manejo de búsquedas recientes
const loadRecentSearches = () => {
  try {
    const saved = localStorage.getItem(recentSearchesKey);
    recentSearches.value = saved ? JSON.parse(saved) : [];
  } catch (e) {
    console.error('Error loading recent searches:', e);
  }
};

const saveRecentSearch = (term) => {
  if (!term) return;
  const searches = new Set([term, ...recentSearches.value]);
  recentSearches.value = Array.from(searches).slice(0, maxRecentSearches);
  localStorage.setItem(recentSearchesKey, JSON.stringify(recentSearches.value));
};

// Animaciones
const animateResults = async () => {
  await nextTick();
  const results = document.querySelectorAll('.search-result-item');
  gsap.from(results, {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out',
  });
};

// Lifecycle hooks
onMounted(() => {
  loadRecentSearches();
});

// Event handlers
const handleFocus = () => {
  isInputFocused.value = true;
  showTrendingSearches.value = !searchInputValue.value;
};

const handleBlur = () => {
  setTimeout(() => {
    isInputFocused.value = false;
    showTrendingSearches.value = false;
  }, 200);
};

const handleSearch = () => {
  debouncedSearch();
  showTrendingSearches.value = false;
};

const handleSelectResult = (hit) => {
  saveRecentSearch(hit.name);
  selectHit(hit);
};

const handleKeydown = (event) => {
  if (!searchHits.value.length) return;

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        searchHits.value.length - 1
      );
      break;
    case 'ArrowUp':
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
  }
};

watch(searchHits, animateResults);
</script>

<template>
  <div class="search-container relative" ref="formSearchTemplateRef">
    <!-- Input principal -->
    <SfInput
      v-model="searchInputValue"
      type="text"
      class="search-input [&::-webkit-search-cancel-button]:appearance-none"
      :class="{ 'is-focused': isInputFocused }"
      placeholder="Buscar productos, marcas y más..."
      wrapper-class="flex-1 h-12 pr-0"
      size="base"
      @input="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keydown.enter.prevent="enterPress"
    >
      <template #prefix>
        <Icon
          name="ion:search"
          size="20px"
          class="text-gray-500 ml-3"
        />
      </template>

      <template #suffix>
        <div class="flex items-center gap-2 pr-2">
          <transition name="fade">
            <SfButton
              v-if="searchInputValue"
              variant="tertiary"
              square
              size="sm"
              class="text-gray-500"
              @click="searchInputValue = ''"
            >
              <Icon name="ion:close" size="18px" />
            </SfButton>
          </transition>

          <SfButton
            variant="primary"
            size="sm"
            class="search-button"
            :disabled="loading || !searchInputValue"
            @click="search"
          >
            <template v-if="!loading">
              Buscar
            </template>
            <SfLoaderCircular v-else size="sm" />
          </SfButton>
        </div>
      </template>
    </SfInput>

    <!-- Panel de resultados y sugerencias -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="showResultSearch || shouldShowSuggestions"
        class="search-results-panel"
        ref="searchResultsRef"
      >
        <!-- Resultados de búsqueda -->
        <div v-if="showResultSearch" class="search-results">
          <div v-if="loading" class="search-loading">
            <SfLoaderCircular size="lg" />
            <p class="text-gray-600">Buscando resultados...</p>
          </div>

          <div v-else-if="hasResults" class="search-hits">
            <ul class="divide-y">
              <li
                v-for="(hit, index) in searchHits"
                :key="hit.id"
                class="search-result-item"
                :class="{ 'is-highlighted': index === highlightedIndex }"
                @click="handleSelectResult(hit)"
              >
                <div class="flex items-center gap-4 p-3 hover:bg-gray-50">
                  <div class="search-result-image">
                    {{ console.log(hit) }}
                    <NuxtImg
                      v-if="hit.image_url"
                      :src="hit.image_url"
                      :alt="hit.name"
                      class="rounded-lg object-cover"
                    />
                    <div v-else class="placeholder-image">
                      <Icon name="ion:image-outline" size="24px" />
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <h4 class="search-result-title">{{ hit.name }}</h4>
                    <p v-if="hit.description" class="search-result-description">
                      {{ hit.description }}
                    </p>
                    <div class="search-result-meta">
                      <span v-if="hit.price" class="search-result-price">
                        {{ new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(hit.price) }}
                      </span>
                      <span v-if="hit.category" class="search-result-category">
                        {{ hit.category }}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div v-else class="search-no-results">
            <Icon name="ion:search-outline" size="48px" class="text-gray-400" />
            <p class="text-gray-600">No se encontraron resultados para "{{ searchInputValue }}"</p>
          </div>
        </div>

        <!-- Sugerencias y búsquedas recientes -->
        <div v-else-if="shouldShowSuggestions" class="search-suggestions">
          <!-- Búsquedas recientes -->
          <div v-if="recentSearches.length" class="suggestion-section">
            <h3 class="suggestion-title">
              <Icon name="ion:time-outline" />
              Búsquedas recientes
            </h3>
            <ul class="suggestion-list">
              <li
                v-for="term in recentSearches"
                :key="term"
                class="suggestion-item"
                @click="searchInputValue = term; search()"
              >
                <Icon name="ion:refresh-outline" />
                {{ term }}
              </li>
            </ul>
          </div>

          <!-- Trending searches -->
          <div class="suggestion-section">
            <h3 class="suggestion-title">
              <Icon name="ion:trending-up-outline" />
              Tendencias
            </h3>
            <ul class="suggestion-list">
              <li
                v-for="trend in trendingSearches"
                :key="trend.id"
                class="suggestion-item"
                @click="searchInputValue = trend.term; search()"
              >
                <span class="trend-icon">{{ trend.icon }}</span>
                {{ trend.term }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.search-container {
  @apply relative w-full max-w-2xl mx-auto;

  .search-input {
    @apply transition-all duration-200 border border-gray-200 rounded-full shadow-sm;

    &.is-focused {
      @apply border-primary-500 ring-2 ring-primary-500/20;
    }
  }

  .search-button {
    @apply rounded-full px-4 min-w-[80px];
  }

  .search-results-panel {
    @apply absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200
           overflow-hidden max-h-[80vh] overflow-y-auto z-50;
  }

  .search-loading {
    @apply flex flex-col items-center justify-center p-8 space-y-4;
  }

  .search-result-item {
    @apply transition-colors duration-150;

    &.is-highlighted {
      @apply bg-primary-50;
    }

    .search-result-image {
      @apply w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden;

      img {
        @apply w-full h-full object-cover;
      }

      .placeholder-image {
        @apply text-gray-400;
      }
    }

    .search-result-title {
      @apply text-sm font-medium text-gray-900 truncate;
    }

    .search-result-description {
      @apply text-xs text-gray-500 line-clamp-1;
    }

    .search-result-meta {
      @apply flex items-center gap-2 mt-1;

      .search-result-price {
        @apply text-sm font-semibold text-primary-600;
      }

      .search-result-category {
        @apply text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full;
      }
    }
  }

  .search-no-results {
    @apply flex flex-col items-center justify-center p-8 space-y-4 text-center;
  }

  .suggestion-section {
    @apply p-4;

    &:not(:last-child) {
      @apply border-b border-gray-200;
    }

    .suggestion-title {
      @apply flex items-center gap-2 text-sm font-medium text-gray-500 mb-3;
    }

    .suggestion-list {
      @apply space-y-2;
    }

    .suggestion-item {
      @apply flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md
             hover:bg-gray-50 cursor-pointer transition-colors duration-150;

      .trend-icon {
        @apply text-lg;
      }
    }
  }
}

// Animations
.fade-enter-active,
.fade-leave-active {
  @apply transition-opacity duration-150;
}

.fade-enter-from,
.fade-leave-to {
  @apply opacity-0;
}
</style>
