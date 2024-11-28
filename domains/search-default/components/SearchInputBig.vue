<script setup>
import { ref, computed } from "vue";
import { SfInput, SfButton, SfLoaderCircular } from "@storefront-ui/vue";
import { useDebounceFn } from "@vueuse/core";

const mainSearchFormRef2 = ref(null);

import useAltSearch from "../composables/useSearch2";
const {
  altSearchInputValue: searchInputValue2,
  altSearch: search2,
  altSearchHits: searchHits2,
  altSelectHit: selectHit2,
  altEnterPress: enterPress2,
  showAltResultSearch: showResultSearch2,
  altLoading: loading2,
} = useAltSearch(mainSearchFormRef2);

const debouncedMainSearch2 = useDebounceFn(() => {
  if (searchInputValue2.value.length >= 3) {
    search2();
  }
}, 3000);

const hasSearchResults2 = computed(() => searchHits2.value.length > 0);
</script>

<template>
  <div class="-top-[3rem] search-container" ref="mainSearchFormRef2">
    <!-- Barra de búsqueda -->
    <SfInput
      v-model="searchInputValue2"
      type="text"
      class="search-input"
      placeholder="¿Qué estás buscando?"
      wrapper-class="flex-1 h-16"
      @input="debouncedMainSearch2"
      @keydown.enter.prevent="enterPress2"
    >
      <template #prefix>
        <Icon name="ion:search" size="24px" class="text-gray-500 ml-4" />
      </template>

      <template #suffix>
        <div class="flex items-center gap-2 pr-2">
          <SfButton
            v-if="searchInputValue2"
            variant="tertiary"
            square
            class="text-gray-500"
            @click="searchInputValue2 = ''"
          >
            <Icon name="ion:close" size="20px" />
          </SfButton>

          <SfButton
            variant="primary"
            class="search-button"
            :disabled="loading2 || !searchInputValue2"
            @click="search2"
          >
            <template v-if="!loading2">Buscar</template>
            <SfLoaderCircular v-else size="sm" />
          </SfButton>
        </div>
      </template>
    </SfInput>
  </div>
</template>

<style scoped>
.search-container {
  @apply relative  mx-auto;
}

.search-input {
  @apply bg-white border-2 border-gray-200 rounded-xl transition-all duration-200;
}

.search-input:focus-within {
  @apply border-yellow-600 shadow-lg;
}

.search-button {
  @apply bg-yellow-400 text-black px-6 h-10 rounded-lg;
}

.results-panel {
  @apply absolute w-full mt-2 bg-white rounded-xl shadow-lg max-h-[600px] overflow-y-auto z-50;
}

.results-list {
  @apply divide-y divide-gray-100;
}

.result-item {
  @apply flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors;
}

.product-image {
  @apply w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100;
}

.product-info {
  @apply flex-1;
}

.product-name {
  @apply text-base font-medium;
}

.product-price {
  @apply text-sm text-gray-600 mt-1 block;
}

.no-results {
  @apply p-8 text-center text-gray-500;
}

.placeholder-image {
  @apply w-full h-full flex items-center justify-center bg-gray-100 text-gray-400;
}
</style>
