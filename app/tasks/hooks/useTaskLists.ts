import { useState, useEffect, useCallback } from 'react';
import { TaskList as TaskListType, Task } from '@/types/task';

export function useTaskLists() {
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/task-lists');
      if (!response.ok) throw new Error('Failed to fetch lists');
      const data = await response.json();
      setTaskLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setError(error instanceof Error ? error : new Error('Failed to fetch lists'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const handleTaskReorder = async (listId: string, startIndex: number, endIndex: number) => {
    try {
      const response = await fetch(`/api/tasks/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listId, startIndex, endIndex }),
      });
      if (!response.ok) throw new Error('Failed to reorder task');
      
      setTaskLists(prevLists => 
        prevLists.map(list => {
          if (list.id !== listId) return list;
          const tasks = [...list.tasks];
          const [movedTask] = tasks.splice(startIndex, 1);
          tasks.splice(endIndex, 0, movedTask);
          return { ...list, tasks };
        })
      );
    } catch (error) {
      console.error('Error reordering task:', error);
      throw error;
    }
  };

  const handleTaskMove = async (taskId: string, sourceListId: string, destinationListId: string, destinationIndex: number) => {
    try {
      const response = await fetch(`/api/tasks/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetListId: destinationListId, order: destinationIndex }),
      });
      if (!response.ok) throw new Error('Failed to move task');
      
      setTaskLists(prevLists => {
        const sourceList = prevLists.find(list => list.id === sourceListId);
        const task = sourceList?.tasks.find(t => t.id === taskId);
        if (!task) return prevLists;
        
        return prevLists.map(list => {
          if (list.id === sourceListId) {
            return {
              ...list,
              tasks: list.tasks.filter(t => t.id !== taskId)
            };
          }
          if (list.id === destinationListId) {
            const tasks = [...list.tasks];
            tasks.splice(destinationIndex, 0, { ...task, listId: destinationListId });
            return { ...list, tasks };
          }
          return list;
        });
      });
    } catch (error) {
      console.error('Error moving task:', error);
      throw error;
    }
  };

  const handleTaskDelete = async (listId: string, taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete task');
      
      setTaskLists(prevLists => 
        prevLists.map(list => 
          list.id === listId
            ? { ...list, tasks: list.tasks.filter(task => task.id !== taskId) }
            : list
        )
      );
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const handleTaskUpdate = async (listId: string, taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update task');
      
      setTaskLists(prevLists => 
        prevLists.map(list => 
          list.id === listId
            ? {
                ...list,
                tasks: list.tasks.map(task =>
                  task.id === taskId ? { ...task, ...updates } : task
                )
              }
            : list
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleListDelete = async (listId: string) => {
    try {
      const response = await fetch(`/api/task-lists/${listId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete list');
      
      setTaskLists(prevLists => prevLists.filter(list => list.id !== listId));
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  };

  const handleListUpdate = async (listId: string, title: string) => {
    try {
      const response = await fetch(`/api/task-lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Failed to update list');
      
      setTaskLists(prevLists => 
        prevLists.map(list => 
          list.id === listId ? { ...list, title } : list
        )
      );
    } catch (error) {
      console.error('Error updating list:', error);
      throw error;
    }
  };

  const handleTaskAdd = async (listId: string, title: string, dueDate: Date, priority: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM') => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title,
          dueDate,
          listId,
          priority,
          completed: false,
          order: 0
        }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const newTask = await response.json();
      
      setTaskLists(prevLists => 
        prevLists.map(list => 
          list.id === listId 
            ? { ...list, tasks: [...list.tasks, newTask].sort((a, b) => a.order - b.order) }
            : list
        )
      );
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const handleListAdd = async (title: string) => {
    try {
      const response = await fetch('/api/task-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) throw new Error('Failed to add list');
      const newList = await response.json();
      
      setTaskLists(prevLists => [...prevLists, newList]);
    } catch (error) {
      console.error('Error adding list:', error);
      throw error;
    }
  };

  return {
    taskLists,
    isLoading,
    error,
    handleTaskReorder,
    handleTaskMove,
    handleTaskDelete,
    handleTaskUpdate,
    handleListDelete,
    handleListUpdate,
    handleTaskAdd,
    handleListAdd,
  };
} 