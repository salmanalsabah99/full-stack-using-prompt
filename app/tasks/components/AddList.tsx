'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { inputStyles, buttonStyles } from '../utils/styles';

interface AddListProps {
  onListAdd: (title: string) => void;
  onCancel?: () => void;
}

export default function AddList({ onListAdd, onCancel }: AddListProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onListAdd(title.trim());
      setTitle('');
      onCancel?.();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-6"
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="List name..."
          className={inputStyles}
          autoFocus
        />
        <button
          type="submit"
          className={buttonStyles.primary}
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={buttonStyles.secondary}
        >
          Cancel
        </button>
      </form>
    </motion.div>
  );
} 