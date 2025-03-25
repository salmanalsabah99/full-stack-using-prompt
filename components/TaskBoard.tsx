'use client';

import { useState, useEffect } from 'react';
import { TaskList as TaskListType, Task } from '@/types/task';
import TaskList from './TaskList';
import TaskListSkeleton from './TaskListSkeleton';

export default function TaskBoard() {
  const [lists, setLists] = useState<TaskListType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  // Fetch task lists on component mount
  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/task-lists');
      if (!response.ok) {
        throw new Error(`Failed to fetch lists: ${response.statusText}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      setLists(data);
    } catch (error) {
      console.error('Failed to fetch lists:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch lists');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    try {
      const response = await fetch('/api/task-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newListTitle,
          row: 0,
          col: lists.length,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create list: ${response.statusText}`);
      }
      const newList = await response.json();
      setLists([...lists, newList]);
      setNewListTitle('');
      setIsCreatingList(false);
    } catch (error) {
      console.error('Failed to create list:', error);
      setError(error instanceof Error ? error.message : 'Failed to create list');
    }
  };

  const handleListUpdate = async (listId: number, title: string) => {
    try {
      const response = await fetch(`/api/task-lists`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: listId, title }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update list: ${response.statusText}`);
      }
      
      // Optimistically update the UI
      setLists(prev => prev.map(list => 
        list.id === listId ? { ...list, title } : list
      ));
    } catch (error) {
      console.error('Failed to update list:', error);
      setError(error instanceof Error ? error.message : 'Failed to update list');
    }
  };

  const handleListDelete = async (listId: number) => {
    try {
      const response = await fetch(`/api/task-lists?id=${listId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete list');
      }
      
      // Optimistically update the UI
      setLists(prev => prev.filter(list => list.id !== listId));
    } catch (error) {
      console.error('Failed to delete list:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete list');
    }
  };

  const handleTaskReorder = async (taskId: number, newOrder: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder task');
      }

      await fetchLists(); // Refresh lists to get updated order
    } catch (error) {
      console.error('Failed to reorder task:', error);
      setError(error instanceof Error ? error.message : 'Failed to reorder task');
    }
  };

  const handleTaskMove = async (taskId: number, targetListId: number) => {
    try {
      const response = await fetch('/api/tasks/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetListId }),
      });

      if (!response.ok) {
        throw new Error('Failed to move task');
      }

      await fetchLists(); // Refresh lists to get updated state
    } catch (error) {
      console.error('Failed to move task:', error);
      setError(error instanceof Error ? error.message : 'Failed to move task');
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!taskId) {
      console.error("Missing task ID on delete");
      setError("Invalid task ID");
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      // Only update UI after successful deletion
      setLists(prev => prev.map(list => ({
        ...list,
        tasks: list.tasks.filter(task => task.id !== taskId)
      })));
    } catch (error) {
      console.error('Failed to delete task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    }
  };

  const handleTaskUpdate = async (taskId: number, content: string) => {
    try {
      // If this is a new task (taskId is not in any list), add it to the appropriate list
      const existingTask = lists.flatMap(list => list.tasks).find(task => task.id === taskId);
      
      if (!existingTask) {
        // This is a new task, add it to the first list
        const firstList = lists[0];
        if (!firstList) return;

        // Create the task in the database
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            listId: firstList.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create task');
        }

        const newTask = await response.json();
        
        // Update the UI with the new task
        setLists(prev => prev.map(list => 
          list.id === firstList.id 
            ? {
                ...list,
                tasks: [...list.tasks, newTask]
              }
            : list
        ));
        return;
      }

      // This is an existing task update
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      // Optimistically update the UI
      setLists(prev => prev.map(list => ({
        ...list,
        tasks: list.tasks.map(task => 
          task.id === taskId ? { ...task, content } : task
        )
      })));
    } catch (error) {
      console.error('Failed to update task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-6 justify-center">
        {[1, 2, 3].map((i) => (
          <TaskListSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-white/90">
        <p className="text-lg mb-4">Error: {error}</p>
        <button
          onClick={fetchLists}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state
  if (lists.length === 0) {
    return (
      <div className="text-center text-white/90">
        <p className="text-lg mb-4">No task lists found</p>
        <p className="text-sm text-white/70 mb-6">Create your first list to get started</p>
        {isCreatingList ? (
          <form onSubmit={handleCreateList} className="max-w-md mx-auto">
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Enter list title"
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              autoFocus
            />
          </form>
        ) : (
          <button
            onClick={() => setIsCreatingList(true)}
            className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
          >
            Add List
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {/* Existing Lists */}
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
        />
      ))}

      {/* Add New List */}
      {isCreatingList ? (
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg w-64 flex flex-col gap-3 text-white">
          <form onSubmit={handleCreateList}>
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Enter list title"
              className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
              autoFocus
            />
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsCreatingList(true)}
          className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg w-64 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          + Add List
        </button>
      )}
    </div>
  );
} 