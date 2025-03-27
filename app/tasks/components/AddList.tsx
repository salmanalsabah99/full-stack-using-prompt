'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface AddListProps {
  onListAdd: (title: string) => void;
}

export default function AddList({ onListAdd }: AddListProps) {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (title.trim()) {
      onListAdd(title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 hover:border-sky-300 hover:shadow-[0_0_8px_2px_rgba(125,211,252,0.2)] transition"
    >
      {isEditing ? (
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Add a new list..."
          className="w-full bg-transparent border-none text-white text-lg font-semibold placeholder-white/50 focus:ring-2 focus:ring-sky-300/50 rounded px-2 py-1"
          autoFocus
        />
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full text-white/50 hover:text-white/80 transition text-left text-lg font-semibold"
        >
          + Add a new list...
        </button>
      )}
    </motion.div>
  );
} 