import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { EventResponse } from '../../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EventResponse>
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Event ID is required'
    })
  }

  if (req.method === 'PUT') {
    try {
      const input = req.body

      // Verify event exists
      const existingEvent = await prisma.event.findUnique({
        where: { id }
      })

      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        })
      }

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title: input.title,
          description: input.description,
          startTime: new Date(input.startTime),
          endTime: input.endTime ? new Date(input.endTime) : null,
          location: input.location
        }
      })

      // Format dates for response
      const formattedEvent = {
        ...updatedEvent,
        startTime: updatedEvent.startTime.toISOString(),
        endTime: updatedEvent.endTime?.toISOString() || null,
        createdAt: updatedEvent.createdAt.toISOString(),
        updatedAt: updatedEvent.updatedAt.toISOString()
      }

      return res.status(200).json({
        success: true,
        data: formattedEvent
      })
    } catch (error) {
      console.error('Error updating event:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update event'
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete the event
      await prisma.event.delete({
        where: { id }
      })

      return res.status(200).json({
        success: true,
        data: null
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete event'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 