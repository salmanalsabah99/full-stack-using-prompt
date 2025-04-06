'use client';

import { useState, useEffect } from 'react';
import { CalendarEvent, CalendarViewProps } from '@/types/calendar';
import TimeGridPanel from './TimeGridPanel';
import CalendarSidebar from './CalendarSidebar';
import { useUser } from '@/context/UserContext';
import { Task, Event } from '@prisma/client';
import { formatFullDate, formatDateForApi, parseDate } from '@/lib/date';
import CreateEventModal from '../modals/CreateEventModal';
import EditEventModal from '../modals/EditEventModal';
import { Plus } from 'lucide-react';

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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { userId } = useUser();

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        // Fetch tasks
        const tasksResponse = await fetch(`/api/tasks?userId=${userId}`);
        const tasksData = await tasksResponse.json();
        
        // Fetch events
        const formattedDate = formatDateForApi(selectedDate);
        const eventsResponse = await fetch(`/api/events?date=${formattedDate}`);
        const eventsData = await eventsResponse.json();

        let calendarEvents: CalendarEvent[] = [];

        // Transform tasks into calendar events
        if (tasksData.success && tasksData.data) {
          const taskEvents = tasksData.data
            .filter((task: Task) => task.dueDate)
            .map((task: Task) => ({
              id: task.id,
              title: task.title,
              startTime: task.dueDate!,
              endTime: new Date(new Date(task.dueDate!).getTime() + 60 * 60 * 1000),
              description: task.description || undefined,
              color: getTaskColor(task.priority),
              type: 'task'
            }));
          calendarEvents = [...calendarEvents, ...taskEvents];
        }

        // Transform events into calendar events
        if (eventsData.data) {
          const calendarEventsFromEvents = eventsData.data.map((event: Event) => ({
            id: event.id,
            title: event.title,
            startTime: event.startTime,
            endTime: event.endTime || new Date(new Date(event.startTime).getTime() + 60 * 60 * 1000),
            description: event.description || undefined,
            color: '#E6E6FA', // Default purple for events
            type: 'event',
            location: event.location
          }));
          calendarEvents = [...calendarEvents, ...calendarEventsFromEvents];
        }

        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    if (userId) {
      fetchCalendarData();
    }
  }, [userId, selectedDate]);

  const getTaskColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return '#FFE4E1'; // Light red
      case 'MEDIUM':
        return '#E6E6FA'; // Light purple
      case 'LOW':
        return '#E0FFFF'; // Light cyan
      case 'URGENT':
        return '#FFB6C1'; // Light pink
      default:
        return '#E6E6FA'; // Default light purple
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Find the full event object from the events array
    const fullEvent = events.find(e => e.id === event.id);
    if (fullEvent) {
      setEditingEvent({
        id: fullEvent.id,
        title: fullEvent.title,
        description: fullEvent.description || '',
        startTime: fullEvent.startTime,
        endTime: fullEvent.endTime || null,
        location: fullEvent.location || '',
        userId: userId || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        taskId: null
      });
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-green-50 rounded-xl overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
      <div className="flex-1 p-6 overflow-y-auto">
        <TimeGridPanel
          events={events}
          selectedDate={selectedDate}
          onEventClick={handleEventClick}
          onCreateEvent={() => setIsCreateModalOpen(true)}
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

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          isOpen={!!editingEvent}
          onClose={() => setEditingEvent(null)}
          event={editingEvent}
        />
      )}
    </div>
  );
} 