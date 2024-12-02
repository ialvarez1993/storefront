<script setup lang="ts">
import { useWebsiteHomePage } from "~/domains/core/composable/useWebsiteHomePage";

const { loadCategoryList, categories } = useCategory();
const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage();

await getWebsiteHomepage();
await loadCategoryList({
  filter: { parent: true, id: null },
});
useHead(websiteHomepageHead(websiteHomepage.value, ""));
</script>

<template>
  <MainBanner />
  <FeatureBox />
  <section class="pb-16">
    <NuxtLazyHydrate when-visible>
      <LazyProductSlider
        key="inspired-by-picks"
        :heading="$t('heading.discount')"
        key-for-composable="inspired-by-picks"
      />
    </NuxtLazyHydrate>
  </section>
  <CategoryCard :categories="categories" />
  <NuxtLazyHydrate when-visible>
    <LazyDisplay />
  </NuxtLazyHydrate>
</template>
