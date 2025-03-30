import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

interface UseLocalStorageOptions<T> {
  key: string;
  initialValue: T;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

/**
 * Custom hook for handling local storage
 */
export function useLocalStorage<T>(options: UseLocalStorageOptions<T>) {
  const {
    key,
    initialValue,
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  } = options;

  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to read from localStorage');
      logger.error(`Error reading localStorage key "${key}":`, err);
      return initialValue;
    }
  }, [key, initialValue, deserializer]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer(valueToStore));
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to write to localStorage');
      logger.error(`Error setting localStorage key "${key}":`, err);
    }
  }, [key, serializer, storedValue]);

  // Listen for changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(deserializer(event.newValue));
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to handle storage change');
          logger.error(`Error handling storage change for key "${key}":`, err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, deserializer]);

  // Remove item from local storage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove from localStorage');
      logger.error(`Error removing localStorage key "${key}":`, err);
    }
  }, [key, initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
  };
} 