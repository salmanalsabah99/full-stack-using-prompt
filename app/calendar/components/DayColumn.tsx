import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { CalendarItem } from '../types';
import EventCard from './EventCard';
import { getLocalNow, ensureLocal, isSameDay } from '@/lib/date-utils';

interface DayColumnProps {
  day: string;
  date: Date;
  items: CalendarItem[];
  isToday?: boolean;
  onAddEvent: (title: string, date: Date) => Promise<void>;
  onEditEvent: (item: CalendarItem) => void;
  onDeleteEvent: (id: number) => void;
  onToggleTask: (id: number) => Promise<void>;
}

export default function DayColumn({
  date,
  items,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleTask,
}: DayColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!newEventTitle.trim()) {
      setError('Event title is required');
      return;
    }

    try {
      const eventDate = ensureLocal(new Date(date));
      const now = getLocalNow();
      eventDate.setHours(now.getHours(), now.getMinutes());
      
      await onAddEvent(newEventTitle, eventDate);
      setNewEventTitle('');
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add event');
    }
  };

  // Filter items for this day
  const dayItems = items.filter(item => {
    const itemDate = ensureLocal(new Date(item.date));
    const columnDate = ensureLocal(new Date(date));
    return isSameDay(itemDate, columnDate);
  });

  return (
    <div className="h-full flex flex-col min-w-0">
      {/* Items Container */}
      <div className="flex-1 p-2 overflow-y-auto">
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-2"
            >
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Add event..."
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        <div className="space-y-2 min-w-0">
          {dayItems.map((item) => (
            <EventCard
              key={item.id}
              item={item}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
              onToggleTask={onToggleTask}
            />
          ))}
        </div>
      </div>

      {/* Quick Add Button */}
      <div className="flex justify-center p-2 border-t">
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          title="Add event"
        >
          <Plus size={16} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
} 