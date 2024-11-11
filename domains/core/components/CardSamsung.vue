<template>
  <section class="hero-section relative h-screen w-full overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 bg-gradient-overlay">
      <NuxtImg
        src="/images/display-2.png"
        alt="Modern Samsung washing machine in a clean laundry room"
        class="object-cover w-full h-full transform scale-105 animate-ken-burns"
        loading="eager"
      />
    </div>

    <!-- Animated Particles Background -->
    <div class="particles-container absolute inset-0"></div>

    <!-- Main Content -->
    <div
      class="absolute inset-0 flex items-center container mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div class="content-wrapper max-w-4xl animate-slide-up">
        <!-- Title Group -->
        <div class="space-y-6">
          <h1 class="title-group relative">
            <span
              class="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight animate-text-reveal"
            >
              LO ÚLTIMO EN <br />
              <span class="text-gradient">LAVADORAS AL 50%</span>
            </span>
          </h1>

          <p
            class="text-xl sm:text-2xl text-white/90 font-light animate-fade-in"
          >
            Oportunidad única, lavadora/Secadora SAMSUNG con tecnología de
            última generación
          </p>

          <!-- Features List -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const features = [
  { icon: "fas fa-tint", text: "Ahorro de agua hasta 40%" },
  { icon: "fas fa-bolt", text: "Eficiencia energética A+++" },
  { icon: "fas fa-shield-alt", text: "10 años de garantía" },
];

const handleButtonHover = () => {
  // Aquí puedes agregar lógica adicional para el hover si lo deseas
};
</script>

<style lang="scss" scoped>
.hero-section {
  perspective: 1000px;
}

.bg-gradient-overlay {
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      45deg,
      rgba(0, 0, 0, 0.7) 0%,
      rgba(0, 0, 0, 0.4) 100%
    );
    z-index: 1;
  }
}

.animate-ken-burns {
  animation: kenBurns 20s ease-in-out infinite alternate;
}

@keyframes kenBurns {
  0% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1.15);
  }
}

.text-gradient {
  background: linear-gradient(90deg, #fdb813, #ff9800);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.content-wrapper {
  z-index: 2;
}

.animate-text-reveal {
  animation: textReveal 1s ease-out forwards;
}

.animate-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 1s ease-out forwards;
}

.feature-item {
  @apply flex flex-col items-center text-center p-4 backdrop-blur-sm
           bg-white/5 rounded-lg border border-white/10 transition-all duration-300;

  &:hover {
    @apply bg-white/10 transform scale-105;
  }
}

.cta-button {
  @apply bg-[#FDB813] text-white rounded-lg transition-all duration-500;

  .btn-background {
    @apply absolute inset-0 -z-10 bg-gradient-to-r from-[#FDB813] to-[#FF9800]
             transform scale-x-0 origin-left transition-transform duration-500;
  }

  &:hover {
    .btn-background {
      @apply scale-x-100;
    }
  }
}

@keyframes textReveal {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// Particles animation
.particles-container {
  &::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle, #fff 1px, transparent 1px);
    background-size: 50px 50px;
    opacity: 0.1;
    animation: particlesFloat 20s linear infinite;
  }
}

@keyframes particlesFloat {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50px);
  }
}
</style>
