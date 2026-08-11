import { Sparkles, CheckCircle2 } from 'lucide-react';
import ProductCard from './ProductCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

/**
 * Product Card Skeleton component for ultra-smooth social media loading experience
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 space-y-3 animate-pulse">
      <div className="aspect-square w-full rounded-xl bg-slate-100/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200/80 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 bg-emerald-100/80 rounded-md w-1/3" />
          <div className="h-7 w-7 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Paginated Product Grid Component
 * Features infinite scroll, smooth skeleton loading, and stable order preservation.
 */
export default function PaginatedProductGrid({
  products = [],
  initialCount = 8,
  pageSize = 8,
  gridClassName = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4',
  emptyState = null,
  showEndMessage = true,
  endMessageText = "You've explored all products in this collection!",
}) {
  const { displayedItems, hasMore, isLoadingMore, sentinelRef, totalCount } = useInfiniteScroll({
    items: products,
    initialCount,
    pageSize,
  });

  if (totalCount === 0) {
    return emptyState;
  }

  return (
    <div className="space-y-6">
      {/* Product Grid */}
      <div className={gridClassName}>
        {displayedItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* Loading Skeletons when fetching next batch */}
        {isLoadingMore && (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        )}
      </div>

      {/* Sentinel observer element for infinite scroll trigger */}
      {hasMore && (
        <div ref={sentinelRef} className="w-full py-6 flex flex-col items-center justify-center gap-2">
          {!isLoadingMore && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100/80 px-4 py-2 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#056839] animate-spin" />
              <span>Scroll for more products ({displayedItems.length} of {totalCount})</span>
            </div>
          )}
        </div>
      )}

      {/* End of list message */}
      {!hasMore && totalCount > 0 && showEndMessage && (
        <div className="w-full py-6 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 bg-emerald-50/80 border border-emerald-200/60 px-4 py-2 rounded-full shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#056839]" />
            <span>{endMessageText} ({totalCount} items)</span>
          </div>
        </div>
      )}
    </div>
  );
}
