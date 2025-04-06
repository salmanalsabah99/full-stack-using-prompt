'use client';

import { MiniCalendarProps } from '@/types/calendar';
import { getMonthDays, isSameDay } from '@/lib/date';

export default function MiniCalendar({ selectedDate, onDateSelect }: MiniCalendarProps) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const days = getMonthDays(year, month);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-semibold text-gray-800">
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(year, month - 1, 1);
              onDateSelect(newDate);
            }}
            className="p-1 hover:bg-green-100 rounded text-gray-600"
          >
            ←
          </button>
          <button
            onClick={() => {
              const newDate = new Date(year, month + 1, 1);
              onDateSelect(newDate);
            }}
            className="p-1 hover:bg-green-100 rounded text-gray-600"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-1"
          >
            {day}
          </div>
        ))}
        
        {days.map(({ date }, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(date)}
            className={`
              p-2 text-sm rounded-lg transition-colors
              ${isSameDay(date, selectedDate)
                ? 'bg-green-100 text-green-700 font-medium'
                : 'hover:bg-green-50 text-gray-700'
              }
              ${date.getMonth() !== month ? 'text-gray-400' : ''}
            `}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
} 