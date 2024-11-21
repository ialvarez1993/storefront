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
        <button class="cta-button" @click="handleClick">
          {{ cardData.buttonText }}
          <Icon name="heroicons:arrow-right" class="icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";

const BASE_IMAGE_URL = "http://localhost:1337";

// Datos estáticos de respaldo
const staticData = {
  data: {
    subtitulo: "Descubre",
    titulo: "Tecnología",
    button: "Ver todo",
    promoImagenLateral: [
      {
        url: "/default-image.webp", // Imagen por defecto
      },
    ],
  },
};

const { locale } = useI18n();

const API_TOKEN =
  "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86";

const API_URL = computed(() => {
  const currentLang = locale.value;
  return `http://localhost:1337/api/home-promo?populate=%2A&locale=${
    currentLang === "es" ? "es-VE" : "en"
  }`;
});

const fetchDataTitleCategory = async (): Promise<any> => {
  try {
    const response = await fetch(API_URL.value, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
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
      backgroundImage: DataCard.value.data.promoImagenLateral?.[0]?.url
        ? `${BASE_IMAGE_URL}${DataCard.value.data.promoImagenLateral[0].url}`
        : staticData.data.promoImagenLateral[0].url,
    };
  }

  return {
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
  @apply relative h-full w-full rounded-xl overflow-hidden
         transition-all duration-300 hover:scale-[1.02];
}

.background-image {
  @apply absolute inset-0 w-full h-full object-cover;
}

.overlay {
  @apply absolute inset-0 bg-black/40;
}

.content-wrapper {
  @apply relative h-full w-full p-8
         flex flex-col items-center justify-center
         text-center gap-4;
}

.subtitle {
  @apply text-lg text-white/90 font-medium;
}

.title {
  @apply text-3xl md:text-4xl font-bold text-white
         mb-4;
}

.cta-button {
  @apply flex items-center gap-2 px-6 py-3
         bg-white text-gray-900 rounded-lg
         font-medium transition-all duration-300
         hover:bg-gray-100 hover:scale-105;

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
