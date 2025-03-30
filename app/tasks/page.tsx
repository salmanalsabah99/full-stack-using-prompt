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
import { pageStyles } from './utils/styles';

export default function TasksPage() {
  const { handleListAdd } = useTaskLists();

  return (
    <div className="relative min-h-screen w-full overflow-x-auto">
      <div className={`fixed inset-0 ${pageStyles.container}`}>
        <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
          <Suspense fallback={null}>
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
          </Suspense>
        </Canvas>
      </div>

      <div className={pageStyles.content}>
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
            className={pageStyles.title}
          >
            Mission: Stellar TaskBoard
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={pageStyles.subtitle}
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

        <TaskBoard />
      </div>
    </div>
  );
} 