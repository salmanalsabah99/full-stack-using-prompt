'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface AddListProps {
  onListAdd: (title: string) => void;
  onCancel: () => void;
}

export default function AddList({ onListAdd, onCancel }: AddListProps) {
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(true);

  const handleSubmit = () => {
    if (title.trim()) {
      onListAdd(title.trim());
      setTitle('');
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-lg shadow-sm mb-6 p-4 border border-gray-200"
    >
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter list name..."
          className="flex-1 bg-transparent border-none text-gray-900 text-lg font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          autoFocus
        />
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
    </motion.div>
  );
} 