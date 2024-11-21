<!-- ProductCard.vue -->
<script setup lang="ts">
import {
  SfRating,
  SfCounter,
  SfButton,
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconFavoriteFilled,
} from "@storefront-ui/vue";
import type { Product } from "~/graphql";

const props = defineProps({
  imageUrl: {
    type: String,
    required: true,
  },
  imageAlt: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  ratingCount: {
    type: Number,
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  },
  regularPrice: {
    type: Number,
    required: true,
  },
  specialPrice: {
    type: Number,
    required: false,
  },
  firstVariant: {
    type: Object as PropType<Product>,
    required: false,
  },
  isInWishlist: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: String as PropType<"eager" | "lazy">,
    default: "lazy",
  },
});

const { cartAdd } = useCart();
const { wishlistAddItem, wishlistRemoveItem } = useWishlist();

const handleAddToCart = async () => {
  if (props.firstVariant?.id) {
    await cartAdd(props.firstVariant.id, 1);
  }
};

const toggleWishlist = async () => {
  if (!props.firstVariant?.id) return;

  if (props.isInWishlist) {
    await wishlistRemoveItem(props.firstVariant.id);
  } else {
    await wishlistAddItem(props.firstVariant.id);
  }
};
</script>

<template>
  <div
    class="relative border border-neutral-200 rounded-md hover:shadow-lg min-h-[330px] flex flex-col justify-around"
  >
    <div class="relative">
      <NuxtLink :to="slug">
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          :width="370"
          :height="370"
          class="rounded-md"
          :loading="loading"
        />
      </NuxtLink>

      <SfButton
        type="button"
        variant="tertiary"
        size="sm"
        square
        class="absolute bottom-0 right-0 mr-2 mb-2 bg-white border border-neutral-200 !rounded-full"
        :class="{ '!bg-green-200': isInWishlist }"
        aria-label="Add to wishlist"
        @click="toggleWishlist"
      >
        <SfIconFavoriteFilled v-if="isInWishlist" size="sm" />
        <SfIconFavorite v-else size="sm" />
      </SfButton>
    </div>

    <div
      class="p-2 border-t border-neutral-200 typography-text-sm flex flex-col justify-between gap-1 h-full"
    >
      <NuxtLink
        :to="slug"
        variant="secondary"
        class="no-underline self-start text-left"
      >
        {{ name }}
      </NuxtLink>

      <div v-if="rating" class="flex items-center">
        <SfRating size="xs" :value="rating" :max="5" />
        <SfCounter size="xs">{{ ratingCount }}</SfCounter>
      </div>

      <p
        v-if="description"
        class="block font-normal leading-5 typography-text-sm text-neutral-700"
      >
        {{ description }}
      </p>

      <div class="flex justify-between items-center">
        <div class="block">
          <span class="font-bold typography-text-sm">
            {{ $currency(regularPrice) }}
          </span>
          <span
            v-if="specialPrice"
            class="ml-1.5 font-normal typography-text-xs line-through"
          >
            {{ $currency(specialPrice) }}
          </span>
        </div>

        <SfButton type="button" size="sm" @click="handleAddToCart">
          <template #prefix>
            <SfIconShoppingCart size="sm" />
          </template>
          Add
        </SfButton>
      </div>
    </div>
  </div>
</template>
