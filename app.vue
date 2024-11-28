<script setup>
</script>
<template>
  <div class="h-screen justify-center align-middle">
    <NuxtLoadingIndicator color="yellow" :height="4" />

    <NuxtLayout>
      <NuxtPage :page-key="(route) => route.fullPath" />
    </NuxtLayout>
  </div>
</template>
