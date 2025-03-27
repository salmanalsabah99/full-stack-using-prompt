'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EventPreview from './EventPreview';
import TaskPreview from './TaskPreview';
import NotesPreview from './NotesPreview';
import DashboardHeader from './DashboardHeader';

export default function TodayView() {
  return (
    <div className="min-h-screen bg-[#F7F7F7] py-8 px-4 md:px-8">
      <div className="max-w-[1100px] mx-auto">
        {/* Header Greeting */}
        <DashboardHeader />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Events */}
          <EventPreview />

          {/* Today's Tasks */}
          <TaskPreview />

          {/* Notes Preview */}
          <NotesPreview />
        </div>
      </div>
    </div>
  );
} 