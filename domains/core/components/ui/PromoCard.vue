<!-- components/PromoCard.vue -->
<template>
  <div class="promo-card">
    <div class="card-container" :class="{ 'blur-active': isBlurActive }">
      <!-- Gradient Background with Effects -->
      <div class="gradient-bg" />
      <div class="animated-particles" aria-hidden="true" />
      <div class="floating-shapes" aria-hidden="true">
        <span
          v-for="n in 5"
          :key="n"
          :style="{ animationDelay: `${n * 0.5}s` }"
        />
      </div>

      <!-- Main Content -->
      <div class="content-wrapper">
        <!-- Top Section -->
        <div class="top-section">
          <div class="header-content">
            <h2 class="title">
              Ofertas Especiales
              <span class="shine"></span>
            </h2>

            <div class="badges-wrapper">
              <span class="category-badge"> Tecnología </span>
              <span class="limited-badge"> Tiempo Limitado </span>
            </div>
          </div>

          <!-- Timer Section -->
          <div class="countdown-timer">
            <div
              v-for="(unit, index) in timeUnits"
              :key="index"
              class="time-unit"
            >
              <span class="number">{{ unit.value }}</span>
              <span class="label">{{ unit.label }}</span>
            </div>
          </div>
        </div>

        <!-- Middle Section -->
        <div class="middle-section">
          <div class="price-info">
            <div class="discount-tag">-40%</div>
            <div class="prices">
              <span class="original-price">999€</span>
              <span class="current-price rounded-lg px-3 bg-green-600"
                >599€</span
              >
            </div>
          </div>

          <div class="features">
            <div
              v-for="(feature, index) in features"
              :key="index"
              class="feature-item"
            >
              <Icon :name="feature.icon" class="feature-icon" />
              <span>{{ feature.text }}</span>
            </div>
          </div>
        </div>

        <!-- Product Display -->
        <div class="product-display">
          <NuxtImg
            src="/images/tv.png"
            alt="Smart TV 4K"
            class="product-image"
            loading="lazy"
          />

          <!-- Floating Features -->
          <div class="floating-features">
            <div
              v-for="(feat, index) in floatingFeatures"
              :key="index"
              class="float-feature"
              :class="feat.position"
            >
              {{ feat.text }}
            </div>
          </div>
        </div>

        <!-- Action Section -->
        <div class="action-section">
          <button class="cta-button" @click="handleClick">
            <span>Ver Oferta</span>
            <Icon name="heroicons:arrow-right" class="icon" />
          </button>

          <div class="stock-info">
            <div class="stock-bar">
              <div
                class="stock-progress"
                :style="{ width: stockPercentage + '%' }"
              />
            </div>
            <span class="stock-text"
              >¡Solo quedan {{ stockLeft }} unidades!</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isBlurActive = ref(false);
const stockLeft = ref(7);
const stockPercentage = computed(() => (stockLeft.value / 20) * 100);

const features = [
  { icon: "mdi:truck-delivery", text: "Envío Gratis" },
  { icon: "mdi:shield-check", text: "2 Años Garantía" },
  { icon: "mdi:credit-card", text: "12 Meses sin intereses" },
];

const floatingFeatures = [
  { text: "4K Ultra HD", position: "top-left" },
  { text: "Smart TV", position: "top-right" },
  { text: "HDR10+", position: "bottom-left" },
  { text: "Dolby Vision", position: "bottom-right" },
];

// Countdown Timer Logic
const timeUnits = reactive({
  hours: { value: 23, label: "Horas" },
  minutes: { value: 59, label: "Min" },
  seconds: { value: 59, label: "Seg" },
});

let timer: NodeJS.Timeout;

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  clearInterval(timer);
});

function startTimer() {
  timer = setInterval(() => {
    if (timeUnits.seconds.value > 0) {
      timeUnits.seconds.value--;
    } else {
      timeUnits.seconds.value = 59;
      if (timeUnits.minutes.value > 0) {
        timeUnits.minutes.value--;
      } else {
        timeUnits.minutes.value = 59;
        if (timeUnits.hours.value > 0) {
          timeUnits.hours.value--;
        } else {
          clearInterval(timer);
        }
      }
    }
  }, 1000);
}

function handleClick() {
  isBlurActive.value = true;
  setTimeout(() => {
    navigateTo("/producto/smart-tv-4k");
  }, 300);
}
</script>

<style lang="scss" scoped>
.promo-card {
  @apply relative w-full aspect-[2/6];
}

.card-container {
  @apply relative h-full w-full rounded-2xl overflow-hidden
         transition-all duration-500 ease-out
         hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(79,70,229,0.45)];

  background: linear-gradient(
    135deg,
    theme("colors.indigo.900") 0%,
    theme("colors.blue.900") 50%,
    theme("colors.indigo.800") 100%
  );

  &.blur-active {
    @apply blur-sm opacity-90;
  }
}

.gradient-bg {
  @apply absolute inset-0 opacity-50;
  background: radial-gradient(
    circle at center,
    theme("colors.blue.400/20") 0%,
    transparent 70%
  );
}

.animated-particles {
  @apply absolute inset-0 opacity-20;
  background-image: radial-gradient(
    circle,
    theme("colors.white") 1px,
    transparent 1px
  );
  background-size: 50px 50px;
  animation: particleFloat 20s linear infinite;
}

.floating-shapes {
  @apply absolute inset-0 overflow-hidden;

  span {
    @apply absolute block w-16 h-16 opacity-10;
    background: linear-gradient(
      45deg,
      theme("colors.blue.400"),
      theme("colors.indigo.400")
    );
    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
    animation: shapeFloat 10s ease-in-out infinite;
  }
}

.content-wrapper {
  @apply relative h-full w-full p-6 lg:p-8
         flex flex-col gap-6;
}

.top-section {
  @apply space-y-4;
}

.header-content {
  @apply space-y-3;
}

.title {
  @apply text-2xl lg:text-3xl font-bold text-white
         relative overflow-hidden;
}

.badges-wrapper {
  @apply flex flex-wrap gap-2;
}

.category-badge {
  @apply px-3 py-1 rounded-full text-sm font-medium
         bg-emerald-500 text-white
         transition-transform duration-300 hover:scale-105;
}

.limited-badge {
  @apply px-3 py-1 rounded-full text-sm font-medium
         bg-red-500 text-white
         animate-pulse;
}

.countdown-timer {
  @apply flex gap-3 mt-4;
}

.time-unit {
  @apply flex flex-col items-center
         bg-white/10 rounded-lg p-2
         backdrop-blur-sm;

  .number {
    @apply text-xl font-bold text-white;
  }

  .label {
    @apply text-xs text-white/80;
  }
}

.middle-section {
  @apply space-y-4;
}

.price-info {
  @apply flex items-center gap-4;
}

.discount-tag {
  @apply px-2 py-1 bg-red-500 text-white rounded-lg
         text-sm font-bold animate-pulse;
}

.prices {
  @apply flex flex-col;

  .original-price {
    @apply text-gray-400 line-through text-sm;
  }

  .current-price {
    @apply text-white font-bold text-2xl;
  }
}

.features {
  @apply flex flex-wrap gap-3;
}

.feature-item {
  @apply flex items-center gap-2
         px-3 py-1 rounded-full
         bg-white/10 backdrop-blur-sm
         text-white text-sm;

  .feature-icon {
    @apply w-4 h-4;
  }
}

.product-display {
  @apply relative flex-1 flex items-center justify-center;
}

.product-image {
  @apply w-64 lg:w-72 object-contain
         transition-all duration-500
         hover:scale-110 hover:translate-y-[-10px];
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.3));
}

.floating-features {
  @apply absolute inset-0;

  .float-feature {
    @apply absolute px-3 py-1
           bg-white/10 backdrop-blur-sm
           rounded-full text-white text-sm
           transform transition-transform duration-300;

    &.top-left {
      @apply top-4 left-4 hover:-translate-y-1;
    }

    &.top-right {
      @apply top-4 right-4 hover:-translate-y-1;
    }

    &.bottom-left {
      @apply bottom-4 left-4 hover:translate-y-1;
    }

    &.bottom-right {
      @apply bottom-4 right-4 hover:translate-y-1;
    }
  }
}

.action-section {
  @apply space-y-3;
}

.cta-button {
  @apply w-full flex items-center justify-center gap-2
         px-6 py-3 rounded-lg
         bg-gradient-to-r from-blue-500 to-indigo-500
         text-white font-medium
         transition-all duration-300
         hover:shadow-lg hover:shadow-blue-500/30
         active:scale-95;

  .icon {
    @apply w-5 h-5 transition-transform duration-300;
  }

  &:hover .icon {
    @apply translate-x-1;
  }
}

.stock-info {
  @apply space-y-2;
}

.stock-bar {
  @apply h-2 bg-white/10 rounded-full overflow-hidden;

  .stock-progress {
    @apply h-full bg-emerald-500
           transition-all duration-1000;
  }
}

.stock-text {
  @apply text-sm text-white/80 text-center block;
}

@keyframes particleFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50px);
  }
}

@keyframes shapeFloat {
  0%,
  100% {
    transform: translateY(0) rotate(0);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* Mobile Optimizations */
@media (max-width: 640px) {
  .content-wrapper {
    @apply p-4;
  }

  .product-image {
    @apply w-48;
  }

  .floating-features {
    @apply hidden;
  }

  .feature-item {
    @apply text-xs;
  }
}
</style>
