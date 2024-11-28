import { onClickOutside, useToggle } from "@vueuse/core";
import type { Product } from "~/graphql";

/**
 * @Responsabilities
 *  1 - FETCH from odoo
 *  2 - Higlighth the results
 *  3 - Handle modal state
 */
const useAltSearch = (formAltSearchRef?: any) => {
  const route = useRoute();
  const router = useRouter();

  // search modal
  const altSearchModalClose = () => altSearchModalToggle(false);
  const altSearchModalOpen = useState("alt-search-ref", () => false);
  const altSearchModalToggle = useToggle(altSearchModalOpen);
  const isAltSearchModalOpen = computed(() => altSearchModalOpen.value);

  // odoo search
  const {
    loadProductTemplateList,
    productTemplateList,
    totalItems,
    organizedAttributes,
    categories,
  } = useProductTemplateList(route.fullPath, route.fullPath);
  const altSearchInputValue = useState("alt-search-input", () => "");
  const altHighlightedIndex = ref(-1);
  const showAltResultSearch = ref(false);
  const altLoading = ref(false);

  watch(
    () => route.query,
    () => {
      altSearchInputValue.value = "";
    },
  );

  const altSearch = async () => {
    altLoading.value = true;

    if (altSearchInputValue.value.length < 3) {
      return;
    }

    await loadProductTemplateList(
      {
        search: altSearchInputValue.value,
        pageSize: 12,
      },
      true,
    );

    showAltResultSearch.value = true;
    altSearchModalOpen.value = true;

    altLoading.value = false;
  };

  const altSearchHits = computed(() => productTemplateList.value || []);

  const altEnterPress = () => {
    if (!altSearchInputValue.value) return;
    showAltResultSearch.value = false;
    altSearchModalOpen.value = false;
    router.push(`/search?search=${altSearchInputValue.value}`);
  };

  const altSelectHit = (selected: Product) => {
    if (!altSearchInputValue.value) return;
    showAltResultSearch.value = false;
    altSearchModalOpen.value = false;
    router.push(String(selected.slug));
  };

  const altHighlightPrevious = () => {
    if (altHighlightedIndex.value === 0) {
      altHighlightedIndex.value = productTemplateList.value?.length - 1;
    } else {
      altHighlightedIndex.value -= 1;
    }
  };

  const altHighlightNext = () => {
    if (altHighlightedIndex.value === altSearchHits.value.length - 1) {
      altHighlightedIndex.value = 0;
    } else {
      altHighlightedIndex.value += 1;
    }
  };

  onClickOutside(formAltSearchRef, () => {
    showAltResultSearch.value = false;
  });

  return {
    // search modal
    altSearchModalClose,
    isAltSearchModalOpen,
    altSearchModalOpen,
    altSearchModalToggle,

    // odoo search
    altLoading,
    altSearchInputValue,
    altHighlightNext,
    altHighlightPrevious,
    altHighlightedIndex,
    altSearch,
    altSelectHit,
    showAltResultSearch,
    altSearchHits,
    totalItems,
    organizedAttributes,
    categories,
    productTemplateList,
    altEnterPress,
  };
};

export default useAltSearch;
