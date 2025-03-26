'use client';

import { useState, useEffect } from 'react';
import { TaskList as TaskListType, Task } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';
import TaskList from './TaskList';

export default function TaskBoard() {
  const [lists, setLists] = useState<TaskListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingList, setIsAddingList] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      if (!response.ok) {
        throw new Error('Failed to fetch lists');
      }
      const data = await response.json();
      setLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch lists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskReorder = async (taskId: number, newOrder: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder task');
      }

      // Update local state
      setLists(prevLists => {
        return prevLists.map(list => {
          const updatedTasks = [...list.tasks];
          const taskIndex = updatedTasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            const task = updatedTasks[taskIndex];
            updatedTasks.splice(taskIndex, 1);
            updatedTasks.splice(newOrder, 0, task);
          }
          return { ...list, tasks: updatedTasks };
        });
      });
    } catch (error) {
      console.error('Error reordering task:', error);
      setError(error instanceof Error ? error.message : 'Failed to reorder task');
    }
  };

  const handleTaskMove = async (taskId: number, targetListId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetListId }),
      });

      if (!response.ok) {
        throw new Error('Failed to move task');
      }

      // Update local state
      setLists(prevLists => {
        const sourceList = prevLists.find(list => 
          list.tasks.some(task => task.id === taskId)
        );
        const targetList = prevLists.find(list => list.id === targetListId);
        
        if (!sourceList || !targetList) return prevLists;

        const task = sourceList.tasks.find(t => t.id === taskId);
        if (!task) return prevLists;

        return prevLists.map(list => {
          if (list.id === sourceList.id) {
            return {
              ...list,
              tasks: list.tasks.filter(t => t.id !== taskId)
            };
          }
          if (list.id === targetListId) {
            return {
              ...list,
              tasks: [...list.tasks, { ...task, listId: targetListId }]
            };
          }
          return list;
        });
      });
    } catch (error) {
      console.error('Error moving task:', error);
      setError(error instanceof Error ? error.message : 'Failed to move task');
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      // Only update local state after successful deletion
      setLists(prevLists => {
        return prevLists.map(list => ({
          ...list,
          tasks: list.tasks.filter(task => task.id !== taskId)
        }));
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleTaskUpdate = async (taskId: number, content: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Update local state
      setLists(prevLists => {
        return prevLists.map(list => ({
          ...list,
          tasks: list.tasks.map(task =>
            task.id === taskId ? { ...task, content } : task
          )
        }));
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  const handleTaskAdd = async (listId: number, content: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, listId }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();

      // Update local state
      setLists(prevLists => {
        return prevLists.map(list =>
          list.id === listId
            ? { ...list, tasks: [...list.tasks, newTask] }
            : list
        );
      });
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task');
    }
  };

  const handleListDelete = async (listId: number) => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete list');
      }

      const { deletedListId } = await response.json();

      // Only update local state after successful deletion
      setLists(prevLists => prevLists.filter(list => list.id !== deletedListId));
    } catch (error) {
      console.error('Error deleting list:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete list');
    }
  };

  const handleListUpdate = async (listId: number, title: string) => {
    try {
      const response = await fetch(`/api/lists/${listId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update list');
      }

      // Update local state
      setLists(prevLists => {
        return prevLists.map(list =>
          list.id === listId ? { ...list, title } : list
        );
      });
    } catch (error) {
      console.error('Error updating list:', error);
      setError(error instanceof Error ? error.message : 'Failed to update list');
    }
  };

  const handleAddList = async () => {
    try {
      setIsAddingList(true);
      setError(null);

      const response = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New List' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create list');
      }

      const newList = await response.json();

      // Update local state
      setLists(prevLists => [...prevLists, newList]);
    } catch (error) {
      console.error('Error creating list:', error);
      setError(error instanceof Error ? error.message : 'Failed to create list');
    } finally {
      setIsAddingList(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 via-sky-800 to-sky-700">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-900 via-sky-800 to-sky-700">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-sky-800 to-sky-700 overflow-auto px-6 py-12">
      {/* Decorative stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
          Task Board
        </h1>
      </div>

      {/* Lists Container */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        <AnimatePresence initial={false}>
          {lists.map((list) => (
            <TaskList
              key={list.id}
              list={list}
              onTaskReorder={handleTaskReorder}
              onTaskMove={handleTaskMove}
              onTaskDelete={handleTaskDelete}
              onTaskUpdate={handleTaskUpdate}
              onListDelete={handleListDelete}
              onListUpdate={handleListUpdate}
              onTaskAdd={handleTaskAdd}
            />
          ))}
          {/* Add List Button */}
          <motion.div
            layout
            className="w-64 min-h-[10rem] bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            onClick={handleAddList}
          >
            <button
              disabled={isAddingList}
              className="w-full h-full flex items-center justify-center text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingList ? 'Adding...' : '+ Add List'}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 