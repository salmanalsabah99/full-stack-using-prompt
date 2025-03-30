import { PriorityUppercase, BaseItemWithUppercasePriority } from './shared';

/**
 * Task priority type (using uppercase values)
 */
export type Priority = PriorityUppercase;

/**
 * Core task interface extending the base item interface
 */
export interface Task extends BaseItemWithUppercasePriority {
  id: string;
  description?: string;
  dueDate: Date;
  order: number;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Task list interface for organizing tasks
 */
export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
}

/**
 * Task update interface for partial updates
 */
export interface TaskUpdate extends Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>> {
  id: string;
}

/**
 * Task list update interface for partial updates
 */
export interface TaskListUpdate extends Partial<Omit<TaskList, 'id'>> {
  id: string;
} 