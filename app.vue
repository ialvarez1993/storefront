<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();

const baseUrl = runtimeConfig.public.apiUrlStrapi.endsWith("/")
  ? runtimeConfig.public.apiUrlStrapi.slice(0, -1)
  : runtimeConfig.public.apiUrlStrapi;

import { useI18n } from "vue-i18n";
const { locale, setLocale } = useI18n();
const currentLang = locale.value; // 'es' o 'en'
const { $fetchApi } = useNuxtApp();

// Inicializar favicon como string en lugar de objeto
const favicon = ref<string | null>(null);

const fetchDataMenuFavicon = async (): Promise<void> => {
  try {
    const API_URL = `/api/logotipo?populate=logo`;
    const data = await $fetchApi(API_URL);

    if (data?.data?.logo?.url) {
      favicon.value = `${baseUrl}${data.data.logo.url}`;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// Usar computed para el favicon
const faviconUrl = computed(() => favicon.value); // fallback a favicon por defecto

useHead(() => ({
  link: [
    {
      rel: "icon",
      type: "image/x-icon",
      href: faviconUrl.value,
    },
  ],
}));

watch(favicon, (newValue) => {
  if (newValue) {
    console.log("Favicon actualizado:", newValue);
  }
});

onMounted(async () => {
  await fetchDataMenuFavicon();
});
</script>

<template>
  <div class="font-sass h-screen justify-center align-middle">
    <NuxtLoadingIndicator color="yellow" :height="4" />
    <NuxtLayout>
      <NuxtPage :page-key="(route) => route.fullPath" />
    </NuxtLayout>
  </div>
</template>
