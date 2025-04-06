'use client';

import { CalendarSidebarProps } from '@/types/calendar';
import MiniCalendar from './MiniCalendar';
import AgendaList from './AgendaList';

export default function CalendarSidebar({
  selectedDate,
  events,
  onDateSelect,
  onEventClick,
}: CalendarSidebarProps) {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Calendar</h2>
        <div className="bg-white/50 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <MiniCalendar
            selectedDate={selectedDate}
            onDateSelect={onDateSelect}
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Agenda</h2>
        <div className="bg-white/50 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
          <AgendaList
            events={events}
            selectedDate={selectedDate}
            onEventClick={onEventClick}
          />
        </div>
      </div>
    </div>
  );
} 