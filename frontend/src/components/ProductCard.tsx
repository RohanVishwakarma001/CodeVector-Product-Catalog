import { memo } from 'react';
import { motion } from 'framer-motion';
import { Tag, DollarSign, Calendar, Clock } from 'lucide-react';
import { Product, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
  index: number;
}

export const ProductCard = memo(function ProductCard({ product, index }: ProductCardProps) {
  const gradientClass =
    CATEGORY_COLORS[product.category as keyof typeof CATEGORY_COLORS] ??
    'from-violet-500 to-indigo-500';
  const icon =
    CATEGORY_ICONS[product.category as keyof typeof CATEGORY_ICONS] ?? '📦';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index % 20, 10) * 0.03 }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-black/30">
        {/* Glow border on hover */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.06]`}
        />
        <div
          className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
          style={{ mask: 'linear-gradient(#fff 0 0) content-box exclude, linear-gradient(#fff 0 0)' }}
        />

        {/* Category icon + badge */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg text-xl`}
          >
            {icon}
          </div>
          <Badge variant="secondary" className="text-xs">
            <Tag className="mr-1 h-3 w-3" />
            {product.category}
          </Badge>
        </div>

        {/* Name */}
        <h3 className="mb-3 text-sm font-semibold leading-snug text-white/90 transition-colors group-hover:text-white line-clamp-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mb-4 flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-emerald-400" />
          <span
            className={`bg-gradient-to-r ${gradientClass} bg-clip-text text-xl font-bold text-transparent`}
          >
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Dates */}
        <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Added {formatDate(product.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-white/40">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span>Updated {formatDate(product.updatedAt)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
