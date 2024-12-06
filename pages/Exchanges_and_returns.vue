<!-- pages/cambios-devoluciones.vue -->
<template>
  <div class="cambios-devoluciones !mt-[13rem]">
    <div class="banner">
      <h1>Cambios y Devoluciones</h1>
    </div>

    <div class="container">
      <section class="politica-seccion">
        <h2>Política de Cambios y Devoluciones</h2>
        <p>
          En [Nombre de la Tienda] queremos que estés completamente satisfecho
          con tu compra. Por eso te ofrecemos una política de cambios y
          devoluciones flexible y transparente.
        </p>
      </section>

      <section class="plazos-seccion">
        <h3>Plazos para realizar cambios o devoluciones</h3>
        <div class="plazo-card">
          <div class="plazo-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <p>
            <strong>30 días</strong> a partir de la fecha de compra para
            productos en general
          </p>
        </div>
      </section>

      <section class="requisitos-seccion">
        <h3>Requisitos indispensables</h3>
        <div class="requisitos-grid">
          <div class="requisito-item">
            <i class="fas fa-box"></i>
            <h4>Producto en condiciones originales</h4>
            <p>Sin usar y con todas sus etiquetas</p>
          </div>
          <div class="requisito-item">
            <i class="fas fa-receipt"></i>
            <h4>Comprobante de compra</h4>
            <p>Factura o ticket original</p>
          </div>
          <div class="requisito-item">
            <i class="fas fa-tag"></i>
            <h4>Etiquetas originales</h4>
            <p>Todas las etiquetas adheridas</p>
          </div>
          <div class="requisito-item">
            <i class="fas fa-box-open"></i>
            <h4>Embalaje original</h4>
            <p>En perfectas condiciones</p>
          </div>
        </div>
      </section>

      <section class="proceso-seccion">
        <h3>Proceso de devolución</h3>
        <div class="proceso-pasos">
          <div class="paso">
            <div class="paso-numero">1</div>
            <h4>Contacta con nosotros</h4>
            <p>
              Llena el formulario de devolución o llama a nuestro servicio al
              cliente
            </p>
          </div>
          <div class="paso">
            <div class="paso-numero">2</div>
            <h4>Empaca el producto</h4>
            <p>Asegúrate de incluir todos los elementos originales</p>
          </div>
          <div class="paso">
            <div class="paso-numero">3</div>
            <h4>Envía el paquete</h4>
            <p>Utiliza la etiqueta de envío proporcionada</p>
          </div>
          <div class="paso">
            <div class="paso-numero">4</div>
            <h4>Reembolso</h4>
            <p>Procesaremos tu reembolso en 5-7 días hábiles</p>
          </div>
        </div>
      </section>

      <section class="excepciones-seccion">
        <h3>Excepciones</h3>
        <div class="excepciones-lista">
          <p>
            <i class="fas fa-exclamation-circle"></i> Artículos en oferta o
            liquidación
          </p>
          <p>
            <i class="fas fa-exclamation-circle"></i> Ropa interior y trajes de
            baño
          </p>
          <p>
            <i class="fas fa-exclamation-circle"></i> Productos personalizados
          </p>
          <p>
            <i class="fas fa-exclamation-circle"></i> Artículos de higiene
            personal
          </p>
        </div>
      </section>

      <section class="contacto-seccion">
        <h3>¿Necesitas ayuda?</h3>
        <div class="contacto-info">
          <p><i class="fas fa-phone"></i> Llámanos: 800-123-4567</p>
          <p><i class="fas fa-envelope"></i> Email: devoluciones@tienda.com</p>
          <p>
            <i class="fas fa-clock"></i> Horario: Lunes a Viernes 9:00 - 18:00
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "CambiosDevoluciones",
  head() {
    return {
      title: "Cambios y Devoluciones | Nombre de la Tienda",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Conoce nuestra política de cambios y devoluciones. Te explicamos el proceso paso a paso.",
        },
      ],
    };
  },
};
</script>

<style scoped>
.cambios-devoluciones {
  margin-top: 10rem;
  width: 100%;
}

.banner {
  background: linear-gradient(to right, #2c3e50, #3498db);
  color: white;
  padding: 3rem 1rem;
  text-align: center;
}

.banner h1 {
  font-size: 2.5rem;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

section {
  margin-bottom: 3rem;
}

h2,
h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.5rem;
}

.politica-seccion p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #666;
}

.plazo-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.plazo-icon {
  font-size: 2rem;
  color: #3498db;
}

.requisitos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.requisito-item {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.requisito-item i {
  font-size: 2rem;
  color: #3498db;
  margin-bottom: 1rem;
}

.proceso-pasos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.paso {
  text-align: center;
  position: relative;
}

.paso-numero {
  width: 40px;
  height: 40px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-weight: bold;
}

.excepciones-lista {
  background: #fff3f3;
  padding: 1.5rem;
  border-radius: 8px;
}

.excepciones-lista p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.excepciones-lista i {
  color: #e74c3c;
}

.contacto-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.contacto-info p {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contacto-info i {
  color: #3498db;
}

@media (max-width: 768px) {
  .banner h1 {
    font-size: 2rem;
  }

  .requisitos-grid,
  .proceso-pasos {
    grid-template-columns: 1fr;
  }

  section {
    margin-bottom: 2rem;
  }
}
</style>
