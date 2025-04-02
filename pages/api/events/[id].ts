import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { UpdateEventInput, EventResponse } from '../../../types'

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
      const input: UpdateEventInput = req.body

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

      // Validate time logic if both times are provided
      if (input.startTime && input.endTime && input.endTime <= input.startTime) {
        return res.status(400).json({
          success: false,
          error: 'endTime must be after startTime'
        })
      }

      // If taskId is provided, verify it exists and belongs to the user
      if (input.taskId) {
        const task = await prisma.task.findFirst({
          where: {
            id: input.taskId,
            userId: existingEvent.userId
          }
        })

        if (!task) {
          return res.status(404).json({
            success: false,
            error: 'Task not found or does not belong to user'
          })
        }
      }

      const updatedEvent = await prisma.event.update({
        where: { id },
        data: input
      })

      return res.status(200).json({
        success: true,
        data: updatedEvent
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