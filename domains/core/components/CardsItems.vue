<template>
  <div
    class="flex flex-wrap gap-4 mb-16 p-4 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen"
  >
    <!-- Panel Izquierdo -->
    <div
      class="w-full md:w-[300px] h-[500px] md:h-[600px] rounded-lg overflow-hidden relative bg-gradient-to-b from-[#001428] to-[#003366] hover:shadow-2xl transition-shadow duration-300"
    >
      <div class="p-6 flex flex-col h-full animate-fade-in">
        <div class="text-white text-xl mb-2 font-bold tracking-wide">
          Descuentos
        </div>
        <div
          class="inline-flex bg-green-500 text-white px-3 py-1 rounded-md text-sm mb-2 w-fit hover:bg-green-600 transition-colors"
        >
          Tecnología
        </div>
        <button
          class="text-white flex items-center text-sm mt-auto mb-4 hover:text-green-400 transition-colors group"
        >
          Ver todo
          <Icon
            name="heroicons:chevron-right"
            class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
          />
        </button>
        <div
          class="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-[#003366] to-transparent"
        />
        <NuxtImg
          src="/images/display-1.png"
          alt="Mobile App Preview"
          class="absolute bottom-4 left-1/2 transform -translate-x-1/2 hover:scale-105 transition-transform duration-300"
          width="250"
          height="400"
        />
      </div>
    </div>

    <!-- Contenido Principal -->
    <div class="flex-1 animate-fade-in w-full">
      <h1
        class="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 tracking-wider text-gray-800 hover:text-gray-900 transition-colors"
      >
        DESCUBRE LOS DESCUENTOS DE 24 HORAS
      </h1>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="bg-white border border-gray-200 rounded-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl group"
        >
          <div class="relative p-4">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-if="product.onSale"
              class="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-pulse"
            >
              Oferta
            </div>
          </div>
          <div class="p-4 pt-0">
            <h3
              class="text-sm font-medium mb-2 whitespace-pre-line group-hover:text-yellow-600 transition-colors"
            >
              {{ product.name }}
            </h3>
            <div
              v-if="product.originalPrice"
              class="text-gray-500 line-through text-sm"
            >
              {{ product.originalPrice }} VES
            </div>
            <div class="flex items-center justify-between mt-1">
              <div class="font-bold text-lg text-gray-900">
                {{ product.price }} VES
              </div>
            </div>
            <div v-if="product.rating" class="flex items-center gap-0.5 my-2">
              <Icon
                v-for="i in 5"
                :key="i"
                :name="
                  i <= product.rating
                    ? 'heroicons:star-solid'
                    : 'heroicons:star'
                "
                class="w-4 h-4"
                :class="
                  i <= product.rating ? 'text-yellow-400' : 'text-gray-300'
                "
              />
              <span class="text-xs text-gray-500 ml-1"
                >({{ product.reviews }})</span
              >
            </div>
            <div
              class="text-green-500 text-sm font-medium flex items-center gap-1"
            >
              <Icon name="heroicons:check-circle" class="w-4 h-4" />
              Disponible
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const products = [
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
  {
    id: 1,
    name: "Bicicleta estática spinning",
    price: "8,488.74",
    originalPrice: "10,500.00",
    image: "/images/display-1.png",
    rating: 5,
    reviews: 7,
    onSale: true,
    available: true,
  },
];
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.5s ease-in;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
