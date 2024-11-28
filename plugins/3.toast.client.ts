import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, {
    timeout: 2000,
    position: "top-right",
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true,
    toastClassName: "custom-toast",
    bodyClassName: ["custom-toast-body"],
    containerClassName: "custom-toast-container",
    // Estilos personalizados para cada tipo de toast
    toastDefaults: {
      // Para success
      success: {
        timeout: 2000,
        icon: "✓",
        toastClassName: "custom-toast-success",
      },
      // Para error
      error: {
        timeout: 3000,
        icon: "✕",
        toastClassName: "custom-toast-error",
      },
      // Para warning
      warning: {
        timeout: 3000,
        icon: "⚠",
        toastClassName: "custom-toast-warning",
      },
      // Para info
      info: {
        timeout: 2000,
        icon: "ℹ",
        toastClassName: "custom-toast-info",
      },
    },
  });
});
