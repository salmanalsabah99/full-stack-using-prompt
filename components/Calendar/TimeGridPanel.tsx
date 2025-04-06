'use client';

import { TimeGridProps } from '@/types/calendar';
import { formatTime, generateTimeSlots, getDayEvents } from '@/lib/date';

export default function TimeGridPanel({ events, selectedDate, onEventClick }: TimeGridProps) {
  const timeSlots = generateTimeSlots();
  const dayEvents = getDayEvents(events, selectedDate);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </h2>
      </div>
      
      <div className="flex-1 relative bg-white/50 rounded-xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Time slots */}
        <div className="absolute left-0 w-20">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-32 flex items-start justify-end pr-4 text-sm text-gray-500"
            >
              {formatTime(new Date(2024, 0, 1, hour))}
            </div>
          ))}
        </div>

        {/* Events grid */}
        <div className="ml-20 border-l border-gray-200">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-32 border-b border-gray-100 relative"
            >
              {dayEvents
                .filter(event => {
                  const eventHour = new Date(event.startTime).getHours();
                  return eventHour >= hour && eventHour < hour + 2;
                })
                .map(event => (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 p-2 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md"
                    style={{
                      backgroundColor: event.color || '#FFF9E5',
                      top: `${((new Date(event.startTime).getMinutes() / 60) * 100)}%`,
                      height: `${((new Date(event.endTime).getTime() - new Date(event.startTime).getTime()) / (2 * 60 * 60 * 1000)) * 100}%`,
                    }}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="text-sm font-medium text-gray-800">
                      {event.title}
                    </div>
                    <div className="text-xs text-gray-600">
                      {formatTime(new Date(event.startTime))} - {formatTime(new Date(event.endTime))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 