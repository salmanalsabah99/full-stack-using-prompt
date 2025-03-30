import { useEffect, useRef, useCallback, useState } from 'react';
import { useLoadingState } from './use-loading-state';
import { logger } from '@/lib/logger';

interface UseInfiniteScrollOptions<T> {
  loadMore: (page: number) => Promise<T[]>;
  initialPage?: number;
  threshold?: number;
  onSuccess?: (items: T[]) => void;
  onError?: (error: Error) => void;
}

interface InfiniteScrollState<T> {
  items: T[];
  hasMore: boolean;
  page: number;
}

/**
 * Custom hook for handling infinite scrolling
 */
export function useInfiniteScroll<T>(options: UseInfiniteScrollOptions<T>) {
  const {
    loadMore,
    initialPage = 1,
    threshold = 0.8,
    onSuccess,
    onError,
  } = options;

  const {
    state,
    error,
    startLoading,
    setSuccess,
    setError,
    reset: resetLoading,
    withLoading,
  } = useLoadingState({
    onSuccess: () => onSuccess?.([]),
    onError: onError,
  });

  const [scrollState, setScrollState] = useState<InfiniteScrollState<T>>({
    items: [],
    hasMore: true,
    page: initialPage,
  });

  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadMoreItems = useCallback(async () => {
    if (!scrollState.hasMore || state === 'loading') return;

    try {
      const newItems = await withLoading(async () => {
        return await loadMore(scrollState.page);
      });

      if (newItems.length === 0) {
        setScrollState((prev: InfiniteScrollState<T>) => ({ ...prev, hasMore: false }));
        return;
      }

      setScrollState((prev: InfiniteScrollState<T>) => ({
        ...prev,
        items: [...prev.items, ...newItems],
        page: prev.page + 1,
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      logger.error('Failed to load more items:', error);
      throw error;
    }
  }, [scrollState.hasMore, scrollState.page, state, loadMore, withLoading]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && scrollState.hasMore) {
          loadMoreItems();
        }
      },
      {
        threshold,
      }
    );

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [scrollState.hasMore, threshold, loadMoreItems]);

  const reset = useCallback(() => {
    setScrollState({
      items: [],
      hasMore: true,
      page: initialPage,
    });
    resetLoading();
  }, [initialPage, resetLoading]);

  return {
    items: scrollState.items,
    hasMore: scrollState.hasMore,
    state,
    error,
    loadingRef,
    reset,
  };
} 