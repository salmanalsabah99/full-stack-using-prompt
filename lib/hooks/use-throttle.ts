import { useState, useEffect, useCallback, useRef } from 'react';
import { logger } from '@/lib/logger';

interface UseThrottleOptions {
  delay?: number;
  onThrottle?: (value: any) => void;
}

/**
 * Custom hook for handling throttled values
 */
export function useThrottle<T>(value: T, options: UseThrottleOptions = {}) {
  const { delay = 500, onThrottle } = options;
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    if (now >= lastExecuted.current + delay) {
      setThrottledValue(value);
      onThrottle?.(value);
      lastExecuted.current = now;
    }
  }, [value, delay, onThrottle]);

  return throttledValue;
}

/**
 * Custom hook for handling throttled callbacks
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  options: UseThrottleOptions = {}
) {
  const { delay = 500 } = options;
  const lastExecuted = useRef<number>(Date.now());

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now >= lastExecuted.current + delay) {
      try {
        callback(...args);
        lastExecuted.current = now;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Throttled callback failed');
        logger.error('Error in throttled callback:', err);
      }
    }
  }, [callback, delay]);
} 