<script lang="ts" setup>
import { SfButton } from "@storefront-ui/vue";
import { onMounted, watch, ref } from "vue";
import gsap from "gsap";
import { useQuery } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const API_TOKEN =
  "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86";

const API_URL = computed(() => {
  return `http://localhost:1337/api/home-tarjetas-descuentos?populate=%2A&locale=${locale.value}`;
});

const fetchDataTitleCategory = async () => {
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

    const data = await response.json();
    console.log("Raw API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const { data: DataCard, isLoading } = useQuery({
  queryKey: ["PromoCardDescuento", locale],
  queryFn: fetchDataTitleCategory,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

const items = ref([]);

watch(
  DataCard,
  (newData) => {
    console.log("DataCard changed:", newData);
    if (newData?.data) {
      items.value = newData.data.map((item) => ({
        id: item.id,
        reverse: true,
        title: item.title,
        subtitle: item.subtitulo,
        description: item.descripcion,
        buttonText: item.button,
        image: `http://localhost:1337${item.imagenCard?.url}`,
        bgColor: item.colorFondo,
        textColor: item.colorTexto,
      }));
    }
  },
  { immediate: true, deep: true },
);

onMounted(() => {
  gsap.from(".showcase-card", {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out",
  });
});
</script>

<template>
  <div class="showcase-container !mb-20" data-testid="display">
    <div
      v-for="(item, index) in items"
      :key="item.title"
      :class="[
        'showcase-card',
        item.bgColor,
        item.textColor,
        index === 0 ? 'showcase-card--featured' : '',
        index === 0 ? 'showcase-card--featured' : '',
      ]"
    >
      <div
        :class="[
          'showcase-card__inner',
          {
            'showcase-card__inner--reverse': item.reverse,
          },
        ]"
      >
        <div class="showcase-card__content">
          <p class="showcase-card__subtitle">{{ $t(item.subtitle) }}</p>
          <h2 class="showcase-card__title">
            {{ $t(item.title) }}
          </h2>
          <p class="showcase-card__description">
            {{ $t(item.description) }}
          </p>
          <SfButton class="showcase-card__button" :tag="NuxtLink" to="/">
            <span class="showcase-card__button-text">{{
              $t(item.buttonText)
            }}</span>
            <div class="showcase-card__button-shine"></div>
          </SfButton>
        </div>
        <div class="showcase-card__image-container">
          <NuxtImg
            :src="item.image"
            :alt="item.title"
            class="showcase-card__image"
            width="600"
            height="600"
            loading="lazy"
            format="webp"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.showcase-container {
  display: grid;
  gap: 1.5rem;
  padding: 1rem;
  max-width: 1440px;
  margin: 0 auto;
}

.showcase-card {
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);

  &:hover {
    transform: translateY(-4px);
  }

  &__inner {
    display: flex;
    flex-direction: column;
    height: 100%;

    @media (min-width: 768px) {
      flex-direction: row;

      &--reverse {
        flex-direction: row-reverse;
      }
    }
  }

  &__content {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    @media (min-width: 1024px) {
      padding: 3rem;
    }
  }

  &__subtitle {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-weight: 500;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
  }

  &__title {
    font-size: 2.25rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (min-width: 1024px) {
      font-size: 3rem;
    }
  }

  &__description {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    line-height: 1.6;
    max-width: 32rem;
  }

  &__button {
    position: relative;
    overflow: hidden;
    background-color: white !important;
    color: black !important;
    padding: 0.75rem 2rem !important;
    border-radius: 9999px !important;
    font-weight: 600 !important;
    display: inline-flex !important;
    align-items: center !important;
    transition: transform 0.3s ease !important;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__button-shine {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shine 3s infinite;
  }

  &__image-container {
    position: relative;
    overflow: hidden;

    @media (min-width: 768px) {
      width: 50%;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    transition: transform 0.5s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.showcase-card--featured {
  @media (min-width: 768px) {
    grid-column: span 2;
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  20%,
  100% {
    left: 100%;
  }
}

@media (min-width: 768px) {
  .showcase-container {
    grid-template-columns: repeat(2, 1fr);
    padding: 2rem;
  }
}
</style>
