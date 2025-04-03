'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@/context/UserContext'
import BaseModal from './BaseModal'
import { useSWRConfig } from 'swr'
import { Priority, TaskStatus } from '@prisma/client'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

interface FormData {
  title: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  taskListId: string
  dueDate: string
  status: TaskStatus
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose }) => {
  const { userId } = useUser()
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [defaultTaskListId, setDefaultTaskListId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    taskListId: '',
    dueDate: '',
    status: 'TODO'
  })

  // Fetch default task list on mount
  useEffect(() => {
    const fetchDefaultTaskList = async () => {
      if (!userId) {
        console.error('No userId available')
        setError('User session not found. Please try logging in again.')
        return
      }

      try {
        console.log('Fetching default task list for userId:', userId)
        const response = await fetch(`/api/tasklists?userId=${userId}&default=true`)
        const data = await response.json()

        if (!response.ok) {
          console.error('Failed to fetch default task list:', data)
          throw new Error(data.error || 'Failed to fetch task list')
        }

        if (data.success && data.data) {
          console.log('Default task list found:', data.data)
          setDefaultTaskListId(data.data.id)
          setFormData((prev: FormData) => ({ ...prev, taskListId: data.data.id }))
        } else {
          console.error('Invalid response format:', data)
          throw new Error('Invalid response format from server')
        }
      } catch (err) {
        console.error('Error fetching default task list:', err)
        setError(err instanceof Error ? err.message : 'Failed to load task list. Please try again.')
      }
    }

    fetchDefaultTaskList()
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!userId) {
      console.error('No userId found in context')
      setError('User session not found. Please try logging in again.')
      setIsSubmitting(false)
      return
    }

    if (!formData.taskListId) {
      console.error('No taskListId provided')
      setError('Task list not found. Please try again.')
      setIsSubmitting(false)
      return
    }

    console.log('Submitting new TASK with userId:', userId)
    console.log('Payload:', {
      userId,
      title: formData.title,
      priority: formData.priority,
      taskListId: formData.taskListId,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      status: formData.status
    })

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title: formData.title,
          priority: formData.priority,
          taskListId: formData.taskListId,
          dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
          status: formData.status
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.error || 'Failed to create task')
      }

      console.log('Task created successfully:', data)

      // Show success message briefly
      setSuccess(true)
      
      // Refresh all task lists and tasks
      await Promise.all([
        mutate(`/api/tasklists?userId=${userId}`),
        mutate(`/api/tasks?userId=${userId}`),
        mutate(`/api/tasks?userId=${userId}&dueToday=true`)
      ])
      
      // Close modal after a short delay
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    } catch (err) {
      console.error('Network or JSON error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create task')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            Task created successfully!
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="TODO">To Do</option>
            <option value="WAITING">Waiting</option>
            <option value="HOLD">On Hold</option>
            <option value="IN_PROGRESS">On Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.taskListId}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default CreateTaskModal 