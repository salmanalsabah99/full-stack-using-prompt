'use client'

import React from 'react'
import { Plus, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

interface TopBarProps {
  onCreateNote: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onCreateNote }) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        All Notes
      </h1>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        <button
          onClick={onCreateNote}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Note</span>
        </button>
      </div>
    </div>
  )
}

export default TopBar 