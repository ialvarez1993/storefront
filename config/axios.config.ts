import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { useRuntimeConfig } from '#app';
import type { ErrorResponse } from '~/types/api.types'; // Importamos el tipo ErrorResponse


export class AxiosService {
  private static instance: AxiosService;
  private axiosInstance: AxiosInstance;
  private readonly baseURL: string;
  private readonly timeout: number = 30000;

  private constructor() {
    const config = useRuntimeConfig();
    // Aseguramos que baseURL sea string
    this.baseURL = config.public.apiBase as string;
    this.axiosInstance = this.createAxiosInstance();
    this.initializeInterceptors();
  }

  public static getInstance(): AxiosService {
    if (!AxiosService.instance) {
      AxiosService.instance = new AxiosService();
    }
    return AxiosService.instance;
  }

  private createAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 17eec83c15384dd6215b8357bbecc348e37308c2a5d098f9aa626d2f73c63ca9c920a35a6038347ca501edc727682984ac7b60eaa476f4a82c78b7f3b8f06f40fdd73e073ae5b67fb857dfbb698231fa16d1f3930778693e8bc9be84b0d4dd9746f2ded7b388c3b4db4fce6c8a96d8c242b43ebd5e474b286c9c531551b4fd86',
      },
      paramsSerializer: (params) => {
        return Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&');
      }
    });
  }


  private initializeInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Añadir token de autenticación si existe
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      this.handleError
    );
  }

  private handleError(error: AxiosError): Promise<never> {
    if (error.response?.status === 401) {
      // Manejar unauthorized
      navigateTo('/');
    }

    // Tipamos correctamente la respuesta de error
    const errorData = (error.response?.data as any) || {};

    const errorResponse: ErrorResponse = {
      message: errorData.message || 'An error occurred',
      code: errorData.code || 'UNKNOWN_ERROR',
      status: error.response?.status || 500,
    };

    return Promise.reject(errorResponse);
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
