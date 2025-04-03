import React, { useState, useEffect } from 'react'
import { useSWRConfig } from 'swr'
import BaseModal from './BaseModal'
import { Note } from '@prisma/client'

interface EditNoteModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note
  onUpdate?: () => void
}

const EditNoteModal: React.FC<EditNoteModalProps> = ({ isOpen, onClose, note, onUpdate }) => {
  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: note.title,
    content: note.content
  })

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content
      })
    }
  }, [note])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/notes/${note.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to update note')
      }

      setSuccess(true)
      mutate('/api/notes') // Revalidate notes list
      if (onUpdate) {
        onUpdate()
      }
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update note')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BaseModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Edit Note"
      className="z-50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">
            Note updated successfully!
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
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={isSubmitting}
            placeholder="Enter note title"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            required
            rows={6}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
            disabled={isSubmitting}
            placeholder="Enter note content"
          />
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
            disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}

export default EditNoteModal 