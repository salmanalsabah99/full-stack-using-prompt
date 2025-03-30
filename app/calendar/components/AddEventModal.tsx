import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { getLocalNow } from '@/lib/date-utils';
import { CalendarItem } from '../types';
import { useDateTime } from '@/lib/hooks/use-date-time';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, date: Date, notes?: string) => Promise<void>;
  defaultDate?: Date;
  defaultTitle?: string;
  defaultNotes?: string;
  item?: CalendarItem;
}

export default function AddEventModal({
  isOpen,
  onClose,
  onSubmit,
  defaultDate = getLocalNow(),
  defaultTitle = '',
  defaultNotes = '',
  item,
}: AddEventModalProps) {
  const [title, setTitle] = useState(defaultTitle);
  const { date, time, setDate, setTime, getDateTime } = useDateTime(defaultDate);
  const [notes, setNotes] = useState(defaultNotes);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await onSubmit(title, getDateTime(), notes);
      setTitle('');
      setDate(getLocalNow().toISOString().split('T')[0]);
      setTime(getLocalNow().toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));
      setNotes('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  const isEditing = Boolean(item);
  const isTask = item?.type === 'task';

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {isEditing ? `Edit ${isTask ? 'Task' : 'Event'}` : `Add New ${isTask ? 'Task' : 'Event'}`}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${isTask ? 'task' : 'event'} title`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={`Add ${isTask ? 'task' : 'event'} notes (optional)`}
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {isEditing ? 'Save Changes' : `Add ${isTask ? 'Task' : 'Event'}`}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 