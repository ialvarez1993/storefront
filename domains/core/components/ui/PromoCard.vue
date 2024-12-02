<!-- components/PromoCard.vue -->
<template>
  <div class="promo-card">
    <div class="card-container">
      <NuxtImg
        :src="cardData.backgroundImage"
        class="background-image"
        loading="lazy"
        format="webp"
        quality="80"
        fit="cover"
        placeholder
      />
      <div class="overlay" />
      <div class="content-wrapper">
        <span class="subtitle"> {{ cardData.subtitle }} </span>
        <h2 class="title">{{ cardData.title }}</h2>
        <NuxtLink :to="cardData.link">
          <button class="cta-button" @click="handleClick">
            {{ cardData.buttonText }}
            <Icon name="heroicons:arrow-right" class="icon" />
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
const runtimeConfig = useRuntimeConfig();
const { $fetchApi } = useNuxtApp();
const BASE_IMAGE_URL = `${runtimeConfig.public.apiUrlStrapi}`;

// Datos estáticos de respaldo
const staticData = {
  data: {
    subtitulo: "Descubre",
    titulo: "Tecnología",
    button: "Ver todo",
    link: `${runtimeConfig.public.apiUrlStrapi}/search?search=`,
    promoImagenLateral: [
      {
        url: "/default-image.webp", // Imagen por defecto
      },
    ],
  },
};

const { locale } = useI18n();

const API_URL = computed(() => {
  const currentLang = locale.value;
  return `api/home-promo?populate=%2A&locale=${
    currentLang === "es" ? "es-VE" : "en"
  }`;
});
// Types
interface PromoCardData {
  data: {
    subtitulo: string;
    titulo: string;
    button: string;
    link: string;
    promoImagenLateral: Array<{ url: string }>;
  };
}

const fetchDataTitleCategory = async (): Promise<PromoCardData> => {
  try {
    const data = await $fetchApi(API_URL.value);
    if (!data || !data.data) {
      throw new Error("PROMO Invalid data structure received from API");
    }
    return data;
  } catch (error) {
    console.error("Error fetching promo card data:", error);
    return staticData;
  }
};

const { data: DataCard, isLoading } = useQuery({
  queryKey: ["PromoCard", locale],
  queryFn: fetchDataTitleCategory,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// Computed property que combina datos de la API o usa datos estáticos
const cardData = computed(() => {
  if (DataCard.value?.data) {
    return {
      subtitle: DataCard.value.data.subtitulo,
      title: DataCard.value.data.titulo,
      buttonText: DataCard.value.data.button,
      link: DataCard.value.data.link,
      backgroundImage: DataCard.value.data.promoImagenLateral?.[0]?.url
        ? `${BASE_IMAGE_URL}${DataCard.value.data.promoImagenLateral[0].url}`
        : staticData.data.promoImagenLateral[0].url,
    };
  }

  return {
    link: staticData.data.link,
    subtitle: staticData.data.subtitulo,
    title: staticData.data.titulo,
    buttonText: staticData.data.button,
    backgroundImage: staticData.data.promoImagenLateral[0].url,
  };
});

function handleClick() {
  navigateTo("/category/52");
}
</script>

<style lang="scss" scoped>
.promo-card {
  @apply relative w-full aspect-[6/20];
}

.card-container {
  @apply relative h-full w-full rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02];
}

.background-image {
  @apply absolute inset-0 w-full h-full object-cover;
}

.overlay {
  @apply absolute inset-0 bg-black/40;
}

.content-wrapper {
  @apply relative h-full w-full p-8 flex flex-col items-center justify-center text-center gap-4;
}

.subtitle {
  @apply text-lg text-white/90 font-medium;
}

.title {
  @apply text-3xl md:text-4xl font-bold text-white mb-4;
}

.cta-button {
  @apply flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium transition-all duration-300 hover:bg-gray-100 hover:scale-105;

  .icon {
    @apply w-5 h-5 transition-transform duration-300;
  }

  &:hover .icon {
    @apply translate-x-1;
  }
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .content-wrapper {
    @apply p-4;
  }

  .title {
    @apply text-2xl;
  }

  .subtitle {
    @apply text-base;
  }
}
</style>
