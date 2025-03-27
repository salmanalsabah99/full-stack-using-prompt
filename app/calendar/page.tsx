'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit2,
  Trash2,
  MoveRight,
  Clock,
  MapPin,
  Calendar as CalendarIcon,
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'Meeting' | 'Deadline' | 'Reminder' | 'Personal Time';
  location?: string;
}

const eventStyles = {
  Meeting: {
    accent: '#AEDFF7',
    bg: '#F4FBFF',
  },
  Deadline: {
    accent: '#FFE5B4',
    bg: '#FFF8E5',
  },
  Reminder: {
    accent: '#FAD6D6',
    bg: '#FFF1F1',
  },
  'Personal Time': {
    accent: '#D7F7DF',
    bg: '#F5FFF7',
  },
};

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];

const mockEvents: Event[] = [
  { id: 1, title: "Team Sync", date: "2025-03-27", time: "10:30 AM", type: "Meeting", location: "Zoom" },
  { id: 2, title: "Project Deadline", date: "2025-03-28", time: "All Day", type: "Deadline" },
  { id: 3, title: "Workout", date: "2025-03-29", time: "6:00 PM", type: "Personal Time" },
  { id: 4, title: "Remind Salman", date: "2025-03-30", time: "9:00 AM", type: "Reminder" },
];

const EventCard = ({ event }: { event: Event }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isPast = new Date(event.date) < new Date();
  const styles = eventStyles[event.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative bg-white rounded-md p-3 mb-2 border border-gray-100 hover:border-gray-200 transition-all duration-200
        ${isPast ? 'opacity-50' : ''}`}
      style={{ borderLeft: `3px solid ${styles.accent}` }}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock size={12} />
              {event.time}
            </span>
            {event.location && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={12} />
                {event.location}
              </span>
            )}
          </div>
          <h3 className={`font-medium mt-1 ${isPast ? 'text-gray-500' : 'text-gray-800'}`}>
            {event.title}
          </h3>
        </div>

        {/* Hover Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1"
            >
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Edit2 size={16} className="text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <MoveRight size={16} className="text-gray-500" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Trash2 size={16} className="text-gray-500" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const DayColumn = ({ 
  day, 
  events, 
  isToday 
}: { 
  day: string; 
  events: Event[];
  isToday: boolean;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEventTitle.trim()) {
      // Mock function - will be replaced with actual API call
      console.log('Adding event:', newEventTitle);
      setNewEventTitle('');
      setIsAdding(false);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* Day Header */}
      <div className={`p-2 text-center border-b ${isToday ? 'bg-blue-50' : ''}`}>
        <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
          {day}
        </div>
        <div className={`text-xs ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
          {new Date().getDate()}
        </div>
      </div>

      {/* Events Container */}
      <div className="p-2 h-[calc(100vh-12rem)] overflow-y-auto">
        {/* Quick Add Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mb-2"
            >
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                placeholder="Add event..."
                className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </motion.form>
          )}
        </AnimatePresence>

        {/* Events List */}
        <div className="space-y-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => setIsAdding(true)}
        className="absolute bottom-2 right-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Plus size={16} className="text-gray-500" />
      </button>
    </div>
  );
};

export default function Calendar() {
  const today = new Date().getDay();
  const adjustedToday = today;

  return (
    <div className="h-screen bg-[#F7F7F7] p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Calendar</h1>
            <p className="text-gray-500">Week of March 27, 2025</p>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
            <Plus size={20} />
            New Event
          </button>
        </div>

        {/* Calendar Grid - Updated to use grid-cols-5 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-5">
            {weekDays.map((day, index) => (
              <DayColumn
                key={day}
                day={day}
                events={mockEvents.filter(event => 
                  new Date(event.date).getDay() === index
                )}
                isToday={index === adjustedToday}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 