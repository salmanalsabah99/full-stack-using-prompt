'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import useSWR from 'swr'
import { Task } from '@prisma/client'
import KanbanColumn from '@/components/KanbanColumn'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const KanbanPage: React.FC = () => {
  const { userId, isLoading } = useUser()
  const router = useRouter()

  const { data: taskListData } = useSWR(
    userId ? `/api/tasklists?userId=${userId}&default=true` : null,
    fetcher
  )

  const taskListId = taskListData?.data?.id

  const { data, error, isLoading: tasksLoading } = useSWR(
    userId && taskListId ? `/api/tasks?userId=${userId}&taskListId=${taskListId}` : null,
    fetcher
  )

  if (isLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            Failed to load tasks
          </div>
        </div>
      </div>
    )
  }

  const tasks = data?.data || []

  const statusColumns = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'On Progress' },
    { id: 'DONE', title: 'Done' },
    { id: 'HOLD', title: 'Hold' },
    { id: 'WAITING', title: 'Waiting' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6 kanban-enter kanban-enter-active">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="flex space-x-4 overflow-x-auto pb-4 kanban-scroll">
          {statusColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              title={column.title}
              tasks={tasks.filter((task: Task) => task.status === column.id)}
              status={column.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default KanbanPage 