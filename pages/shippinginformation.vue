<template>
  <div class="shipping-info  mt-[12rem]">
    <!-- Banner Principal -->
    <div class="bg-gradient-to-r  from-indigo-600 to-blue-500 py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-white text-center">
          Información de Envíos
        </h1>
        <p class="text-white text-center mt-4 max-w-2xl mx-auto">
          Conoce todos los detalles sobre nuestros métodos de envío y tiempos de
          entrega
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Métodos de Envío -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Métodos de Envío</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="shipping-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg">
              <div class="text-indigo-600 mb-4">
                <svg
                  class="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Envío Express</h3>
              <p class="text-gray-600 mb-4">
                Entrega en 24-48 horas a principales ciudades
              </p>
              <p class="font-bold text-indigo-600">$299 MXN</p>
            </div>
          </div>

          <div class="shipping-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg">
              <div class="text-indigo-600 mb-4">
                <svg
                  class="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Envío Estándar</h3>
              <p class="text-gray-600 mb-4">Entrega en 3-5 días hábiles</p>
              <p class="font-bold text-indigo-600">$149 MXN</p>
            </div>
          </div>

          <div class="shipping-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg">
              <div class="text-indigo-600 mb-4">
                <svg
                  class="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Recogida en Tienda</h3>
              <p class="text-gray-600 mb-4">Disponible en 24 horas</p>
              <p class="font-bold text-indigo-600">GRATIS</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Zonas de Cobertura -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">
          Zonas de Cobertura
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="coverage-info bg-gray-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4">Zona Metropolitana</h3>
            <ul class="space-y-2">
              <li
                v-for="(ciudad, index) in ciudadesMetropolitanas"
                :key="index"
                class="flex items-center"
              >
                <svg
                  class="w-5 h-5 text-green-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ ciudad }}
              </li>
            </ul>
          </div>

          <div class="coverage-info bg-gray-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4">Resto del País</h3>
            <p class="text-gray-600">
              Realizamos envíos a toda la República Mexicana. Los tiempos de
              entrega pueden variar según la ubicación.
            </p>
          </div>
        </div>
      </section>

      <!-- Rastreo de Pedidos -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">
          Rastrear mi Pedido
        </h2>
        <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
          <div class="mb-6">
            <label class="block text-gray-700 mb-2">Número de Rastreo</label>
            <input
              v-model="trackingNumber"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Ingresa tu número de rastreo"
            />
          </div>
          <button
            class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Rastrear Pedido
          </button>
        </div>
      </section>

      <!-- Preguntas Frecuentes -->
      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-8">
          Preguntas Frecuentes
        </h2>
        <div class="max-w-2xl mx-auto space-y-4">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold">{{ faq.question }}</h3>
                <span
                  :class="[
                    'transform transition-transform',
                    faq.isOpen ? 'rotate-180' : '',
                  ]"
                  >▼</span
                >
              </div>
              <div v-show="faq.isOpen" class="mt-4 text-gray-600">
                {{ faq.answer }}
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShippingInfo",
  data() {
    return {
      trackingNumber: "",
      ciudadesMetropolitanas: [
        "Ciudad de México",
        "Estado de México",
        "Puebla",
        "Querétaro",
        "Morelos",
      ],
      faqs: [
        {
          question: "¿Cuánto tarda en llegar mi pedido?",
          answer:
            "Los tiempos de entrega varían según el método de envío seleccionado y tu ubicación. El envío express tarda 24-48 horas, mientras que el estándar toma 3-5 días hábiles.",
          isOpen: false,
        },
        {
          question: "¿Cómo puedo rastrear mi pedido?",
          answer:
            "Una vez que tu pedido sea enviado, recibirás un correo electrónico con el número de rastreo. Puedes usar ese número en nuestra herramienta de rastreo en línea.",
          isOpen: false,
        },
        {
          question: "¿Qué pasa si no estoy en casa cuando llegue mi pedido?",
          answer:
            "El repartidor intentará la entrega hasta 3 veces. Si no se logra la entrega, el paquete será devuelto a nuestro centro de distribución.",
          isOpen: false,
        },
      ],
    };
  },
  methods: {
    toggleFaq(index) {
      this.faqs[index].isOpen = !this.faqs[index].isOpen;
    },
  },
  head() {
    return {
      title: "Información de Envíos",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Información detallada sobre nuestros métodos de envío, costos y tiempos de entrega.",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.shipping-info {
  .shipping-method-card {
    @apply transition-all duration-300;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .coverage-info {
    @apply transition-all duration-300;

    &:hover {
      @apply shadow-md;
    }
  }

  .faq-item {
    @apply transition-all duration-300;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
