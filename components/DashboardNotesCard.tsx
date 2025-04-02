'use client'

import React from 'react'
import useSWR from 'swr'
import { DashboardCardProps, Note } from '@/types/components'
import { Trash2 } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const DashboardNotesCard: React.FC<DashboardCardProps> = ({ userId }) => {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/notes?userId=${userId}&limit=5` : null,
    fetcher
  )

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete note')
      }

      // Refresh the notes list
      mutate()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-yellow-50 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📓</span>
          <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-yellow-100/50 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-50 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📓</span>
          <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
        </div>
        <div className="text-red-500 bg-red-50 p-3 rounded-lg text-sm">
          Failed to load notes
        </div>
      </div>
    )
  }

  const notes = data?.data || []

  return (
    <div className="bg-yellow-50 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📓</span>
        <h2 className="text-lg font-semibold text-gray-900">Recent Notes</h2>
      </div>
      {notes.length === 0 ? (
        <p className="text-gray-500 text-sm">No notes yet</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note: Note) => (
            <div
              key={note.id}
              className="p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors"
            >
              <h3 className="font-medium text-gray-900 truncate">
                {note.title}
              </h3>
              <div className="flex items-start justify-between">
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {note.content}
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardNotesCard 