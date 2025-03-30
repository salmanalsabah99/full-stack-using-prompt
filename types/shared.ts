/**
 * Priority levels for tasks and events
 */
export type Priority = 'low' | 'medium' | 'high';
export type PriorityUppercase = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Base interface for items that can be displayed in cards
 */
export interface BaseItem {
  id: number | string;
  title: string;
  date: Date | string;
  notes?: string;
  priority?: Priority;
  completed?: boolean;
}

/**
 * Base interface for items that use uppercase priority values
 */
export interface BaseItemWithUppercasePriority {
  id: number | string;
  title: string;
  date: Date | string;
  notes?: string;
  priority?: PriorityUppercase;
  completed?: boolean;
}

/**
 * Date range interface for calendar views
 */
export interface DateRange {
  start: Date;
  end: Date;
}

/**
 * Options for date formatting
 */
export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
  relative?: boolean;
  humanReadable?: boolean;
}

/**
 * Common API response interface
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Common loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Common pagination interface
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

/**
 * Utility functions for priority case conversion
 */
export function convertPriorityToLowercase(priority: PriorityUppercase): Priority {
  return priority.toLowerCase() as Priority;
}

export function convertPriorityToUppercase(priority: Priority): PriorityUppercase {
  return priority.toUpperCase() as PriorityUppercase;
}

/**
 * Common validation error interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Common API error interface
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
} 