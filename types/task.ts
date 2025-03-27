export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: Priority;
  completed: boolean;
  order: number;
  listId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
} 