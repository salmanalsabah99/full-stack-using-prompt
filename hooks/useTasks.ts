import { useState, useEffect } from 'react';
import { Task, TaskList, TaskReorderUpdate, TaskMoveUpdate } from '../types/task';

const CELL_WIDTH = 300;
const CELL_HEIGHT = 400;

export const useTasks = () => {
  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all task lists with their tasks
  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/task-lists');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch task lists');
      }
      const data = await response.json();
      
      // Ensure each list has grid positioning
      const listsWithPosition = data.map((list: TaskList, index: number) => ({
        ...list,
        row: list.row ?? Math.floor(index / Math.floor(window.innerWidth / CELL_WIDTH)),
        col: list.col ?? index % Math.floor(window.innerWidth / CELL_WIDTH),
      }));
      
      setLists(listsWithPosition);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching lists:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLists();
  }, []);

  // Create a new task list with optimistic update
  const createList = async (title: string) => {
    const tempId = Date.now();
    const nextIndex = lists.length;
    const newList: TaskList = {
      id: tempId,
      title,
      tasks: [],
      row: Math.floor(nextIndex / Math.floor(window.innerWidth / CELL_WIDTH)),
      col: nextIndex % Math.floor(window.innerWidth / CELL_WIDTH),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update
    setLists(prev => [...prev, newList]);

    try {
      const response = await fetch('/api/task-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          row: newList.row,
          col: newList.col
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(prev => prev.filter(list => list.id !== tempId));
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create task list');
      }

      const createdList = await response.json();
      // Replace temporary list with the real one
      setLists(prev => prev.map(list => list.id === tempId ? createdList : list));
      return createdList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating list:', err);
      throw err;
    }
  };

  // Update list orders with optimistic update
  const updateListOrders = async (updatedLists: TaskList[]) => {
    const originalLists = [...lists];
    
    // Validate updates before applying
    const validUpdates = updatedLists.filter(list => 
      typeof list.id === 'number' &&
      typeof list.row === 'number' &&
      typeof list.col === 'number'
    );

    if (validUpdates.length === 0) {
      throw new Error('Invalid list updates');
    }

    // Optimistic update
    setLists(validUpdates);

    try {
      const response = await fetch('/api/task-lists/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validUpdates.map(list => ({
          id: list.id,
          row: list.row,
          col: list.col
        }))),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(originalLists);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update list orders');
      }

      const serverUpdatedLists = await response.json();
      setLists(serverUpdatedLists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating list orders:', err);
      // Revert to original state
      setLists(originalLists);
      throw err;
    }
  };

  // Move a task between lists
  const moveTask = async (taskId: number, targetListId: number, order: number) => {
    try {
      const response = await fetch('/api/tasks/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetListId, order }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to move task');
      }

      const updatedLists = await response.json();
      setLists(updatedLists);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error moving task:', err);
      throw err;
    }
  };

  // Update a task list with optimistic update
  const updateList = async (id: number, updates: Partial<TaskList>) => {
    const originalList = lists.find(list => list.id === id);
    if (!originalList) throw new Error('List not found');

    // Optimistic update
    const updatedList = { ...originalList, ...updates };
    setLists(prev => prev.map(list => list.id === id ? updatedList : list));

    try {
      const response = await fetch(`/api/task-lists/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(prev => prev.map(list => list.id === id ? originalList : list));
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update task list');
      }

      const serverUpdatedList = await response.json();
      // Update with server response
      setLists(prev => prev.map(list => list.id === id ? serverUpdatedList : list));
      return serverUpdatedList;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating list:', err);
      throw err;
    }
  };

  // Delete a task list with optimistic update
  const deleteList = async (id: number) => {
    const listToDelete = lists.find(list => list.id === id);
    if (!listToDelete) throw new Error('List not found');

    // Optimistic update
    setLists(prev => prev.filter(list => list.id !== id));

    try {
      const response = await fetch(`/api/task-lists/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(prev => [...prev, listToDelete]);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete task list');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting list:', err);
      throw err;
    }
  };

  // Create a new task with optimistic update
  const createTask = async (listId: number, content: string) => {
    const tempId = Date.now();
    const newTask: Task = {
      id: tempId,
      content,
      listId,
      order: 0, // Will be updated by the server
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistic update
    setLists(prev => prev.map(list => 
      list.id === listId 
        ? { ...list, tasks: [...list.tasks, newTask] }
        : list
    ));

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, listId }),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(prev => prev.map(list => 
          list.id === listId 
            ? { ...list, tasks: list.tasks.filter(task => task.id !== tempId) }
            : list
        ));
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create task');
      }

      const createdTask = await response.json();
      // Replace temporary task with the real one
      setLists(prev => prev.map(list => 
        list.id === listId 
          ? {
              ...list,
              tasks: list.tasks.map(task => 
                task.id === tempId ? createdTask : task
              )
            }
          : list
      ));
      return createdTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error creating task:', err);
      throw err;
    }
  };

  // Update a task with optimistic update
  const updateTask = async (taskId: number, updates: Partial<Task>) => {
    const originalTask = lists.flatMap(l => l.tasks).find(t => t.id === taskId);
    if (!originalTask) throw new Error('Task not found');

    // Optimistic update
    const updatedTask = { ...originalTask, ...updates };
    setLists(prev => prev.map(list => ({
      ...list,
      tasks: list.tasks.map(task => 
        task.id === taskId ? updatedTask : task
      )
    })));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(prev => prev.map(list => ({
          ...list,
          tasks: list.tasks.map(task => 
            task.id === taskId ? originalTask : task
          )
        })));
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update task');
      }

      const serverUpdatedTask = await response.json();
      // Update with server response
      setLists(prev => prev.map(list => ({
        ...list,
        tasks: list.tasks.map(task => 
          task.id === taskId ? serverUpdatedTask : task
        )
      })));
      return serverUpdatedTask;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Delete a task with optimistic update
  const deleteTask = async (taskId: number) => {
    const taskToDelete = lists.flatMap(l => l.tasks).find(t => t.id === taskId);
    if (!taskToDelete) throw new Error('Task not found');

    // Optimistic update
    setLists(prev => prev.map(list => ({
      ...list,
      tasks: list.tasks.filter(task => task.id !== taskId)
    })));

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert optimistic update on error
        setLists(prev => prev.map(list => 
          list.id === taskToDelete.listId
            ? { ...list, tasks: [...list.tasks, taskToDelete] }
            : list
        ));
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  return {
    lists,
    loading,
    error,
    createList,
    updateList,
    deleteList,
    createTask,
    updateTask,
    deleteTask,
    updateListOrders,
    moveTask,
    refreshLists: fetchLists,
  };
}; 