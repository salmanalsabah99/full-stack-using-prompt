import { 
  startOfWeek, 
  addDays, 
  subDays, 
  format, 
  isToday, 
  isSameDay as dateFnsIsSameDay,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isSameMonth as dateFnsIsSameMonth,
  isSameYear as dateFnsIsSameYear,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  formatDistanceToNow
} from 'date-fns';

// Project-wide timezone constant
export const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateFormatOptions {
  format?: 'short' | 'medium' | 'long' | 'full';
  includeTime?: boolean;
  relative?: boolean;
  humanReadable?: boolean;
}

/**
 * Returns current date in device's local timezone
 */
export function getLocalNow(): Date {
  return new Date();
}

/**
 * Formats a date according to specified options
 */
export function formatDate(date: Date | string, options: DateFormatOptions = {}): string {
  const {
    format: formatStyle = 'medium',
    includeTime = false,
    relative = false,
    humanReadable = false
  } = options;

  // Convert string date to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    return formatDistanceToNow(dateObj, { addSuffix: true });
  }

  if (humanReadable) {
    const now = getLocalNow();
    const diffDays = differenceInDays(now, dateObj);
    const diffHours = differenceInHours(now, dateObj);
    const diffMinutes = differenceInMinutes(now, dateObj);

    if (diffDays === 0) {
      if (diffHours === 0) {
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
  }

  const dateFormat = includeTime 
    ? `MMM d, yyyy - h:mm a`
    : `MMM d, yyyy`;

  return format(dateObj, dateFormat);
}

/**
 * Gets the start of the current week (Sunday)
 */
export function getStartOfWeek(date: Date = getLocalNow()): Date {
  return startOfWeek(date, { weekStartsOn: 0 });
}

/**
 * Gets the end of the current week (Saturday)
 */
export function getEndOfWeek(date: Date = getLocalNow()): Date {
  const start = getStartOfWeek(date);
  return addDays(start, 6);
}

export function getWeekDates(baseDate: Date = new Date()): Date[] {
  // Ensure we're working with a clean date object
  const cleanDate = new Date(baseDate);
  cleanDate.setHours(0, 0, 0, 0);
  
  // Get the start of the week (Sunday)
  const start = startOfWeek(cleanDate, { weekStartsOn: 0 });
  
  // Generate exactly 7 days
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    // Ensure each date is at midnight to avoid timezone issues
    date.setHours(0, 0, 0, 0);
    return date;
  });
}

export function getWeekRange(baseDate: Date = new Date()): DateRange {
  const dates = getWeekDates(baseDate);
  return {
    start: dates[0],
    end: dates[6]
  };
}

export function formatWeekRange(dates: Date[]): string {
  const start = format(dates[0], 'MMM d');
  const end = format(dates[6], 'MMM d, yyyy');
  return `${start} - ${end}`;
}

export function isDateInRange(date: Date, range: DateRange): boolean {
  const cleanDate = new Date(date);
  cleanDate.setHours(0, 0, 0, 0);
  return cleanDate >= range.start && cleanDate <= range.end;
}

export function getWeekOffset(currentDate: Date, targetDate: Date): number {
  const currentWeek = getWeekDates(currentDate);
  const targetWeek = getWeekDates(targetDate);
  
  // Calculate the difference in weeks using timestamps
  const diffTime = targetWeek[0].getTime() - currentWeek[0].getTime();
  const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7));
  
  return diffWeeks;
}

export function getDateRangeLabel(dates: Date[]): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const weekRange = getWeekRange(today);
  
  if (isDateInRange(today, weekRange)) {
    return 'This Week';
  }
  
  const nextWeek = getWeekRange(addDays(today, 7));
  if (isDateInRange(today, nextWeek)) {
    return 'Next Week';
  }
  
  const lastWeek = getWeekRange(subDays(today, 7));
  if (isDateInRange(today, lastWeek)) {
    return 'Last Week';
  }
  
  return formatWeekRange(dates);
}

export function compareDates(date1: Date, date2: Date): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return d1.getTime() === d2.getTime();
}

export const getDateRanges = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(todayEnd);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  const upcomingStart = new Date(todayEnd);
  upcomingStart.setDate(upcomingStart.getDate() + 1);

  return {
    today: { start: todayStart, end: todayEnd },
    tomorrow: { start: tomorrowStart, end: tomorrowEnd },
    upcoming: { start: upcomingStart, end: null }
  };
};

/**
 * Gets the start of the current month
 */
export function getStartOfMonth(date: Date = getLocalNow()): Date {
  return startOfMonth(date);
}

/**
 * Gets the end of the current month
 */
export function getEndOfMonth(date: Date = getLocalNow()): Date {
  return endOfMonth(date);
}

/**
 * Gets the start of the current year
 */
export function getStartOfYear(date: Date = getLocalNow()): Date {
  return startOfYear(date);
}

/**
 * Gets the end of the current year
 */
export function getEndOfYear(date: Date = getLocalNow()): Date {
  return endOfYear(date);
}

/**
 * Checks if two dates are in the same month
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  return dateFnsIsSameMonth(date1, date2);
}

/**
 * Checks if two dates are in the same year
 */
export function isSameYear(date1: Date, date2: Date): boolean {
  return dateFnsIsSameYear(date1, date2);
}

/**
 * Gets the number of days between two dates
 */
export function getDaysBetween(date1: Date, date2: Date): number {
  return differenceInDays(date1, date2);
}

/**
 * Gets the number of hours between two dates
 */
export function getHoursBetween(date1: Date, date2: Date): number {
  return differenceInHours(date1, date2);
}

/**
 * Gets the number of minutes between two dates
 */
export function getMinutesBetween(date1: Date, date2: Date): number {
  return differenceInMinutes(date1, date2);
}

/**
 * Ensures a date is in the local timezone
 */
export function ensureLocal(date: Date): Date {
  const localDate = new Date(date);
  return localDate;
}

/**
 * Formats a date for database storage (ISO string)
 */
export function formatForStorage(date: Date): string {
  return ensureLocal(date).toISOString();
}

/**
 * Parses a date from database storage (ISO string)
 */
export function parseFromStorage(isoString: string): Date {
  return ensureLocal(new Date(isoString));
}

/**
 * Checks if two dates are the same day
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return dateFnsIsSameDay(date1, date2);
} 