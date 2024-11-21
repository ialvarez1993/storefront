<!-- components/SuperMenu/MenuPanel.vue -->
<script setup>
const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  panelData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["itemClick"]);
</script>

<template>
  <div class="menu-panel">
    <div
      v-for="(column, index) in panelData.columns"
      :key="index"
      class="menu-panel__column"
    >
      <h3 class="menu-panel__title">{{ column.title }}</h3>
      <ul class="menu-panel__list">
        <li
          v-for="item in column.items"
          :key="item.id"
          class="menu-panel__item"
        >
          <NuxtLink
            :to="item.href"
            class="menu-panel__link"
            @click="emit('itemClick', item)"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="menu-panel__item-image"
              loading="lazy"
            />
            <div class="menu-panel__item-content">
              <span class="menu-panel__item-title">{{ item.title }}</span>
              <span
                v-if="item.description"
                class="menu-panel__item-description"
              >
                {{ item.description }}
              </span>
              <span
                v-if="item.badge"
                class="menu-panel__item-badge"
                :class="item.badge.type"
              >
                {{ item.badge.text }}
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem;

  &__column {
    min-width: 0;
  }

  &__title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--supermenu-text);
    margin-bottom: 1rem;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 0.5rem;
  }

  &__link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;

    &:hover {
      background-color: var(--gray-50, #f9fafb);
    }
  }

  &__item-image {
    width: 2.5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: 0.25rem;
  }

  &__item-content {
    flex: 1;
    min-width: 0;
  }

  &__item-title {
    display: block;
    font-weight: 500;
  }

  &__item-description {
    display: block;
    font-size: 0.875rem;
    color: var(--gray-600, #4b5563);
  }

  &__item-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;

    &.new {
      background-color: var(--green-100, #d1fae5);
      color: var(--green-800, #065f46);
    }

    &.hot {
      background-color: var(--red-100, #fee2e2);
      color: var(--red-800, #991b1b);
    }
  }
}
</style>
