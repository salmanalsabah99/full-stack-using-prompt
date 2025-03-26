'use client';

import { useState } from 'react';

interface AddTaskProps {
  listId: number;
  onTaskAdd: (listId: number, content: string) => Promise<void>;
}

export default function AddTask({ listId, onTaskAdd }: AddTaskProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onTaskAdd(listId, content.trim());
      setContent('');
    } catch (error) {
      console.error('Error adding task:', error);
      setError(error instanceof Error ? error.message : 'Failed to add task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-2 mt-2">
      {error && (
        <p className="text-red-400 text-sm mb-2">{error}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a task..."
            className="w-full px-3 py-2 rounded-md bg-white/20 text-white placeholder-white/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/30"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-3 py-2 rounded-md bg-white/30 hover:bg-white/40 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  );
} 