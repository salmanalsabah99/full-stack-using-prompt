'use client';

import { useState } from 'react';
import { CalendarEvent, CalendarViewProps } from '@/types/calendar';
import TimeGridPanel from './TimeGridPanel';
import CalendarSidebar from './CalendarSidebar';

// Placeholder data for development
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    startTime: new Date(2024, 3, 6, 14, 0),
    endTime: new Date(2024, 3, 6, 15, 0),
    color: '#FFE4E1',
  },
  {
    id: '2',
    title: 'Project Review',
    startTime: new Date(2024, 3, 6, 16, 0),
    endTime: new Date(2024, 3, 6, 17, 0),
    color: '#E6E6FA',
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    // TODO: Implement event click handler
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-green-50 rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
      <div className="flex-1 p-6 overflow-y-auto">
        <TimeGridPanel
          events={events}
          selectedDate={selectedDate}
          onEventClick={handleEventClick}
        />
      </div>
      <div className="w-80 border-l border-gray-200 bg-green-50 overflow-y-auto">
        <CalendarSidebar
          selectedDate={selectedDate}
          events={events}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
        />
      </div>
    </div>
  );
} 