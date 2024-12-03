<script setup lang="ts">
import {
  SfButton,
  SfChip,
  SfCounter,
  SfIconCompareArrows,
  SfIconFavorite,
  SfIconFavoriteFilled,
  SfIconPackage,
  SfIconSafetyCheck,
  SfIconSell,
  SfIconShoppingCart,
  SfIconShoppingCartCheckout,
  SfIconWarehouse,
  SfLink,
  SfRating,
  SfThumbnail,
} from "@storefront-ui/vue";
import type { LocationQueryRaw } from "vue-router";
import type { OrderLine, Product } from "~/graphql";
import LazyUiGallery from "../../../core/components/ui/Gallery.vue";
import ProductView from "../../components/ProductView.vue";
import ProductInfoData from "../../components/ProductInfoData.vue";

const route = useRoute();
const router = useRouter();
const { list } = useRecentViewProducts();

const {
  loadProductTemplate,
  productTemplate,
  loadingProductTemplate,
  getAllColors,
  getAllMaterials,
  getAllSizes,
} = useProductTemplate(route.path);
const {
  loadProductVariant,
  loadingProductVariant,
  productVariant,
  getImages,
  breadcrumbs,
  getRegularPrice,
  getSpecialPrice,
} = useProductVariant(route.fullPath);
const { addProductToRecentViews } = useRecentViewProducts();
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist();
const { cart, cartAdd } = useCart();

useHead(productHead(productVariant.value, String(route.fullPath)));

const params = computed(() => ({
  combinationId: Object.values(route.query)?.map((value) =>
    parseInt(value as string),
  ),
  productTemplateId: productTemplate?.value?.id,
}));

const selectedSize = computed(() =>
  route.query.Size ? Number(route.query.Size) : getAllSizes?.value?.[0]?.value,
);

const selectedColor = computed(() =>
  route.query.Color
    ? Number(route.query.Color)
    : getAllColors?.value?.[0]?.value,
);

const selectedMaterial = computed(() =>
  route.query.Material
    ? Number(route.query.Material)
    : getAllMaterials?.value?.[0]?.value,
);

const productDetailsOpen = ref(true);
const quantitySelectorValue = ref(1);

const updateFilter = async (filter: LocationQueryRaw | undefined) => {
  const query: LocationQueryRaw = {};

  if (selectedMaterial.value && selectedMaterial.value !== 0) {
    query.Material = selectedMaterial.value;
  }

  if (selectedColor.value && selectedColor.value !== 0) {
    query.Color = selectedColor.value;
  }

  if (selectedSize.value && selectedSize.value !== 0) {
    query.Size = selectedSize.value;
  }

  Object.assign(query, filter);
  await navigateTo({ query });
};

const tomorrow = computed(() => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toDateString().slice(0, 10);
});

const productsInCart = computed(() => {
  return (
    cart.value?.order?.orderLines?.find(
      (orderLine: OrderLine) =>
        orderLine.product?.id === productVariant?.value.id,
    )?.quantity || 0
  );
});

const handleCartAdd = async () => {
  let id = productVariant?.value.id;
  if (!productVariant.value.combinationInfoVariant) {
    id = Number(productVariant?.value.firstVariant?.id);
  }
  await cartAdd(id, quantitySelectorValue.value);
};

const handleWishlistAddItem = async (firstVariant: Product) => {
  await wishlistAddItem(firstVariant.id);
};

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id);
};

await loadProductTemplate({ slug: route.path });
await loadProductVariant(params.value);

addProductToRecentViews(productTemplate.value.id);
</script>

<template>
  <NuxtErrorBoundary>
    <section>
      <div class="!mx-[4rem] mt-[12rem]" v-if="productTemplate?.id && !loadingProductTemplate">
        <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mt-5 mb-10 cursor-pointer" />
      </div>
      <ProductInfoData />
      <ProductSlider :text="$t('recommendWithThis')" />
    </section>
    <section class="pb-16" v-if="list?.length > 0">
      <ClientOnly>
        <LazyProductSlider :heading="$t('recentViews')" :ids="list" key="recent-views"
          key-for-composable="recent-views" />
      </ClientOnly>
    </section>
    <template #error="{ error }">
      <div>
        <NuxtImg src="/images/hp.png" :alt="$t('emptyStateAltText')" width="300" height="300" />
        <p class="mt-8 font-medium">{{ $t("emptyStateText") }}</p>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
