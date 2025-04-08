'use client'

import React, { useState } from 'react'
import { useUser } from '@/context/UserContext'
import BaseModal from './BaseModal'
import { useSWRConfig } from 'swr'
import { NoteCategory } from '@/types/note'

interface CreateNoteModalProps {
  isOpen: boolean
  onClose: () => void
  categories?: NoteCategory[]
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({
  isOpen,
  onClose,
  categories = [],
}) => {
  const { userId } = useUser()
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    categoryId: '',
  })

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

    // Validate form data
    if (!formData.title.trim()) {
      setError('Title is required')
      setIsSubmitting(false)
      return
    }

    if (!formData.content.trim()) {
      setError('Content is required')
      setIsSubmitting(false)
      return
    }

    console.log('Submitting new NOTE with userId:', userId)
    console.log('Payload:', {
      ...formData,
      categoryId: formData.categoryId || null,
      userId,
    })

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          categoryId: formData.categoryId || null,
          userId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create note')
      }

      console.log('Note created successfully:', data)

      setSuccess(true)
      mutate('/api/notes') // Revalidate notes list
      setTimeout(() => {
        onClose()
        setFormData({
          title: '',
          content: '',
          categoryId: '',
        })
        setSuccess(false)
      }, 1000)
    } catch (err) {
      console.error('Network or JSON error:', err)
      setError(err instanceof Error ? err.message : 'Failed to create note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Note"
      size="md"
      className="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-100">
            Note created successfully!
          </div>
        )}
        
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-100">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={isSubmitting}
              placeholder="Enter note title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              required
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              disabled={isSubmitting}
              placeholder="Enter note content"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isSubmitting}
            >
              <option value="">No Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </div>
      </form>
    </BaseModal>
  )
}

export default CreateNoteModal 