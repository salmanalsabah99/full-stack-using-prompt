'use client';

import TaskBoard from '@/components/TaskBoard';

export default function TaskPage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-indigo-900 via-sky-800 to-sky-700 overflow-auto px-6 py-12">
      {/* Decorative stars */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
      <div className="absolute bottom-20 left-1/2 w-48 h-48 bg-white/10 blur-3xl rounded-full" />

      {/* Header */}
      <h1 className="text-4xl font-bold bg-gradient-to-b from-white via-white to-sky-400 bg-clip-text text-transparent text-center mb-12">
        Task Board
      </h1>

      {/* Task Board */}
      <TaskBoard />
    </div>
  );
} 