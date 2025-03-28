import { useState, useEffect } from 'react';
import { Event, Task, CalendarItem } from '../types';

export function useCalendar() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const [eventsRes, tasksRes] = await Promise.all([
        fetch('/api/calendar'),
        fetch('/api/tasks')
      ]);

      if (!eventsRes.ok || !tasksRes.ok) {
        throw new Error('Failed to fetch calendar data');
      }

      const events: Event[] = await eventsRes.json();
      const tasks: Task[] = await tasksRes.json();

      // Convert events and tasks to calendar items
      const calendarItems: CalendarItem[] = [
        ...events.map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          type: 'event' as const,
          notes: event.notes,
          eventType: event.type
        })),
        ...tasks.map(task => ({
          id: task.id,
          title: task.title,
          date: task.dueDate,
          type: 'task' as const,
          notes: task.description,
          priority: task.priority,
          completed: task.completed
        }))
      ];

      setItems(calendarItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (title: string, date: Date, notes?: string) => {
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const newEvent = await response.json();
      setItems(prev => [...prev, {
        id: newEvent.id,
        title: newEvent.title,
        date: newEvent.date,
        type: 'event',
        notes: newEvent.notes
      }]);
    } catch (err) {
      throw err;
    }
  };

  const updateEvent = async (id: number, title: string, date: Date, notes?: string) => {
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      const updatedEvent = await response.json();
      setItems(prev => prev.map(item => 
        item.id === id && item.type === 'event'
          ? {
              ...item,
              title: updatedEvent.title,
              date: updatedEvent.date,
              notes: updatedEvent.notes
            }
          : item
      ));
    } catch (err) {
      throw err;
    }
  };

  const deleteEvent = async (id: number) => {
    try {
      const response = await fetch(`/api/calendar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      setItems(prev => prev.filter(item => !(item.id === id && item.type === 'event')));
    } catch (err) {
      throw err;
    }
  };

  const toggleTaskCompletion = async (id: number) => {
    try {
      const task = items.find(item => item.id === id && item.type === 'task');
      if (!task) return;

      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setItems(prev => prev.map(item => 
        item.id === id && item.type === 'task'
          ? { ...item, completed: !item.completed }
          : item
      ));
    } catch (err) {
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleTaskCompletion,
    refresh: fetchItems
  };
} 