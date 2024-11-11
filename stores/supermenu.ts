import { defineStore } from "pinia";
import { useQuery } from "@tanstack/vue-query";
import api from "../src/api/axios"; // Importamos nuestra instancia de axios

// Definimos las interfaces para los productos, categorías y carrito
interface Producto {
  id: number;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  imagen: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

interface CarritoItem {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

interface PanelContent {
  productos: Producto[];
  categorias: Categoria[];
  carrito: CarritoItem[];
}

export const useSupermenuStore = defineStore("supermenu", {
  state: () => ({
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPanelContent(): Promise<PanelContent | null> {
      // Esta función será eliminada en favor de Vue Query
      return null;
    },
  },

  getters: {
    // Aquí podríamos agregar algún getter si fuera necesario
  },
});

// Función para obtener los datos de la API
const fetchPanelData = async (): Promise<PanelContent> => {
  const productos = await api.get("/productos");
  const categorias = await api.get("/categorias");
  const carrito = await api.get("/carrito");

  return {
    productos: productos.data,
    categorias: categorias.data,
    carrito: carrito.data,
  };
};

// Usa Vue Query para gestionar el estado de la API
export const useSupermenuQuery = () => {
  return useQuery<PanelContent>({
    queryKey: ["panelData"], // El identificador del query
    queryFn: fetchPanelData, // Función que obtiene los datos
    staleTime: 1000 * 60 * 2, // Los datos no se consideran obsoletos hasta después de 2 minutos
    refetchOnWindowFocus: false, // No hacer refetch cuando se vuelve a enfocar la ventana
    retry: 3, // Reintentar hasta 3 veces en caso de error
  });
};
