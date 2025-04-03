'use client'

import { useUser } from '@/context/UserContext'
import { useEffect, useState } from 'react'
import { TaskStatus, Priority } from '@prisma/client'
import { TaskList as TaskListType } from '@prisma/client'
import { format } from 'date-fns'
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Archive, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import EditTaskModal from './modals/EditTaskModal'

interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: Date | null
  completedAt: Date | null
  order: number
  createdAt: Date
  updatedAt: Date
  userId: string
  taskListId: string
}

export default function TaskList() {
  const { userId } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [taskListId, setTaskListId] = useState<string>('')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    const fetchTaskList = async () => {
      if (!userId) return

      try {
        // First, get or create the default task list
        const response = await fetch(`/api/tasklists?userId=${userId}&default=true`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch task list')
        }

        if (!data.success || !data.data) {
          throw new Error('Invalid response format')
        }

        setTaskListId(data.data.id)

        // Then fetch all tasks for this task list that are due today
        const tasksResponse = await fetch(`/api/tasks?userId=${userId}&taskListId=${data.data.id}&dueToday=true`)
        const tasksData = await tasksResponse.json()

        if (!tasksResponse.ok) {
          throw new Error(tasksData.error || 'Failed to fetch tasks')
        }

        if (tasksData.success && tasksData.data) {
          console.log('Received tasks in TaskList:', tasksData.data.map((task: Task) => ({
            id: task.id,
            title: task.title,
            status: task.status,
            dueDate: task.dueDate
          })))
          setTasks(tasksData.data)
        } else {
          throw new Error('Invalid tasks response format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTaskList()
  }, [userId])

  const handleTaskUpdate = async () => {
    if (!userId || !taskListId) return

    try {
      const tasksResponse = await fetch(`/api/tasks?userId=${userId}&taskListId=${taskListId}&dueToday=true`)
      const tasksData = await tasksResponse.json()

      if (!tasksResponse.ok) {
        throw new Error(tasksData.error || 'Failed to fetch tasks')
      }

      if (tasksData.success && tasksData.data) {
        setTasks(tasksData.data)
      }
    } catch (err) {
      console.error('Error refreshing tasks:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No tasks due today
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={cn(
            "bg-white p-4 rounded-lg shadow-sm border border-gray-100",
            task.status === 'DONE' && "opacity-75",
            task.status === 'ARCHIVED' && "opacity-50"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={async () => {
                  try {
                    // Define status transitions
                    const statusTransitions: Record<TaskStatus, TaskStatus> = {
                      'TODO': 'IN_PROGRESS',
                      'IN_PROGRESS': 'DONE',
                      'DONE': 'ARCHIVED',
                      'ARCHIVED': 'TODO'
                    }

                    const newStatus = statusTransitions[task.status]
                    const response = await fetch(`/api/tasks/${task.id}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        status: newStatus,
                        completedAt: newStatus === 'DONE' ? new Date() : null,
                      }),
                    })

                    if (!response.ok) {
                      throw new Error('Failed to update task')
                    }

                    // Refresh tasks
                    await handleTaskUpdate()
                  } catch (err) {
                    console.error('Error updating task:', err)
                  }
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                {task.status === 'DONE' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : task.status === 'IN_PROGRESS' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : task.status === 'ARCHIVED' ? (
                  <Archive className="h-5 w-5 text-gray-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <h3 className={cn(
                "text-sm font-medium",
                task.status === 'DONE' ? "text-gray-500 line-through" : "text-gray-900"
              )}>
                {task.title}
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              {task.dueDate && (
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </div>
              )}
              <div className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                {
                  'bg-red-100 text-red-800': task.priority === 'HIGH',
                  'bg-yellow-100 text-yellow-800': task.priority === 'MEDIUM',
                  'bg-green-100 text-green-800': task.priority === 'LOW',
                }
              )}>
                {task.priority}
              </div>
              <div className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                {
                  'bg-gray-100 text-gray-800': task.status === 'TODO',
                  'bg-blue-100 text-blue-800': task.status === 'IN_PROGRESS',
                  'bg-green-100 text-green-800': task.status === 'DONE',
                  'bg-gray-200 text-gray-600': task.status === 'ARCHIVED',
                }
              )}>
                {task.status}
              </div>
              <button
                onClick={() => setEditingTask(task)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                aria-label="Edit task"
                title="Edit task"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
          {task.description && (
            <p className={cn(
              "text-sm mt-1",
              task.status === 'DONE' ? "text-gray-400" : "text-gray-500"
            )}>
              {task.description}
            </p>
          )}
        </div>
      ))}
      {editingTask && (
        <EditTaskModal
          isOpen={!!editingTask}
          onClose={() => {
            setEditingTask(null)
            handleTaskUpdate()
          }}
          task={editingTask}
        />
      )}
    </div>
  )
} 