'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import TaskPreview from './TaskPreview';
import EventPreview from './EventPreview';
import DashboardHeader from './DashboardHeader';

export default function TodayView() {
  const [selectedDate] = useState(new Date());

  return (
    <div className="p-6">
      <DashboardHeader title="Today's Overview" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Tasks Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TaskPreview />
        </motion.div>

        {/* Events Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EventPreview />
        </motion.div>
      </div>
    </div>
  );
} 