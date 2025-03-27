import { Task, TaskList } from './task';

// Task List Types
export interface CreateTaskListRequest {
  title: string;
}

export interface UpdateTaskListRequest {
  id: string;
  title: string;
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
  listId: string;
}

export interface UpdateTaskRequest {
  id: string;
  content: string;
  listId: string;
  order: number;
}

export interface MoveTaskRequest {
  taskId: string;
  sourceListId: string;
  destinationListId: string;
  destinationIndex: number;
}

export interface ReorderTasksRequest {
  listId: string;
  startIndex: number;
  endIndex: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success?: boolean;
}

export interface TaskListResponse {
  id: string;
  title: string;
  tasks: TaskResponse[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskResponse {
  id: string;
  content: string;
  listId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
} 