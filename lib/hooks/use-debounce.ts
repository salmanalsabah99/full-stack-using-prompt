import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseDebounceOptions {
  delay?: number;
  onDebounce?: (value: any) => void;
}

/**
 * Custom hook for handling debounced values
 */
export function useDebounce<T>(value: T, options: UseDebounceOptions = {}) {
  const { delay = 500, onDebounce } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      onDebounce?.(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, onDebounce]);

  return debouncedValue;
}

/**
 * Custom hook for handling debounced callbacks
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: UseDebounceOptions = {}
) {
  const { delay = 500 } = options;
  const timeoutRef = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          callback(...args);
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Debounced callback failed');
          logger.error('Error in debounced callback:', err);
        }
      }, delay);
    };
  }, [callback, delay]);

  return useCallback(timeoutRef(), [timeoutRef]);
} 