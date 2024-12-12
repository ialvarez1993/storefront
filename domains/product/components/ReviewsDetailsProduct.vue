<!-- components/ReviewInterface.vue -->
<template>
  <div class="w-[90%] mt-12 mx-auto p-6">
    <h1
      class="text-center font-bold !font-header uppercase mb-6 typography-headline-3 md:typography-headline-2 text-gray-800"
    >
      Guest ratings & reviews
    </h1>

    <div class="grid grid-cols-3 gap-8 mb-8">
      <!-- Left Column - Rating Overview -->
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="text-3xl font-medium">3.7</span>
          <div class="flex">
            <Icon
              v-for="star in 4"
              :key="star"
              name="lucide:star"
              class="w-5 h-5 fill-yellow-400 text-yellow-400"
            />
            <Icon name="lucide:star" class="w-5 h-5 text-gray-200" />
          </div>
        </div>
        <p class="text-sm text-gray-500">7 user ratings</p>
        <div class="space-y-1 text-sm">
          <div
            v-for="(rating, key) in ratings"
            :key="key"
            class="flex items-center gap-1"
          >
            <span>{{ key }}</span>
            <span class="text-gray-500">{{ rating }} out of 5</span>
          </div>
        </div>
      </div>

      <!-- Middle Column - Rating Distribution -->
      <div class="space-y-2">
        <div
          v-for="rating in 5"
          :key="rating"
          class="flex items-center gap-2 text-sm"
        >
          <span class="w-3">{{ 6 - rating }}</span>
          <div class="flex-1 h-2 bg-gray-200 rounded-full">
            <div
              class="h-full bg-yellow-500 rounded-full"
              :style="{ width: getRatingWidth(6 - rating) }"
            />
          </div>
          <span class="w-8 text-right text-gray-500">{{
            getRatingCount(6 - rating)
          }}</span>
        </div>
      </div>

      <!-- Right Column - Recommendation -->
      <div class="text-center space-y-2">
        <div>
          <span class="text-yellow-500 font-medium">69%</span>
          <span class="text-sm text-gray-500"> would recommend</span>
        </div>
        <p class="text-sm text-gray-500">3 recommendations</p>
        <button
          @click="showReviewModal = true"
          class="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
        >
          Write a review
        </button>

        <!-- Añadir el componente del modal -->
        <ReviewModal
          v-if="showReviewModal"
          @close="showReviewModal = false"
          @submit="submitReview"
        />
      </div>
    </div>

    <!-- Reviews with Images -->
    <div class="mb-6">
      <h2 class="text-base font-medium mb-4">Reviews with images</h2>
      <div class="flex gap-2">
        <img
          v-for="(image, index) in reviewImages"
          :key="index"
          :src="image"
          :alt="`Review image ${index + 1}`"
          class="w-[120px] h-[120px] rounded object-cover"
        />
      </div>
    </div>

    <!-- Filter Controls -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">sort by</span>
          <select v-model="sortBy" class="text-sm border rounded px-2 py-1">
            <option value="recent">most recent</option>
            <option value="rating">highest rating</option>
          </select>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">filter by</span>
          <select v-model="filterBy" class="text-sm border rounded px-2 py-1">
            <option value="all">all ratings</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }} stars</option>
          </select>
        </div>
        <label class="flex items-center gap-2">
          <Checkbox v-model="showPhotosOnly" />
          <span class="text-sm text-gray-600">With photos</span>
        </label>
      </div>
      <span class="text-sm text-gray-500"
        >We found {{ filteredReviews.length }} matching reviews</span
      >
    </div>

    <!-- Reviews -->
    <div class="space-y-4">
      <div
        v-for="review in displayedReviews"
        :key="review.id"
        class="border rounded-lg p-4"
      >
        <div class="flex justify-between mb-1">
          <h3 class="font-medium">{{ review.title }} </h3>
          <span class="text-sm text-gray-500">{{ review.date }}</span>
        </div>
        <div class="flex items-center gap-2 mb-2">
          <div class="flex">
            <Icon
              v-for="star in 5"
              :key="star"
              name="lucide:star"
              :class="[
                'w-4 h-4',
                star <= review.rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-200',
              ]"
            />
          </div>
          <span
            :class="[
              'text-sm',
              review.recommended ? 'text-green-600' : 'text-orange-600',
            ]"
          >
            {{ review.recommended ? "Would recommend" : "Would not recommend" }}
          </span>
        </div>
        <p class="text-sm mb-4">{{ review.content }}</p>

        <img
          v-if="review.image"
          :src="review.image"
          :alt="review.title"
          class="w-[60px] h-[60px] rounded mb-4"
        />

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div
              v-for="(score, metric) in review.metrics"
              :key="metric"
              class="flex items-center gap-1"
            >
              <span class="text-sm text-gray-500">{{ metric }}</span>
              <span class="text-sm capitalize">{{ score }} out of 5</span>
            </div>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            {{ review.helpfulCount }} guests found this review helpful. Did you?
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Helpful
            </button>
            <button
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Not helpful
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      class="w-full mt-4 px-4 py-2 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
      @click="loadMoreReviews"
    >
      Show {{ remainingReviews }} more reviews
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

// Estado
const sortBy = ref("recent");
const filterBy = ref("all");
const showPhotosOnly = ref(false);
const displayLimit = ref(2);

const ratings = {
  "easy to setup": 3.7,
  quality: 2.7,
  value: 3.0,
};

const reviewImages = ["/images/display-1.png", "/images/display-1.png"];

interface Review {
  id: number;
  title: string;
  date: string;
  rating: number;
  recommended: boolean;
  content: string;
  image?: string;
  helpfulCount: number;
  metrics: Record<string, number>;
}

const reviews = ref<Review[]>([
  {
    id: 1,
    title: "Disappointed twice",
    date: "3 years ago",
    rating: 2,
    recommended: false,
    content:
      "Don't buy! I bought 2 and the white lights are two different colors on both trees. So frustrated!",
    image: "/images/display-1.png",
    helpfulCount: 7,
    metrics: {
      quality: 1.0,
      value: 1.0,
      "easy to setup": 1.0,
    },
  },
  {
    id: 2,
    title: "christmas tree",
    date: "3 years ago",
    rating: 4,
    recommended: true,
    content:
      "The set up was so easy! and I enjoy the lights that have many different settings",
    helpfulCount: 3,
    metrics: {
      quality: 4.0,
      value: 4.0,
      "easy to setup": 4.0,
    },
  },
  // Añade más reviews según necesites
]);

const showReviewModal = ref(false);

const submitReview = (review: any) => {
  // Aquí puedes manejar la lógica para guardar la review
  console.log("Review received:", review);
  // Actualizar la lista de reviews
  // Cerrar el modal
  showReviewModal.value = false;
};

// Computed properties
const filteredReviews = computed(() => {
  let filtered = [...reviews.value];

  if (filterBy.value !== "all") {
    filtered = filtered.filter(
      (review) => review.rating === Number(filterBy.value),
    );
  }

  if (showPhotosOnly.value) {
    filtered = filtered.filter((review) => review.image);
  }

  if (sortBy.value === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  return filtered;
});

const displayedReviews = computed(() => {
  return filteredReviews.value.slice(0, displayLimit.value);
});

const remainingReviews = computed(() => {
  return filteredReviews.value.length - displayLimit.value;
});

// Métodos
const getRatingWidth = (rating: number): string => {
  const percentages: Record<number, string> = {
    4: "40%",
    3: "30%",
    2: "20%",
    1: "10%",
    5: "10%",
  };
  return percentages[rating] || "0%";
};

const getRatingCount = (rating: number): string => {
  const counts: Record<number, string> = {
    4: "3",
    3: "2",
    2: "1",
    1: "0",
    5: "0",
  };
  return counts[rating] || "0";
};

const loadMoreReviews = () => {
  displayLimit.value += 2;
};
</script>
