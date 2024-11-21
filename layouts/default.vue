<script lang="ts" setup>
const isDev = process.dev;
</script>

<template>
  <div class="font-sass">
    <TheHeader />

    <main class="w-full narrow-container bg-white">
      <slot></slot>
    </main>

    <LazyNewsletter />
    <NuxtLazyHydrate when-visible>
      <LazyTheFooter />
    </NuxtLazyHydrate>

    <WishlistSidebar />
    <VueQueryDevTools v-if="isDev" />
  </div>
</template>
