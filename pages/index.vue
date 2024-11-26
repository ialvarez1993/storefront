<script setup lang="ts">
import { useWebsiteHomePage } from "~/domains/core/composable/useWebsiteHomePage";
import websiteHomepageHead from "../domains/core/utils/websiteHomepageHead";
import { useCategory } from "../domains/category/composables/useCategory";
import { useMotion } from "@vueuse/motion";
import { ref, onMounted, reactive } from "vue";
import Skeleton from "primevue/skeleton";
import MainBanner from "../domains/core/components/MainBanner.vue";
import FeatureBox from "../domains/core/components/FeatureBox.vue";
import CardSamsung from "../domains/core/components/CardSamsung.vue";
import ProductSliderCircle from "../domains/core/components/ProductSliderCircle.vue";
import ProductSlider from "../domains/core/components/ProductSlider.vue";
import CategoryCard from "../domains/category/components/CategoryCard.vue";
import CardsItems from "../domains/core/components/CardsItems.vue";

import CardsItemsMobile from "../domains/core/components/CardsItemsMobile.vue";

import Display from "../domains/core/components/Display.vue";
import Marcas from "../domains/core/components/ui/Marcas.vue";
import { useI18n } from "vue-i18n";
import { useQuery } from "@tanstack/vue-query";
import type { TitleData } from "../types/TitleDescuento";
import { useScreenSize } from '../../../compasables/useScreenSize.ts';


const { isMobile } = useScreenSize();

const MobileViewSliderProduct = defineAsyncComponent(() =>
  import('../domains/core/components/ProductSliderMobile.vue')
);

const DesktopViewSliderProduct = defineAsyncComponent(() =>
  import('../domains/core/components/ProductSlider.vue')
);



const { locale, setLocale } = useI18n();

const API_TOKEN =
  "17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86";

const fetchDataTitleDiscount = async (): Promise<TitleData> => {
  try {
    const response = await fetch(API_URL_DISCOUNT, {
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
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const fetchDataTitleCategory = async (): Promise<TitleData> => {
  try {
    const response = await fetch(API_URL_CATEGORY, {
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
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const { data: titleTitleDescuento } = useQuery({
  queryKey: ["titleDescuento"],
  queryFn: fetchDataTitleDiscount,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

const { data: titleTitleCategory } = useQuery({
  queryKey: ["titleCategoria"],
  queryFn: fetchDataTitleCategory,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

const currentLang = locale.value; // 'es' o 'en'
const API_URL_DISCOUNT = `http://localhost:1337/api/title-discount?locale=${currentLang === "es" ? "es-VE" : "en"}`;
const API_URL_CATEGORY = `http://localhost:1337/api/titulo-categoria?locale=${currentLang === "es" ? "es-VE" : "en"}`;

// Interfaces
interface LoadingStates {
  mainBanner: boolean;
  featureBox: boolean;
  productSlider1: boolean;
  productSlider2: boolean;
  cardSamsung: boolean;
  categoryCard: boolean;
  cardsItems: boolean;
  display: boolean;
  marcas: boolean;
}

interface SectionRefs {
  mainBanner: Ref<HTMLElement | null>;
  featureBox: Ref<HTMLElement | null>;
  productSlider1: Ref<HTMLElement | null>;
  productSlider2: Ref<HTMLElement | null>;
  cardSamsung: Ref<HTMLElement | null>;
  categoryCard: Ref<HTMLElement | null>;
  cardsItems: Ref<HTMLElement | null>;
  display: Ref<HTMLElement | null>;
  marcas: Ref<HTMLElement | null>;
}

// Estados y referencias
const loadingStates = reactive<LoadingStates>({
  mainBanner: true,
  featureBox: true,
  productSlider1: true,
  productSlider2: true,
  cardSamsung: true,
  categoryCard: true,
  cardsItems: true,
  display: true,
  marcas: true,
});

const { loadCategoryList, categories } = useCategory();
const { getWebsiteHomepage, websiteHomepage } = useWebsiteHomePage();

const sectionRefs: SectionRefs = {
  mainBanner: ref(null),
  featureBox: ref(null),
  productSlider1: ref(null),
  productSlider2: ref(null),
  cardSamsung: ref(null),
  categoryCard: ref(null),
  cardsItems: ref(null),
  display: ref(null),
  marcas: ref(null),
};

// Configuración de animaciones
const createMotion = (elementRef: Ref<HTMLElement | null>, delay = 0) => {
  if (elementRef.value) {
    return useMotion(elementRef, {
      initial: { opacity: 0, y: 50 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay,
        },
      },
      enter: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay,
        },
      },
    });
  }
};

// Inicialización de animaciones
const initializeAnimations = () => {
  Object.entries(sectionRefs).forEach(([key, ref], index) => {
    if (ref.value) {
      createMotion(ref, index * 150);
    }
  });
};

// Función de carga de secciones
const loadSection = async (
  section: keyof LoadingStates,
  delay: number = 1000,
) => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  loadingStates[section] = false;
};

// Hook de ciclo de vida
onMounted(async () => {
  try {
    await Promise.all([
      getWebsiteHomepage(),
      loadCategoryList({
        filter: { parent: true, id: null },
      }),
    ]);

    initializeAnimations();

    const sections = Object.keys(loadingStates) as Array<keyof LoadingStates>;
    for (const section of sections) {
      await loadSection(section, Math.random() * 1000 + 500);
    }
  } catch (error) {
    console.error("Error loading page:", error);
  }
});

// SEO
useHead(websiteHomepageHead(websiteHomepage.value, ""));

const titleOne = computed(() => {
  return titleTitleDescuento || "Cargando";
});

const titleTwo = computed(() => {
  return titleTitleCategory || "Cargando";
});
</script>

<template>
  <div class="relative">
    <!-- MainBanner Section -->
    <section>
      <div v-if="loadingStates.mainBanner" class="animate-pulse">
        <Skeleton class="h-[600px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.mainBanner">
        <MainBanner />
      </div>
    </section>

    <!-- FeatureBox Section -->
    <section>
      <div v-if="loadingStates.featureBox" class="animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton v-for="n in 4" :key="n" class="h-[100px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.featureBox">
        <FeatureBox />
      </div>
    </section>

    <p class="text-center mt-24 font-bold !font-header uppercase mb-10 typography-headline-3 md:typography-headline-2">
      {{ titleOne.value?.data?.TitleDiscount }}
    </p>
    <!-- ProductSlider1 Section -->
    <section class="mb-8">
      <div v-if="loadingStates.productSlider1" class="animate-pulse">
        <Skeleton class="h-[400px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.productSlider1 data TitleDiscount">
        <p
          class="text-center !mt-10 font-bold !font-header uppercase mb-10 typography-headline-3 md:typography-headline-2">
          {{ titleTitleCategory?.data?.TitleDiscount }}
        </p>


        <Suspense>
          <template #default>
            <component :is="isMobile ? MobileViewSliderProduct : DesktopViewSliderProduct" :data="data"
              :images="images" />
          </template>
          <template #fallback>
            <div>Cargando...</div>
          </template>
        </Suspense>



      </div>
    </section>

    <!-- CategoryCard Section -->
    <section class="mb-8 mt-32">
      <div v-if="loadingStates.categoryCard" class="animate-pulse">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton v-for="n in 8" :key="n" class="h-[200px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.categoryCard">
        <h2 class="text-center font-bold !font-header uppercase mb-10 typography-headline-3 md:typography-headline-2">
          {{ titleTwo.value?.data.TituloCategoria }}
        </h2>
        <CategoryCard :categories="categories" />
      </div>
    </section>

    <!-- CardSamsung Section -->
    <section class="mb-8 mt-12s">
      <div v-if="loadingStates.cardSamsung" class="animate-pulse">
        <Skeleton class="h-[300px] rounded-lg" />
      </div>
      <div v-else class="mt-[5rem]" ref="sectionRefs.cardSamsung">
        <CardSamsung />
      </div>
    </section>

    <!-- ProductSlider2 Section -->
    <section class="mb-12">
      <div v-if="loadingStates.productSlider2" class="animate-pulse">
        <Skeleton class="h-[400px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.productSlider2">
        <ProductSliderCircle />
      </div>
    </section>

    <!-- CardsItems Section -->
    <section class="mb-8 !mt-12">
      <div v-if="loadingStates.cardsItems" class="animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton v-for="n in 3" :key="n" class="h-[250px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.cardsItems">

        <Suspense>
          <template #default>
            <component :is="isMobile ? CardsItemsMobile : CardsItems" :images="images" />
          </template>
          <template #fallback>
            <div>Cargando...</div>
          </template>
        </Suspense>


      </div>
    </section>

    <!-- Display Section -->
    <h3 class="text-center font-bold !font-header uppercase mt-12 typography-headline-3 md:typography-headline-2">
      {{ $t("descuentosCards") }}
    </h3>
    <section class="">
      <div v-if="loadingStates.display" class="animate-pulse">
        <Skeleton class="h-[400px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.display">
        <Display />
      </div>
    </section>

    <!-- Marcas Section -->
    <section class="-mt-20">
      <div v-if="loadingStates.marcas" class="animate-pulse">
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Skeleton v-for="n in 6" :key="n" class="h-[100px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.marcas">
        <Marcas :brands="[]" :showTitle="true" :isAnimated="true" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

/* Asegúrate de que los Skeletons tengan un color de fondo adecuado */
:deep(.p-skeleton) {
  background-color: #e2e8f0;
}
</style>
