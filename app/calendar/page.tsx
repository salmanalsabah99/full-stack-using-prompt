'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import { useCalendar } from './hooks/useCalendar';
import AddEventModal from './components/AddEventModal';
import WeeklyCalendar from './components/WeeklyCalendar';
import { CalendarItem } from './types';

export default function CalendarPage() {
  const {
    items,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleTaskCompletion,
    refresh
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CalendarItem | null>(null);

  const handleAddEvent = async (title: string, date: Date, notes?: string) => {
    await addEvent(title, date, notes);
  };

  const handleEditEvent = (item: CalendarItem) => {
    setEditingItem(item);
  };

  const handleDeleteEvent = async (id: number) => {
    await deleteEvent(id);
  };

  const handleToggleTask = async (id: number) => {
    await toggleTaskCompletion(id);
  };

  const handlePreviousWeek = () => {
    setSelectedDate(prev => addDays(prev, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const getWeekDates = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 0 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const weekDates = getWeekDates();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {format(selectedDate, 'MMMM yyyy')}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-500" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {/* Calendar View */}
      <div className="flex-1 overflow-hidden">
        <WeeklyCalendar
          weekDays={weekDays}
          weekDates={weekDates}
          items={items}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onToggleTask={handleToggleTask}
        />
      </div>

      {/* Add Event Modal */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddEvent}
      />

      {/* Edit Event Modal */}
      <AnimatePresence>
        {editingItem && (
          <AddEventModal
            isOpen={true}
            onClose={() => setEditingItem(null)}
            onSubmit={async (title, date, notes) => {
              await updateEvent(editingItem.id, title, date, notes);
              setEditingItem(null);
            }}
            defaultDate={new Date(editingItem.date)}
            defaultTitle={editingItem.title}
            defaultNotes={editingItem.notes}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 