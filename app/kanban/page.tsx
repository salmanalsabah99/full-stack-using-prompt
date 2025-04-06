'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import useSWR from 'swr'
import { Task } from '@prisma/client'
import KanbanColumn from '@/components/dashboard/kanban/KanbanColumn'
import { motion } from 'framer-motion'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const KanbanPage: React.FC = () => {
  const { userId, isLoading } = useUser()
  const router = useRouter()

  const { data: taskListData } = useSWR(
    userId ? `/api/tasklists?userId=${userId}&default=true` : null,
    fetcher
  )

  const taskListId = taskListData?.data?.id

  const { data, error, isLoading: tasksLoading, mutate } = useSWR(
    userId && taskListId ? `/api/tasks?userId=${userId}&taskListId=${taskListId}` : null,
    fetcher
  )

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
    } catch (error) {
      console.error('Error updating task:', error)
      // You might want to show an error notification here
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
      // You might want to show an error notification here
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
    } catch (error) {
      console.error('Error creating task:', error)
      // You might want to show an error notification here
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
            Failed to load tasks
          </div>
        </div>
      </div>
    )
  }

  const tasks = data?.data || []

  const topRowColumns = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' },
  ]

  const bottomRowColumns = [
    { id: 'HOLD', title: 'Hold' },
    { id: 'WAITING', title: 'Wait' },
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

        {/* Top Row - Main Task Columns */}
        <motion.div 
          className="grid grid-cols-3 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {topRowColumns.map((column, index) => (
            <motion.div
              key={column.id}
              variants={columnVariants}
              custom={index}
            >
              <KanbanColumn
                title={column.title}
                tasks={tasks.filter((task: Task) => task.status === column.id)}
                status={column.id}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskCreate={handleTaskCreate}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Row - Hold/Wait Columns */}
        <motion.div 
          className="grid grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bottomRowColumns.map((column, index) => (
            <motion.div
              key={column.id}
              variants={columnVariants}
              custom={index}
            >
              <KanbanColumn
                title={column.title}
                tasks={tasks.filter((task: Task) => task.status === column.id)}
                status={column.id}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                onTaskCreate={handleTaskCreate}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default KanbanPage 