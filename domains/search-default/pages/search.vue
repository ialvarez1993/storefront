<script setup lang="ts">
import SearchInputBig from "../components/SearchInputBig.vue"
import LazyUiProductCard2 from "../../core/components/ui/ProductCard2.vue";
import {
  SfButton,
  SfIconTune,
  useDisclosure,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import type { Product } from "~/graphql";
import { useNuxtApp } from "#app";

// Nuevo composable para manejar el responsive design
const useScreen = () => {
  const width = ref(0);

  const updateWidth = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    updateWidth();
    window.addEventListener("resize", updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateWidth);
  });

  return {
    isWideScreen: computed(() => width.value >= 1024), // lg breakpoint
    isTabletScreen: computed(() => width.value >= 768 && width.value < 1024), // md breakpoint
    width,
  };
};

const route = useRoute();
const { isOpen, open, close } = useDisclosure();
const { isWideScreen, isTabletScreen } = useScreen();

// searching on odoo with query params
const {
  loading,
  totalItems,
  organizedAttributes,
  categories,
  loadProductTemplateList,
  productTemplateList,
} = useProductTemplateList(route.fullPath, route.fullPath);

const { getFacetsFromURL } = useUiHelpers();
const { getRegularPrice, getSpecialPrice } = useProductAttributes();

const breadcrumbs = [
  { name: "Home", link: "/" },
  { name: "Search", link: "/" },
];

const maxVisiblePages = useState("search-page-max-visible", () => 1);
const setMaxVisiblePages = (isWide: boolean) =>
  (maxVisiblePages.value = isWide ? 5 : 1);

// Mejora en los watchers usando watchEffect
watchEffect(() => {
  setMaxVisiblePages(isWideScreen.value);
  if (isTabletScreen.value && isOpen.value) {
    close();
  }
});

// Watcher mejorado para la ruta
watch(
  () => route.fullPath,
  async () => {
    await loadProductTemplateList(getFacetsFromURL(route.query));
  },
  { immediate: true },
);

const pagination = computed(() => ({
  currentPage: Number(route?.query?.page) || 1,
  totalPages: Math.ceil(totalItems.value / 12) || 1,
  totalItems: totalItems.value,
  itemsPerPage: 12,
  pageOptions: [5, 12, 15, 20],
}));

// El onMounted ya no es necesario porque el watchEffect se encarga de esto
</script>

<template>
  <div class="pb-20 mt-56 mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-5" />
    <h1 class="font-bold typography-headline-3 md:typography-headline-2 mb-10">
      {{ $t("resultsQuerySearch") }} "{{ route.query.search }}"
    </h1>
    <div class="grid grid-cols-12 lg:gap-x-6">
      <!-- Sidebar -->
      <div class="col-span-12 lg:col-span-4 xl:col-span-3">
        <CategoryFilterSidebar class="hidden lg:block" :attributes="organizedAttributes" :categories="categories" />
        <LazyCategoryMobileSidebar :is-open="isOpen" @close="close">
          <template #default>
            <CategoryFilterSidebar class="block lg:hidden" :attributes="organizedAttributes" :categories="categories"
              @close="close" />
          </template>
        </LazyCategoryMobileSidebar>
      </div>
      <!-- Main Content -->
      <div class="col-span-12 mt-[2rem] lg:mt-[0rem] top-[0rem]  lg:top-[23rem] lg:col-span-8 xl:col-span-9">
        <SearchInputBig />
        <template v-if="!loading">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg">
              {{ totalItems }} Products
            </span>
            <SfButton variant="tertiary" class="lg:hidden whitespace-nowrap" @click="open">
              <template #prefix>
                <SfIconTune />
              </template>
              Filter
            </SfButton>
          </div>

          <section v-if="totalItems > 0" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            <LazyUiProductCard2 v-for="productTemplate in productTemplateList" :key="productTemplate.id"
              :name="productTemplate?.name || ''" loading="eager" :slug="mountUrlSlugForProductVariant(
                (productTemplate.firstVariant || productTemplate) as Product,
              )
                " :image-url="$getImage(
                  String(productTemplate.image),
                  370,
                  370,
                  String(productTemplate.imageFilename),
                )
                  " :image-alt="productTemplate?.name || ''" :regular-price="getRegularPrice(productTemplate.firstVariant as Product) || 250
                    " :special-price="getSpecialPrice(productTemplate.firstVariant as Product)
                      " :rating-count="123" :rating="Number(4)"
              :first-variant="productTemplate.firstVariant as Product" />
          </section>
          <CategoryEmptyState v-else />

          <LazyUiPagination v-if="pagination.totalPages > 1" class="mt-5" v-bind="pagination"
            :max-visible-pages="maxVisiblePages" />
        </template>
        <template v-else>
          <div class="flex justify-center items-center min-h-[200px]">
            <SfLoaderCircular size="base" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
