'use client';

import { useState, memo } from 'react';
import { Task } from '@/types/task';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: number) => Promise<void>;
  onUpdate: (taskId: number, content: string) => Promise<void>;
}

const TaskCard = memo(function TaskCard({ task, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content === task.content) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onUpdate(task.id, content.trim());
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error instanceof Error ? error.message : 'Failed to update task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/10 rounded-lg p-2 hover:bg-white/20 transition-colors"
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            autoFocus
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            ✓
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setContent(task.content);
              setError(null);
            }}
            className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            ×
          </button>
        </form>
      ) : (
        <div className="flex items-start justify-between gap-2">
          <span className="flex-1 text-white/90">{task.content}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              ✎
            </button>
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </motion.div>
  );
});

export default TaskCard; 