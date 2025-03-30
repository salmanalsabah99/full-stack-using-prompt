'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  title?: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-2xl md:text-3xl font-medium text-gray-800">
        {title || `${greeting}, Salman`}
      </h1>
      <p className="text-gray-500 mt-2">
        Here's what's happening today
      </p>
    </motion.div>
  );
} 