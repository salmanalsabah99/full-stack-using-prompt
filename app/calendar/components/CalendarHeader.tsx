'use client';

import { CalendarHeaderProps } from '@/app/types/calendar';

export default function CalendarHeader({ monthName, year, onPreviousMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-semibold text-neutral-800">
        {monthName} {year}
      </h2>
      <div className="flex gap-2">
        <button
          onClick={onPreviousMonth}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Previous month"
        >
          ←
        </button>
        <button
          onClick={onNextMonth}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Next month"
        >
          →
        </button>
      </div>
    </div>
  );
} 