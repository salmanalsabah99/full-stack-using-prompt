'use client';

import { CalendarEvent, CalendarDay } from '@/app/types/calendar';
import DayCell from './DayCell';
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

interface CalendarGridProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  isCreatingEvent: boolean;
}

export default function CalendarGrid({
  selectedDate,
  events,
  onDayClick,
  onEventClick,
  onPreviousMonth,
  onNextMonth,
  isCreatingEvent,
}: CalendarGridProps) {
  // Calculate the start and end dates for the calendar grid
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start from Sunday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 }); // End on Saturday

  // Generate all days in the calendar grid
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd }).map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, selectedDate),
    isToday: isToday(date),
  }));

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">
          {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onPreviousMonth}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 grid-rows-[auto_1fr] gap-1 h-full">
        {/* Week Days */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <DayCell
            key={index}
            day={day}
            events={events.filter(event => {
              const eventDate = new Date(event.date);
              return eventDate.getDate() === day.date.getDate() &&
                     eventDate.getMonth() === day.date.getMonth() &&
                     eventDate.getFullYear() === day.date.getFullYear();
            })}
            onClick={() => {
              if (day.isCurrentMonth && !isCreatingEvent) {
                onDayClick(day.date);
              }
            }}
            onEventClick={onEventClick}
            isCreatingEvent={isCreatingEvent}
          />
        ))}
      </div>
    </div>
  );
} 