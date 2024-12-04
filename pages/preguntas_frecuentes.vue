<template>
  <div class="faq-page !mt-[12rem]">
    <div class="bg-gradient-to-r from-blue-800 to-blue-600 py-16">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl font-bold text-white text-center">
          Preguntas Frecuentes
        </h1>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="max-w-3xl mx-auto">
        <!-- Buscador -->
        <div class="mb-8">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Buscar pregunta..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Categorías -->
        <div class="mb-12 flex flex-wrap gap-4">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectCategory(category)"
            :class="[
              'px-4 py-2 rounded-full transition-colors',
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
          >
            {{ category }}
          </button>
        </div>

        <!-- Lista de Preguntas -->
        <div class="space-y-6">
          <div
            v-for="(faq, index) in filteredFaqs"
            :key="index"
            class="faq-item"
          >
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-xl font-semibold text-gray-800">
                  {{ faq.question }}
                </h3>
                <span
                  :class="[
                    'transform transition-transform',
                    faq.isOpen ? 'rotate-180' : '',
                  ]"
                >
                  ▼
                </span>
              </div>
              <div v-show="faq.isOpen" class="mt-4 text-gray-600 prose">
                {{ faq.answer }}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FaqPage",
  data() {
    return {
      searchQuery: "",
      selectedCategory: "Todos",
      categories: ["Todos", "Envíos", "Pagos", "Productos", "Cuenta"],
      faqs: [
        {
          question: "¿Cuál es el tiempo estimado de entrega?",
          answer:
            "El tiempo estimado de entrega es de 3-5 días hábiles para envíos nacionales.",
          category: "Envíos",
          isOpen: false,
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos tarjetas de crédito/débito, PayPal y transferencias bancarias.",
          category: "Pagos",
          isOpen: false,
        },
        {
          question: "¿Cómo puedo rastrear mi pedido?",
          answer:
            "Puedes rastrear tu pedido ingresando el número de seguimiento en tu cuenta.",
          category: "Envíos",
          isOpen: false,
        },
        // Añade más preguntas según sea necesario
      ],
    };
  },
  computed: {
    filteredFaqs() {
      return this.faqs.filter((faq) => {
        const matchesSearch = faq.question
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          this.selectedCategory === "Todos" ||
          faq.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    },
  },
  methods: {
    toggleFaq(index) {
      this.faqs[index].isOpen = !this.faqs[index].isOpen;
    },
    selectCategory(category) {
      this.selectedCategory = category;
    },
  },
  head() {
    return {
      title: "Preguntas Frecuentes",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Encuentra respuestas a las preguntas más frecuentes sobre nuestros productos y servicios.",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.faq-page {
  .faq-item {
    @apply transition-all duration-300;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
