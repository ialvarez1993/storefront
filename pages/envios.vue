<!-- pages/acerca-de-nosotros.vue -->
<template>
  <div class="container !mt-56">
    <section class="section" v-if="aboutData">
      <h2 class="section-title">Nuestra Historia</h2>
      <div class="historia-content">
        <div>
          <h3>Fundación</h3>
          <p>Establecidos en {{ aboutData.historia.fundacion }}</p>
          <h3>Fundadores</h3>
          <p>{{ aboutData.historia.fundadores.join(", ") }}</p>
        </div>
        <div>
          <h3>Misión</h3>
          <p>{{ aboutData.historia.mision }}</p>
          <h3>Visión</h3>
          <p>{{ aboutData.historia.vision }}</p>
        </div>
      </div>
    </section>

    <section class="section" v-if="aboutData">
      <h2 class="section-title">Nuestros Valores</h2>
      <div class="valores-grid">
        <div
          v-for="valor in aboutData.valores"
          :key="valor.nombre"
          class="valor-card"
        >
          <h3>{{ valor.nombre }}</h3>
          <p>{{ valor.descripcion }}</p>
        </div>
      </div>
    </section>

    <section class="section" v-if="aboutData">
      <h2 class="section-title">Nuestro Equipo</h2>
      <div class="equipo-cards">
        <div
          v-for="miembro in aboutData.equipo"
          :key="miembro.nombre"
          class="equipo-card"
        >
          <h3>{{ miembro.nombre }}</h3>
          <p>
            <strong>{{ miembro.cargo }}</strong>
          </p>
          <p>{{ miembro.descripcion }}</p>
          <p>Email: {{ miembro.contacto.email }}</p>
          <p>Tel: {{ miembro.contacto.telefono }}</p>
        </div>
      </div>
    </section>

    <section class="section" v-if="aboutData">
      <h2 class="section-title">Ubicaciones</h2>
      <div
        v-for="ubicacion in aboutData.ubicaciones"
        :key="ubicacion.tipo"
        class="ubicacion-info"
      >
        <h3>{{ ubicacion.tipo }}</h3>
        <p>{{ ubicacion.direccion }}</p>
        <p>{{ ubicacion.ciudad }}, {{ ubicacion.pais }}</p>
        <p>CP: {{ ubicacion.codigo_postal }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const aboutData = ref(null);
const { $fetchApi } = useNuxtApp();

onMounted(async () => {
  try {
    const response = await $fetchApi("http://localhost:4000/acerca_de_nosotros");
    aboutData.value = response
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  margin-bottom: 40px;
  padding: 30px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 2em;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.historia-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.valor-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.valor-card:hover {
  transform: translateY(-5px);
}

.equipo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.equipo-card {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.ubicacion-info {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .section {
    padding: 15px;
  }
}
</style>
