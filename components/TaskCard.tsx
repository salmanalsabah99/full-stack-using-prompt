'use client'

import React from 'react'
import { Task } from '@prisma/client'
import { format } from 'date-fns'
import { Calendar, Pencil, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          )}
          <div className={`px-2 py-1 text-xs font-medium rounded-full ${
            task.priority === 'HIGH'
              ? 'bg-red-100 text-red-800'
              : task.priority === 'MEDIUM'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {task.priority}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Edit task"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard 