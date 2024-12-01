<script setup lang="ts">
import {
  SfButton,
  SfIconTune,
  useDisclosure,
  SfLoaderCircular,
} from "@storefront-ui/vue";
import type { Product } from "~/graphql";

import { useProductAttributes } from "../../../../domains/product/composables/useProductAttributes";


const route = useRoute();
const { isMobile, isDesktopOrTablet } = useDevice();

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

const { isWideScreen, isTabletScreen } = useScreen();

const { isOpen, open, close } = useDisclosure();
const {
  loadProductTemplateList,
  organizedAttributes,
  loading,
  productTemplateList,
  totalItems,
  categories,
} = useProductTemplateList(route.path, String(route.fullPath));

const {
  loadCategory,
  category,
  loading: categoryLoading,
} = useCategory(String(route.fullPath));

const { getRegularPrice, getSpecialPrice } = useProductAttributes();
const { getFacetsFromURL } = useUiHelpers();

const breadcrumbs = [
  { name: "Home", link: "/" },
  { name: "Category", link: `Category/${route.params.id}` },
];

const maxVisiblePages = useState("category-max-visible-pages", () => 1);
const setMaxVisiblePages = (isWide: boolean) =>
  (maxVisiblePages.value = isWide ? 5 : 1);

watch(isWideScreen, (value) => setMaxVisiblePages(value));
watch(isTabletScreen, (value) => {
  if (value && isOpen.value) {
    close();
  }
});

watch(
  () => route,
  async () => {
    await loadProductTemplateList(getFacetsFromURL(route.query));
  },
  { deep: true, immediate: true },
);

const pagination = computed(() => ({
  currentPage: route?.query?.page ? Number(route.query.page) : 1,
  totalPages: Math.ceil(totalItems.value / 12) || 1,
  totalItems: totalItems.value,
  itemsPerPage: 12,
  pageOptions: [5, 12, 15, 20],
}));

const params = route.params as { id?: string | number; slug?: string };

if (params.id) {
  await loadCategory({
    id: Number(params.id),
    slug: String(route.path),
  });
}

if (category.value) {
  useHead(categoryHead(category.value, String(route.fullPath)));
}

setMaxVisiblePages(isWideScreen.value);
</script>
<template>
  <div class="pb-20 !mt-[15rem] mx-[5rem]">
    <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-5" />
    <div class="grid grid-cols-12 lg:gap-x-6">
      <div class="col-span-12 lg:col-span-4 xl:col-span-3">
        <LazyCategoryFilterSidebar v-show="isDesktopOrTablet" :attributes="organizedAttributes"
          :categories="categories" />
        <LazyCategoryMobileSidebar v-show="isMobile" :is-open="isOpen" @close="close">
          <template #default>
            <CategoryFilterSidebar class="block lg:hidden" :attributes="organizedAttributes" :categories="categories"
              @close="close" />
          </template>
        </LazyCategoryMobileSidebar>
      </div>
      <div class="col-span-12  lg:col-span-8 xl:col-span-9">
        <div v-if="!loading">
          <div class="flex  justify-between items-center mb-6">
            <span class="font-bold font-headings md:text-lg">{{ totalItems }} Products
            </span>
            <SfButton variant="tertiary" class="lg:hidden whitespace-nowrap" @click="open">
              <template #prefix>
                <SfIconTune />
              </template>
            </SfButton>
          </div>
          <div class="category-banner -mt-[5rem] relative overflow-hidden rounded-lg">
            <div class="banner-container aspect-[1350/372]">
              <!-- Imagen de fondo -->
              <NuxtImg src="/images/bannerCategoria2.png" alt="Título de categoría"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105" />

              <!-- Overlay para mejorar legibilidad del texto -->
              <div class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

              <!-- Contenido del banner -->
              <div class="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                <h2 class="text-2xl md:text-4xl font-bold text-white mb-2 max-w-xl">
                  Category: {{ category.name }}
                </h2>
              </div>
            </div>
          </div>
          <section v-if="productTemplateList.length > 0"
            class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            <LazyUiProductCard v-for="productTemplate in productTemplateList" :key="productTemplate.id"
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
          <CategoryEmptyState v-else :page="pagination.currentPage" />
          <LazyUiPagination v-if="pagination.totalPages > 1" class="mt-5" :current-page="pagination.currentPage"
            :total-items="pagination.totalItems" :page-size="pagination.itemsPerPage"
            :max-visible-pages="maxVisiblePages" />
        </div>
        <div v-else class="w-full text-center">
          <SfLoaderCircular size="xl" class="mt-[160px]" />
        </div>
      </div>
    </div>
  </div>
</template>
