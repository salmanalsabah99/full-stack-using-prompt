'use client'

import React from 'react'
import { Task } from '@prisma/client'
import { format } from 'date-fns'
import { Calendar, Pencil, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, currentStatus: Task['status']) => Promise<void>
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id)
    }
  }

  return (
    <motion.div 
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={task.status === 'DONE'}
              onChange={() => onStatusChange(task.id, task.status)}
            />
            <h3 className={`font-medium text-gray-900 truncate ${task.status === 'DONE' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
          </div>
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
            <motion.div 
              className="flex items-center text-sm text-gray-500"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </motion.div>
          )}
          <motion.div 
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.priority === 'HIGH'
                ? 'bg-red-100 text-red-800'
                : task.priority === 'MEDIUM'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-800'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {task.priority}
          </motion.div>
        </div>

        <div className="flex items-center space-x-2">
          <motion.button
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Edit task"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task)}
          >
            <Pencil className="h-4 w-4" />
          </motion.button>
          <motion.button
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete task"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard 