'use client';

import { TimeGridProps } from '@/types/calendar';
import { formatTime, generateTimeSlots, getDayEvents, parseDate } from '@/lib/date';

export default function TimeGridPanel({ events, selectedDate, onEventClick }: TimeGridProps) {
  const timeSlots = generateTimeSlots();
  const dayEvents = getDayEvents(events, selectedDate);

  // Calculate event positions and spans
  const processedEvents = dayEvents.map(event => {
    const startDate = parseDate(event.startTime);
    const endDate = parseDate(event.endTime);
    
    if (!startDate) {
      console.error('Invalid start time for event:', event);
      return null;
    }

    const startHour = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    
    // For tasks, if no end time is specified, default to 1 hour duration
    // For events, use the specified end time or default to 1 hour
    const endHour = endDate ? endDate.getHours() : startHour + 1;
    const endMinutes = endDate ? endDate.getMinutes() : startMinutes;
    
    // Calculate total duration in hours
    const totalHours = endHour - startHour + (endMinutes - startMinutes) / 60;
    
    // Calculate position within the hour (0-1)
    const startPosition = startMinutes / 60;
    
    return {
      ...event,
      startHour,
      startMinutes,
      startPosition,
      totalHours,
      height: `${totalHours * 100}%`,
      top: `${startPosition * 100}%`,
      isTask: event.type === 'task'
    };
  }).filter(Boolean); // Remove any null events

  // Group events by hour to handle overlapping events
  const eventsByHour = timeSlots.reduce((acc, hour) => {
    acc[hour] = processedEvents.filter(event => event.startHour === hour);
    return acc;
  }, {} as Record<number, typeof processedEvents>);

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
              className="h-16 flex items-start justify-end pr-4 text-sm text-gray-500"
            >
              {formatTime(new Date(2024, 0, 1, hour))}
            </div>
          ))}
        </div>

        {/* Events grid */}
        <div className="ml-20 border-l border-gray-200 h-full overflow-y-auto">
          {timeSlots.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-100 relative"
            >
              {eventsByHour[hour]?.map((event, index) => {
                // Calculate width and left position for overlapping events
                const eventsInHour = eventsByHour[hour].length;
                const width = `${100 / eventsInHour}%`;
                const left = `${(index * 100) / eventsInHour}%`;
                
                return (
                  <div
                    key={event.id}
                    className="absolute p-2 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md"
                    style={{
                      backgroundColor: event.color || '#FFF9E5',
                      top: event.top,
                      height: event.height,
                      minHeight: '24px',
                      width,
                      left,
                      zIndex: 10
                    }}
                    onClick={() => onEventClick?.(event)}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${event.isTask ? 'text-blue-600' : 'text-purple-600'}`}>
                        {event.isTask ? 'Task' : 'Event'}
                      </span>
                      <div className="text-sm font-medium text-gray-800 truncate flex-1">
                        {event.title}
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {formatTime(event.startTime)}
                      {!event.isTask && ` - ${formatTime(event.endTime)}`}
                    </div>
                    {event.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 