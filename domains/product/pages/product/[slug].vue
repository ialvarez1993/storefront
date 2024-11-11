<script setup lang="ts">
import type { LocationQueryRaw } from "vue-router";
import type { OrderLine, Product } from "~/graphql";

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

addProductToRecentViews(productTemplate.value?.id);

await loadProductTemplate({ slug: route.path });
await loadProductVariant(params.value);
</script>

<template>
  <NuxtErrorBoundary>
    <div v-if="productTemplate?.id && !loadingProductTemplate">
      <UiBreadcrumb
        :breadcrumbs="breadcrumbs"
        class="self-start mb-10 cursor-pointer"
      />
      <div
        class="md:grid grid-areas-product-page mt-[8rem] grid-cols-product-page gap-x-6"
      >
        <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
          <ProductView :images="getImages" />
        </section>

        <UiDivider class="mt-4 mb-2" />
      </div>
      <section class="lg:mx-4 mt-28 mb-20">
        <ProductSlider :text="$t('recommendWithThis')" />
      </section>
      <section v-if="list?.length > 0" class="pb-16">
        <ClientOnly>
          <LazyProductSlider
            key="recent-views"
            :heading="$t('recentViews')"
            :ids="list"
            key-for-composable="recent-views"
          />
        </ClientOnly>
      </section>
    </div>
    <template #error="{ error }">
      <div>
        <NuxtImg
          src="/images/something-went-wrong.svg"
          :alt="$t('emptyStateAltText')"
          width="300"
          height="300"
        />
        <p class="mt-8 font-medium">{{ $t("emptyStateText") }}</p>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
