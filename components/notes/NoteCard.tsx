'use client'

import React from 'react'
import { NoteWithCategory } from '@/types/note'
import { formatDistanceToNow } from 'date-fns'
import { Pencil, Trash2 } from 'lucide-react'

interface NoteCardProps {
  note: NoteWithCategory
  onEdit: (note: NoteWithCategory) => void
  onDelete: (noteId: string) => void
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800 rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-white/80 dark:hover:bg-gray-700 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {note.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
            {note.content}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(note)}
            className="p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        {note.category && (
          <span
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${note.category.color}20`, color: note.category.color }}
          >
            {note.category.name}
          </span>
        )}
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </div>
  )
}

export default NoteCard 