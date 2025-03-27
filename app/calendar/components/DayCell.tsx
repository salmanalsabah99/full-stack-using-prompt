'use client';

import { CalendarEvent, CalendarDay } from '@/app/types/calendar';

interface DayCellProps {
  day: CalendarDay;
  events: CalendarEvent[];
  onClick: () => void;
  onEventClick: (event: CalendarEvent) => void;
  isCreatingEvent: boolean;
}

export default function DayCell({
  day,
  events,
  onClick,
  onEventClick,
  isCreatingEvent,
}: DayCellProps) {
  return (
    <div
      className={`
        min-h-[100px] p-2 rounded-md cursor-pointer
        ${day.isCurrentMonth 
          ? 'bg-white/20 hover:bg-white/30 text-neutral-800' 
          : 'bg-white/10 text-neutral-400 hover:bg-white/20'
        }
        ${day.isToday ? 'ring-2 ring-blue-500' : ''}
        transition-colors relative flex flex-col
      `}
      onClick={onClick}
    >
      <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
      <div className="flex-1 space-y-1 overflow-y-auto">
        {events.map(event => (
          <div
            key={event.id}
            className="text-xs p-1 rounded bg-blue-500/20 text-blue-700 truncate"
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
} 