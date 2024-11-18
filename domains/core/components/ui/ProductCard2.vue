<script lang="ts" setup>
import {
  SfRating,
  SfCounter,
  SfButton,
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconFavoriteFilled,
} from "@storefront-ui/vue";
import type { Product } from "~/graphql";

defineProps({
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
    type: Object,
    required: false,
  },
  loading: {
    type: String as PropType<"eager" | "lazy" | undefined>,
    required: false,
    default: "lazy",
  },
});

const { cartAdd } = useCart();
const { wishlistAddItem, isInWishlist, wishlistRemoveItem } = useWishlist();

const handleWishlistAddItem = async (firstVariant: Product) => {
  await wishlistAddItem(firstVariant.id);
};

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id);
};
</script>

<template>
  <div class="sf-product">
    <div class="sf-product__image-container">
      <a :to="slug" class="sf-product__image-link">
        <NuxtImg
          :src="imageUrl"
          :alt="imageAlt"
          :width="370"
          :height="370"
          class="sf-product__image"
        />
        <div class="sf-product__image-overlay"></div>
      </a>

      <SfButton
        type="button"
        variant="tertiary"
        size="sm"
        square
        :class="[
          'sf-product__wishlist-btn',
          {
            'sf-product__wishlist-btn--active': isInWishlist(firstVariant?.id),
          },
        ]"
        aria-label="Add to wishlist"
        @click="
          isInWishlist(firstVariant?.id)
            ? handleWishlistRemoveItem(firstVariant as Product)
            : handleWishlistAddItem(firstVariant as Product)
        "
      >
        <SfIconFavoriteFilled
          v-if="isInWishlist(firstVariant?.id)"
          size="sm"
          class="sf-product__wishlist-icon--filled"
        />
        <SfIconFavorite v-else size="sm" class="sf-product__wishlist-icon" />
      </SfButton>

      <div v-if="specialPrice" class="sf-product__discount-badge">
        {{ Math.round(((regularPrice - specialPrice) / regularPrice) * 100) }}%
        OFF
      </div>
    </div>

    <div class="sf-product__content">
      <NuxtLink :to="slug" class="sf-product__title"> {{ name }} </NuxtLink>

      <div class="sf-product__rating-container">
        <SfRating
          size="xs"
          :value="rating ?? 0"
          :max="5"
          class="sf-product__rating"
        />
        <SfCounter size="xs" class="sf-product__rating-count">
          {{ ratingCount }}
        </SfCounter>
      </div>

      <p v-if="description" class="sf-product__description">
        {{ description }}
      </p>

      <div class="sf-product__footer">
        <div class="sf-product__price-container">
          <span v-if="specialPrice" class="sf-product__price-original">
            {{ $currency(regularPrice) }}
          </span>
          <span
            :class="[
              'sf-product__price-current',
              { 'sf-product__price-current--special': specialPrice },
            ]"
          >
            {{ $currency(specialPrice || regularPrice) }}
          </span>
        </div>

        <SfButton
          type="button"
          size="sm"
          class="sf-product__add-to-car hover:!bg-yellow-600 duration-700 !bg-yellow-200"
          @click="cartAdd(firstVariant?.id, 1)"
        >
          <SfIconShoppingCart size="lg" class="!text-black" />
          <span class="text-black">Add to Cart</span>
        </SfButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sf-product {
  $self: &;
  position: relative;
  overflow: hidden;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 330px;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);

    #{$self}__image {
      transform: scale(1.05);
    }

    #{$self}__image-overlay {
      opacity: 1;
    }

    #{$self}__add-to-cart {
      transform: translateY(0);
      opacity: 1;
    }

    #{$self}__content {
      background-color: #f9fafb;
    }
  }

  &__image-container {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
  }

  &__image-link {
    display: block;
    height: 100%;
    width: 100%;
  }

  &__image {
    height: 100%;
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }

  &__image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.2), transparent);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &__wishlist-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: scale(1.1);
      background-color: rgba(254, 242, 242, 0.9);
    }

    &--active {
      background-color: rgba(254, 242, 242, 0.9);
      transform: scale(1.1);
    }
  }

  &__wishlist-icon {
    color: #6b7280;

    &--filled {
      color: #ef4444;
    }
  }

  &__discount-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background-color: #ef4444;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    transition: background-color 0.3s ease-in-out;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: #fbbf24;
    }
  }

  &__rating-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__rating {
    color: #fbbf24;
  }

  &__rating-count {
    color: #6b7280;
  }

  &__description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #4b5563;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  &__price-container {
    display: flex;
    flex-direction: column;
  }

  &__price-original {
    font-size: 0.75rem;
    color: #6b7280;
    text-decoration: line-through;
  }

  &__price-current {
    font-size: 1.125rem;
    font-weight: 700;
    color: #111827;

    &--special {
      color: #dc2626;
    }
  }

  &__add-to-cart {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    border-radius: 9999px;
    background-color: #4f46e5;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    transform: translateY(10px);
    opacity: 0.8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: #4338ca;
      box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active {
  animation: fadeIn 0.3s ease-in-out;
}
</style>
