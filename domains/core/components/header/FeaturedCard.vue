<!-- components/SuperMenu/FeaturedCard.vue -->
<script setup>
defineProps({
  promo: {
    type: Object,
    required: true,
    validator: (promo) => {
      return promo.title && promo.image && promo.href;
    },
  },
});
</script>

<template>
  <NuxtLink :to="promo.href" class="featured-card">
    <div class="featured-card__image-container">
      <img
        :src="promo.image"
        :alt="promo.title"
        class="featured-card__image"
        loading="lazy"
      />
    </div>
    <div class="featured-card__content">
      <h4 class="featured-card__title">{{ promo.title }}</h4>
      <p v-if="promo.description" class="featured-card__description">
        {{ promo.description }}
      </p>
      <span class="featured-card__cta">
        {{ promo.ctaText || "Ver más" }}
        <IconArrowRight class="featured-card__cta-icon" />
      </span>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.featured-card {
  display: block;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);

    .featured-card__image {
      transform: scale(1.05);
    }
  }

  &__image-container {
    position: relative;
    padding-top: 56.25%; // 16:9 aspect ratio
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &__content {
    padding: 1rem;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: white;
  }

  &__title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  &__description {
    font-size: 0.875rem;
    margin-bottom: 1rem;
    opacity: 0.9;
  }

  &__cta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;

    &-icon {
      width: 1rem;
      height: 1rem;
      transition: transform 0.2s ease;
    }

    &:hover &-icon {
      transform: translateX(4px);
    }
  }
}
</style>
