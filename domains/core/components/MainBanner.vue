<template>
  <div class="relative w-full overflow-hidden mt-[10rem] h-[400px]">
    <!-- Background with curve -->
    <div class="absolute inset-0 z-10">
      <div
        class="absolute inset-0 bg-gradient-to-r from-[#FDB813] via-[#FDB813]/90 to-transparent"
        :style="{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)' }"
      />
    </div>

    <div class="relative z-20 h-full flex items-center px-8 md:px-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
        <div class="space-y-6">
          <div>
            <h2
              class="text-3xl md:text-4xl font-bold text-white leading-tight tracking-wide"
            >
              {{ slides[currentSlide].title }}
            </h2>
            <p class="text-white/90 mt-2 text-lg">
              {{ slides[currentSlide].subtitle }}
            </p>
          </div>

          <button
            class="bg-[#FDB813] text-white hover:bg-[#FDB813]/90 font-semibold px-8 py-3 rounded-md transition-colors"
          >
            Ver producto
          </button>
        </div>

        <div class="relative">
          <NuxtImg
            :src="slides[currentSlide].image"
            alt="Product image"
            class="object-contain"
            width="600"
            height="400"
          />

          <!-- HP Logo -->
          <div
            class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg"
          >
            <NuxtImg src="/images/hero.png" alt="HP Logo" class="w-8 h-8" />
          </div>

          <!-- Price Tag -->
          <div
            class="absolute top-20 right-4 bg-white px-4 py-2 rounded-xl shadow-lg"
          >
            <div class="text-xs text-gray-600 font-medium">PRECIO</div>
            <div class="text-2xl font-bold">
              ${{ slides[currentSlide].price }}
            </div>
          </div>

          <!-- Discount Badge -->
          <div
            class="absolute top-40 right-4 bg-red-500 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-1"
          >
            <span class="text-2xl font-bold">30%</span>
            <span class="text-xs font-medium"> DE DESCUENTO</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button
      @click="prevSlide"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 w-10 h-10 flex items-center justify-center rounded-lg shadow-lg hover:bg-white transition-colors"
      aria-label="Previous slide"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        class="transform rotate-180"
      >
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    <button
      @click="nextSlide"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 w-10 h-10 flex items-center justify-center rounded-lg shadow-lg hover:bg-white transition-colors"
      aria-label="Next slide"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>

    <!-- Pagination Dots -->
    <div
      class="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2"
    >
      <button
        v-for="(slide, index) in slides"
        :key="index"
        @click="setCurrentSlide(index)"
        :class="{
          'bg-white': currentSlide === index,
          'bg-white/50': currentSlide !== index,
        }"
        class="w-2 h-2 rounded-full transition-colors"
        :aria-label="'Go to slide ' + (index + 1)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const slides = [
  {
    title: "LA NUEVA NOTEBOOK QUE BUSCABAS YA ESTÁ AQUÍ",
    subtitle: "Lenovo Legión 5 I5 8GB RAM",
    price: 279,
    discount: 30,
    image: "/images/hero.png",
    brand: "hp",
  },
  {
    title: "ENCUENTRA LO ÚLTIMO EN CELULARES",
    subtitle: "Celular Cubot P80 Dual Sim 256 Gb Global 8 Gb",
    price: 279,
    discount: 30,
    image: "/images/display-1.png",
    brand: "hp",
  },
];

const currentSlide = ref(0);

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};

const setCurrentSlide = (index) => {
  currentSlide.value = index;
};
</script>
