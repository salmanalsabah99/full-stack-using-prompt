export interface Task {
  id: string;
  content: string;
  listId: string;
  order: number;
}

export interface TaskList {
  id: string;
  title: string;
  tasks: Task[];
} 