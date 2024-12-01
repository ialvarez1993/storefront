<script lang="ts" setup>
import { SfButton, SfInput, SfSwitch } from "@storefront-ui/vue";

type AccountFormsNameProps = {
  fullName?: string;
  email?: string;
};

const props = defineProps<AccountFormsNameProps>();
const { email, fullName } = toRefs(props);
defineEmits(["on-save", "on-cancel"]);
const userData = ref({
  fullName: fullName?.value ?? "",
  email: email?.value ?? "",
  subscribeNewsletter: true,
});
</script>
<template>
  <form data-testid="account-forms-name" @submit.prevent="$emit('on-save', userData)">
    <div class="md:flex flex-col justify-between gap-4">
      <label class="block flex-1">
        <UiFormLabel>{{
          $t("account.accountSettings.personalData.yourName")
        }}</UiFormLabel>
        <SfInput v-model="userData.fullName" name="fullname" type="text" required />
      </label>
      <label class="block flex-1">
        <UiFormLabel>{{
          $t("account.accountSettings.personalData.contactInformation")
        }}</UiFormLabel>
        <SfInput v-model="userData.email" name="email" type="text" required />
      </label>
      <label>
        <UiFormLabel>{{ $t("contactInfo.subescribe") }}</UiFormLabel>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="subscribeNewsletter" class="sr-only peer">
          <div class="w-11 h-6 bg-gray-200 rounded-full peer
    peer-focus:ring-2 peer-focus:ring-blue-300
    peer-checked:after:translate-x-full
    peer-checked:after:border-white
    after:content-['']
    after:absolute
    after:top-[2px]
    after:left-[2px]
    after:bg-white
    after:border-gray-300
    after:border
    after:rounded-full
    after:h-5
    after:w-5
    after:transition-all
    peer-checked:bg-blue-600">
          </div>
        </label>
      </label>
    </div>
    <div class="mt-6 flex flex-col-reverse md:flex-row md:justify-end gap-4">
      <SfButton class="bg-black text-white hover:bg-yellow-400" type="reset" variant="secondary"
        @click="$emit('on-cancel')">
        {{ $t("contactInfo.cancel") }}
      </SfButton>
      <SfButton type="submit" class="min-w-[120px] bg-yellow-400 text-white hover:bg-black">
        {{ $t("contactInfo.save") }}
      </SfButton>
    </div>
  </form>
</template>
