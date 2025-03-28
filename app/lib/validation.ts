import { createErrorResponse } from './api-utils';

export const validateTaskData = (data: any) => {
  if (!data.title || !data.dueDate || !data.listId) {
    return createErrorResponse('Title, due date, and listId are required');
  }
  return null;
};

export const validateTaskListData = (data: any) => {
  if (!data.title || typeof data.title !== 'string') {
    return createErrorResponse('Title is required and must be a string');
  }
  return null;
};

export const validateTaskMoveData = (data: any) => {
  if (!data.taskId || !data.targetListId || typeof data.order !== 'number') {
    return createErrorResponse('Missing required fields');
  }
  return null;
};

export const validateTaskReorderData = (data: any) => {
  if (!data.listId || !Array.isArray(data.tasks)) {
    return createErrorResponse('List ID and tasks array are required');
  }
  return null;
}; 