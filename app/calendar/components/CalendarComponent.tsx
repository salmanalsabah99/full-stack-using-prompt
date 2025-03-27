'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/app/types/calendar';
import EventModal from './EventModal';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  events: CalendarEvent[];
}

export default function CalendarComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar');
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (date: Date) => {
    try {
      setIsCreatingEvent(true);
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'New Event',
          date: date.toISOString(),
          notes: 'Click to edit event details',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      const newEvent = await response.json();
      setEvents([...events, newEvent]);
      setSelectedEvent(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleEventDelete = (eventId: number) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();

  // Generate calendar days
  const calendarDays: CalendarDay[] = [];
  
  // Add previous month's days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevMonthDays = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0).getDate();
    calendarDays.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      events: [],
    });
  }

  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    const currentDayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
    calendarDays.push({
      date: i,
      isCurrentMonth: true,
      events: events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === currentDayDate.getDate() &&
               eventDate.getMonth() === currentDayDate.getMonth() &&
               eventDate.getFullYear() === currentDayDate.getFullYear();
      }),
    });
  }

  // Add next month's days to complete the grid
  const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      date: i,
      isCurrentMonth: false,
      events: [],
    });
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = selectedDate.toLocaleString('default', { month: 'long' });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <div className="h-8 bg-white/20 rounded-lg w-48 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
              {day}
            </div>
          ))}
          {[...Array(42)].map((_, i) => (
            <div key={i} className="aspect-square p-2 bg-white/20 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-neutral-800">
            {monthName} {selectedDate.getFullYear()}
          </h2>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-neutral-800">
          {monthName} {selectedDate.getFullYear()}
        </h2>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Week Days */}
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium text-neutral-600 py-2">
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div
            key={index}
            onClick={() => {
              if (day.isCurrentMonth && !isCreatingEvent) {
                const selectedDayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day.date);
                handleAddEvent(selectedDayDate);
              }
            }}
            className={`
              aspect-square p-2 relative
              ${day.isCurrentMonth ? 'text-neutral-800 hover:bg-white/30 cursor-pointer' : 'text-neutral-400'}
              transition-colors rounded-md
              ${isCreatingEvent ? 'cursor-wait' : ''}
            `}
          >
            <span className="text-sm">{day.date}</span>
            {day.events.length > 0 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {day.events.map(event => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className="w-1 h-1 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    title={event.title}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={handleEventUpdate}
          onDelete={handleEventDelete}
        />
      )}
    </div>
  );
} 