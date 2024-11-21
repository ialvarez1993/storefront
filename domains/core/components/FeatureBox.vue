<template>
  <div
    v-if="isLoading"
    class="flex items-center justify-center mt-52 w-full min-h-[200px] bg-black backdrop-blur-sm"
  >
    <div class="flex flex-col items-center gap-4">
      <!-- Spinner Animation -->
      <div class="relative w-16 h-16">
        <div
          class="absolute w-16 h-16 border-4 border-primary-500 rounded-full animate-ping opacity-75"
        ></div>
        <div
          class="absolute w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>
    </div>
  </div>
  <!-- Spinner Animation -->
  <div class="bg-gray-50 flex flex-col items-center">
    <div class="container">
      <div class="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap justify-center">
        <div
          v-for="(
            { icon, title, description, isDisabled }, index
          ) in cardDetails"
          :key="`${title}-${index}`"
          class="flex w-full max-w-[325px] sm:w-[300px] lg:w-[496px] items-left"
        >
          <component
            :is="icon"
            size="2xl"
            :class="{ 'text-disabled-900': isDisabled }"
          />
          <div class="p-4 flex flex-col items-left">
            <p
              :class="[
                'font-medium typography-text-base',
                { 'text-disabled-900': isDisabled },
              ]"
            >
              {{ $t(title) }}
            </p>
            <p
              :class="[
                'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-left',
                { 'text-disabled-700': isDisabled },
              ]"
            >
              {{ $t(description) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const DEBUG = true;
const log = (...args: any[]) => {
  if (DEBUG) console.log(...args);
};

import { computed } from "vue";
import iconDelivery from "./icon/Delivery.vue";
import iconHouse from "./icon/House.vue";
import iconCreditCard from "./icon/CreditCard.vue";
import iconSafety from "./icon/Safety.vue";
import { useQuery } from "@tanstack/vue-query";
import type { featureIconos } from "../../../types/FeatureIconos";

// Configuración base de las cards
const baseCardConfig = [
  {
    icon: iconDelivery,
    description: "benefits.shipping.subtitle",
    index: 0,
  },
  {
    icon: iconHouse,
    description: "benefits.homeDelivery.subtitle",
    index: 1,
  },
  {
    icon: iconCreditCard,
    description: "benefits.securePay.subtitle",
    index: 2,
  },
  {
    icon: iconSafety,
    description: "benefits.trust.subtitle",
    index: 3,
  },
];

const fetchIconos = async (): Promise<featureIconos> => {
  try {
    const { locale } = useI18n();
    const currentLang = locale.value;
    const url = `http://localhost:1337/api/iconos-homes?locale=${currentLang === "es" ? "es-VE" : "en"}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer 17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    log("Error fetching icons:", error);
    throw error;
  }
};

const {
  data: featureIconos,
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: ["featureIconos"],
  queryFn: fetchIconos,
  retry: 5,
});

// Computed property para manejar los estados de las cards
const cardDetails = computed(() => {
  if (isLoading.value) {
    // Retorna las cards con estado de carga
    return baseCardConfig.map((card) => ({
      ...card,
      title: "Cargando...",
      description: "Cargando...",
      isDisabled: true,
    }));
  }

  if (error.value) {
    // Manejo de error
    return baseCardConfig.map((card) => ({
      ...card,
      title: "Error al cargar",
      description: "Error al cargar",
      isDisabled: true,
    }));
  }

  // Verifica si los datos están disponibles
  if (!featureIconos.value?.data) {
    return baseCardConfig.map((card) => ({
      ...card,
      title: "No hay datos disponibles",
      description: "Error al cargar",
      isDisabled: true,
    }));
  }

  // Retorna las cards con los datos
  return baseCardConfig.map((card) => ({
    ...card,
    title:
      featureIconos.value!.data[card.index]!.Title ?? "Título no disponible",
    description:
      featureIconos.value!.data[card.index]!.Subtext ?? "Título no disponible",
    isDisabled: false,
  }));
});
</script>
