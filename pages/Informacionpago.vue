<template>
  <div class="payment-info !mt-[12rem] !mx-[12rem]">
    <!-- Banner Principal -->
    <div class="bg-gradient-to-r from-emerald-600 to-teal-500 py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-white text-center">
          Métodos de Pago
        </h1>
        <p class="text-white text-center mt-4 max-w-2xl mx-auto">
          Conoce todas las opciones disponibles para realizar tus pagos de
          manera segura
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <!-- Métodos de Pago Principales -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">
          Formas de Pago Aceptadas
        </h2>
        <div class="grid md:grid-cols-4 gap-6">
          <div class="payment-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg text-center">
              <div class="text-emerald-600 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Tarjetas de Crédito</h3>
              <p class="text-gray-600">Visa, MasterCard, American Express</p>
            </div>
          </div>

          <div class="payment-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg text-center">
              <div class="text-emerald-600 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Tarjetas de Débito</h3>
              <p class="text-gray-600">Todas las instituciones bancarias</p>
            </div>
          </div>

          <div class="payment-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg text-center">
              <div class="text-emerald-600 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Transferencia</h3>
              <p class="text-gray-600">SPEI y transferencia directa</p>
            </div>
          </div>

          <div class="payment-method-card">
            <div class="p-6 bg-white rounded-lg shadow-lg text-center">
              <div class="text-emerald-600 mb-4">
                <svg
                  class="w-12 h-12 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-semibold mb-2">Efectivo</h3>
              <p class="text-gray-600">OXXO, 7-Eleven, CircleK</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Proceso de Pago -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Proceso de Pago</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(step, index) in paymentSteps"
            :key="index"
            class="process-step"
          >
            <div class="relative p-6 bg-white rounded-lg shadow-lg">
              <div
                class="absolute -top-4 -left-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold"
              >
                {{ index + 1 }}
              </div>
              <h3 class="text-xl font-semibold mb-4 mt-2">{{ step.title }}</h3>
              <p class="text-gray-600">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Seguridad -->
      <section class="mb-16">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">Pago Seguro</h2>
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <div class="grid md:grid-cols-2 gap-8">
            <div class="security-feature">
              <div class="flex items-start space-x-4">
                <div class="text-emerald-600">
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-2">Certificado SSL</h3>
                  <p class="text-gray-600">
                    Todas las transacciones están protegidas con encriptación de
                    256 bits
                  </p>
                </div>
              </div>
            </div>

            <div class="security-feature">
              <div class="flex items-start space-x-4">
                <div class="text-emerald-600">
                  <svg
                    class="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-xl font-semibold mb-2">
                    Verificación 3D Secure
                  </h3>
                  <p class="text-gray-600">
                    Doble autenticación en todas las transacciones con tarjeta
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQs -->
      <section>
        <h2 class="text-3xl font-bold text-gray-800 mb-8">
          Preguntas Frecuentes
        </h2>
        <div class="max-w-3xl mx-auto">
          <div v-for="(faq, index) in faqs" :key="index" class="mb-4">
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
  name: "PaymentInfo",
  data() {
    return {
      paymentSteps: [
        {
          title: "Selecciona tu método",
          description:
            "Elige entre las diferentes opciones de pago disponibles según tu preferencia.",
        },
        {
          title: "Ingresa los datos",
          description:
            "Proporciona la información necesaria según el método seleccionado.",
        },
        {
          title: "Confirma tu pago",
          description:
            "Verifica los detalles y confirma la transacción de manera segura.",
        },
      ],
      faqs: [
        {
          question: "¿Qué tan seguro es pagar en línea?",
          answer:
            "Utilizamos los más altos estándares de seguridad en la industria, incluyendo encriptación SSL y verificación 3D Secure para proteger tus datos.",
          isOpen: false,
        },
        {
          question: "¿Cuánto tiempo tarda en reflejarse mi pago?",
          answer:
            "Los pagos con tarjeta se reflejan inmediatamente. Las transferencias pueden tomar hasta 24 horas hábiles, y los pagos en efectivo hasta 48 horas.",
          isOpen: false,
        },
        {
          question: "¿Puedo solicitar factura de mi compra?",
          answer:
            "Sí, puedes solicitar tu factura inmediatamente después de realizar tu pago desde tu cuenta de usuario.",
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
};
</script>

<style lang="scss">
.payment-info {
  .payment-method-card {
    @apply transition-all duration-300;

    &:hover {
      transform: translateY(-4px);
    }
  }

  .process-step {
    @apply transition-all duration-300;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .security-feature {
    @apply transition-all duration-300;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
