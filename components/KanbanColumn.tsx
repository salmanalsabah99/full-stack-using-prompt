'use client'

import React from 'react'
import { Task } from '@prisma/client'
import TaskCard from './TaskCard'
import { motion } from 'framer-motion'

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  status: string
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, status }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const taskVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      },
    },
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
          {tasks.length}
        </span>
      </div>
      <motion.div 
        className="flex-1 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-md rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] shadow-blue-100/50 ring-1 ring-inset ring-blue-100/50 p-5 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {tasks.length === 0 ? (
          <motion.div 
            className="text-center text-gray-500 py-4"
            variants={taskVariants}
          >
            No tasks in this column
          </motion.div>
        ) : (
          tasks.map((task, index) => (
            <motion.div
              key={task.id}
              variants={taskVariants}
              custom={index}
            >
              <TaskCard task={task} />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  )
}

export default KanbanColumn 