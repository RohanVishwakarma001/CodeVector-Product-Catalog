import axios from 'axios';
import { ProductsResponse, StatsResponse } from '@/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ?? err.message ?? 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export interface FetchProductsParams {
  cursor?: string;
  category?: string;
  limit?: number;
}

export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsResponse> {
  const searchParams: Record<string, string> = {};
  if (params.limit) searchParams.limit = String(params.limit);
  if (params.cursor) searchParams.cursor = params.cursor;
  if (params.category) searchParams.category = params.category;

  const { data } = await api.get<ProductsResponse>('/products', { params: searchParams });
  return data;
}

export async function fetchStats(): Promise<StatsResponse> {
  const { data } = await api.get<StatsResponse>('/products/stats');
  return data;
}
