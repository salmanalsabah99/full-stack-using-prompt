'use client'

import React from 'react'
import { NoteCategory } from '@/types/note'
import { useUser } from '@/context/UserContext'
import { Plus, Pencil, Trash2 } from 'lucide-react'

interface SidebarProps {
  categories: NoteCategory[]
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string | null) => void
  onCreateCategory: () => void
  onEditCategory: (category: NoteCategory) => void
  onDeleteCategory: (categoryId: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}) => {
  const { userId } = useUser()

  return (
    <div className="w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="font-medium text-gray-900 dark:text-gray-100">
          Notes
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Categories
          </h3>
          <button
            onClick={onCreateCategory}
            className="p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              selectedCategoryId === null
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            All Notes
          </button>
          {categories.map((category) => (
            <div
              key={category.id}
              className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategoryId === category.id
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              <button
                onClick={() => onSelectCategory(category.id)}
                className="flex-1 text-left flex items-center gap-2"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </button>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEditCategory(category)}
                  className="p-1 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400 transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar 