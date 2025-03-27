'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2 } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  index: number;
  onDelete: () => void;
  onUpdate: (content: string) => void;
}

export default function TaskCard({ task, index, onDelete, onUpdate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSubmit = () => {
    if (content.trim()) {
      onUpdate(content.trim());
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await onDelete();
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
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3 hover:border-sky-300 hover:shadow-[0_0_8px_2px_rgba(125,211,252,0.2)] transition"
      {...attributes}
      {...listeners}
    >
      {isEditing ? (
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="w-full bg-transparent border-none text-white focus:ring-2 focus:ring-sky-300/50 rounded px-2 py-1"
          autoFocus
        />
      ) : (
        <div className="flex items-center justify-between">
          <p
            onClick={() => setIsEditing(true)}
            className="text-white cursor-pointer hover:text-sky-300 transition flex-1"
          >
            {task.content}
          </p>
          <button
            onClick={handleDelete}
            className="text-white/50 hover:text-white/80 transition ml-2"
            disabled={isSubmitting}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </motion.div>
  );
} 