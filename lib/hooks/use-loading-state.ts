import { useState, useCallback } from 'react';
import { LOADING_STATES } from '@/lib/constants';
import { logger } from '@/lib/logger';

type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];

interface UseLoadingStateOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

/**
 * Custom hook for managing loading states
 */
export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [state, setState] = useState<LoadingState>(LOADING_STATES.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startLoading = useCallback(() => {
    setState(LOADING_STATES.LOADING);
    setErrorMessage(null);
  }, []);

  const setSuccess = useCallback(() => {
    setState(LOADING_STATES.SUCCESS);
    options.onSuccess?.();
  }, [options]);

  const handleError = useCallback((error: Error | string) => {
    const message = error instanceof Error ? error.message : error;
    setState(LOADING_STATES.ERROR);
    setErrorMessage(message);
    logger.error('Loading state error:', error instanceof Error ? error : new Error(message));
    const errorObject = error instanceof Error ? error : new Error(message);
    options.onError?.(errorObject);
  }, [options]);

  const reset = useCallback(() => {
    setState(LOADING_STATES.IDLE);
    setErrorMessage(null);
  }, []);

  const withLoading = useCallback(async <T>(
    asyncFn: () => Promise<T>
  ): Promise<T> => {
    try {
      startLoading();
      const result = await asyncFn();
      setSuccess();
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      handleError(error);
      throw error;
    }
  }, [startLoading, setSuccess, handleError]);

  return {
    state,
    error: errorMessage,
    startLoading,
    setSuccess,
    setError: handleError,
    reset,
    withLoading,
  };
} 