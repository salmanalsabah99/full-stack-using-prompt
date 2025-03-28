export type EventType = 'Meeting' | 'Deadline' | 'Reminder' | 'Personal Time';

export interface Event {
  id: number;
  title: string;
  date: string;
  notes?: string;
  type?: EventType;
}

export interface Task {
  id: number;
  title: string;
  dueDate: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  listId?: number;
}

export interface CalendarItem {
  id: number;
  title: string;
  date: string;
  type: 'event' | 'task';
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  eventType?: EventType;
}

export interface EventStyles {
  accent: string;
  bg: string;
} 