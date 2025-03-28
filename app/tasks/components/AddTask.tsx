'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { inputStyles, buttonStyles } from '../utils/styles';

interface AddTaskProps {
  listId: string;
  onAdd: (listId: string, title: string) => void;
}

export default function AddTask({ listId, onAdd }: AddTaskProps) {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd(listId, title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3 hover:border-sky-300 hover:shadow-[0_0_8px_2px_rgba(125,211,252,0.2)] transition"
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Add a new task..."
          className={`${inputStyles} bg-transparent border-white/10 text-white placeholder-white/50 focus:ring-sky-300/50`}
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className={`${buttonStyles.secondary} w-full text-white/50 hover:text-white/80 transition text-left flex items-center gap-2`}
        >
          <Plus size={16} />
          Add a new task...
        </button>
      )}
    </motion.div>
  );
} 