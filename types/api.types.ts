// types/api.types.ts
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface ErrorResponse {
  message: string;
  code: string;
  status: number;
}
