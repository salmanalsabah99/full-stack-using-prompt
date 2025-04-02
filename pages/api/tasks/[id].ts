import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { UpdateTaskInput, TaskResponse } from '../../../types'

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

  if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const input: UpdateTaskInput = req.body
      const { userId } = input

      // Verify task exists and belongs to user
      const existingTask = await prisma.task.findFirst({
        where: {
          id,
          userId
        }
      })

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          error: 'Task not found or does not belong to user'
        })
      }

      // If moving to a different list, verify the new list exists and belongs to the user
      if (input.taskListId && input.taskListId !== existingTask.taskListId) {
        const newTaskList = await prisma.taskList.findFirst({
          where: {
            id: input.taskListId,
            userId: existingTask.userId
          }
        })

        if (!newTaskList) {
          return res.status(404).json({
            success: false,
            error: 'Target TaskList not found or does not belong to user'
          })
        }

        // Get the highest order in the new taskList
        const lastTask = await prisma.task.findFirst({
          where: { taskListId: input.taskListId },
          orderBy: { order: 'desc' }
        })

        input.order = lastTask ? lastTask.order + 1 : 0
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: input
      })

      return res.status(200).json({
        success: true,
        data: updatedTask
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