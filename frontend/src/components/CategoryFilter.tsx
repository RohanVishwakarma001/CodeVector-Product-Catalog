import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS, type Category } from '@/types';

interface CategoryFilterProps {
  selected: string | undefined;
  onChange: (category: Category | undefined) => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(undefined)}
        className={cn(
          'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
          !selected
            ? 'bg-white/10 text-white shadow-lg border border-white/20'
            : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
        )}
      >
        {!selected && (
          <motion.span
            layoutId="category-pill"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative">All</span>
      </button>

      {CATEGORIES.map((cat) => {
        const isActive = selected === cat;
        const gradient = CATEGORY_COLORS[cat];
        return (
          <button
            key={cat}
            onClick={() => onChange(isActive ? undefined : cat)}
            className={cn(
              'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'text-white shadow-lg'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient} opacity-20 border border-white/20`}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </span>
          </button>
        );
      })}
    </div>
  );
}
