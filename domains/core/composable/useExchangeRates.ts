// @/composables/useExchangeRates.ts

import { ref } from 'vue';

interface ExchangeRate {
    [key: string]: number;
}

interface CurrencyInfo {
    code: string;
    name: string;
    symbol: string;
    rate?: number;
}

export interface ExchangeRateResponse {
    success: boolean;
    timestamp: number;
    base: string;
    rates: ExchangeRate;
}

export function useExchangeRates() {
    const rates: Ref<ExchangeRate> = ref({});
    const loading = ref(false);
    const error = ref<Error | null>(null);
    const lastUpdated = ref<Date | null>(null);

    // Cache para almacenar las tasas y reducir llamadas a la API
    const ratesCache: Map<string, { rates: ExchangeRate; timestamp: number }> = new Map();
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

    const isValidCache = (timestamp: number): boolean => {
        return Date.now() - timestamp < CACHE_DURATION;
    };

    const fetchRates = async (baseCurrency: string): Promise<void> => {
        try {
            // Verificar cache
            const cachedData = ratesCache.get(baseCurrency);
            if (cachedData && isValidCache(cachedData.timestamp)) {
                rates.value = cachedData.rates;
                lastUpdated.value = new Date(cachedData.timestamp);
                return;
            }

            loading.value = true;
            error.value = null;

            // Puedes usar tu propia API key de exchangerate-api.com o similar
            const API_KEY = process.env.EXCHANGE_RATE_API_KEY;
            const response = await fetch(
                `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${baseCurrency}`
            );

            if (!response.ok) {
                throw new Error('Error al obtener las tasas de cambio');
            }

            const data: ExchangeRateResponse = await response.json();

            // Actualizar estados
            rates.value = data.rates;
            lastUpdated.value = new Date();

            // Actualizar cache
            ratesCache.set(baseCurrency, {
                rates: data.rates,
                timestamp: Date.now(),
            });

        } catch (e) {
            error.value = e instanceof Error ? e : new Error('Error desconocido');
            // Usar tasas de respaldo en caso de error
            rates.value = getFallbackRates(baseCurrency);
        } finally {
            loading.value = false;
        }
    };

    // Convertir monto entre divisas
    const convertAmount = (
        amount: number,
        fromCurrency: string,
        toCurrency: string
    ): number => {
        if (!rates.value[toCurrency] || !rates.value[fromCurrency]) {
            return 0;
        }

        const rate = rates.value[toCurrency] / rates.value[fromCurrency];
        return Number((amount * rate).toFixed(2));
    };

    // Tasas de respaldo en caso de error con la API
    const getFallbackRates = (baseCurrency: string): ExchangeRate => {
        const fallbackRates: ExchangeRate = {
            USD: 1,
            BS: 35.95, // Tasa de respaldo para Bolívares
            EUR: 0.85,
            GBP: 0.73,
        };

        if (baseCurrency === 'USD') {
            return fallbackRates;
        }

        // Ajustar las tasas si la base no es USD
        const baseRate = fallbackRates[baseCurrency];
        const adjustedRates: ExchangeRate = {};

        Object.entries(fallbackRates).forEach(([currency, rate]) => {
            adjustedRates[currency] = rate / baseRate;
        });

        return adjustedRates;
    };

    // Formato de moneda
    const formatCurrency = (
        amount: number,
        currency: string,
        locale: string = 'es-VE'
    ): string => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // Obtener símbolo de la moneda
    const getCurrencySymbol = (currency: string, locale: string = 'es-VE'): string => {
        return (0).toLocaleString(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).replace(/\d/g, '').trim();
    };

    return {
        rates,
        loading,
        error,
        lastUpdated,
        fetchRates,
        convertAmount,
        formatCurrency,
        getCurrencySymbol,
    };
}

// Tipos exportados para uso en otros componentes
export type { ExchangeRate, CurrencyInfo };
