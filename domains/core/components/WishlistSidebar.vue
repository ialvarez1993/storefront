<script setup lang="ts">
import {
  SfLoaderCircular,
  SfDrawer,
  SfButton,
  SfIconClose,
  useTrapFocus,
} from "@storefront-ui/vue";
import type { Product } from "~/graphql";

const { wishlist, wishlistRemoveItem, wishlistTotalItems, loading } =
  useWishlist();
const { wishlistSidebarIsOpen, toggleWishlistSideBar } = useWishlistUiState();

const wishlistDrawerRef = ref();
useTrapFocus(wishlistDrawerRef, { activeState: wishlistSidebarIsOpen });

const handleWishlistRemoveItem = async (firstVariant: Product) => {
  await wishlistRemoveItem(firstVariant.id);
};
</script>


<template>
  <div class="w-full">
    <div
      v-if="wishlistSidebarIsOpen"
      class="fixed !w-screen !h-screen inset-0 bg-neutral-500 bg-opacity-50 transition-opacity duration-1000 top-index"
    />
    <div>
      <transition
        enter-active-class="transition duration-500 ease-in-out"
        leave-active-class="transition duration-500 ease-in-out"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <SfDrawer
          ref="wishlistDrawerRef"
          v-model="wishlistSidebarIsOpen"
          :disable-esc="true"
          placement="right"
          class="shadow-none z-[100] w-full lg:w-[420px] bg-white h-screen"
          data-testid="category-sidebar"
        >
          <div class="flex flex-col h-full">
            <!-- Header -->
            <div class="p-4 flex justify-between items-center border-b border-neutral-200">
              <span class="font-bold text-lg text-black">
                Wishlist
                <span v-if="wishlistTotalItems > 0" class="ml-2 text-sm text-neutral-500">
                  ({{ wishlistTotalItems }})
                </span>
              </span>
              <SfButton
                variant="tertiary"
                :aria-label="$t('closeListSettings')"
                @click.prevent="toggleWishlistSideBar()"
                class="hover:bg-neutral-100 transition-colors"
              >
                <template #prefix>
                  <SfIconClose class="text-neutral-500" />
                </template>
              </SfButton>
            </div>

            <!-- Content -->
            <div class="flex-1 overflow-hidden">
              <div v-if="!loading" class="h-full">
                <div
                  v-if="wishlistTotalItems > 0"
                  class="h-full overflow-y-auto px-4"
                >
                  <div class="flex items-center font-medium py-4">
                    <p class="text-gray-600 mr-1">Number of products:</p>
                    {{ wishlistTotalItems }}
                  </div>
                  <div class="space-y-4 pb-4">
                    <div
                      v-for="item in wishlist?.wishlistItems || []"
                      :key="item?.id"
                    >
                      <WishlistCollectedProductCard
                        :product="item?.product as Product"
                        @remove-from-wishlist="handleWishlistRemoveItem(item?.product as Product)"
                      />
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="flex items-center justify-center flex-col text-black h-full p-4"
                  data-testid="cart-page-content"
                >
                  <NuxtImg
                    src="/images/empty-cart.svg"
                    :alt="$t('emptyCartImgAlt')"
                    width="192"
                    height="192"
                    loading="lazy"
                    class="mb-6"
                  />
                  <h2 class="font-medium">Your Wishlist is empty</h2>
                </div>
              </div>

              <!-- Loading State -->
              <div
                v-else
                class="flex-1 flex items-center justify-center h-full"
              >
                <SfLoaderCircular size="lg" />
              </div>
            </div>
          </div>
        </SfDrawer>
      </transition>
    </div>
  </div>
</template>
