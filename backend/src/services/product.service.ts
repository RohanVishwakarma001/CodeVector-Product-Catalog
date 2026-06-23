import {
  findProducts,
  countProducts,
  countByCategory,
  getDatabaseSize,
} from '../repositories/product.repository';
import { encodeCursor, decodeCursor, CursorPayload } from '../utils/cursor';

export interface ProductDTO {
  id: string;
  name: string;
  category: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResult {
  products: ProductDTO[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface StatsResult {
  totalProducts: number;
  categories: number;
  dbSize: string;
  categoryBreakdown: { category: string; count: number }[];
}

export async function getProducts(
  limit: number,
  cursorToken?: string,
  category?: string
): Promise<ProductsResult> {
  const clampedLimit = Math.min(Math.max(limit, 1), 100);
  const fetchLimit = clampedLimit + 1;

  let cursor: CursorPayload | undefined;
  if (cursorToken) {
    cursor = decodeCursor(cursorToken);
  }

  const rows = await findProducts({ category, cursor, limit: fetchLimit });

  const hasMore = rows.length > clampedLimit;
  const items = hasMore ? rows.slice(0, clampedLimit) : rows;

  const last = items[items.length - 1];
  const nextCursor =
    hasMore && last
      ? encodeCursor({ updatedAt: last.updatedAt.toISOString(), id: last.id })
      : null;

  return {
    products: items.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price.toString(),
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    })),
    nextCursor,
    hasMore,
  };
}

export async function getStats(): Promise<StatsResult> {
  const [totalProducts, categoryRows, dbSize] = await Promise.all([
    countProducts(),
    countByCategory(),
    getDatabaseSize(),
  ]);

  return {
    totalProducts,
    categories: categoryRows.length,
    dbSize,
    categoryBreakdown: categoryRows.map((r) => ({
      category: r.category,
      count: Number(r.count),
    })),
  };
}
