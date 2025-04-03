import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { TaskStatus, Task, Priority } from '@prisma/client'
import { TaskResponse } from '../../../types'

interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: string
  order?: number
  taskListId?: string
  completedAt?: Date | null
  userId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaskResponse>
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Task ID is required'
    })
  }

  if (req.method === 'PUT') {
    try {
      const input = req.body

      // Verify task exists
      const existingTask = await prisma.task.findUnique({
        where: { id }
      })

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        })
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate ? new Date(input.dueDate) : null
        }
      })

      // Format dates for response
      const formattedTask = {
        ...updatedTask,
        dueDate: updatedTask.dueDate?.toISOString() || null,
        completedAt: updatedTask.completedAt?.toISOString() || null,
        createdAt: updatedTask.createdAt.toISOString(),
        updatedAt: updatedTask.updatedAt.toISOString()
      }

      return res.status(200).json({
        success: true,
        data: formattedTask
      })
    } catch (error) {
      console.error('Error updating task:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update task'
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete the task
      await prisma.task.delete({
        where: { id }
      })

      return res.status(200).json({
        success: true,
        data: null
      })
    } catch (error) {
      console.error('Error deleting task:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete task'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 