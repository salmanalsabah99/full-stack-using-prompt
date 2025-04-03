import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { EventsResponse } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsResponse>
) {
  const auth = verifyAuth(req, res)
  if (!auth) return

  if (req.method === 'GET') {
    try {
      const { date } = req.query
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Use provided date or default to today
      const startOfDay = date ? new Date(date as string) : today
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(startOfDay)
      endOfDay.setHours(23, 59, 59, 999)

      const events = await prisma.event.findMany({
        where: {
          userId: auth.userId,
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
            },
            {
              AND: [
                { startTime: { lte: startOfDay } },
                { endTime: { gte: endOfDay } }
              ]
            }
          ]
        },
        orderBy: {
          startTime: 'asc'
        }
      })

      const formattedEvents = events.map(event => ({
        ...event,
        createdAt: event.createdAt.toISOString(),
        updatedAt: event.updatedAt.toISOString(),
        startTime: event.startTime.toISOString(),
        endTime: event.endTime?.toISOString() || null,
      }))

      return res.status(200).json({ data: formattedEvents })
    } catch (error) {
      console.error('Error fetching events:', error)
      return res.status(500).json({ data: [], error: 'Failed to fetch events' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { title, description, startTime, endTime, location, taskId } = req.body

      if (!title || !startTime) {
        return res.status(400).json({ data: [], error: 'Title and startTime are required' })
      }

      const event = await prisma.event.create({
        data: {
          title,
          description,
          startTime: new Date(startTime),
          endTime: endTime ? new Date(endTime) : null,
          location,
          userId: auth.userId,
          taskId,
        },
      })

      return res.status(201).json({
        data: [{
          ...event,
          createdAt: event.createdAt.toISOString(),
          updatedAt: event.updatedAt.toISOString(),
          startTime: event.startTime.toISOString(),
          endTime: event.endTime?.toISOString() || null,
        }],
      })
    } catch (error) {
      console.error('Error creating event:', error)
      return res.status(500).json({ data: [], error: 'Failed to create event' })
    }
  }

  return res.status(405).json({ data: [], error: 'Method not allowed' })
} 