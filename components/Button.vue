<!-- components/Button.vue -->
<template>
  <button
    :class="['button', { 'button--primary': primary }]"
    @click="$emit('click', $event)"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  primary?: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
}

.button--primary {
  background-color: #0070f3;
  color: white;
  border-color: #0070f3;
}
</style>
