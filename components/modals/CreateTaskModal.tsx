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
  const { userId, isLoading } = useUser()
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
      if (isLoading) {
        console.log('User context is loading, waiting...')
        return
      }

      if (!userId) {
        console.error('User is not authenticated')
        setError('Please log in to create tasks.')
        return
      }

      try {
        console.log('Fetching default task list for userId:', userId)
        const response = await fetch(`/api/tasklists?userId=${userId}&default=true`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
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

    if (isOpen) {
      fetchDefaultTaskList()
    }
  }, [userId, isLoading, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (isLoading) {
      console.error('User context is still loading')
      setError('Please wait while we verify your session.')
      setIsSubmitting(false)
      return
    }

    if (!userId) {
      console.error('User is not authenticated')
      setError('Please log in to create tasks.')
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
      userId: userId,
      title: formData.title,
      priority: formData.priority,
      taskListId: formData.taskListId,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
      status: formData.status
    })

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: formData.title,
          priority: formData.priority,
          taskListId: formData.taskListId,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
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
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Task"
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="bg-green-50 text-green-800 p-4 rounded-md">
            Task created successfully!
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-md">
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default CreateTaskModal 