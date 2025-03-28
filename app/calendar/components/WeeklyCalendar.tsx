import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { startOfWeek, addDays, subDays, format, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayColumn from './DayColumn';
import { Event, CalendarItem } from '../types';

interface WeeklyCalendarProps {
  weekDays: string[];
  weekDates: Date[];
  items: CalendarItem[];
  onAddEvent: (title: string, date: Date) => Promise<void>;
  onEditEvent: (item: CalendarItem) => void;
  onDeleteEvent: (id: number) => void;
  onToggleTask: (id: number) => void;
}

export default function WeeklyCalendar({
  weekDays,
  weekDates,
  items,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleTask,
}: WeeklyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const today = new Date();

  const handlePreviousWeek = () => {
    setCurrentWeek(prev => subDays(prev, 7));
  };

  const handleNextWeek = () => {
    setCurrentWeek(prev => addDays(prev, 7));
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Week Navigation */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          <span className="text-lg font-medium">
            {format(currentWeek, 'MMM d')} - {format(addDays(currentWeek, 6), 'MMM d, yyyy')}
          </span>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Week Header */}
      <div className="grid grid-cols-7 bg-white border-b">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 h-[calc(100%-3rem)]">
        {weekDates.map((date, index) => (
          <motion.div
            key={date.toISOString()}
            className="min-w-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <DayColumn
              day={weekDays[index]}
              date={date}
              items={items}
              isToday={isToday(date)}
              onAddEvent={onAddEvent}
              onEditEvent={onEditEvent}
              onDeleteEvent={onDeleteEvent}
              onToggleTask={onToggleTask}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
} 