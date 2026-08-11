import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for social-media style infinite scroll pagination.
 * Maintains stable item ordering by appending new items to the end of the array.
 *
 * @param {Array} items - The full array of filtered/sorted items
 * @param {number} initialCount - Initial number of items to display (default 8)
 * @param {number} pageSize - Number of items to add per batch (default 8)
 * @param {number} delay - Simulated network/render delay in ms (default 300)
 */
export function useInfiniteScroll({ items = [], initialCount = 8, pageSize = 8, delay = 300 }) {
  const [displayCount, setDisplayCount] = useState(initialCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef(null);

  // Reset pagination count when items length changes or search/filter changes
  useEffect(() => {
    setDisplayCount(initialCount);
  }, [items.length, initialCount]);

  const hasMore = displayCount < items.length;
  const displayedItems = items.slice(0, displayCount);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + pageSize, items.length));
      setIsLoadingMore(false);
    }, delay);
  }, [isLoadingMore, hasMore, pageSize, items.length, delay]);

  // Observer sentinel callback ref
  const sentinelRef = useCallback(
    (node) => {
      if (observerRef.current) observerRef.current.disconnect();

      if (!node || !hasMore) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        {
          root: null,
          rootMargin: '250px 0px', // Trigger 250px before entering viewport for seamless infinite scroll
          threshold: 0.1,
        }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loadMore]
  );

  return {
    displayedItems,
    hasMore,
    isLoadingMore,
    sentinelRef,
    totalCount: items.length,
    loadMore,
  };
}
