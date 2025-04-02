'use client'

import { useState } from 'react'
import { useUser } from '@/context/UserContext'

export default function QuickAddBar() {
  const { userId } = useUser()
  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !userId) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: input.trim(),
          userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      setInput('')
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add a quick task..."
        className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  )
} 