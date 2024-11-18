<template>
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
import iconDelivery from "./icon/Delivery.vue";
import iconHouse from "./icon/House.vue";
import iconCreditCard from "./icon/CreditCard.vue";
import iconSafety from "./icon/Safety.vue";

const cardDetails = [
  {
    icon: iconDelivery,
    title: "benefits.shipping.title",
    description: "benefits.shipping.subtitle",
    isDisabled: false,
  },
  {
    icon: iconHouse,
    title: "benefits.homeDelivery.title",
    description: "benefits.homeDelivery.subtitle",
    isDisabled: false,
  },
  {
    icon: iconCreditCard,
    title: "benefits.securePay.title",
    description: "benefits.securePay.subtitle",
    isDisabled: false,
  },
  {
    icon: iconSafety,
    title: "benefits.trust.title",
    description: "benefits.trust.subtitle",
    isDisabled: false,
  },
];
</script>
