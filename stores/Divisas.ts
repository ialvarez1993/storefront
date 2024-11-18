import { defineStore } from 'pinia'

export const useExchangeStore = defineStore('exchange', {
  state: () => ({
    baseCurrency: 'BS', // Divisa base por defecto
    currencies: {
      USD: {
        name: 'Dólar estadounidense',
        symbol: 'USD'
      },
      VEF: {
        name: 'Bolívar soberano',
        symbol: 'BS'
      },
    },
    rates: {
      // Tasa de cambio actualizada: { divisa: tasa }
      VEF: 45.05 // Ejemplo: 1 USD equivale a 1000 VEF
    }
  }),
  actions: {
    async fetchRates() {
      // Lógica para obtener las tasas de cambio de una API externa
      const response = await fetch('https://api.example.com/exchange-rates');
      const data = await response.json();
      this.rates = data.rates;
    },
    convert(amount, from, to) {
      if (!this.rates[to]) {
        console.error('Divisa de destino no encontrada');
        return;
      }
      const rate = this.rates[to];
      return amount * rate;
    }
  }
})
