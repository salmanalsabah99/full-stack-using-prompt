'use client';

import { useState, useEffect, useCallback, Suspense, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskList as TaskListType, Task } from '@/types/task';
import TaskList from './components/TaskList';
import AddList from './components/AddList';
import { useTaskLists } from './hooks/useTaskLists';
import TaskBoard from './components/TaskBoard';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function Scene() {
  return (
    <>
      {/* Base layer - distant stars */}
      <Stars
        radius={200}
        depth={80}
        count={5000}
        factor={5}
        saturation={0.3}
        fade
        speed={1}
      />
      {/* Middle layer - medium brightness stars */}
      <Stars
        radius={200}
        depth={50}
        count={2000}
        factor={7}
        saturation={0.6}
        fade
        speed={1.2}
      />
      {/* Top layer - bright stars */}
      <Stars
        radius={200}
        depth={30}
        count={1000}
        factor={9}
        saturation={0.8}
        fade
        speed={1.5}
      />
    </>
  );
}

export default function TasksPage() {
  const { taskLists, isLoading, error, handleListAdd, handleTaskReorder, handleTaskMove, handleTaskDelete, handleTaskUpdate, handleListDelete, handleListUpdate, handleTaskAdd } = useTaskLists();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#030712] via-[#0b0c2a] to-[#0f0f1e] text-white">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold"
          >
            Loading...
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#030712] via-[#0b0c2a] to-[#0f0f1e] text-white">
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-red-500"
          >
            Error: {error.message}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-auto">
      <div className="fixed inset-0 bg-gradient-to-b from-[#030712] via-[#0b0c2a] to-[#0f0f1e]">
        <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 px-10 py-12 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-12"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-extrabold text-center mb-4 tracking-widest drop-shadow-xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          >
            Mission: Stellar TaskBoard
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-200 text-lg mb-6"
          >
            Command Center Dashboard
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AddList onListAdd={handleListAdd} />
          </motion.div>
        </motion.div>

        <TaskBoard
          taskLists={taskLists}
          onTaskReorder={handleTaskReorder}
          onTaskMove={handleTaskMove}
          onTaskDelete={handleTaskDelete}
          onTaskUpdate={handleTaskUpdate}
          onListDelete={handleListDelete}
          onListUpdate={handleListUpdate}
          onTaskAdd={handleTaskAdd}
        />
      </div>
    </div>
  );
} 