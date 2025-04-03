import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { Task, TaskStatus, Priority } from '@prisma/client'
import { ensureDefaultTaskList } from '../../../lib/task-list'

interface TasksResponse {
  success: boolean
  data?: {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    priority: Priority
    dueDate: string | null
    completedAt: string | null
    order: number
    createdAt: string
    updatedAt: string
    userId: string
    taskListId: string
  }[]
  error?: string
}

interface TaskResponse {
  success: boolean
  data?: {
    id: string
    title: string
    description: string | null
    status: TaskStatus
    priority: Priority
    dueDate: string | null
    completedAt: string | null
    order: number
    createdAt: string
    updatedAt: string
    userId: string
    taskListId: string
  }
  error?: string
}

interface CreateTaskInput {
  title: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: string
  order?: number
  userId: string
  taskListId: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TasksResponse | TaskResponse>
) {
  if (req.method === 'GET') {
    try {
      const { userId, taskListId, dueToday } = req.query

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        })
      }

      let where: any = {
        userId: userId as string
      }

      if (taskListId) {
        where.taskListId = taskListId as string
      }

      if (dueToday === 'true') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        console.log('Today date range:', {
          today: today.toISOString(),
          tomorrow: tomorrow.toISOString()
        })

        where.dueDate = {
          gte: today,
          lt: tomorrow
        }
      }

      const tasks = await prisma.task.findMany({
        where,
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      })

      console.log('Found tasks:', tasks.map(task => ({
        id: task.id,
        title: task.title,
        status: task.status,
        dueDate: task.dueDate?.toISOString()
      })))

      // Convert Date objects to ISO strings for the response
      const formattedTasks = tasks.map(task => ({
        ...task,
        dueDate: task.dueDate?.toISOString() || null,
        completedAt: task.completedAt?.toISOString() || null,
        createdAt: task.createdAt.toISOString(),
        updatedAt: task.updatedAt.toISOString()
      }))

      return res.status(200).json({
        success: true,
        data: formattedTasks
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
          order: lastTask ? lastTask.order + 1 : 0,
          status: input.status || 'TODO'
        }
      })

      // Convert Date objects to ISO strings for the response
      const formattedTask = {
        ...newTask,
        dueDate: newTask.dueDate?.toISOString() || null,
        completedAt: newTask.completedAt?.toISOString() || null,
        createdAt: newTask.createdAt.toISOString(),
        updatedAt: newTask.updatedAt.toISOString()
      }

      return res.status(201).json({
        success: true,
        data: formattedTask
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