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
    <div class="sf-product__image-wrapper">
      <div class="sf-product__image-container">
        <a :to="slug" class="sf-product__image-link">
          <NuxtImg
            :src="imageUrl"
            :alt="imageAlt"
            :width="370"
            :height="370"
            class="sf-product__image"
          />
          <div class="sf-product__image-overlay">
            <div class="sf-product__quick-view">
              <NuxtLink :to="slug">Quick View</NuxtLink>
            </div>
          </div>
        </a>

        <SfButton
          type="button"
          variant="tertiary"
          size="sm"
          square
          :class="[
            'sf-product__wishlist-btn',
            {
              'sf-product__wishlist-btn--active': isInWishlist(
                firstVariant?.id,
              ),
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
          <span class="sf-product__discount-text">
            {{
              Math.round(((regularPrice - specialPrice) / regularPrice) * 100)
            }}% OFF
          </span>
        </div>
      </div>
    </div>

    <div class="sf-product__content">
      <NuxtLink :to="slug" class="sf-product__title">
        <span class="sf-product__title-text">{{ name }}</span>
      </NuxtLink>

      <div class="sf-product__rating-container">
        <SfRating
          size="xs"
          :value="rating ?? 0"
          :max="5"
          class="sf-product__rating"
        />
        <SfCounter size="xs" class="sf-product__rating-count">
          ({{ ratingCount }})
        </SfCounter>
      </div>

      <p v-if="description" class="sf-product__description">
        {{ description }}
      </p>

      <div class="sf-product__footer !hidden">
        <div class="sf-product__price-wrapper">
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
        </div>

        <SfButton
          type="button"
          size="sm"
          class="sf-product__add-to-cart"
          @click="cartAdd(firstVariant?.id, 1)"
        >
          <SfIconShoppingCart size="lg" class="sf-product__cart-icon" />
          <span class="sf-product__cart-text">Add to Cart</span>
        </SfButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sf-product {
  $self: &;
  position: relative;
  border-radius: 1rem;
  background-color: #ffffff;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    border-radius: 0.75rem;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);

    #{$self}__image {
      transform: scale(1.08);
    }

    #{$self}__image-overlay {
      opacity: 1;
    }

    #{$self}__quick-view {
      transform: translateY(0);
      opacity: 1;
    }
  }

  &__image-wrapper {
    position: relative;
    overflow: hidden;
  }

  &__image-container {
    position: relative;
    aspect-ratio: 1 / 1;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.1),
      rgba(0, 0, 0, 0.3)
    );
    opacity: 0;
    transition: all 0.4s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__quick-view {
    background: rgba(255, 255, 255, 0.95);
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    font-weight: 600;
    font-size: 0.875rem;
    color: #1f2937;
    cursor: pointer;

    &:hover {
      background: #ffffff;
      transform: translateY(-2px);
    }
  }

  &__wishlist-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
      background: #ffffff;
    }

    &--active {
      background: #fee2e2;
    }
  }

  &__wishlist-icon {
    color: #6b7280;
    transition: color 0.3s ease;

    &--filled {
      color: #ef4444;
    }
  }

  &__discount-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: linear-gradient(45deg, #ef4444, #dc2626);
    padding: 0.5rem 1rem;
    border-radius: 2rem;
    box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3);
  }

  &__discount-text {
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
  }

  &__content {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title {
    text-decoration: none;

    &-text {
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.3s ease;

      &:hover {
        color: #fbbf24;
      }
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
    font-size: 0.875rem;
  }

  &__description {
    font-size: 0.875rem;
    line-height: 1.6;
    color: #4b5563;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  &__price-wrapper {
    display: flex;
    flex-direction: column;
  }

  &__price-container {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__price-original {
    font-size: 0.875rem;
    color: #6b7280;
    text-decoration: line-through;
  }

  &__price-current {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;

    &--special {
      color: #dc2626;
    }
  }

  &__add-to-cart {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    border-radius: 2rem;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(251, 191, 36, 0.4);
      background: linear-gradient(45deg, #f59e0b, #d97706);
    }

    @media (max-width: 768px) {
      padding: 0.5rem 1rem;
    }
  }

  &__cart-icon {
    color: #ffffff;
  }

  &__cart-text {
    color: #ffffff;
    font-weight: 600;
    font-size: 0.875rem;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-enter-active {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes pulseHeart {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.sf-product__wishlist-btn--active .sf-product__wishlist-icon--filled {
  animation: pulseHeart 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
