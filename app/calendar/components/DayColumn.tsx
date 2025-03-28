import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { CalendarItem } from '../types';
import EventCard from './EventCard';

interface DayColumnProps {
  day: string;
  date: Date;
  items: CalendarItem[];
  isToday: boolean;
  onAddEvent: (title: string, date: Date) => Promise<void>;
  onEditEvent: (item: CalendarItem) => void;
  onDeleteEvent: (id: number) => void;
  onToggleTask?: (id: number) => void;
}

export default function DayColumn({
  day,
  date,
  items,
  isToday,
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
      // Set time to current time but keep the selected date
      const eventDate = new Date(date);
      eventDate.setHours(new Date().getHours(), new Date().getMinutes());
      
      await onAddEvent(newEventTitle, eventDate);
      setNewEventTitle('');
      setIsAdding(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add event');
    }
  };

  // Filter items for this day
  const dayItems = items.filter(item => {
    try {
      const itemDate = new Date(item.date);
      // Set time to midnight for comparison
      itemDate.setHours(0, 0, 0, 0);
      const columnDate = new Date(date);
      columnDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === columnDate.getTime();
    } catch (err) {
      console.error('Error parsing item date:', err);
      return false;
    }
  });

  // Sort items by time
  dayItems.sort((a, b) => {
    const timeA = new Date(a.date).getTime();
    const timeB = new Date(b.date).getTime();
    return timeA - timeB;
  });

  return (
    <div className="flex flex-col h-full min-w-0 bg-white">
      {/* Day Header */}
      <div className={`p-2 text-center border-b ${isToday ? 'bg-blue-50' : ''}`}>
        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
          {day}
        </div>
        <div className={`text-xs ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
          {format(date, 'MMM d')}
        </div>
      </div>

      {/* Items Container */}
      <div className="flex-1 p-2 overflow-y-auto">
        {/* Quick Add Form */}
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

        {/* Items List */}
        <div className="space-y-2">
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
      <button
        onClick={() => setIsAdding(true)}
        className="absolute bottom-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Plus size={16} className="text-gray-500" />
      </button>
    </div>
  );
} 