import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'
import { EventsResponse } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventsResponse>
) {
  try {
    const auth = await verifyAuth(req, res)
    if (!auth || !auth.userId) {
      return res.status(401).json({ data: [], error: 'Unauthorized' })
    }

    if (req.method === 'GET') {
      try {
        const { startDate, endDate } = req.query
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Use provided date range or default to today
        const startOfRange = startDate ? new Date(startDate as string) : today
        startOfRange.setHours(0, 0, 0, 0)
        const endOfRange = endDate ? new Date(endDate as string) : today
        endOfRange.setHours(23, 59, 59, 999)

        const events = await prisma.event.findMany({
          where: {
            userId: auth.userId,
            OR: [
              {
                startTime: {
                  gte: startOfRange,
                  lte: endOfRange
                }
              },
              {
                endTime: {
                  gte: startOfRange,
                  lte: endOfRange
                }
              },
              {
                AND: [
                  { startTime: { lte: startOfRange } },
                  { endTime: { gte: endOfRange } }
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

        // Validate dates
        const startDate = new Date(startTime)
        if (isNaN(startDate.getTime())) {
          return res.status(400).json({ data: [], error: 'Invalid start time format' })
        }

        let endDate = null
        if (endTime) {
          endDate = new Date(endTime)
          if (isNaN(endDate.getTime())) {
            return res.status(400).json({ data: [], error: 'Invalid end time format' })
          }
        }

        const event = await prisma.event.create({
          data: {
            title,
            description,
            startTime: startDate,
            endTime: endDate,
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
  } catch (error) {
    console.error('API error:', error)
    return res.status(500).json({ data: [], error: 'Server error' })
  }
} 