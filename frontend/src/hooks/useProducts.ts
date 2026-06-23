import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/services/api';

interface UseProductsOptions {
  category?: string;
  limit?: number;
}

export function useProducts({ category, limit = 20 }: UseProductsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ['products', category] as const,
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      fetchProducts({ cursor: pageParam, category, limit }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export type UseProductsResult = ReturnType<typeof useProducts>;
