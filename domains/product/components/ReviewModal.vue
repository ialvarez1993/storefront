<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg w-full max-w-2xl p-6 mx-4">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-semibold">Write a Review</h2>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700"
        >
          <Icon name="lucide:x" class="w-6 h-6" />
        </button>
      </div>

      <!-- Review Form -->
      <form @submit.prevent="submitReview">
        <!-- Rating -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Overall Rating</label
          >
          <div class="flex gap-2">
            <button
              v-for="star in 5"
              :key="star"
              type="button"
              @click="review.rating = star"
              class="focus:outline-none"
            >
              <Icon
                name="lucide:star"
                :class="[
                  'w-8 h-8',
                  star <= review.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-200',
                ]"
              />
            </button>
          </div>
        </div>

        <!-- Title -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Review Title</label
          >
          <input
            v-model="review.title"
            type="text"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Summarize your experience"
            required
          />
        </div>

        <!-- Review Content -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Your Review</label
          >
          <textarea
            v-model="review.content"
            rows="4"
            class="w-full px-3 py-2 border rounded-md"
            placeholder="Tell us about your experience"
            required
          ></textarea>
        </div>

        <!-- Recommendation -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Would you recommend this?</label
          >
          <div class="flex gap-4">
            <label class="flex items-center">
              <input
                type="radio"
                v-model="review.recommended"
                :value="true"
                class="mr-2"
              />
              Yes
            </label>
            <label class="flex items-center">
              <input
                type="radio"
                v-model="review.recommended"
                :value="false"
                class="mr-2"
              />
              No
            </label>
          </div>
        </div>

        <!-- Image Upload -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Add Photos</label
          >
          <div class="border-2 border-dashed rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
              ref="fileInput"
              multiple
            />
            <button
              type="button"
              @click="$refs.fileInput.click()"
              class="text-sm text-gray-600 hover:text-gray-800"
            >
              Click to upload or drag and drop
            </button>
          </div>
          <!-- Preview de imágenes -->
          <div v-if="review.images.length" class="flex gap-2 mt-2">
            <div
              v-for="(image, index) in review.images"
              :key="index"
              class="relative w-20 h-20"
            >
              <img :src="image" class="w-full h-full object-cover rounded" />
              <button
                @click="removeImage(index)"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Submit Review
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

const review = reactive({
  rating: 0,
  title: "",
  content: "",
  recommended: null,
  images: [],
});

const handleImageUpload = (event) => {
  const files = event.target.files;
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      review.images.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (index) => {
  review.images.splice(index, 1);
};

const submitReview = () => {
  // Aquí puedes enviar la review al backend
  console.log("Review submitted:", review);
  // Emitir evento al componente padre
  emit("submit", review);
  // Cerrar el modal
  emit("close");
};
</script>
