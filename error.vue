<script setup lang="ts">
import { SfButton, SfIconArrowBack } from "@storefront-ui/vue";
const NuxtLink = resolveComponent("NuxtLink");
const error = useError();
</script>
<template>
  <NuxtLayout>
    <div
      v-if="error?.message === 'Product not found' || error?.statusCode === 404"
      class="flex flex-col justify-center items-center"
    >
      <div>
        <NuxtImg
          src="/images/something-went-wrong.svg"
          :alt="$t('emptyStateAltText')"
          width="300"
          height="300"
        />
        <p class="mt-8 font-medium">Pagina no encontrada</p>
        <div class="my-10">
          <SfButton
            to="/category/53"
            class="hidden md:flex"
            variant="secondary"
            :tag="NuxtLink"
          >
            <template #prefix>
              <SfIconArrowBack />
            </template>
            Volver a la tiendasas
          </SfButton>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mt-60">
        <NuxtImg
          class="mx-auto"
          src="/images/something-went-wrong.svg"
          :alt="$t('emptyStateAltText')"
          width="300"
          height="300"
        />
        <p class="mt-8 text-center font-medium">
          Vuelva a intentarlo mas tarde
        </p>
        <div class="my-10">
          <SfButton
            to="/category/53"
            class="hidden md:flex"
            variant="secondary"
            :tag="NuxtLink"
          >
            <template #prefix>
              <SfIconArrowBack />
            </template>
            Volver a la tienda
          </SfButton>
        </div>
      </div>
      <div /></div
  ></NuxtLayout>
</template>
