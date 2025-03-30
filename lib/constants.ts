/**
 * Application-wide constants
 */

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  TASKS: '/api/tasks',
  CALENDAR: '/api/calendar',
  AUTH: '/api/auth',
  USER: '/api/user'
} as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100
  },
  DESCRIPTION: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 500
  }
} as const;

/**
 * Date formatting constants
 */
export const DATE_FORMATS = {
  SHORT: 'MMM d',
  MEDIUM: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  FULL: 'EEEE, MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy - h:mm a'
} as const;

/**
 * Priority levels
 */
export const PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

export const PRIORITY_COLORS = {
  [PRIORITIES.LOW]: 'text-green-500',
  [PRIORITIES.MEDIUM]: 'text-yellow-500',
  [PRIORITIES.HIGH]: 'text-red-500'
} as const;

/**
 * Event types
 */
export const EVENT_TYPES = {
  MEETING: 'Meeting',
  DEADLINE: 'Deadline',
  REMINDER: 'Reminder',
  PERSONAL_TIME: 'Personal Time'
} as const;

export const EVENT_COLORS = {
  [EVENT_TYPES.MEETING]: 'bg-blue-50 border-blue-200 text-blue-700',
  [EVENT_TYPES.DEADLINE]: 'bg-red-50 border-red-200 text-red-700',
  [EVENT_TYPES.REMINDER]: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  [EVENT_TYPES.PERSONAL_TIME]: 'bg-green-50 border-green-200 text-green-700'
} as const;

/**
 * UI constants
 */
export const UI = {
  ANIMATION_DURATION: 200,
  TRANSITION_DURATION: 150,
  HOVER_DELAY: 100,
  MAX_TOAST_DURATION: 5000,
  MIN_TOAST_DURATION: 3000
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters long',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_PRIORITY: 'Please select a valid priority',
  INVALID_EVENT_TYPE: 'Please select a valid event type',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.'
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  EVENT_CREATED: 'Event created successfully',
  EVENT_UPDATED: 'Event updated successfully',
  EVENT_DELETED: 'Event deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  SETTINGS_UPDATED: 'Settings updated successfully'
} as const;

/**
 * Loading states
 */
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

/**
 * Pagination constants
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE: 1
} as const;

/**
 * Cache keys
 */
export const CACHE_KEYS = {
  TASKS: 'tasks',
  CALENDAR: 'calendar',
  USER: 'user',
  SETTINGS: 'settings'
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: 'theme',
  TOKEN: 'token',
  USER: 'user',
  SETTINGS: 'settings'
} as const;

/**
 * List colors
 */
export const LIST_COLORS = [
  { accent: '#3B82F6', bg: 'bg-blue-50' },    // Blue
  { accent: '#10B981', bg: 'bg-green-50' },   // Green
  { accent: '#6366F1', bg: 'bg-indigo-50' },  // Indigo
  { accent: '#8B5CF6', bg: 'bg-purple-50' },  // Purple
  { accent: '#EC4899', bg: 'bg-pink-50' },    // Pink
  { accent: '#F59E0B', bg: 'bg-amber-50' },   // Amber
  { accent: '#EF4444', bg: 'bg-red-50' },     // Red
  { accent: '#14B8A6', bg: 'bg-teal-50' },    // Teal
  { accent: '#F97316', bg: 'bg-orange-50' },  // Orange
  { accent: '#84CC16', bg: 'bg-lime-50' },    // Lime
] as const;

export function getListColor(index: number) {
  return LIST_COLORS[index % LIST_COLORS.length];
} 