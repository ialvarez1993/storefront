<!-- pages/contact.vue -->
<template>
  <div class="contact-page mt-56">
    <div class="contact-container">
      <!-- Información de contacto -->
      <div class="contact-info">
        <h1 class="text-4xl font-bold mb-6">Contáctanos</h1>
        <div class="info-items">
          <div class="info-item">
            <Icon name="mdi:map-marker" class="text-2xl" />
            <div>
              <h3>Dirección</h3>
              <p>123 Calle Principal, Ciudad</p>
            </div>
          </div>
          <div class="info-item">
            <Icon name="mdi:phone" class="text-2xl" />
            <div>
              <h3>Teléfono</h3>
              <p>+1 234 567 890</p>
            </div>
          </div>
          <div class="info-item">
            <Icon name="mdi:email" class="text-2xl" />
            <div>
              <h3>Email</h3>
              <p>contacto@empresa.com</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario de contacto -->
      <form
        @submit.prevent="handleSubmit"
        class="contact-form border border-yellow-300"
      >
        <div class="form-group">
          <input
            v-model="formData.name"
            type="text"
            placeholder="Tu nombre"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <input
            v-model="formData.email"
            type="email"
            placeholder="Tu email"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <input
            v-model="formData.subject"
            type="text"
            placeholder="Asunto"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <textarea
            v-model="formData.message"
            placeholder="Tu mensaje"
            required
            class="form-textarea"
          ></textarea>
        </div>
        <button type="submit" class="submit-btn">
          <span v-if="!isLoading">Enviar Mensaje</span>
          <Icon v-else name="mdi:loading" class="animate-spin" />
        </button>
        <Transition name="fade">
          <div v-if="isSubmitted" class="success-message">
            ¡Mensaje enviado con éxito!
          </div>
        </Transition>
      </form>
    </div>
  </div>
</template>

<script setup>
const formData = ref({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const isLoading = ref(false);
const isSubmitted = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    // Aquí iría la llamada a tu API
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de llamada

    isSubmitted.value = true;
    formData.value = {
      name: "",
      email: "",
      subject: "",
      message: "",
    };

    setTimeout(() => {
      isSubmitted.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.contact-page {
  @apply min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8;
}

.contact-container {
  @apply max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.contact-info {
  @apply p-8 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black;

  .info-items {
    @apply space-y-6 mt-8;
  }

  .info-item {
    @apply flex items-center space-x-4;

    h3 {
      @apply font-semibold text-lg text-black;
    }

    p {
      @apply text-black;
    }
  }
}

.contact-form {
  @apply p-8 space-y-6;

  .form-group {
    @apply space-y-1;
  }

  .form-input,
  .form-textarea {
    @apply w-full px-4 py-2 border border-gray-300 rounded-md
           focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
    transition: all 0.3s ease;

    &:focus {
      @apply outline-none;
    }
  }

  .form-textarea {
    @apply h-32 resize-none;
  }

  .submit-btn {
    @apply w-full bg-black text-white py-2 px-4 rounded-md
           hover:bg-black/50 focus:outline-none focus:ring-2
           focus:ring-blue-500 focus:ring-offset-2
           flex items-center justify-center;
    transition: all 0.3s ease;
  }

  .success-message {
    @apply mt-4 p-3 bg-green-100 text-green-700 rounded-md text-center;
  }
}

// Transiciones
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
