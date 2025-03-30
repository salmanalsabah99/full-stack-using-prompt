import { Priority } from './shared';

/**
 * Event type for calendar items
 */
export type EventType = 'Meeting' | 'Deadline' | 'Reminder' | 'Personal Time';

/**
 * Base interface for calendar items
 */
export interface BaseCalendarItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  priority?: Priority;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for calendar events
 */
export interface Event extends BaseCalendarItem {
  type: 'event';
  eventType: EventType;
  startTime?: string;
  endTime?: string;
  location?: string;
  attendees?: string[];
  notes?: string;
}

/**
 * Interface for calendar tasks
 */
export interface Task extends BaseCalendarItem {
  type: 'task';
  completed: boolean;
  listId?: string;
  order?: number;
}

/**
 * Union type for all calendar items
 */
export type CalendarItem = Event | Task; 