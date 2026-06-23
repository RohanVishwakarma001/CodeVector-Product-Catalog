import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Package, AlertCircle, Loader2, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton';
import { CategoryFilter } from '@/components/CategoryFilter';
import { useProducts } from '@/hooks/useProducts';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { type Category } from '@/types';
import type { Product } from '@/types';
import { formatNumber } from '@/lib/utils';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError, error } =
    useProducts({ category: selectedCategory });

  const allProducts = useMemo(() => {
    if (!data) return [] as Product[];
    return data.pages.flatMap((page) => page.products);
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    const q = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [allProducts, searchQuery]);

  const totalLoaded = allProducts.length;

  const handleFetchNext = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sentinelRef = useIntersectionObserver({
    onIntersect: handleFetchNext,
    enabled: hasNextPage && !isFetchingNextPage && !isLoading,
  });

  const handleCategoryChange = (cat: Category | undefined) => {
    setSelectedCategory(cat);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          </div>
          {totalLoaded > 0 && (
            <p className="text-sm text-white/40 ml-12">
              {formatNumber(totalLoaded)} products loaded
            </p>
          )}
        </motion.div>

        {/* Search + Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-8 space-y-4"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <CategoryFilter selected={selectedCategory} onChange={handleCategoryChange} />
        </motion.div>

        {/* Error state */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error?.message ?? 'Failed to load products'}
          </motion.div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <Package className="h-8 w-8 text-white/20" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-white/60">No products found</h3>
            <p className="text-sm text-white/30">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : 'Try selecting a different category'}
            </p>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory ?? 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}

                {/* Inline skeleton rows while fetching next page */}
                {isFetchingNextPage &&
                  Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={`skeleton-${i}`} />
                  ))}
              </motion.div>
            </AnimatePresence>

            {/* Intersection sentinel */}
            <div ref={sentinelRef} className="mt-8 flex items-center justify-center py-4">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-sm text-white/40">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading more products...
                </div>
              )}
              {!hasNextPage && totalLoaded > 0 && !searchQuery && (
                <p className="text-sm text-white/25">
                  All {formatNumber(totalLoaded)} products loaded
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
