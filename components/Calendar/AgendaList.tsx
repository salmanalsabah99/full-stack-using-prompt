'use client';

import { AgendaListProps } from '@/types/calendar';
import { formatTime, getDayEvents } from '@/lib/date';

export default function AgendaList({ events, selectedDate, onEventClick }: AgendaListProps) {
  const dayEvents = getDayEvents(events, selectedDate);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Agenda</h3>
      
      {dayEvents.length === 0 ? (
        <div className="text-gray-500 text-sm italic">
          No events scheduled for today
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            .map(event => (
              <div
                key={event.id}
                className="p-3 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md bg-white/50 hover:bg-white/80"
                style={{ backgroundColor: event.color || '#FFF9E5' }}
                onClick={() => onEventClick?.(event)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">
                      {event.title}
                    </h4>
                    {event.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 ml-4">
                    {formatTime(new Date(event.startTime))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
} 