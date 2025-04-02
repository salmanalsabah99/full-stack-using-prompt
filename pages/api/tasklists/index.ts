import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { CreateTaskListInput, TaskListResponse, TaskListsResponse } from '../../../types'
import { ensureDefaultTaskList } from '../../../lib/task-list'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TaskListResponse | TaskListsResponse>
) {
  if (req.method === 'GET') {
    try {
      const { userId, default: isDefault } = req.query
      console.log('GET /api/tasklists - Query params:', { userId, isDefault })

      if (!userId || typeof userId !== 'string') {
        console.error('Invalid userId:', userId)
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        })
      }

      if (isDefault === 'true') {
        console.log('Fetching default task list for userId:', userId)
        const defaultTaskList = await ensureDefaultTaskList(userId)
        console.log('Default task list result:', defaultTaskList)
        return res.status(200).json({
          success: true,
          data: defaultTaskList
        })
      }

      console.log('Fetching all task lists for userId:', userId)
      const taskLists = await prisma.taskList.findMany({
        where: { userId },
        orderBy: { order: 'asc' }
      })
      console.log('Found task lists:', taskLists)

      return res.status(200).json({
        success: true,
        data: taskLists
      })
    } catch (error) {
      console.error('Error in GET /api/tasklists:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        })
      }
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch task lists'
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const input: CreateTaskListInput = req.body

      if (!input.name || !input.userId) {
        return res.status(400).json({
          success: false,
          error: 'Name and userId are required'
        })
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: input.userId }
      })

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        })
      }

      // Get the highest order
      const lastList = await prisma.taskList.findFirst({
        where: { userId: input.userId },
        orderBy: { order: 'desc' }
      })

      const taskList = await prisma.taskList.create({
        data: {
          ...input,
          order: input.order ?? (lastList ? lastList.order + 1 : 0)
        }
      })

      return res.status(201).json({
        success: true,
        data: taskList
      })
    } catch (error) {
      console.error('Error creating task list:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create task list'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 