export interface Position {
  row: number;
  col: number;
}

export interface Task {
  id: number;
  content: string;
  listId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskList {
  id: number;
  title: string;
  order: number;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskReorderUpdate {
  id: number;
  order: number;
}

export interface TaskMoveUpdate {
  taskId: number;
  targetListId: number;
  order: number;
}

export type TaskListWithTasks = TaskList & {
  tasks: Task[];
} 