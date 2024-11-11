<script setup lang="ts">
import type { LocationQueryRaw } from 'vue-router'
import type { OrderLine, Product } from '~/graphql'

const route = useRoute()
const router = useRouter()
const { list } = useRecentViewProducts()

const {
  loadProductTemplate,
  productTemplate,
  loadingProductTemplate,
  getAllColors,
  getAllMaterials,
  getAllSizes
} = useProductTemplate(route.path)
const {
  loadProductVariant,
  loadingProductVariant,
  productVariant,
  getImages,
  breadcrumbs,
  getRegularPrice,
  getSpecialPrice
} = useProductVariant(route.fullPath)
const { addProductToRecentViews } = useRecentViewProducts()
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist()
const { cart, cartAdd } = useCart()

useHead(productHead(productVariant.value, String(route.fullPath)))

const params = computed(() => ({
  combinationId: Object.values(route.query)?.map((value) => parseInt(value as string)),
  productTemplateId: productTemplate?.value?.id
}))

const selectedSize = computed(() =>
  route.query.Size ? Number(route.query.Size) : getAllSizes?.value?.[0]?.value
)

const selectedColor = computed(() =>
  route.query.Color ? Number(route.query.Color) : getAllColors?.value?.[0]?.value
)

const selectedMaterial = computed(() =>
  route.query.Material ? Number(route.query.Material) : getAllMaterials?.value?.[0]?.value
)

const productDetailsOpen = ref(true)
const quantitySelectorValue = ref(1)

const updateFilter = async (filter: LocationQueryRaw | undefined) => {
  const query: LocationQueryRaw = {}

  if (selectedMaterial.value && selectedMaterial.value !== 0) {
    query.Material = selectedMaterial.value
  }

  if (selectedColor.value && selectedColor.value !== 0) {
    query.Color = selectedColor.value
  }

  if (selectedSize.value && selectedSize.value !== 0) {
    query.Size = selectedSize.value
  }

  Object.assign(query, filter)
  await navigateTo({ query })
}

const tomorrow = computed(() => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  return date.toDateString().slice(0, 10)
})

const productsInCart = computed(() => {
  return (
    cart.value?.order?.orderLines?.find(
      (orderLine: OrderLine) => orderLine.product?.id === productVariant?.value.id
    )?.quantity || 0
  )
})

const handleCartAdd = async () => {
  let id = productVariant?.value.id
  if (!productVariant.value.combinationInfoVariant) {
    id = Number(productVariant?.value.firstVariant?.id)
  }
  await cartAdd(id, quantitySelectorValue.value)
}

const handleWishlistAddItem = async (firstVariant: Product) => {
  await wishlistAddItem(firstVariant.id)
}

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id)
}

addProductToRecentViews(productTemplate.value?.id)

await loadProductTemplate({ slug: route.path })
await loadProductVariant(params.value)
</script>

<template>
  <NuxtErrorBoundary>
    <div v-if="productTemplate?.id && !loadingProductTemplate">
      <UiBreadcrumb :breadcrumbs="breadcrumbs" class="self-start mb-10 cursor-pointer" />
      <div class="md:grid grid-areas-product-page mt-[8rem] grid-cols-product-page gap-x-6">
        <section class="grid-in-left-top md:h-full xl:max-h-[700px]">
          {{ getImages }}
          <ProductView :images="getImages" />
        </section>
        <section class="col-span-5 grid-in-right md:mb-0">
          <div
            class="p-6 xl:p-6 md:border md:border-neutral-100 md:shadow-lg md:rounded-md md:sticky md:top-20"
            data-testid="purchase-card"
          >
            <div
              class="inline-flex items-center justify-center font-medium rounded-none bg-secondary-800 text-sm p-1.5 gap-1 mb-4"
            >
              <span class="mr-1 text-white">{{ $t(`sale`) }}</span>
            </div>
            <h1 class="mb-1 font-bold typography-headline-4" data-testid="product-name">
              {{ productVariant?.name }}
            </h1>
            <div
              v-if="productVariant && productVariant?.combinationInfoVariant?.has_discounted_price"
              class="my-1"
            >
              <span
                class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
                data-testid="price"
              >
                {{ $currency(getSpecialPrice) }}
              </span>
              <span class="text-base font-normal text-neutral-500 line-through">
                {{ $currency(getRegularPrice) }}
              </span>
            </div>
            <div v-else class="my-1">
              <span
                class="mr-2 text-secondary-700 font-bold font-headings text-2xl"
                data-testid="price"
              >
                {{ $currency(getRegularPrice) }}
              </span>
            </div>
            <div class="inline-flex items-center mt-4 mb-2"></div>
            <p class="mb-4 font-normal typography-text-sm" data-testid="product-description">
              {{ productVariant?.description }}
            </p>
            <div class="py-4 mb-4 border-gray-200 border-y">
              <div
                v-show="productsInCart"
                class="w-full mb-4 bg-primary-200 p-2 rounded-md text-center text-primary-700"
              >
                {{ productsInCart }} products in cart
              </div>
              <div class="flex flex-col md:flex-row flex-wrap gap-4">
                <UiQuantitySelector
                  v-model="quantitySelectorValue"
                  :value="quantitySelectorValue"
                  class="min-w-[145px] flex-grow flex-shrink-0 basis-0"
                />
              </div>
              <div class="flex justify-center mt-4 gap-x-4"></div>
            </div>
            <div class="flex first:mt-4">
              <p class="text-sm">
                <i18n-t keypath="additionalInfo.shipping" scope="global">
                  <template #date>
                    {{ tomorrow }}
                  </template>
                  <template #addAddress> </template>
                </i18n-t>
              </p>
            </div>
            <div class="flex mt-4">
              <p class="text-sm">
                <i18n-t keypath="additionalInfo.pickup" scope="global">
                  <template #checkAvailability> </template>
                </i18n-t>
              </p>
            </div>
            <div class="flex mt-4">
              <i18n-t keypath="additionalInfo.returns" scope="global">
                <template #details> </template>
              </i18n-t>
            </div>
          </div>
        </section>
        <section class="grid-in-left-bottom md:mt-8">
          <UiDivider class="mt-10 mb-6" />
          <div class="lg:px-4" data-testid="product-properties">
            <fieldset v-if="getAllSizes && getAllSizes?.length" class="pb-4 flex">
              <legend class="block mb-2 text-base font-medium leading-6 text-neutral-900">
                Size
              </legend>
              <span
                v-for="{ label, value } in getAllSizes"
                :key="value"
                class="mr-2 mb-2 uppercase"
              >
              </span>
            </fieldset>
            <fieldset v-if="getAllMaterials && getAllMaterials?.length" class="pb-4 flex">
              <legend class="block mb-2 text-base font-medium leading-6 text-neutral-900">
                Material
              </legend>
              <span
                v-for="{ label, value } in getAllMaterials"
                :key="value"
                class="mr-2 mb-2 uppercase"
              >
              </span>
            </fieldset>
            <fieldset v-if="getAllColors && getAllColors?.length" class="pb-2 flex">
              <legend class="block mb-2 text-base font-medium leading-6 text-neutral-900">
                Color
              </legend>
              <span
                v-for="{ label, value } in getAllColors"
                :key="value"
                class="mr-2 mb-2 uppercase"
              >
              </span>
            </fieldset>
          </div>
          <UiDivider class="my-4 md:mt-6" />
          <div data-testid="product-accordion">
            <UiAccordionItem
              v-model="productDetailsOpen"
              summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
            >
              <template #summary>
                <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                  {{ $t('productDetails') }}
                </h2>
              </template>
              <p>
                {{ productVariant?.description }}
              </p>
            </UiAccordionItem>
            <UiDivider class="my-4" />
            <UiAccordionItem
              summary-class="md:rounded-md w-full hover:bg-neutral-100 py-2 lg:pl-4 pr-3 flex justify-between items-center"
            >
              <template #summary>
                <h2 class="font-bold font-headings text-lg leading-6 md:text-2xl">
                  {{ $t('customerReviews') }}
                </h2>
              </template>
              <p>Lightweight • Non slip • Flexible outsole • Easy to wear on and off</p>
            </UiAccordionItem>
          </div>
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
        <p class="mt-8 font-medium">{{ $t('emptyStateText') }}</p>
      </div>
    </template>
  </NuxtErrorBoundary>
</template>
