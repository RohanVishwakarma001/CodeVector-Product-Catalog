import { Request, Response } from 'express';
import { z } from 'zod';
import { getProducts, getStats } from '../services/product.service';
import { sendSuccess, sendError } from '../utils/response';

const QuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
  category: z.string().optional(),
});

const VALID_CATEGORIES = new Set([
  'Electronics', 'Fashion', 'Books', 'Sports',
  'Home', 'Beauty', 'Toys', 'Gaming',
]);

export async function listProducts(req: Request, res: Response): Promise<void> {
  const parsed = QuerySchema.safeParse(req.query);
  if (!parsed.success) {
    sendError(res, parsed.error.errors[0]?.message ?? 'Invalid query parameters', 400);
    return;
  }

  const { limit, cursor, category } = parsed.data;

  if (category && !VALID_CATEGORIES.has(category)) {
    sendError(res, `Invalid category. Valid values: ${[...VALID_CATEGORIES].join(', ')}`, 400);
    return;
  }

  try {
    const result = await getProducts(limit, cursor, category);
    sendSuccess(res, result);
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid cursor') {
      sendError(res, 'Invalid cursor token', 400);
      return;
    }
    console.error('[listProducts]', err);
    sendError(res, 'Failed to fetch products', 500);
  }
}

export async function getProductStats(_req: Request, res: Response): Promise<void> {
  try {
    const stats = await getStats();
    sendSuccess(res, stats);
  } catch (err) {
    console.error('[getProductStats]', err);
    sendError(res, 'Failed to fetch stats', 500);
  }
}
