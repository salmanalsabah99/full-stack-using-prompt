'use client'

import React, { useState } from 'react'
import { Task } from '@prisma/client'
import TaskCard from './TaskCard'
import TaskForm from './TaskForm'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  status: string
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>
  onTaskDelete: (taskId: string) => Promise<void>
  onTaskCreate: (taskData: Partial<Task>) => Promise<void>
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  tasks,
  status,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

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

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingTask(undefined)
  }

  const handleFormSubmit = async (taskData: Partial<Task>) => {
    if (editingTask) {
      await onTaskUpdate(editingTask.id, taskData)
    } else {
      await onTaskCreate({ ...taskData, status: status as Task['status'] })
    }
  }

  const handleStatusChange = async (taskId: string, currentStatus: Task['status']) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE'
    await onTaskUpdate(taskId, { status: newStatus })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {tasks.length}
          </span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Add task"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      <motion.div 
        className="flex-1 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-md rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.08)] shadow-blue-100/50 ring-1 ring-inset ring-blue-100/50 p-5 space-y-3 overflow-y-auto max-h-[calc(100vh-250px)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-blue-200/70 hover:ring-blue-200/70 transition-all duration-300"
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
              <TaskCard
                task={task}
                onEdit={handleEdit}
                onDelete={onTaskDelete}
                onStatusChange={handleStatusChange}
              />
            </motion.div>
          ))
        )}
      </motion.div>

      <TaskForm
        task={editingTask}
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialStatus={status as Task['status']}
      />
    </div>
  )
}

export default KanbanColumn 