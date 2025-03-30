import { motion } from 'framer-motion';
import { format, isToday } from 'date-fns';
import DayColumn from './DayColumn';
import { CalendarItem } from '../types';
import { getWeekDates, getDateRangeLabel } from '@/lib/date-utils';

interface WeeklyCalendarProps {
  selectedDate: Date;
  items: CalendarItem[];
  onAddEvent: (title: string, date: Date) => Promise<void>;
  onEditEvent: (item: CalendarItem) => void;
  onDeleteEvent: (id: number) => void;
  onToggleTask: (id: number) => Promise<void>;
}

export default function WeeklyCalendar({
  selectedDate,
  items,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleTask,
}: WeeklyCalendarProps) {
  const weekDates = getWeekDates(selectedDate);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dateRangeLabel = getDateRangeLabel(weekDates);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-sm">
      {/* Week Header */}
      <div className="flex-none">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">{dateRangeLabel}</h2>
        </div>
        <div className="grid grid-cols-7 border-b">
          {weekDates.map((date, index) => (
            <div
              key={date.toISOString()}
              className={`p-3 text-center border-r last:border-r-0 ${
                isToday(date) ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`text-sm font-medium ${
                isToday(date) ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {weekDays[index]}
              </div>
              <div className={`text-xs ${
                isToday(date) ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {format(date, 'MMM d')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Week Grid */}
      <div className="flex-1 grid grid-cols-7 min-h-0">
        {weekDates.map((date, index) => (
          <motion.div
            key={date.toISOString()}
            className="min-w-0 border-r last:border-r-0 h-full"
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