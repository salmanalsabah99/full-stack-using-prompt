'use client';

import { CalendarEvent } from '@/app/types/calendar';

interface EventSidebarProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onEventDelete: (eventId: number) => void;
}

export default function EventSidebar({
  events,
  onEventClick,
  onEventDelete,
}: EventSidebarProps) {
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-bold text-neutral-800 mb-6">Upcoming Events</h2>
      <div className="flex-1 overflow-y-auto space-y-4">
        {sortedEvents.length === 0 ? (
          <p className="text-neutral-500 text-center py-4">No events scheduled</p>
        ) : (
          sortedEvents.map(event => (
            <div
              key={event.id}
              className="bg-white/20 rounded-lg p-4 hover:bg-white/30 transition-colors cursor-pointer"
              onClick={() => onEventClick(event)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-neutral-800">{event.title}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventDelete(event.id);
                  }}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-neutral-600 mb-2">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {event.notes && (
                <p className="text-sm text-neutral-500 line-clamp-2">{event.notes}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 