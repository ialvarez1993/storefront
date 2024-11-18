<!-- components/TransitionExpand.vue -->
<template>
  <transition
    name="expand"
    @enter="enter"
    @leave="leave"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <slot />
  </transition>
</template>

<script setup>
const enter = (element) => {
  const width = getComputedStyle(element).width;
  element.style.width = width;
  element.style.position = "absolute";
  element.style.visibility = "hidden";
  element.style.height = "auto";

  const height = getComputedStyle(element).height;

  element.style.width = null;
  element.style.position = null;
  element.style.visibility = null;
  element.style.height = 0;

  getComputedStyle(element).height;

  requestAnimationFrame(() => {
    element.style.height = height;
  });
};

const afterEnter = (element) => {
  element.style.height = "auto";
};

const leave = (element) => {
  const height = getComputedStyle(element).height;
  element.style.height = height;

  getComputedStyle(element).height;

  requestAnimationFrame(() => {
    element.style.height = 0;
  });
};

const afterLeave = (element) => {
  element.style.height = null;
};
</script>
