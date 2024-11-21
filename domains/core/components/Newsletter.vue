<script lang="ts" setup>
import { SfButton, SfLink } from "@storefront-ui/vue";
import { ref } from "vue";
import { useCore } from "../composable/useCore";

const { newsletterSubscribe } = useCore();

const inputValue = ref("");
const emailValidation = ref();

const subscribeNewsletter = async () => {
  await newsletterSubscribe({ email: inputValue.value });
  inputValue.value = "";
};
</script>
<template>
  <div class="relative">
    <div class="bg-black p-4 sm:p-10 text-center">
      <p
        class="typography-headline-4 text-white sm:typography-headline-3 font-bold"
      >
        {{ $t("newsletter.title") }}
      </p>
      <p
        class="typography-text-sm text-white sm:typography-text-base my-2 mb-4"
      >
        {{ $t("newsletter.title") }}
      </p>
      <form
        class="mb-4 flex flex-col sm:flex-row gap-4 max-w-[688px] mx-auto"
        @submit.prevent="subscribeNewsletter()"
      >
        <UiFormEmailInput
          v-model="inputValue"
          @is-field-valid="(n) => (emailValidation = n)"
        />
        <SfButton
          :disabled="!emailValidation"
          type="submit"
          class="bg-yellow-500 w-auto sm:w-[325px] disabled:bg-yellow-300 !text-black hover:bg-yellow-400"
        >
          {{ $t("newsletter.button") }}
        </SfButton>
      </form>
      <div class="typography-text-xs text-neutral-600">
        {{ $t("newsletter.disclaimer") }}
      </div>
    </div>
  </div>
</template>
