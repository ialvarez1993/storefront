<template>
  <div
    class="w-[95%] mx-auto bg-card rounded-lg transition-shadow duration-300"
  >
    <div class="p-8 pt-0">
      <h2
        class="text-2xl font-bold tracking-tight mb-4 flex items-center gap-2 animate-fade-in"
      >
        <span>✨ Detalles de Produtos</span>
        <span class="text-primary animate-bounce">🛍️</span>
      </h2>
      <Separator class="mb-6" />
      <ScrollArea class="pr-4">
        <Accordion type="single" collapsible class="space-y-4">
          <!-- Details Section -->
          <AccordionItem
            value="details"
            class="border rounded-lg px-6 hover:border-primary transition-colors duration-200"
          >
            <AccordionTrigger
              class="text-lg font-medium hover:text-primary hover:no-underline group"
            >
              <span class="flex items-center gap-2">
                <span
                  class="transform group-hover:scale-110 transition-transform duration-200"
                  >📋</span
                >
                Details
              </span>
            </AccordionTrigger>
            <AccordionContent class="text-muted-foreground animate-slide-down">
              <div class="space-y-4 pb-4 pl-8">
                <p class="leading-relaxed">
                  Experience premium quality and craftsmanship with our latest
                  product. Designed with attention to detail and built to last,
                  this item represents the perfect blend of form and function.
                </p>
                <ul class="list-none space-y-3">
                  <li
                    class="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span class="text-lg">🌟</span> Premium materials
                  </li>
                  <li
                    class="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span class="text-lg">⚒️</span> Expertly crafted
                  </li>
                  <li
                    class="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span class="text-lg">🎨</span> Modern design
                  </li>
                  <li
                    class="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <span class="text-lg">💪</span> Built to last
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Specifications Section -->
          <AccordionItem
            value="specifications"
            class="border rounded-lg px-6 hover:border-primary transition-colors duration-200"
          >
            <AccordionTrigger
              class="text-lg font-medium hover:text-primary hover:no-underline group"
            >
              <span class="flex items-center gap-2">
                <span
                  class="transform group-hover:scale-110 transition-transform duration-200"
                  >📊</span
                >
                Specifications
              </span>
            </AccordionTrigger>
            <AccordionContent class="text-muted-foreground animate-slide-down">
              <div class="grid grid-cols-2 gap-6 pb-4 pl-8">
                <div class="space-y-4">
                  <h4
                    class="font-semibold text-lg flex items-center gap-2 text-primary"
                  >
                    <span>📏</span> Dimensions
                  </h4>
                  <div class="space-y-2 pl-6">
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span class="font-medium">Length:</span> 10 inches
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span class="font-medium">Width:</span> 5 inches
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span class="font-medium">Height:</span> 2 inches
                    </p>
                  </div>
                </div>
                <div class="space-y-4">
                  <h4
                    class="font-semibold text-lg flex items-center gap-2 text-primary"
                  >
                    <span>🛠️</span> Materials
                  </h4>
                  <div class="space-y-2 pl-6">
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span class="font-medium">Body:</span> Aluminum
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span class="font-medium">Finish:</span> Anodized
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span class="font-medium">Interior:</span> Foam-lined
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Shipping Section -->
          <AccordionItem
            value="shipping"
            class="border rounded-lg px-6 hover:border-primary transition-colors duration-200"
          >
            <AccordionTrigger
              class="text-lg font-medium hover:text-primary hover:no-underline group"
            >
              <span class="flex items-center gap-2">
                <span
                  class="transform group-hover:scale-110 transition-transform duration-200"
                  >🚚</span
                >
                Shipping & Returns
              </span>
            </AccordionTrigger>
            <AccordionContent class="text-muted-foreground animate-slide-down">
              <div class="space-y-6 pb-4 pl-8">
                <div class="space-y-4">
                  <h4
                    class="font-semibold text-lg flex items-center gap-2 text-primary"
                  >
                    <span>📦</span> Shipping
                  </h4>
                  <div class="space-y-2 pl-6">
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>🎁</span> Free standard shipping on orders over $50
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>⚡</span> Express shipping available
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>🌍</span> International shipping to select countries
                    </p>
                  </div>
                </div>
                <div class="space-y-4">
                  <h4
                    class="font-semibold text-lg flex items-center gap-2 text-primary"
                  >
                    <span>↩️</span> Returns
                  </h4>
                  <div class="space-y-2 pl-6">
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>📅</span> 30-day return policy
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>💫</span> Free returns on unused items
                    </p>
                    <p
                      class="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span>📦</span> Original packaging required
                    </p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <!-- Q&A Section -->
          <AccordionItem
            value="qa"
            class="border rounded-lg px-6 hover:border-primary transition-colors duration-200"
          >
            <AccordionTrigger
              class="text-lg font-medium hover:text-primary hover:no-underline group"
            >
              <span class="flex items-center gap-2">
                <span
                  class="transform group-hover:scale-110 transition-transform duration-200"
                  >❓</span
                >
                Q&A ({{ qaItems.length }})
              </span>
            </AccordionTrigger>
            <AccordionContent class="animate-slide-down">
              <div class="space-y-6 pb-4 pl-8">
                <div
                  v-for="item in qaItems"
                  :key="item.id"
                  class="space-y-3 hover:bg-gray-50 p-4 rounded-lg transition-colors"
                >
                  <div class="flex items-start gap-3">
                    <div class="font-semibold text-primary text-lg">Q:</div>
                    <div class="font-medium">{{ item.question }}</div>
                  </div>
                  <div
                    class="flex items-start gap-3 text-muted-foreground pl-8"
                  >
                    <div class="font-semibold text-lg">A:</div>
                    <div>{{ item.answer }}</div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface QAItem {
  id: number;
  question: string;
  answer: string;
}

const qaItems = ref<QAItem[]>([
  {
    id: 1,
    question: "What are the care instructions for this product?",
    answer:
      "Clean with a soft, dry cloth. Avoid using harsh chemicals or abrasive materials. Store in a cool, dry place when not in use.",
  },
  {
    id: 2,
    question: "What are the care instructions for this product?",
    answer:
      "Clean with a soft, dry cloth. Avoid using harsh chemicals or abrasive materials. Store in a cool, dry place when not in use.",
  },
  {
    id: 3,
    question: "What are the care instructions for this product?",
    answer:
      "Clean with a soft, dry cloth. Avoid using harsh chemicals or abrasive materials. Store in a cool, dry place when not in use.",
  },
  {
    id: 4,
    question: "What are the care instructions for this product?",
    answer:
      "Clean with a soft, dry cloth. Avoid using harsh chemicals or abrasive materials. Store in a cool, dry place when not in use.",
  },
]);
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
