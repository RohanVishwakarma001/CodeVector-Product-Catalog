import { PrismaClient } from '@prisma/client';
import { CursorPayload } from '../utils/cursor';

const prisma = new PrismaClient();

export interface ProductFilters {
  category?: string;
  cursor?: CursorPayload;
  limit: number;
}

export interface ProductRow {
  id: string;
  name: string;
  category: string;
  price: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
}

export async function findProducts(filters: ProductFilters): Promise<ProductRow[]> {
  const { category, cursor, limit } = filters;

  const cursorDate = cursor ? new Date(cursor.updatedAt) : undefined;

  const where = {
    ...(category ? { category } : {}),
    ...(cursor && cursorDate
      ? {
          OR: [
            { updatedAt: { lt: cursorDate } },
            {
              updatedAt: { equals: cursorDate },
              id: { lt: cursor.id },
            },
          ],
        }
      : {}),
  };

  return prisma.product.findMany({
    where,
    orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
    take: limit,
  }) as Promise<ProductRow[]>;
}

export async function countProducts(category?: string): Promise<number> {
  return prisma.product.count({
    where: category ? { category } : undefined,
  });
}

export async function countByCategory(): Promise<{ category: string; count: bigint }[]> {
  return prisma.$queryRaw<{ category: string; count: bigint }[]>`
    SELECT category, COUNT(*) as count
    FROM "Product"
    GROUP BY category
    ORDER BY count DESC
  `;
}

export async function getDatabaseSize(): Promise<string> {
  const result = await prisma.$queryRaw<{ size: string }[]>`
    SELECT pg_size_pretty(pg_database_size(current_database())) as size
  `;
  return result[0]?.size ?? 'Unknown';
}
