export interface Task {
  id: number;
  content: string;
  order: number;
  listId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskList {
  id: number;
  title: string;
  order: number;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
} 