'use client'

import React, { useState, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import BaseModal from './BaseModal'
import { NoteCategory } from '@/types/note'
import { useUser } from '@/context/UserContext'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  category?: NoteCategory
  onUpdate?: () => void
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  onUpdate,
}) => {
  const { mutate } = useSWRConfig()
  const { userId } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6', // Default blue color
  })

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
      })
    } else {
      setFormData({
        name: '',
        color: '#3B82F6',
      })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const url = category
        ? `/api/note-categories/${category.id}`
        : '/api/note-categories'
      const method = category ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to save category')
      }

      setSuccess(true)
      mutate('/api/note-categories') // Revalidate categories list
      if (onUpdate) {
        onUpdate()
      }
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Create Category'}
      className="z-50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            Category {category ? 'updated' : 'created'} successfully!
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
            placeholder="Enter category name"
          />
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color
          </label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="color"
              id="color"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="h-8 w-8 rounded border border-gray-300"
              disabled={isSubmitting}
            />
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isSubmitting}
              placeholder="#000000"
            />
          </div>
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
            disabled={isSubmitting || !formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting
              ? category
                ? 'Saving...'
                : 'Creating...'
              : category
              ? 'Save Changes'
              : 'Create Category'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default CategoryModal 