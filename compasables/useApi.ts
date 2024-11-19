// composables/useApi.ts
import { useQuery, useMutation } from '@tanstack/vue-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/vue-query';
import { AxiosService } from '~/config/axios.config';
import type { ApiResponse, ErrorResponse } from '~/types/api.types'; // Importamos los tipos necesarios
import type { Data as AboutData } from '~/types/aceda-de'; // Importamos los tipos necesarios

export class ApiService<T> {
    private axiosService: AxiosService;

    constructor() {
        this.axiosService = AxiosService.getInstance();
    }

    useGet<TResponse = T>(
        endpoint: string,
        queryKey: string[],
        options?: Omit<UseQueryOptions<ApiResponse<TResponse>>, 'queryKey' | 'queryFn'>
    ) {
        return useQuery({
            queryKey,
            queryFn: async () => {
                const response = await this.axiosService
                    .getAxiosInstance()
                    .get<ApiResponse<TResponse>>(endpoint);
                return response.data;
            },
            ...options,
        });
    }

    usePost<TData = any, TResponse = T>(
        endpoint: string,
        options?: UseMutationOptions<ApiResponse<TResponse>, ErrorResponse, TData>
    ) {
        return useMutation({
            mutationFn: async (data: TData) => {
                const response = await this.axiosService
                    .getAxiosInstance()
                    .post<ApiResponse<TResponse>>(endpoint, data);
                return response.data;
            },
            ...options,
        });
    }

    usePut<TData = any, TResponse = T>(
        endpoint: string,
        options?: UseMutationOptions<ApiResponse<TResponse>, ErrorResponse, TData>
    ) {
        return useMutation({
            mutationFn: async (data: TData) => {
                const response = await this.axiosService
                    .getAxiosInstance()
                    .put<ApiResponse<TResponse>>(endpoint, data);
                return response.data;
            },
            ...options,
        });
    }

    useDelete<TResponse = T>(
        endpoint: string,
        options?: UseMutationOptions<ApiResponse<TResponse>, ErrorResponse, void>
    ) {
        return useMutation({
            mutationFn: async () => {
                const response = await this.axiosService
                    .getAxiosInstance()
                    .delete<ApiResponse<TResponse>>(endpoint);
                return response.data;
            },
            ...options,
        });
    }
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
}

export class UserApi extends ApiService<User> {
    private static instance: UserApi;
    private readonly baseEndpoint = '/users';

    private constructor() {
        super();
    }

    public static getInstance(): UserApi {
        if (!UserApi.instance) {
            UserApi.instance = new UserApi();
        }
        return UserApi.instance;
    }

    public useGetUsers(options?: UseQueryOptions<ApiResponse<User[]>>) {
        return this.useGet<User[]>(this.baseEndpoint, ['users'], options);
    }

    public useGetUserById(id: number, options?: UseQueryOptions<ApiResponse<User>>) {
        return this.useGet<User>(`${this.baseEndpoint}/${id}`, ['users', id.toString()], options);
    }

    public useCreateUser(options?: UseMutationOptions<ApiResponse<User>, ErrorResponse, CreateUserDTO>) {
        return this.usePost<CreateUserDTO, User>(this.baseEndpoint, options);
    }
}


