import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { CreateTaskInput, TasksResponse, TaskResponse } from '../../../types'
import { ensureDefaultTaskList } from '../../../lib/task-list'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TasksResponse | TaskResponse>
) {
  if (req.method === 'GET') {
    try {
      const { taskListId, userId, dueToday } = req.query

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        })
      }

      let effectiveTaskListId = taskListId

      // Handle default task list case
      if (taskListId === 'default') {
        const defaultTaskList = await ensureDefaultTaskList(userId)
        effectiveTaskListId = defaultTaskList.id
      }

      if (!effectiveTaskListId || typeof effectiveTaskListId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'TaskList ID is required'
        })
      }

      // Build where clause
      const where: any = {
        taskListId: effectiveTaskListId
      }

      // Handle dueToday filter
      if (dueToday === 'true') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        where.dueDate = {
          gte: today,
          lt: tomorrow
        }
      }

      const tasks = await prisma.task.findMany({
        where,
        orderBy: {
          order: 'asc'
        }
      })

      return res.status(200).json({
        success: true,
        data: tasks
      })
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch tasks'
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const input: CreateTaskInput = req.body

      // Validate required fields
      if (!input.title || !input.userId) {
        return res.status(400).json({
          success: false,
          error: 'Title and userId are required'
        })
      }

      let effectiveTaskListId = input.taskListId

      // Handle default task list case
      if (!effectiveTaskListId || effectiveTaskListId === 'default') {
        const defaultTaskList = await ensureDefaultTaskList(input.userId)
        effectiveTaskListId = defaultTaskList.id
      }

      // Verify taskList exists and belongs to user
      const taskList = await prisma.taskList.findFirst({
        where: {
          id: effectiveTaskListId,
          userId: input.userId
        }
      })

      if (!taskList) {
        return res.status(404).json({
          success: false,
          error: 'TaskList not found or does not belong to user'
        })
      }

      // Get the highest order in the taskList
      const lastTask = await prisma.task.findFirst({
        where: { taskListId: effectiveTaskListId },
        orderBy: { order: 'desc' }
      })

      const newTask = await prisma.task.create({
        data: {
          ...input,
          taskListId: effectiveTaskListId,
          order: lastTask ? lastTask.order + 1 : 0
        }
      })

      return res.status(201).json({
        success: true,
        data: newTask
      })
    } catch (error) {
      console.error('Error creating task:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create task'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 