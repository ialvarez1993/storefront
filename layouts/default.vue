<script lang="ts" setup></script>

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
  </div>
</template>
