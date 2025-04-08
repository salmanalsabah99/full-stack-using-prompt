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

  // Predefined color palette
  const colorPalette = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#6366F1', // Indigo
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#6B7280', // Gray
  ]

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
      title={category ? 'Edit Category' : 'New Category'}
      className="z-50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
            disabled={isSubmitting}
            placeholder="Category name"
          />
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Color
          </label>
          <div className="mt-2">
            <div className="flex flex-wrap gap-3">
              {colorPalette.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Category saved successfully!
          </p>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Saving...' : category ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default CategoryModal 