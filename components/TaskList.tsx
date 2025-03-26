'use client';

import { useState, memo } from 'react';
import { TaskList as TaskListType, Task } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import AddTask from './AddTask';

interface TaskListProps {
  list: TaskListType;
  onTaskReorder: (taskId: number, newOrder: number) => Promise<void>;
  onTaskMove: (taskId: number, targetListId: number) => Promise<void>;
  onTaskDelete: (taskId: number) => Promise<void>;
  onTaskUpdate: (taskId: number, content: string) => Promise<void>;
  onListDelete: (listId: number) => Promise<void>;
  onListUpdate: (listId: number, title: string) => Promise<void>;
  onTaskAdd: (listId: number, content: string) => Promise<void>;
}

const TaskList = memo(function TaskList({
  list,
  onTaskReorder,
  onTaskMove,
  onTaskDelete,
  onTaskUpdate,
  onListDelete,
  onListUpdate,
  onTaskAdd,
}: TaskListProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title === list.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onListUpdate(list.id, title.trim());
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating list title:', error);
      setError(error instanceof Error ? error.message : 'Failed to update list title');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleListDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onListDelete(list.id);
    } catch (error) {
      console.error('Error deleting list:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete list');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg w-64 flex flex-col gap-3 text-white"
    >
      {/* List Header */}
      <div className="flex items-center justify-between">
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              autoFocus
              disabled={isSubmitting}
            />
          </form>
        ) : (
          <h2 className="text-lg font-semibold">{list.title}</h2>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditingTitle(!isEditingTitle)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            ✎
          </button>
          <button
            onClick={handleListDelete}
            disabled={isSubmitting}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-red-400 hover:text-red-300"
            title="Delete list"
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
        <AnimatePresence initial={false}>
          {list.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onTaskDelete}
              onUpdate={onTaskUpdate}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Task Form */}
      <AddTask listId={list.id} onTaskAdd={onTaskAdd} />
    </motion.div>
  );
});

export default TaskList; 