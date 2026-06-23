export interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface StatsResponse {
  success: boolean;
  totalProducts: number;
  categories: number;
  dbSize: string;
  categoryBreakdown: CategoryStat[];
}

export type Category =
  | 'Electronics'
  | 'Fashion'
  | 'Books'
  | 'Sports'
  | 'Home'
  | 'Beauty'
  | 'Toys'
  | 'Gaming';

export const CATEGORIES: Category[] = [
  'Electronics',
  'Fashion',
  'Books',
  'Sports',
  'Home',
  'Beauty',
  'Toys',
  'Gaming',
];

export const CATEGORY_ICONS: Record<Category, string> = {
  Electronics: '⚡',
  Fashion: '👗',
  Books: '📚',
  Sports: '🏆',
  Home: '🏠',
  Beauty: '✨',
  Toys: '🎮',
  Gaming: '🕹️',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Electronics: 'from-blue-500 to-cyan-500',
  Fashion: 'from-pink-500 to-rose-500',
  Books: 'from-amber-500 to-orange-500',
  Sports: 'from-green-500 to-emerald-500',
  Home: 'from-purple-500 to-violet-500',
  Beauty: 'from-fuchsia-500 to-pink-500',
  Toys: 'from-yellow-500 to-amber-500',
  Gaming: 'from-indigo-500 to-blue-500',
};
