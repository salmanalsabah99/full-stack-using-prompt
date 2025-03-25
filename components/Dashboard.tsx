'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const cards = [
  {
    title: 'Tasks',
    description: 'Organize your todos',
    path: '/task',
  },
  {
    title: 'Calendar',
    description: 'View upcoming events',
  },
  {
    title: 'Notes',
    description: 'Capture ideas effortlessly',
  },
];

const priorityTasks = [
  {
    label: '🔥 Submit AI Research',
    position: 'top-4 left-1/2 -translate-x-1/2',
    duration: 4,
  },
  {
    label: '🕒 10AM Sync Call',
    position: 'right-12 top-1/3',
    duration: 5,
  },
  {
    label: '📖 Read Design Notes',
    position: 'left-12 bottom-1/4',
    duration: 6,
  },
];

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-sky-400 via-white to-white flex flex-col items-center p-4 md:p-12">
      <div className="flex flex-col items-center gap-12 py-12">
        <motion.h1
          animate={{ y: [0, -4, 0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{
            scale: 1.03,
            textShadow: "0px 0px 20px rgba(255, 255, 255, 0.6)",
          }}
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-b from-white via-white to-sky-400 bg-clip-text text-transparent text-center"
        >
          Your Daily Helper
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10 max-w-screen-lg">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.2 }}
              whileHover={{
                scale: 1.05,
                rotate: 2,
                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => card.path && router.push(card.path)}
              className={`w-64 h-40 md:w-72 md:h-48 bg-white/40 backdrop-blur-md rounded-2xl shadow-xl p-6 flex flex-col justify-between cursor-pointer ${
                card.path ? 'hover:bg-white/50' : ''
              }`}
            >
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800">{card.title}</h2>
              <p className="text-sm md:text-base text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8 mt-24">
          Today's Priorities
        </h2>

        <div className="relative w-full max-w-xl h-96 mb-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/60 backdrop-blur rounded-full px-6 py-3 shadow-lg text-lg font-semibold text-gray-800">
            Today
          </div>

          {priorityTasks.map((task, index) => (
            <motion.div
              key={task.label}
              animate={{ y: [0, -6, 0, 6, 0] }}
              transition={{ duration: task.duration, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.1 }}
              className={`absolute ${task.position} bg-white/40 backdrop-blur-md rounded-full px-5 py-2 shadow-md text-sm font-medium text-gray-700`}
            >
              {task.label}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 