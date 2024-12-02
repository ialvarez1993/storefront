<template>
  <section class="px-4 py-8 w-full max-w-7xl mx-auto">
    <h1
      class="text-2xl  md:text-3xl font-bold font-header text-center mb-8 uppercase tracking-wider"
    >
      Los Mejores Descuentos de la Semana
    </h1>

    <div class="relative">
      <div class="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
        <div
          v-for="product in products"
          :key="product.id"
          class="min-w-[280px] max-w-[280px] snap-start"
        >
          <CardContent class="p-4">
            <div class="relative mb-4">
              <span
                v-if="product.onSale"
                class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded-md"
              >
                Oferta
              </span>
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-48 object-contain"
              />
            </div>
            <div class="space-y-2">
              <h3 class="font-semibold line-clamp-2">{{ product.name }}</h3>
              <p class="text-sm text-muted-foreground">{{ product.brand }}</p>
              <div class="flex flex-col gap-1">
                <span
                  v-if="product.originalPrice"
                  class="text-sm text-muted-foreground line-through"
                >
                  £{{ product.originalPrice.toFixed(2) }}
                </span>
                <span class="text-lg font-bold">
                  £{{ product.price.toFixed(2) }}
                </span>
              </div>
              <p
                :class="[
                  'text-sm',
                  product.status === 'Disponible'
                    ? 'text-green-600'
                    : 'text-orange-600',
                ]"
              >
                {{ product.status }}
              </p>
              <div v-if="product.rating" class="flex items-center gap-2">
                <div class="flex">
                  <Star
                    v-for="n in product.rating"
                    :key="n"
                    class="w-4 h-4 fill-primary text-primary"
                  />
                </div>
                <span class="text-sm text-muted-foreground">
                  {{ product.reviews }} Reseña{{
                    product.reviews !== 1 ? "s" : ""
                  }}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button
        class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8"
      >
        Explorar más  {{  `${ButtonExplorar}`}}
      </button>
    </div>
  </section>
</template>

<script setup>
import { Star } from "lucide-vue-next";

const products = [
  {
    id: 1,
    name: "Bicicleta estática spinning",
    brand: "MaxKare",
    image: "/placeholder.svg?height=200&width=200",
    originalPrice: 283.4,
    price: 153.36,
    status: "Quedan 3 unidades",
    onSale: true,
    rating: 5,
    reviews: 1,
  },
  {
    id: 2,
    name: "Corneta inalámbrica",
    brand: "Panasonic",
    image: "/placeholder.svg?height=200&width=200",
    price: 191.7,
    status: "Disponible",
    onSale: false,
  },
  {
    id: 3,
    name: 'TV 75" 4K UHD Smart',
    brand: "Samsung",
    image: "/placeholder.svg?height=200&width=200",
    price: 766.8,
    status: "Disponible",
    onSale: false,
  },
  {
    id: 4,
    name: "Refrigerador 29 pies",
    brand: "Samsung",
    image: "/placeholder.svg?height=200&width=200",
    price: 2223.72,
    status: "Disponible",
    onSale: false,
  },
  {
    id: 5,
    name: "Aire acondicionado 24.000 BTU Split",
    brand: "Hyundai",
    image: "/placeholder.svg?height=200&width=200",
    price: 575.1,
    status: "Disponible",
    onSale: false,
  },
];
</script>
