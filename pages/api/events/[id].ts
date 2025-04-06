import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { EventResponse } from '../../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventResponse>
) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid event ID'
    })
  }

  switch (req.method) {
    case 'GET':
      try {
        const event = await prisma.event.findUnique({
          where: { id }
        })

        if (!event) {
          return res.status(404).json({
            success: false,
            error: 'Event not found'
          })
        }

        return res.status(200).json({
          success: true,
          data: {
            ...event,
            startTime: event.startTime.toISOString(),
            endTime: event.endTime?.toISOString() || null,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString()
          }
        })
      } catch (error) {
        console.error('Error fetching event:', error)
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch event'
        })
      }

    case 'PATCH':
      try {
        const event = await prisma.event.update({
          where: { id },
          data: req.body
        })

        return res.status(200).json({
          success: true,
          data: {
            ...event,
            startTime: event.startTime.toISOString(),
            endTime: event.endTime?.toISOString() || null,
            createdAt: event.createdAt.toISOString(),
            updatedAt: event.updatedAt.toISOString()
          }
        })
      } catch (error) {
        console.error('Error updating event:', error)
        return res.status(500).json({
          success: false,
          error: 'Failed to update event'
        })
      }

    case 'DELETE':
      try {
        await prisma.event.delete({
          where: { id }
        })

        return res.status(200).json({
          success: true,
          data: {
            id,
            title: '',
            description: null,
            startTime: new Date().toISOString(),
            endTime: null,
            location: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: '',
            taskId: null
          }
        })
      } catch (error) {
        console.error('Error deleting event:', error)
        return res.status(500).json({
          success: false,
          error: 'Failed to delete event'
        })
      }

    default:
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      })
  }
} 