'use client'

import React from 'react'
import { Task } from '@prisma/client'
import TaskCard from './TaskCard'

interface KanbanColumnProps {
  title: string
  tasks: Task[]
  status: string
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, status }) => {
  return (
    <div className="flex flex-col w-72 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-sm p-4 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No tasks in this column
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  )
}

export default KanbanColumn 