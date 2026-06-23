import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-3 h-4 w-3/4" />
      <Skeleton className="mb-4 h-7 w-28" />
      <div className="space-y-1.5 border-t border-white/[0.06] pt-3">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}
