<!-- SearchInput.vue -->
<script setup>
import { watch, ref, computed, onMounted, nextTick } from "vue";
import { SfInput, SfButton, SfLoaderCircular } from "@storefront-ui/vue";
import { useDebounceFn, useIntersectionObserver } from "@vueuse/core";
import gsap from "gsap";

const formSearchTemplateRef = ref(null);
const searchResultsRef = ref(null);
const recentSearchesKey = "recent-searches";
const maxRecentSearches = 5;

// Estados locales
const isInputFocused = ref(false);
const showTrendingSearches = ref(false);
const recentSearches = ref([]);

// Trending searches (ejemplo - idealmente vendría del backend)
const trendingSearches = [
  { id: 1, term: "women", icon: "👩‍🦲" },
  { id: 2, term: "desk", icon: "✏️" },
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
}, 0);

// Computed properties
const hasResults = computed(() => searchHits.value.length > 0);
const shouldShowSuggestions = computed(
  () => isInputFocused.value && !showResultSearch.value && !loading.value,
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
    console.error("Error loading recent searches:", e);
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
  const results = document.querySelectorAll(".search-result-item");
  gsap.from(results, {
    y: 20,
    opacity: 0,
    duration: 0.4,
    stagger: 0.05,
    ease: "power2.out",
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
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        searchHits.value.length - 1,
      );
      break;
    case "ArrowUp":
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
      class="search-input font-robotolight [&::-webkit-search-cancel-button]:appearance-none"
      :class="{ 'is-focused': isInputFocused }"
      :placeholder="$t('search')"
      wrapper-class="flex-1 h-12 pr-0"
      size="base"
      @input="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleKeydown"
      @keydown.enter.prevent="enterPress"
    >
      <template #prefix>
        <Icon name="ion:search" size="20px" class="text-gray-500 ml-3" />
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
            <template v-if="!loading"> {{ $t("searchButton") }} </template>
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
                    <NuxtImg
                      v-if="hit.combinationInfo.display_name"
                      :src="
                        $getImage(
                          String(hit.image),
                          250,
                          250,
                          String(hit.imageFilename),
                        )
                      "
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
                        {{
                          new Intl.NumberFormat("es-ES", {
                            style: "currency",
                            currency: "EUR",
                          }).format(hit.price)
                        }}
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
            <p class="text-gray-600">
              No se encontraron resultados para "{{ searchInputValue }}"
            </p>
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
                @click="
                  searchInputValue = term;
                  search();
                "
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
                @click="
                  searchInputValue = trend.term;
                  search();
                "
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
  position: relative;
  width: 100%;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;

  .search-input {
    transition-property: all;
    transition-duration: 200ms;
    border-width: 1px;
    border-color: rgb(229 231 235);
    border-radius: 9999px;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &.is-focused {
      border-color: #0ea5e9; // Color primary-500
      ring-width: 2px;
      ring-color: rgba(14, 165, 233, 0.2); // primary-500 con opacidad
    }
  }

  .search-button {
    background-color: #ffc107b4;
    color: #000000;
    border-radius: 9999px;
    padding-left: 1rem;
    padding-right: 1rem;
    min-width: 80px;
  }

  .search-results-panel {
    position: absolute;
    left: 0;
    right: 0;
    margin-top: 0.5rem;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    border-width: 1px;
    border-color: rgb(229 231 235);
    overflow: hidden;
    max-height: 80vh;
    overflow-y: auto;
    z-index: 50;
  }

  .search-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
  }

  .search-result-item {
    transition-property: color, background-color, border-color;
    transition-duration: 150ms;

    &.is-highlighted {
      background-color: #f0f9ff; // Color primary-50
    }

    .search-result-image {
      width: 4rem;
      height: 4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(243 244 246);
      border-radius: 0.5rem;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .placeholder-image {
        color: rgb(156 163 175);
      }
    }

    .search-result-title {
      font-size: 0.875rem;
      font-weight: 500;
      color: rgb(17 24 39);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .search-result-description {
      font-size: 0.75rem;
      color: rgb(107 114 128);
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .search-result-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;

      .search-result-price {
        font-size: 0.875rem;
        font-weight: 600;
        color: #0284c7; // Color primary-600
      }

      .search-result-category {
        font-size: 0.75rem;
        color: rgb(107 114 128);
        background-color: rgb(243 244 246);
        padding: 0.125rem 0.5rem;
        border-radius: 9999px;
      }
    }
  }

  .search-no-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
    text-align: center;
  }

  .suggestion-section {
    padding: 1rem;

    &:not(:last-child) {
      border-bottom-width: 1px;
      border-color: rgb(229 231 235);
    }

    .suggestion-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: rgb(107 114 128);
      margin-bottom: 0.75rem;
    }

    .suggestion-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.875rem;
      color: rgb(55 65 81);
      border-radius: 0.375rem;
      cursor: pointer;
      transition-property: color, background-color;
      transition-duration: 150ms;

      &:hover {
        background-color: rgb(249 250 251);
      }

      .trend-icon {
        font-size: 1.125rem;
      }
    }
  }
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 150ms;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
