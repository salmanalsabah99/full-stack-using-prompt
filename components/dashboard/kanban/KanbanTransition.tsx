'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Task } from '@prisma/client'
import KanbanColumn from './KanbanColumn'

interface KanbanTransitionProps {
  isExpanded: boolean
  onClose: () => void
  initialTasks: Task[]
  userId: string
}

const KanbanTransition: React.FC<KanbanTransitionProps> = ({
  isExpanded,
  onClose,
  initialTasks,
  userId
}) => {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const cardRef = useRef<HTMLDivElement>(null)

  const statusColumns = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'On Progress' },
    { id: 'DONE', title: 'Done' },
    { id: 'HOLD', title: 'Hold' },
    { id: 'WAITING', title: 'Waiting' },
  ]

  useEffect(() => {
    if (isExpanded) {
      setIsAnimating(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isExpanded])

  const handleAnimationComplete = () => {
    if (!isExpanded) {
      router.back()
    }
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task))
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(tasks.filter(task => task.id !== taskId))
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...taskData, userId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-50 bg-gray-50"
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>

              <div className="flex space-x-4 overflow-x-auto pb-4 kanban-scroll">
                {statusColumns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    title={column.title}
                    tasks={tasks.filter((task) => task.status === column.id)}
                    status={column.id}
                    onTaskUpdate={handleTaskUpdate}
                    onTaskDelete={handleTaskDelete}
                    onTaskCreate={handleTaskCreate}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default KanbanTransition 