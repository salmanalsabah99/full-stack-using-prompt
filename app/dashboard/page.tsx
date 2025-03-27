'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { View } from '../../components/Sidebar';
import TaskBoard from '../tasks/components/TaskBoard';
import Calendar from '../calendar/page';
import NotesView from '../notes/page';
import TodayView from './components/TodayView';

export default function Dashboard() {
  const [currentView, setCurrentView] = useState<View>('home');

  const renderContent = () => {
    switch (currentView) {
      case 'tasks':
        return <TaskBoard />;
      case 'calendar':
        return <Calendar />;
      case 'notes':
        return <NotesView />;
      case 'home':
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      <Sidebar onSelect={setCurrentView} currentView={currentView} />
      <main className="flex-1 ml-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
} 