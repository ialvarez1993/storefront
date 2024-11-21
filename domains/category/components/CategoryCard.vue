<script lang="ts" setup>
import { computed, ref } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
});

const topCategories = computed(() => props.categories as any);
const filteredCategories = computed(() =>
  topCategories.value.filter(
    (category) => category.name === "WOMEN" || category.name === "MEN",
  ),
);

const items = ref([
  {
    name: "buyCategory.woman",
    image: "/images/women-card.png",
  },
  {
    name: "buyCategory.men",
    image: "/images/men-card.png",
  },
]);
</script>

<template>
  <section class="container mx-auto my-14 px-4">
    <div
      class="flex flex-wrap justify-center gap-6"
      data-testid="category-card"
    >
      <div
        v-for="{ name, slug } in filteredCategories"
        :key="name"
        class="group relative w-60 h-60 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <NuxtLink
          :to="slug"
          class="block w-full h-full focus:outline-none focus-visible:outline focus-visible:outline-offset focus-visible:rounded-md"
          :aria-label="name"
        >
          <div class="relative w-full h-full bg-neutral-100">
            <NuxtImg
              v-if="name === 'WOMEN'"
              :src="items[0].image"
              :alt="`${name} category`"
              width="240"
              height="240"
              loading="lazy"
              format="webp"
              class="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <NuxtImg
              v-if="name === 'MEN'"
              :src="items[1].image"
              :alt="`${name} category`"
              width="240"
              height="240"
              loading="lazy"
              format="webp"
              class="w-full h-full object-cover rounded-full transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
          <p
            class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-75 px-4 py-2 rounded-full font-semibold text-lg text-neutral-900 shadow-md transition duration-300 ease-in-out group-hover:bg-black group-hover:text-[#FFC107]"
          >
            {{ $t(name) }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
$primary-color: #4a90e2;

.container {
  max-width: 1200px;
}

.group:hover .shadow-lg {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.focus\:ring-4 {
  outline: 2px solid $primary-color;
}

.group:hover .transition-transform {
  transform: scale(1.05);
}
</style>
