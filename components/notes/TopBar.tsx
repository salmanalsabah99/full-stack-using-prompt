'use client'

import React from 'react'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopBarProps {
  onCreateNote: () => void
}

const TopBar: React.FC<TopBarProps> = ({ onCreateNote }) => {
  const router = useRouter()

  return (
    <div className="h-16 bg-white/50 border-b border-gray-200/50 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">All Notes</h1>
        <button
          onClick={onCreateNote}
          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          aria-label="Add note"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={() => router.push('/dashboard')}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        Back to Dashboard
      </button>
    </div>
  )
}

export default TopBar 