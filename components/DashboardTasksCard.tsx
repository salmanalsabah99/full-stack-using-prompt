'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { DashboardCardProps } from '@/types/components'
import { Trash2, Pencil } from 'lucide-react'
import EditTaskModal from './modals/EditTaskModal'
import { Task, TaskStatus, Priority } from '@prisma/client'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const DashboardTasksCard: React.FC<DashboardCardProps> = ({ userId }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const router = useRouter()

  const { data: taskListData } = useSWR(
    userId ? `/api/tasklists?userId=${userId}&default=true` : null,
    fetcher
  )

  const taskListId = taskListData?.data?.id

  const { data, error, isLoading, mutate } = useSWR(
    userId && taskListId ? `/api/tasks?userId=${userId}&taskListId=${taskListId}&dueToday=true` : null,
    fetcher
  )

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      // Refresh the tasks list
      mutate()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleTaskStatusChange = async (taskId: string, currentStatus: TaskStatus) => {
    try {
      const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE'
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task status')
      }

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
      console.error('Error updating task status:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-blue-50 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🧠</span>
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-blue-100/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🧠</span>
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
        </div>
        <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">
          Failed to load tasks
        </div>
      </div>
    )
  }

  const tasks = data?.data || []

  return (
    <>
      <div 
        className="bg-blue-50 rounded-xl p-6 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        onClick={() => router.push('/kanban')}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🧠</span>
          <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
          <span className="text-sm text-gray-500">({tasks.length} total)</span>
        </div>
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">No tasks for today</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: Task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={task.status === 'DONE'}
                  onChange={() => handleTaskStatusChange(task.id, task.status)}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-gray-900 truncate ${task.status === 'DONE' ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 truncate">
                      {task.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      task.priority === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'MEDIUM'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {task.priority}
                  </span>
                  <button
                    onClick={() => setEditingTask(task)}
                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                    title="Edit task"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => {
            setEditingTask(null)
            mutate()
          }}
          task={editingTask}
        />
      )}
    </>
  )
}

export default DashboardTasksCard 