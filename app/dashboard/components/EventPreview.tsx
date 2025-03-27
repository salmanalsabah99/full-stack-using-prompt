'use client';

import { motion } from 'framer-motion';

const mockEvents = [
  { time: '10:30 AM', title: 'Team Sync', location: 'Zoom' },
  { time: '1:00 PM', title: 'Project Meeting', location: 'Conference Room' },
  { time: '3:30 PM', title: 'Client Call' }
];

export default function EventPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 relative overflow-hidden"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: '#AEDFF7' }}
      />
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Events</h2>
      <div className="space-y-4">
        {mockEvents.map((event, index) => (
          <div key={index} className="flex items-start space-x-4 group">
            <div className="text-sm text-gray-500 font-mono w-20 flex-shrink-0">
              {event.time}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 group-hover:text-[#4A90E2] transition-colors">
                {event.title}
              </h3>
              {event.location && (
                <p className="text-sm text-gray-500">{event.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 