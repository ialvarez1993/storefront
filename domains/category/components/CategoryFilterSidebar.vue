<script lang="ts" setup>
import {
  SfAccordionItem,
  SfButton,
  SfCheckbox,
  SfChip,
  SfIconChevronLeft,
  SfListItem,
  SfRadio,
  SfSelect,
  SfThumbnail,
} from "@storefront-ui/vue";

const emit = defineEmits(["close"]);
const props = defineProps({
  attributes: {
    type: Array,
    required: true,
  },
  categories: {
    type: Object,
    required: true,
  },
});
const route = useRoute();
const router = useRouter();
const { changeFilters, facetsFromUrlToFilter } = useUiHelpers();

const sort = useState("sort", () =>
  route.query?.sort ? route.query?.sort : "",
);

const sortBy = computed(() => getSortOptions({ input: { sort: sort.value } }));
const changeSorting = async (newSort: string) => {
  sort.value = newSort;
};
const getSortOptions = (searchData: { input: any }) => ({
  options: sortOptions,
  selected: searchData.input.sort || "",
});

const selectedFilters = useState("category-selected-filters", () => []);
const isFilterSelected = (option: any) => {
  return selectedFilters.value.some(
    (filter: { id: any }) => String(filter.id) === String(option.id),
  );
};

const facets = computed(() => [
  {
    id: null,
    label: "Price",
    type: "price",
    options: [
      { id: "pr1", label: "Under $250.00", values: "0-250" },
      { id: "pr2", label: "$250.00 - $500.00", values: "250-500" },
      { id: "pr3", label: "$500.00 - $750.00", values: "500-750" },
      { id: "pr4", label: "$750.00 - $1000.00", values: "750-1000" },
      { id: "pr5", label: "$1000.00- $1500.00", values: "1000-1500" },
    ],
  },
  ...props.attributes,
]);
const opened = useState("category-opened", () => ({
  Price: true,
}));

const priceModel = useState("price-model", () => "");

const selectFilter = (
  facet: { label: string },
  option: { id: string; value: string; label: string },
) => {
  const alreadySelectedIndex = selectedFilters.value.findIndex(
    (filter: { label: string }) => String(filter.label) === String(option.id),
  );

  if (alreadySelectedIndex !== -1) {
    selectedFilters.value.splice(alreadySelectedIndex, 1);
    return;
  }

  selectedFilters.value.push({
    filterName: facet?.label,
    label: option?.id,
    id: option?.value,
  });
};

const applyFilters = () => {
  const filters = selectedFilters.value.filter((item: any) => {
    return typeof item === "object";
  });

  changeFilters(filters, sort.value);
  emit("close");
};

const clearFilters = () => {
  priceModel.value = "";
  selectedFilters.value = [];
  router.push({ query: {} });
  emit("close");
};

const changeCategory = (categoryId: number) => {
  clearFilters();
  router.push({ path: `/category/${categoryId}` });
};

selectedFilters.value = facetsFromUrlToFilter();

watch(
  () => [facets.value, selectedFilters.value],
  () => {
    facets.value.forEach((facet: any) => {
      opened.value[facet.label] = selectedFilters.value.some(
        (item: any) => item.filterName === facet.label,
      );
    });
    opened.value.Price = true;
  },
  { deep: true },
);

const priceFilter = selectedFilters.value?.find((item: any) => {
  return item.filterName === "price";
});

if (priceFilter) {
  priceModel.value = priceFilter.id;
}

watch(priceModel, (newValue) => {
  const priceFilterIndex = selectedFilters.value.findIndex(
    (item: any) => item.filterName === "price"
  );

  if (priceFilterIndex !== -1) {
    selectedFilters.value.splice(priceFilterIndex, 1);
  }

  if (newValue) {
    selectedFilters.value.push({
      filterName: "price",
      id: newValue,
      label: facets.value[0].options.find(opt => opt.values === newValue)?.label
    });
  }
});

onMounted(() => {
  const priceFilter = selectedFilters.value?.find((item: any) => item.filterName === "price");
  if (priceFilter) {
    priceModel.value = priceFilter.id;
  }
});

</script>

<template>
  <aside class="w-full lg:max-w-[376px] font-sans">
    <!-- Categorías -->
    <template v-if="categories.length">
      <div class="bg-gradient-to-r from-yellow-700 to-yellow-500 p-4 rounded-lg shadow-lg mb-6">
        <h3 class="text-white font-bold text-xl tracking-wider uppercase">
          {{ $t("category") }}
        </h3>
      </div>

      <ul class="space-y-2 mb-8" data-testid="categories">
        <SfListItem v-for="category in categories" :key="category.name" size="lg"
          class="transition-all group/categoryFilter duration-300 hover:!bg-black scale-100 hover:scale-105" :class="[
            'rounded-md hover:!bg-black',
            {
              'bg-indigo-50 border-l-4 border-indigo-600':
                category.id === route.query.id,
            },
          ]">
          <span class="flex items-center gap-3 p-2 cursor-pointer" @click="changeCategory(category.id)">
            <i class="fas fa-folder group-hover/categoryFilter:!text-white"></i>
            <span class="group-hover/categoryFilter:!text-white font-medium capitalize">
              {{ category.name }}
            </span>
          </span>
        </SfListItem>
      </ul>
    </template>

    <div class="sticky top-[5rem] z-10 bg-white mb-4 p-4 rounded-lg">
      <div class="flex gap-2">
        <Button
          class="flex-1 py-2 px-3 scale-100 hover:scale-105 !bg-yellow-600 !border-none transition-colors duration-200"
          @click="clearFilters">
          <i class="fas fa-times mr-2"></i>
          {{ $t("clearFilters") }}
        </Button>
        <Button
          class="flex-1 py-2 px-3 scale-100 hover:scale-105 !bg-black !border-none text-white transition-colors duration-200"
          @click="applyFilters">
          <i class="fas fa-magnifying-glass mr-2"></i>
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
          {{ $t("showProducts") }}
        </Button>
      </div>
    </div>


    <!-- Ordenamiento -->
    <div class="bg-white rounded-lg p-4 mb-6">
      <h5 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-sort text-black"></i>
        Sort by
      </h5>
      <div class="px-2">
        <label>
          <SfSelect v-model="sortBy.selected" placeholder="-- Select --"
            class="w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500  placeholder:text-black"
            :aria-label="$t('sortBy')" @update:model-value="changeSorting">
            <option value="" disabled>Select sorting</option>
            <option v-for="{ id, value, attrName } in sortBy.options" :key="id" :value="value" class="text-gray-900">
              {{ attrName }}
            </option>
          </SfSelect>
        </label>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-md p-4">
      <h5 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <i class="fas fa-filter text-black"></i>
        Filter
      </h5>






      <ul class="space-y-4">
        <li v-for="(facet, index) in facets" :key="index">
          <SfAccordionItem v-model="opened[facet.label]" class="border border-gray-100 rounded-lg overflow-hidden">
            <template #summary>
              <div class="flex justify-between items-center p-3 hover:bg-gray-50">
                <p class="font-medium text-gray-800 flex items-center gap-2">
                  <i class="fas fa-tag text-black"></i>
                  {{ facet?.label }}
                </p>
                <SfIconChevronLeft class="text-gray-500 transition-transform duration-300"
                  :class="opened[facet.label] ? 'rotate-90' : '-rotate-90'" />
              </div>
            </template>

            <!-- Filtros de precio -->
            <template v-if="facet.type == 'price'">
              <fieldset id="radio-price" class="p-4">
                <SfListItem v-for="option in facet.options" :key="option.id" tag="div"
                  class="mb-2 last:mb-0 cursor-pointer hover:bg-gray-50 p-2 rounded-md"
                  @click="priceModel = option.values">
                  <template #prefix>
                    <SfRadio type="radio" v-model="priceModel" :name="facet.label" :value="option.values"
                      :checked="priceModel === option.values"
                      class="w-4 h-4 appearance-none border-2 border-gray-300 rounded-full transition-all duration-200"
                      :class="{
                        'bg-black': priceModel === option.values,
                      }" />
                  </template>
                  <span class="ml-2 text-sm text-gray-600" :class="{
                    'font-medium text-yellow-600': priceModel === option.values,
                  }">
                    {{ option.label }}
                  </span>
                </SfListItem>
              </fieldset>
            </template>

            <!-- Chips de selección -->
            <ul v-if="facet.type === 'select'" class="grid grid-cols-2 md:grid-cols-3 gap-2 p-4">
              <li v-for="{ id, value, label } in facet.options" :key="id">
                <SfChip class="w-full transition-all duration-200 hover:scale-105" size="sm" :input-props="{ value }"
                  :model-value="isFilterSelected({ id, value })" @update:model-value="
                    selectFilter(facet, { id, value, label })
                    ">
                  {{ label }}
                </SfChip>
              </li>
            </ul>

            <!-- Colores -->
            <template v-if="facet.type == 'color'">
              <div class="p-4 grid grid-cols-4 gap-4">
                <SfListItem v-for="{ id, value, label, htmlColor } in facet.options" :key="id" size="sm" tag="label"
                  class="flex flex-col items-center">
                  <SfCheckbox :value="label" class="hidden" :model-value="isFilterSelected({ id, value })"
                    @update:model-value="
                      selectFilter(facet, { id, value, label })
                      " />
                  <div class="w-8 h-8 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
                    :style="{ backgroundColor: htmlColor }"></div>
                  <span class="mt-1 text-xs text-gray-600">{{ label }}</span>
                </SfListItem>
              </div>
            </template>
          </SfAccordionItem>
        </li>
      </ul>

    </div>
  </aside>
</template>

<style lang="scss">
.scale-102 {
  transform: scale(3.02);
}

.sf-accordion-item {
  &__content {
    @apply bg-white;
  }
}

.sf-chip {
  @apply bg-gray-100 hover:bg-gray-200 text-gray-700;

  &--selected {
    @apply bg-indigo-100 text-indigo-700 border-indigo-600;
  }
}

.sf-button {
  @apply rounded-lg font-medium shadow-sm;

  &--secondary {
    @apply text-gray-700;
  }
}

.sf-radio {
  &__container {
    @apply relative flex items-center;
  }

  &__input {
    @apply w-4 h-4 border-2 border-gray-300 rounded-full;

    &:checked {
      @apply border-indigo-600 bg-indigo-600;

      &::after {
        content: '';
        @apply absolute w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
      }
    }
  }
}
</style>
