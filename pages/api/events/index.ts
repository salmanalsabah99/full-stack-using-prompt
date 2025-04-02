import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { CreateEventInput, EventsResponse, EventResponse } from '../../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsResponse | EventResponse>
) {
  if (req.method === 'GET') {
    try {
      const { userId, date } = req.query

      if (!userId || typeof userId !== 'string' || !date || typeof date !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'userId and date are required'
        })
      }

      // Parse the date and create start/end of day
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const events = await prisma.event.findMany({
        where: {
          userId,
          OR: [
            {
              startTime: {
                gte: startOfDay,
                lte: endOfDay
              }
            },
            {
              endTime: {
                gte: startOfDay,
                lte: endOfDay
              }
            }
          ]
        },
        orderBy: {
          startTime: 'asc'
        }
      })

      return res.status(200).json({
        success: true,
        data: events
      })
    } catch (error) {
      console.error('Error fetching events:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch events'
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const input: CreateEventInput = req.body

      // Validate required fields
      if (!input.title || !input.startTime || !input.userId) {
        return res.status(400).json({
          success: false,
          error: 'Title, startTime, and userId are required'
        })
      }

      // Validate time logic
      if (input.endTime && input.endTime <= input.startTime) {
        return res.status(400).json({
          success: false,
          error: 'endTime must be after startTime'
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

      // If taskId is provided, verify it exists and belongs to the user
      if (input.taskId) {
        const task = await prisma.task.findFirst({
          where: {
            id: input.taskId,
            userId: input.userId
          }
        })

        if (!task) {
          return res.status(404).json({
            success: false,
            error: 'Task not found or does not belong to user'
          })
        }
      }

      const event = await prisma.event.create({
        data: input
      })

      return res.status(201).json({
        success: true,
        data: event
      })
    } catch (error) {
      console.error('Error creating event:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create event'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 