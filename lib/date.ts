import { format, parseISO, isSameDay as dateFnsIsSameDay } from 'date-fns';

/**
 * Format a date to a time string (e.g., "1:30 PM")
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

/**
 * Format a date to a date string (e.g., "Jan 1, 2023")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
};

/**
 * Format a date to a full date string (e.g., "Monday, January 1, 2023")
 */
export const formatFullDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'EEEE, MMMM d, yyyy');
};

/**
 * Format a date to a month and year string (e.g., "January 2023")
 */
export const formatMonthYear = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMMM yyyy');
};

/**
 * Get events for a specific day
 */
export const getDayEvents = (events: any[], date: Date) => {
  return events.filter(event => {
    const eventDate = typeof event.startTime === 'string' 
      ? parseISO(event.startTime) 
      : new Date(event.startTime);
    return dateFnsIsSameDay(eventDate, date);
  });
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date | string, date2: Date | string): boolean => {
  const date1Obj = typeof date1 === 'string' ? parseISO(date1) : date1;
  const date2Obj = typeof date2 === 'string' ? parseISO(date2) : date2;
  return dateFnsIsSameDay(date1Obj, date2Obj);
};

/**
 * Generate time slots for the day view
 */
export const generateTimeSlots = (startHour: number = 8, endHour: number = 24) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(hour);
  }
  return slots;
};

/**
 * Get days for a month
 */
export const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Add padding days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const prevDate = new Date(year, month, -i);
    days.unshift({ date: prevDate, events: [] });
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), events: [] });
  }

  // Add padding days from next month
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({ date: nextDate, events: [] });
  }

  return days;
};

/**
 * Parse a date string or Date object to a Date object, handling timezone issues
 */
export const parseDate = (date: string | Date | null | undefined): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  return parseISO(date);
};

/**
 * Format a date for API requests (ISO string)
 */
export const formatDateForApi = (date: Date | null | undefined): string | null => {
  if (!date) return null;
  return date.toISOString();
}; 