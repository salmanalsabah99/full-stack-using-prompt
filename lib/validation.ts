import { createErrorResponse } from './api-utils';
import { NextResponse } from 'next/server';
import { ensureLocal } from './date-utils';
import { ValidationError } from '@/types/shared';

export const validateTaskData = (data: any) => {
  if (!data.title || !data.dueDate || !data.listId) {
    return createErrorResponse('Title, due date, and listId are required');
  }
  return null;
};

export const validateTaskListData = (data: any) => {
  if (!data.title || typeof data.title !== 'string') {
    return createErrorResponse('Title is required and must be a string');
  }
  return null;
};

export const validateTaskMoveData = (data: any) => {
  if (!data.taskId || !data.targetListId || typeof data.order !== 'number') {
    return createErrorResponse('Missing required fields');
  }
  return null;
};

export const validateTaskReorderData = (data: any) => {
  if (!data.listId || !Array.isArray(data.tasks)) {
    return createErrorResponse('List ID and tasks array are required');
  }
  return null;
};

interface CalendarEntryData {
  title: string;
  date: string;
  notes?: string;
}

export const validateCalendarEntry = (data: any): NextResponse | null => {
  if (!data.title || !data.date) {
    return NextResponse.json(
      { error: 'Title and date are required' },
      { status: 400 }
    );
  }

  // Validate date format and ensure it's in local timezone
  try {
    const date = ensureLocal(new Date(data.date));
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid date format' },
      { status: 400 }
    );
  }

  return null;
};

/**
 * Validates a string is not empty
 */
export function validateRequired(value: string, field: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return {
      field,
      message: `${field} is required`
    };
  }
  return null;
}

/**
 * Validates a string length is within bounds
 */
export function validateLength(
  value: string,
  field: string,
  min: number,
  max: number
): ValidationError | null {
  if (value.length < min) {
    return {
      field,
      message: `${field} must be at least ${min} characters`
    };
  }
  if (value.length > max) {
    return {
      field,
      message: `${field} must be at most ${max} characters`
    };
  }
  return null;
}

/**
 * Validates a date is not in the past
 */
export function validateFutureDate(date: Date, field: string): ValidationError | null {
  const now = new Date();
  if (date < now) {
    return {
      field,
      message: `${field} must be in the future`
    };
  }
  return null;
}

/**
 * Validates a date is within a range
 */
export function validateDateRange(
  date: Date,
  field: string,
  min: Date,
  max: Date
): ValidationError | null {
  if (date < min) {
    return {
      field,
      message: `${field} must be after ${min.toLocaleDateString()}`
    };
  }
  if (date > max) {
    return {
      field,
      message: `${field} must be before ${max.toLocaleDateString()}`
    };
  }
  return null;
}

/**
 * Validates a priority value
 */
export function validatePriority(priority: string, field: string): ValidationError | null {
  const validPriorities = ['low', 'medium', 'high', 'LOW', 'MEDIUM', 'HIGH'];
  if (!validPriorities.includes(priority)) {
    return {
      field,
      message: `${field} must be one of: ${validPriorities.join(', ')}`
    };
  }
  return null;
}

/**
 * Validates an email address
 */
export function validateEmail(email: string, field: string): ValidationError | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      field,
      message: `${field} must be a valid email address`
    };
  }
  return null;
}

/**
 * Validates a URL
 */
export function validateUrl(url: string, field: string): ValidationError | null {
  try {
    new URL(url);
    return null;
  } catch {
    return {
      field,
      message: `${field} must be a valid URL`
    };
  }
}

/**
 * Validates a number is within bounds
 */
export function validateNumberRange(
  value: number,
  field: string,
  min: number,
  max: number
): ValidationError | null {
  if (value < min) {
    return {
      field,
      message: `${field} must be at least ${min}`
    };
  }
  if (value > max) {
    return {
      field,
      message: `${field} must be at most ${max}`
    };
  }
  return null;
}

/**
 * Validates a string matches a pattern
 */
export function validatePattern(
  value: string,
  field: string,
  pattern: RegExp,
  message: string
): ValidationError | null {
  if (!pattern.test(value)) {
    return {
      field,
      message: `${field} ${message}`
    };
  }
  return null;
}

/**
 * Validates a task object
 */
export function validateTask(task: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const titleError = validateRequired(task.title, 'title');
  if (titleError) errors.push(titleError);
  
  const titleLengthError = validateLength(task.title, 'title', 1, 100);
  if (titleLengthError) errors.push(titleLengthError);
  
  const descriptionLengthError = task.description && 
    validateLength(task.description, 'description', 1, 500);
  if (descriptionLengthError) errors.push(descriptionLengthError);
  
  const priorityError = task.priority && validatePriority(task.priority, 'priority');
  if (priorityError) errors.push(priorityError);
  
  return errors;
}

/**
 * Validates a calendar event object
 */
export function validateCalendarEvent(event: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  const titleError = validateRequired(event.title, 'title');
  if (titleError) errors.push(titleError);
  
  const titleLengthError = validateLength(event.title, 'title', 1, 100);
  if (titleLengthError) errors.push(titleLengthError);
  
  const notesLengthError = event.notes && 
    validateLength(event.notes, 'notes', 1, 500);
  if (notesLengthError) errors.push(notesLengthError);
  
  const priorityError = event.priority && validatePriority(event.priority, 'priority');
  if (priorityError) errors.push(priorityError);
  
  return errors;
} 