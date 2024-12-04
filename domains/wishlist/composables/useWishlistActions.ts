// composables/useWishlistActions.ts
import { ref, computed } from 'vue'
import { useWishlist } from '@/domains/wishlist/composables/useWishlist'

export function useWishlistActions(productId: number) {
  const { wishlistAddItem, wishlistRemoveItem, isInWishlist } = useWishlist()
  const isProcessing = ref(false)
  const error = ref<string | null>(null)

  const toggleWishlist = async () => {
    if (isProcessing.value) return

    try {
      isProcessing.value = true
      error.value = null

      if (!productId) {
        throw new Error('Product ID is required')
      }

      if (isInWishlist.value) {
        await wishlistRemoveItem(productId)
      } else {
        await wishlistAddItem(productId)
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred'
      console.error('Wishlist operation failed:', e)
    } finally {
      isProcessing.value = false
    }
  }

  const wishlistButtonLabel = computed(() => {
    return isInWishlist.value ? 'removeFromWishlist' : 'addToWishlist'
  })

  const wishlistIconClass = computed(() => ({
    'fas': true,
    'fa-heart': isInWishlist.value,
    'fa-heart-o': !isInWishlist.value,
    'opacity-50': isProcessing.value
  }))

  return {
    toggleWishlist,
    isProcessing,
    error,
    wishlistButtonLabel,
    wishlistIconClass,
    isInWishlist
  }
}
