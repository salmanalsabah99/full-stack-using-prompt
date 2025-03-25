'use client';

import { useState } from 'react';
import { TaskList as TaskListType, Task } from '@/types/task';

interface TaskListProps {
  list: TaskListType;
  onTaskReorder: (taskId: number, newOrder: number) => void;
  onTaskMove: (taskId: number, targetListId: number) => void;
  onTaskDelete: (taskId: number) => void;
  onTaskUpdate: (taskId: number, content: string) => void;
  onListDelete: (listId: number) => void;
  onListUpdate: (listId: number, title: string) => void;
}

export default function TaskList({
  list,
  onTaskReorder,
  onTaskMove,
  onTaskDelete,
  onTaskUpdate,
  onListDelete,
  onListUpdate,
}: TaskListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskContent, setEditingTaskContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newTitle !== list.title) {
      onListUpdate(list.id, newTitle);
    }
    setIsEditingTitle(false);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newTaskContent.trim(),
          listId: list.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create task');
      }

      const newTask = await response.json();
      
      // Update the parent component's state
      onTaskUpdate(newTask.id, newTask.content);
      
      // Reset form state
      setNewTaskContent('');
      setIsAddingTask(false);
    } catch (error) {
      console.error('Error creating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskUpdate = async (taskId: number) => {
    if (!editingTaskContent.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editingTaskContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      onTaskUpdate(taskId, editingTaskContent);
      setEditingTaskId(null);
      setEditingTaskContent('');
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!taskId) {
      console.error("Missing task ID on delete");
      setError("Invalid task ID");
      return;
    }

    try {
      setIsDeletingTask(taskId);
      setError(null);

      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
      }

      // Only update UI after successful deletion
      onTaskDelete(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setIsDeletingTask(null);
    }
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg w-64 flex flex-col gap-3 text-white">
      {/* List Header */}
      <div className="flex items-center justify-between">
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
            />
          </form>
        ) : (
          <h2 className="text-lg font-semibold">{list.title}</h2>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditingTitle(!isEditingTitle)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            ✎
          </button>
          <button
            onClick={() => onListDelete(list.id)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="flex-1 min-h-[100px] space-y-2">
        {error && (
          <p className="text-red-400 text-sm mb-2">{error}</p>
        )}
        {list.tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors ${
              isDeletingTask === task.id ? 'opacity-50' : ''
            }`}
          >
            {editingTaskId === task.id ? (
              <form onSubmit={(e) => { e.preventDefault(); handleTaskUpdate(task.id); }} className="flex gap-2">
                <input
                  type="text"
                  value={editingTaskContent}
                  onChange={(e) => setEditingTaskContent(e.target.value)}
                  className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTaskId(null);
                    setEditingTaskContent('');
                    setError(null);
                  }}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  ×
                </button>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <span className="flex-1 text-white/90">{task.content}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingTaskId(task.id);
                      setEditingTaskContent(task.content);
                      setError(null);
                    }}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    disabled={isDeletingTask === task.id}
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleTaskDelete(task.id)}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDeletingTask === task.id}
                  >
                    {isDeletingTask === task.id ? '...' : '×'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Task Form */}
      {isAddingTask ? (
        <form onSubmit={handleAddTask} className="flex flex-col gap-2">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Enter task content..."
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            autoFocus
            disabled={isSubmitting}
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !newTaskContent.trim()}
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingTask(false);
                setNewTaskContent('');
                setError(null);
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingTask(true)}
          className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          + Add Task
        </button>
      )}
    </div>
  );
} 