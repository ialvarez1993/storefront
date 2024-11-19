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
import CategoryCard from "../domains/category/components/CategoryCard.vue";
import CardsItems from "../domains/core/components/CardsItems.vue";
import Display from "../domains/core/components/Display.vue";
import Marcas from "../domains/core/components/ui/Marcas.vue";

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
</script>

<template>
  <div class="relative">
    <!-- MainBanner Section -->
    <section class="mb-8">
      <div v-if="loadingStates.mainBanner" class="animate-pulse">
        <Skeleton class="h-[600px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.mainBanner">
        <MainBanner />
      </div>
    </section>

    <!-- FeatureBox Section -->
    <section class="mb-8">
      <div v-if="loadingStates.featureBox" class="animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton v-for="n in 4" :key="n" class="h-[100px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.featureBox">
        <FeatureBox />
      </div>
    </section>

    <!-- ProductSlider1 Section -->
    <section class="mb-8">
      <div v-if="loadingStates.productSlider1" class="animate-pulse">
        <Skeleton class="h-[400px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.productSlider1">
        <ProductSlider :heading="$t('heading.discount')" />
      </div>
    </section>

    <!-- CardSamsung Section -->
    <section class="mb-8">
      <div v-if="loadingStates.cardSamsung" class="animate-pulse">
        <Skeleton class="h-[300px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.cardSamsung">
        <CardSamsung />
      </div>
    </section>

    <!-- CategoryCard Section -->
    <section class="mb-8">
      <div v-if="loadingStates.categoryCard" class="animate-pulse">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton v-for="n in 8" :key="n" class="h-[200px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.categoryCard">
        <CategoryCard
          :heading="$t('heading.categories')"
          :categories="categories"
        />
      </div>
    </section>

    <!-- ProductSlider2 Section -->
    <section class="mb-8">
      <div v-if="loadingStates.productSlider2" class="animate-pulse">
        <Skeleton class="h-[400px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.productSlider2">
        <ProductSlider />
      </div>
    </section>

    <!-- CardsItems Section -->
    <section class="mb-8">
      <div v-if="loadingStates.cardsItems" class="animate-pulse">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton v-for="n in 3" :key="n" class="h-[250px] rounded-lg" />
        </div>
      </div>
      <div v-else ref="sectionRefs.cardsItems">
        <CardsItems />
      </div>
    </section>

    <!-- Display Section -->
    <section class="mb-8">
      <div v-if="loadingStates.display" class="animate-pulse">
        <Skeleton class="h-[400px] rounded-lg" />
      </div>
      <div v-else ref="sectionRefs.display">
        <Display />
      </div>
    </section>

    <!-- Marcas Section -->
    <section class="mb-8">
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
