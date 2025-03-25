import { Task, TaskList } from './task';

// Task List Types
export interface CreateTaskListRequest {
  title: string;
  row: number;
  col: number;
}

export interface UpdateTaskListRequest {
  id: number;
  title: string;
  row: number;
  col: number;
}

export interface UpdateTaskListOrdersRequest {
  id: number;
  order: number;
  row: number;
  col: number;
}

// Task Types
export interface CreateTaskRequest {
  content: string;
  listId: number;
}

export interface UpdateTaskRequest {
  id: number;
  content: string;
  listId: number;
  order: number;
}

export interface MoveTaskRequest {
  taskId: number;
  targetListId: number;
  order: number;
}

export interface ReorderTasksRequest {
  id: number;
  order: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

export interface TaskListResponse {
  id: number;
  title: string;
  row: number;
  col: number;
  order: number;
  tasks: TaskResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskResponse {
  id: number;
  content: string;
  listId: number;
  order: number;
  createdAt: Date;
  updatedAt: Date;
} 