import { createErrorResponse } from './api-utils';
import { NextResponse } from 'next/server';

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

  // Validate date format
  const date = new Date(data.date);
  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { error: 'Invalid date format' },
      { status: 400 }
    );
  }

  return null;
}; 