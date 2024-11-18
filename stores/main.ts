// stores/main.ts
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => ({
    isCompact: false,
    isMenuOpen: false,
    cartCount: 0,
    selectedCurrency: "VES",
  }),

  actions: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    updateCompact(value: boolean) {
      this.isCompact = value;
    },

    updateCurrency(currency: string) {
      this.selectedCurrency = currency;
    },
  },
});
