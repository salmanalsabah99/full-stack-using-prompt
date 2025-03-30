import { Priority, PriorityUppercase, BaseItem } from '@/types/shared';

/**
 * Types of calendar events
 */
export type EventType = 'Meeting' | 'Deadline' | 'Reminder' | 'Personal Time';

/**
 * Core event interface
 */
export interface Event {
  id: number | string;
  title: string;
  date: string;
  notes?: string;
  type?: EventType;
}

/**
 * Task interface for calendar tasks
 */
export interface Task {
  id: number | string;
  title: string;
  dueDate: string;
  description?: string;
  priority: PriorityUppercase;
  completed: boolean;
  listId?: number;
}

/**
 * Calendar item interface extending base item
 */
export interface CalendarItem extends BaseItem {
  id: number | string;
  title: string;
  date: string;
  type: 'event' | 'task';
  notes?: string;
  priority?: Priority;
  completed?: boolean;
  eventType?: EventType;
}

/**
 * Event styles interface for theming
 */
export interface EventStyles {
  accent: string;
  bg: string;
}

/**
 * Calendar item update interface
 */
export interface CalendarItemUpdate extends Partial<Omit<CalendarItem, 'id'>> {
  id: number | string;
} 