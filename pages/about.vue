<template>
  <div class="min-h-screen">
    <!-- Loading State -->
    <div v-if="isPending" class="flex items-center justify-center min-h-screen">
      <div class="loading-spinner">
        <div class="spinner-inner"></div>
      </div>
      <p class="ml-4 text-gray-600 animate-pulse">{{ $t("infoLoad") }}</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-screen"
      role="alert"
    >
      <div
        class="text-center p-8 bg-red-50 rounded-lg shadow-lg max-w-md mx-4 animate-fade-in"
      >
        <ExclamationCircleIcon class="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 class="text-2xl font-bold text-red-700">{{ $t("ErrorLoad") }}</h2>
        <p class="text-red-600">{{ error.message }}</p>
        <button
          @click="retryFetch"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="container mx-auto px-4 mt-48 py-8 md:py-12">
      <!-- Hero Section -->
      <div class="text-center mb-12 md:mb-16">
        <h1
          class="text-4xl md:text-6xl font-bold text-gray-800 mb-4 animate-fade-in"
        >
          {{ $t("loadNosotros") }}
        </h1>
        <div class="w-24 h-1 bg-yellow-400 mx-auto"></div>
      </div>

      <!-- Historia Section -->
      <section
        class="mb-12 md:mb-20 transform transition-all duration-300 hover:translate-y-[-5px]"
        v-if="data?.data"
      >
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden hover-card">
          <div class="p-6 md:p-12">
            <div class="flex items-center mb-8">
              <HistoryIcon class="h-8 w-8 text-blue-500 mr-4" />
              <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
                {{ $t("loadHistoria") }}
              </h2>
            </div>

            <div class="grid md:grid-cols-2 gap-6 md:gap-8">
              <!-- Misión -->
              <div
                class="bg-blue-50 p-6 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <h3
                  class="flex items-center text-xl font-semibold text-black mb-4"
                >
                  <TagIcon class="h-6 w-6 text-black mr-2" />
                  {{ $t("Mision") }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ data.data.HistoriaMision }}
                </p>
              </div>

              <!-- Visión -->
              <div
                class="bg-blue-50 p-6 rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                <h3
                  class="flex items-center text-xl font-semibold text-black mb-4"
                >
                  <EyeIcon class="h-6 w-6 text-black mr-2" />
                  {{ $t("LoadVision") }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ data.data.HistoriaVision }}
                </p>
              </div>
            </div>

            <!-- Fundadores -->
            <div class="mt-8">
              <h3
                class="flex items-center text-xl font-semibold text-gray-700 mb-4"
              >
                <UsersIcon class="h-6 w-6 text-black mr-2" />
                {{ $t("loadFounders") }}
              </h3>
              <TransitionGroup
                name="list"
                tag="div"
                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              >
                <div
                  v-for="(fundador, index) in data.data.HistoriaFundadores"
                  :key="index"
                  class="bg-gray-50 p-4 rounded-lg text-center transform hover:scale-105 transition-all duration-300"
                >
                  <UserCircleIcon
                    class="h-12 w-12 text-blue-500 mx-auto mb-2"
                  />
                  <p class="text-gray-700 font-medium">{{ fundador }}</p>
                </div>
              </TransitionGroup>
            </div>
          </div>
        </div>
      </section>

      <!-- Valores Section -->
      <section
        class="mb-12 md:mb-20 transform transition-all duration-300 hover:translate-y-[-5px]"
        v-if="data?.data"
      >
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-12 hover-card">
          <div class="flex items-center mb-8">
            <StarIcon class="h-8 w-8 text-yellow-500 mr-4" />
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
              {{ $t("loadValores") }}
            </h2>
          </div>
          <div class="bg-yellow-50 p-6 rounded-xl">
            <h3 class="text-xl md:text-2xl font-bold text-gray-700 mb-4">
              {{ data.data.ValorNombre }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ data.data.ValorDescripcion }}
            </p>
          </div>
        </div>
      </section>

      <!-- Contact & Location Grid -->
      <div class="grid md:grid-cols-2 gap-6 md:gap-8" v-if="data?.data">
        <!-- Contact Section -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover-card">
          <div class="flex items-center mb-6">
            <PhoneIcon class="h-8 w-8 text-green-500 mr-4" />
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
              {{ $t("loadContact") }}
            </h2>
          </div>
          <div class="space-y-4">
            <a
              :href="`mailto:${data.data.ContactoEmail}`"
              class="flex items-center group hover:bg-green-50 p-2 rounded-lg transition-all duration-300"
            >
              <MapIcon
                class="h-6 w-6 text-green-500 mr-3 group-hover:scale-110 transition-transform"
              />
              <span class="text-gray-600 capitalize group-hover:text-green-600">
                {{ data.data.ContactoEmail }}
              </span>
            </a>
            <a
              :href="`tel:${data.data.ContactoTelefono}`"
              class="flex items-center group hover:bg-green-50 p-2 rounded-lg transition-all duration-300"
            >
              <PhoneIcon
                class="h-6 w-6 text-green-500 mr-3 group-hover:scale-110 transition-transform"
              />
              <span class="text-gray-600 capitalize group-hover:text-green-600">
                {{ data.data.ContactoTelefono }}
              </span>
            </a>
          </div>
        </div>

        <!-- Location Section -->
        <div class="bg-white rounded-2xl shadow-xl p-6 md:p-8 hover-card">
          <div class="flex items-center mb-6">
            <i class="fa-solid fa-house p-5 m-1"></i>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">
              {{ $t("ubicacion") }}
            </h2>
          </div>
          <div class="space-y-4">
            <div
              class="flex items-center group hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
            >
              <LocationMarkerIcon class="h-6 w-6 text-red-500 mr-3" />
              <p class="text-gray-600 capitalize">
                {{ data.data.UbicacionDireccion }}
              </p>
            </div>
            <div
              class="flex items-center group hover:bg-red-50 p-2 rounded-lg transition-all duration-300"
            >
              <OfficeBuildingIcon class="h-6 w-6 text-red-500 mr-3" />
              <p class="text-gray-600 capitalize">
                {{ data.data.UbicacionCiudad }},
                {{ data.data.UbicacionCodigoPostal }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig()
import { useQuery } from "@tanstack/vue-query";
import type { About } from "../types/aceda-de";
import {
  UserCircleIcon,
  UsersIcon,
  PhoneIcon,
  StarIcon,
  ExclamationCircleIcon,
  EyeIcon,
  UserGroupIcon,
  MapIcon,
} from "@heroicons/vue/24/solid";
import { TagIcon } from "@heroicons/vue/24/outline";
import { useI18n } from "vue-i18n";

const { locale, setLocale } = useI18n();
const { $fetchApi } = useNuxtApp();


const fetchData = async () => {
  try {
    const response = await $fetchApi(API_URL);

    return response;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const { data, isPending, error, refetch } = useQuery({
  queryKey: ["about"],
  queryFn: fetchData,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
const currentLang = locale.value; // 'es' o 'en'
console.log(currentLang);
const API_URL = `/api/acerca-de?pagination%5BwithCount%5D=true&locale=${currentLang === "es" ? "es-VE" : "en"}`;

const retryFetch = () => {
  refetch();
};
</script>

<style scoped>
.loading-spinner {
  width: 50px;
  height: 50px;
  position: relative;
}

.spinner-inner {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #000000;
  border-radius: 50%;
}

.hover-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive Typography */
@media (max-width: 640px) {
  h1 {
    font-size: 2.5rem;
  }

  h2 {
    font-size: 1.75rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  p {
    font-size: 0.875rem;
  }
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  transition: background-color 0.3s;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Print styles */
@media print {
  .hover-card {
    box-shadow: none !important;
    transform: none !important;
  }

  .container {
    max-width: 100% !important;
    padding: 0 !important;
  }
}
</style>
