import { useState, useCallback } from 'react';
import { PAGINATION } from '@/lib/constants';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  maxLimit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

/**
 * Custom hook for handling pagination
 */
export function usePagination(options: UsePaginationOptions = {}) {
  const {
    initialPage = PAGINATION.MIN_PAGE,
    initialLimit = PAGINATION.DEFAULT_PAGE_SIZE,
    maxLimit = PAGINATION.MAX_PAGE_SIZE,
    onPageChange,
    onLimitChange,
  } = options;

  const [state, setState] = useState<PaginationState>({
    page: initialPage,
    limit: Math.min(initialLimit, maxLimit),
    total: 0,
  });

  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page: Math.max(PAGINATION.MIN_PAGE, page) }));
    onPageChange?.(page);
  }, [onPageChange]);

  const setLimit = useCallback((limit: number) => {
    const newLimit = Math.min(Math.max(1, limit), maxLimit);
    setState(prev => ({ ...prev, limit: newLimit, page: PAGINATION.MIN_PAGE }));
    onLimitChange?.(newLimit);
  }, [maxLimit, onLimitChange]);

  const setTotal = useCallback((total: number) => {
    setState(prev => ({ ...prev, total }));
  }, []);

  const nextPage = useCallback(() => {
    const maxPage = Math.ceil(state.total / state.limit);
    if (state.page < maxPage) {
      setPage(state.page + 1);
    }
  }, [state.page, state.limit, state.total, setPage]);

  const previousPage = useCallback(() => {
    if (state.page > PAGINATION.MIN_PAGE) {
      setPage(state.page - 1);
    }
  }, [state.page, setPage]);

  const goToPage = useCallback((page: number) => {
    setPage(page);
  }, [setPage]);

  const reset = useCallback(() => {
    setState({
      page: initialPage,
      limit: Math.min(initialLimit, maxLimit),
      total: 0,
    });
  }, [initialPage, initialLimit, maxLimit]);

  const hasNextPage = useCallback(() => {
    return state.page < Math.ceil(state.total / state.limit);
  }, [state.page, state.limit, state.total]);

  const hasPreviousPage = useCallback(() => {
    return state.page > PAGINATION.MIN_PAGE;
  }, [state.page]);

  const getPageRange = useCallback(() => {
    const maxPage = Math.ceil(state.total / state.limit);
    const range = [];
    const delta = 2; // Number of pages to show before and after current page

    for (
      let i = Math.max(PAGINATION.MIN_PAGE, state.page - delta);
      i <= Math.min(maxPage, state.page + delta);
      i++
    ) {
      range.push(i);
    }

    return range;
  }, [state.page, state.limit, state.total]);

  return {
    ...state,
    setPage,
    setLimit,
    setTotal,
    nextPage,
    previousPage,
    goToPage,
    reset,
    hasNextPage,
    hasPreviousPage,
    getPageRange,
  };
} 