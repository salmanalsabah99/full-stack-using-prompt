'use client';

import { motion } from 'framer-motion';

const mockNotes = [
  { title: 'Meeting notes', snippet: 'Discussion points from the team sync meeting...' },
  { title: 'Project ideas', snippet: 'Brainstorming session on new features...' }
];

export default function NotesPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 relative overflow-hidden"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: '#FCE2CE' }}
      />
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes Preview</h2>
      <div className="space-y-4">
        {mockNotes.map((note, index) => (
          <div key={index} className="group">
            <h3 className="font-medium text-gray-800 group-hover:text-[#4A90E2] transition-colors">
              {note.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {note.snippet}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 