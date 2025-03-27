'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/app/types/calendar';
import CalendarGrid from './CalendarGrid';
import EventSidebar from './EventSidebar';
import EventModal from './EventModal';

export default function CalendarBoard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching events...');
      
      const response = await fetch('/api/calendar');
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched events:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format: expected an array of events');
      }
      
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (date: Date) => {
    try {
      setIsCreatingEvent(true);
      setError(null);
      
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
        throw new Error(`Failed to create event: ${response.statusText}`);
      }

      const newEvent = await response.json();
      console.log('Created new event:', newEvent);
      setEvents([...events, newEvent]);
      setSelectedEvent(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      setError(error instanceof Error ? error.message : 'Failed to create event');
    } finally {
      setIsCreatingEvent(false);
    }
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    try {
      setError(null);
      const response = await fetch(`/api/calendar/${updatedEvent.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedEvent.title,
          date: updatedEvent.date,
          notes: updatedEvent.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update event');
      }

      const event = await response.json();
      setEvents(events.map(e => e.id === event.id ? event : e));
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      setError(error instanceof Error ? error.message : 'Failed to update event');
    }
  };

  const handleEventDelete = async (eventId: number) => {
    try {
      setError(null);
      const response = await fetch(`/api/calendar/${eventId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete event');
      }

      if (!data.success) {
        throw new Error('Failed to delete event: Invalid response');
      }

      console.log('Deleted event:', eventId);
      setEvents(events.filter(event => event.id !== eventId));
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete event');
    }
  };

  const handlePreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex px-8 py-10 bg-gradient-to-b from-orange-100 via-yellow-50 to-white gap-8">
        <div className="flex-1 bg-white/20 rounded-xl backdrop-blur-md p-6 shadow-lg animate-pulse">
          <div className="h-8 bg-white/20 rounded-lg w-48 mb-6"></div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="text-center text-sm font-medium text-neutral-600 py-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}
              </div>
            ))}
            {[...Array(42)].map((_, i) => (
              <div key={i} className="aspect-square p-2 bg-white/20 rounded-md"></div>
            ))}
          </div>
        </div>
        <div className="w-[300px] bg-white/20 rounded-xl backdrop-blur-md p-6 shadow-lg">
          <div className="h-6 bg-white/20 rounded-lg w-32 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white/20 rounded-lg mb-4"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex px-8 py-10 bg-gradient-to-b from-orange-100 via-yellow-50 to-white gap-8">
      <div className="flex-1 bg-white/20 rounded-xl backdrop-blur-md p-6 shadow-lg overflow-hidden flex flex-col">
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <CalendarGrid
            selectedDate={selectedDate}
            events={events}
            onDayClick={handleAddEvent}
            onEventClick={setSelectedEvent}
            onPreviousMonth={handlePreviousMonth}
            onNextMonth={handleNextMonth}
            isCreatingEvent={isCreatingEvent}
          />
        )}
      </div>
      <div className="w-[300px] bg-white/20 rounded-xl backdrop-blur-md p-6 shadow-lg overflow-y-auto">
        <EventSidebar
          events={events}
          onEventClick={setSelectedEvent}
          onEventDelete={handleEventDelete}
        />
      </div>

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