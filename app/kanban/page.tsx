'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import useSWR from 'swr'
import { Task, TaskStatus } from '@prisma/client'
import KanbanColumn from '@/components/KanbanColumn'
import { motion, AnimatePresence } from 'framer-motion'
import TaskForm from '@/components/TaskForm'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const KanbanPage: React.FC = () => {
  const { userId, isLoading } = useUser()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: taskListData } = useSWR(
    userId ? `/api/tasklists?userId=${userId}&default=true` : null,
    fetcher
  )

  const taskListId = taskListData?.data?.id

  const { data, error: tasksError, isLoading: tasksLoading, mutate } = useSWR(
    userId && taskListId ? `/api/tasks?userId=${userId}&taskListId=${taskListId}` : null,
    fetcher
  )

  React.useEffect(() => {
    if (data) {
      setTasks(data.data)
    }
  }, [data])

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error('Failed to update task')

      // Optimistically update the UI
      const updatedTask = await response.json()
      mutate(
        {
          ...data,
          data: data.data.map((task: Task) =>
            task.id === taskId ? updatedTask.data : task
          ),
        },
        false
      )
      setEditingTask(null)
    } catch (error) {
      console.error('Error updating task:', error)
      setError(error instanceof Error ? error.message : 'Failed to update task')
    }
  }

  const handleTaskDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete task')

      // Optimistically update the UI
      mutate(
        {
          ...data,
          data: data.data.filter((task: Task) => task.id !== taskId),
        },
        false
      )
    } catch (error) {
      console.error('Error deleting task:', error)
      setError(error instanceof Error ? error.message : 'Failed to delete task')
    }
  }

  const handleTaskCreate = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskData,
          userId,
          taskListId,
        }),
      })

      if (!response.ok) throw new Error('Failed to create task')

      // Optimistically update the UI
      const newTask = await response.json()
      mutate(
        {
          ...data,
          data: [...data.data, newTask.data],
        },
        false
      )
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error creating task:', error)
      setError(error instanceof Error ? error.message : 'Failed to create task')
    }
  }

  const handleTaskStatusChange = async (taskId: string, currentStatus: TaskStatus) => {
    try {
      const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE'
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) throw new Error('Failed to update task status')
      const updatedTask = await response.json()
      mutate(
        {
          ...data,
          data: data.data.map((task: Task) =>
            task.id === taskId ? updatedTask : task
          ),
        },
        false
      )
    } catch (error) {
      console.error('Error updating task status:', error)
      setError(error instanceof Error ? error.message : 'Failed to update task status')
    }
  }

  if (isLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        </div>
      </div>
    )
  }

  const columns = [
    { title: 'To Do', status: 'TODO' as TaskStatus },
    { title: 'In Progress', status: 'IN_PROGRESS' as TaskStatus },
    { title: 'Done', status: 'DONE' as TaskStatus },
    { title: 'Hold', status: 'HOLD' as TaskStatus },
    { title: 'Waiting', status: 'WAITING' as TaskStatus },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-gray-900"
          >
            Kanban Board
          </motion.h1>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Dashboard
          </motion.button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
          >
            Add Task
          </motion.button>
        </div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <TaskForm
                  onSubmit={handleTaskCreate}
                  onCancel={() => setIsFormOpen(false)}
                  initialData={{ status: 'TODO' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {editingTask && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <TaskForm
                  onSubmit={(updates) => handleTaskUpdate(editingTask.id, updates)}
                  onCancel={() => setEditingTask(null)}
                  initialData={editingTask}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="grid grid-cols-5 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {columns.map((column, index) => (
            <motion.div
              key={column.status}
              variants={columnVariants}
              custom={index}
            >
              <KanbanColumn
                title={column.title}
                tasks={tasks.filter((task: Task) => task.status === column.status)}
                status={column.status}
                onEditTask={setEditingTask}
                onDeleteTask={handleTaskDelete}
                onStatusChange={handleTaskStatusChange}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default KanbanPage 