import React from 'react';

/**
 * Common Base Shimmer Item
 */
export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`bg-slate-200/80 rounded-lg animate-pulse ${className}`} />
  );
}

/**
 * Product Card Skeleton component for product grids
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-2.5 sm:p-3 space-y-3 animate-pulse shadow-2xs">
      <div className="aspect-square w-full rounded-xl bg-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent animate-shimmer" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 bg-emerald-100/90 rounded-md w-1/3" />
          <div className="h-7 w-7 rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Product Card Skeletons
 */
export function ProductGridSkeleton({ count = 8, gridClassName = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4' }) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Shop Directory Card Skeleton
 */
export function ShopCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 space-y-3 animate-pulse shadow-2xs">
      {/* Top Banner & Logo Header Placeholder */}
      <div className="h-28 sm:h-32 w-full rounded-xl bg-slate-100 relative overflow-hidden">
        <div className="absolute top-2 left-2 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-200 border-2 border-white shadow-2xs" />
        <div className="absolute top-2 right-2 h-5 w-16 rounded-full bg-slate-200" />
      </div>

      {/* Shop Info Placeholder */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded-md w-1/2" />
          <div className="h-3.5 bg-amber-100 rounded-md w-12" />
        </div>
        <div className="h-3 bg-slate-100 rounded-md w-3/4" />
        <div className="flex items-center gap-2 pt-2">
          <div className="h-3 bg-emerald-100 rounded-full w-20" />
          <div className="h-3 bg-slate-100 rounded-full w-24" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of Shop Card Skeletons
 */
export function ShopGridSkeleton({ count = 6, gridClassName = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5' }) {
  return (
    <div className={gridClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <ShopCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Hero Banner Carousel Skeleton
 */
export function BannerSkeleton() {
  return (
    <div className="w-full rounded-3xl bg-slate-100 border border-slate-200/80 p-4 sm:p-8 min-h-[180px] sm:min-h-[240px] flex flex-col justify-between animate-pulse relative overflow-hidden shadow-2xs">
      <div className="space-y-3 max-w-md">
        <div className="h-5 w-24 bg-emerald-200/70 rounded-full" />
        <div className="h-6 sm:h-8 bg-slate-200 rounded-lg w-4/5" />
        <div className="h-3.5 bg-slate-200/70 rounded-md w-3/5" />
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-9 w-28 bg-[#056839]/20 rounded-xl" />
        <div className="flex gap-1.5">
          <div className="h-2 w-6 bg-slate-300 rounded-full" />
          <div className="h-2 w-2 bg-slate-200 rounded-full" />
          <div className="h-2 w-2 bg-slate-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/**
 * Scrollable Category Bar Skeleton
 */
export function CategoryBarSkeleton() {
  return (
    <div className="w-full bg-white border-b border-slate-200/80 py-2.5 px-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 min-w-max max-w-7xl mx-auto">
        <div className="h-8 w-16 bg-slate-200 rounded-xl animate-pulse" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 w-24 sm:w-28 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/**
 * Product Details Page Skeleton
 */
export function ProductDetailsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-8 w-24 bg-slate-200 rounded-xl" />

      {/* Main Content Grid: Image Left, Info Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/80">
        {/* Gallery Image Skeleton */}
        <div className="space-y-3">
          <div className="aspect-square w-full rounded-2xl bg-slate-100" />
          <div className="flex gap-2">
            <div className="h-16 w-16 rounded-xl bg-slate-100" />
            <div className="h-16 w-16 rounded-xl bg-slate-100" />
            <div className="h-16 w-16 rounded-xl bg-slate-100" />
          </div>
        </div>

        {/* Product Meta Skeleton */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-3.5 bg-emerald-100 rounded-md w-1/3" />
            <div className="h-7 bg-slate-200 rounded-lg w-4/5" />
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
            <div className="h-8 bg-emerald-200/80 rounded-xl w-2/5 mt-2" />
            <div className="space-y-2 pt-2">
              <div className="h-3 bg-slate-100 rounded-md w-full" />
              <div className="h-3 bg-slate-100 rounded-md w-5/6" />
              <div className="h-3 bg-slate-100 rounded-md w-4/6" />
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-2 pt-4">
            <div className="h-12 w-full bg-emerald-600/30 rounded-2xl" />
            <div className="h-10 w-full bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Shop Details Page Skeleton
 */
export function ShopDetailsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Cover & Header Banner Skeleton */}
      <div className="h-48 sm:h-64 w-full bg-slate-200 relative">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-end pb-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 border-2 border-white shadow-md">
              <div className="w-full h-full rounded-xl bg-slate-300" />
            </div>
            <div className="space-y-2 text-white">
              <div className="h-6 w-48 bg-slate-300 rounded-md" />
              <div className="h-4 w-32 bg-slate-300/80 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Catalog Grid Skeleton */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-5">
        <div className="h-10 w-full max-w-sm bg-slate-100 rounded-xl mx-auto" />
        <ProductGridSkeleton count={6} />
      </div>
    </div>
  );
}

/**
 * Customer / Merchant / Admin Dashboard KPI Cards Skeleton
 */
export function DashboardStatsSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="h-3.5 bg-slate-200 rounded-md w-1/2" />
            <div className="h-8 w-8 rounded-xl bg-emerald-100/80" />
          </div>
          <div className="h-7 bg-slate-300 rounded-lg w-1/3" />
          <div className="h-3 bg-slate-100 rounded-md w-2/3" />
        </div>
      ))}
    </div>
  );
}

/**
 * Data Table Skeleton (for Admin & Merchant tables)
 */
export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden animate-pulse shadow-2xs">
      {/* Table Header Placeholder */}
      <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="h-4 bg-slate-200 rounded-md w-1/4" />
        <div className="h-8 w-24 bg-slate-200 rounded-xl" />
      </div>

      {/* Table Rows Placeholder */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-1/3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
              <div className="space-y-1.5 w-full">
                <div className="h-3.5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-md w-1/2" />
              </div>
            </div>
            <div className="h-3.5 bg-slate-200 rounded-md w-1/6 hidden sm:block" />
            <div className="h-6 w-16 bg-emerald-100 rounded-full shrink-0" />
            <div className="h-8 w-8 bg-slate-100 rounded-xl shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Saved / Wishlist Products Skeleton
 */
export function SavedProductsSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 animate-pulse">
      <div className="h-6 bg-slate-200 rounded-md w-40" />
      <ProductGridSkeleton count={4} />
    </div>
  );
}
