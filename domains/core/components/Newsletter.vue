<script lang="ts" setup>
import { SfButton, SfLink } from '@storefront-ui/vue'
import { ref } from 'vue'
import { useCore } from '../composable/useCore'

const { newsletterSubscribe } = useCore()

const inputValue = ref('')
const emailValidation = ref()

const subscribeNewsletter = async () => {
  await newsletterSubscribe({ email: inputValue.value })
  inputValue.value = ''
}
</script>
<template>
  <div class="relative">
    <div class="bg-black p-4 sm:p-10 text-center">
      <p class="typography-headline-4 text-white sm:typography-headline-3 font-bold">
        Sé el primero en enterarte de ofertas especiales, regalos y eventos exclusivos.
      </p>
      <p class="typography-text-sm text-white sm:typography-text-base my-2 mb-4">
        Sé el primero en enterarte de ofertas especiales, regalos y eventos exclusivos.
      </p>
      <form
        class="mb-4 flex flex-col sm:flex-row gap-4 max-w-[688px] mx-auto"
        @submit.prevent="subscribeNewsletter()"
      >
        <UiFormEmailInput v-model="inputValue" @is-field-valid="(n) => (emailValidation = n)" />
        <SfButton
          :disabled="!emailValidation"
          type="submit"
          class="w-[325px] bg-yellow-500 disabled:bg-yellow-300 !text-black hover:bg-yellow-400"
        >
          Suscribirse al boletín
        </SfButton>
      </form>
      <div class="typography-text-xs text-neutral-600">
        Para más información sobre cómo gestionamos tus datos, consulta nuestro
        <SfLink href="#" class="!text-neutral-600">Aviso de Privacidad</SfLink>. Puedes cancelar tu
        suscripción en cualquier momento sin coste alguno.
      </div>
    </div>
  </div>
</template>
