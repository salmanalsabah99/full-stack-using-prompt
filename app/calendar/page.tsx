'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import CalendarPage from '@/components/Calendar/CalendarPage';
import PageTransitionWrapper from '@/components/common/PageTransitionWrapper';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarRoute: React.FC = () => {
  const { userId, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    router.push('/login');
    return null;
  }

  return (
    <PageTransitionWrapper direction="right">
      <div className="min-h-screen bg-green-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Dashboard
            </motion.button>
          </div>
          <CalendarPage />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};

export default CalendarRoute; 