<template>
  <div class="!bg-white p-2">
    <div class="container">
      <div class="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap justify-center">
        <div
          v-for="(
            { icon, title, description, isDisabled }, index
          ) in cardDetails"
          :key="`${title}-${index}`"
          class="flex w-full max-w-[325px] sm:w-[375px] lg:w-[496px] items-left"
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
              {{ title }}
            </p>
            <p
              :class="[
                'mt-1 mb-4 font-normal typography-text-sm text-neutral-700 text-left',
                { 'text-disabled-700': isDisabled },
              ]"
            >
              {{ description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import iconDelivery from "./icon/Delivery.vue";
import iconHouse from "./icon/House.vue";
import iconCreditCard from "./icon/CreditCard.vue";
import iconSafety from "./icon/Safety.vue";

const cardDetails = [
  {
    icon: iconDelivery,
    title: "Envíos gratis",
    description: " en toda Venezuela",
    isDisabled: false,
  },
  {
    icon: iconHouse,
    title: "Recibe en tu casa",
    description: "Sin salir, a tan solo un click",
    isDisabled: false,
  },
  {
    icon: iconCreditCard,
    title: "Pagos 100% seguros",
    description: "Todos los métodos de pago",
    isDisabled: false,
  },
  {
    icon: iconSafety,
    title: "Confianza y seguridad",
    description: "Estamos respaldados",
    isDisabled: false,
  },
];
</script>
