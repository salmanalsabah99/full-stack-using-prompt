'use client';

import { motion } from 'framer-motion';

const mockTasks = [
  { title: 'Finish quarterly report', priority: 'High' },
  { title: 'Call Sarah', priority: 'High' },
  { title: 'Plan next sprint', priority: 'Medium' }
];

const PriorityBadge = ({ priority }: { priority: string }) => {
  const styles = {
    High: 'bg-red-50 text-red-600',
    Medium: 'bg-orange-50 text-orange-600',
    Low: 'bg-blue-50 text-blue-600'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority as keyof typeof styles]}`}>
      {priority}
    </span>
  );
};

export default function TaskPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6 relative overflow-hidden"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: '#C9F0D8' }}
      />
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Today's Tasks</h2>
      <div className="space-y-3">
        {mockTasks.map((task, index) => (
          <div key={index} className="flex items-center space-x-3 group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-800 group-hover:text-[#4A90E2] transition-colors">
                {task.title}
              </h3>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
} 