<script lang="ts" setup>
import { computed, ref, onMounted } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const topCategories = computed(() => props.categories as any);
const filteredCategories = computed(() =>
  topCategories.value.filter(
    (category) =>
      category.name === "WOMEN"
  ),
);

const categoryImages = ref<Record<string, string>>({});
const loading = ref(true);

const fetchCategoryImages = async () => {
  try {
    loading.value = true;

    const response = await fetch(
      "http://localhost:1337/api/home-categorias?populate=*&locale=en",
      {
        headers: {
          Authorization:
            "Bearer 17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86",
        },
      },
    );

    const data = await response.json();

    // Ordenar los datos por el campo 'orden'
    const sortedData = data.data.sort(
      (a: any, b: any) => parseInt(a.orden) - parseInt(b.orden),
    );

    // Asignar las imágenes a las categorías en orden
    filteredCategories.value.forEach((category, index) => {
      const apiData = sortedData[index];
      if (apiData?.ImageCategoriesHome?.[0]?.formats?.medium?.url) {
        categoryImages.value[category.name] =
          `http://localhost:1337${apiData.ImageCategoriesHome[0].formats.medium.url}`;
      } else if (apiData?.ImageCategoriesHome?.[0]?.url) {
        // Fallback para imágenes sin formatos
        categoryImages.value[category.name] =
          `http://localhost:1337${apiData.ImageCategoriesHome[0].url}`;
      }
    });

  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loading.value = false;
  }
};

// Fallback images en caso de error
const fallbackImages = {
  "Construccion": "/images/women-card.png",
  "Electricidad": "/images/men-card.png",
  "DIGITAL": "/images/digital-card.png"
};

onMounted(() => {
  fetchCategoryImages();
});
</script>

<template>
  <section class="container mx-auto my-14 px-4">
    <div class="flex flex-wrap justify-center gap-6" data-testid="category-card">
      <div v-for="category in filteredCategories" :key="category.name"
        class="group relative w-60 h-60 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
        <NuxtLink :to="category.slug"
          class="block w-full h-full focus:outline-none focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
          :aria-label="category.name">
          <div class="relative w-full h-full bg-neutral-100">
            <template v-if="!loading">
              <NuxtImg :src="categoryImages[category.name] || fallbackImages[category.name]"
                :alt="`${category.name} category`"
                class="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out group-hover:scale-105" />
            </template>
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></span>
            </div>
          </div>
          <p
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-4 py-2 rounded-full font-semibold text-lg text-neutral-900 shadow-md transition duration-300 ease-in-out group-hover:bg-black group-hover:text-[#FFC107]">
            {{ $t(category.name) }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
}

.group:hover .shadow-lg {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.group:hover .transition-transform {
  transform: scale(1.05);
}
</style>
