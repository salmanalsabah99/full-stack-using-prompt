import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { CreateNoteInput, NotesResponse, NoteResponse } from '../../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotesResponse | NoteResponse>
) {
  if (req.method === 'GET') {
    try {
      const { userId, taskId, eventId } = req.query

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'userId is required'
        })
      }

      // Build where clause based on filters
      const where = {
        userId,
        ...(taskId && typeof taskId === 'string' ? { taskId } : {}),
        ...(eventId && typeof eventId === 'string' ? { eventId } : {})
      }

      const notes = await prisma.note.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        }
      })

      return res.status(200).json({
        success: true,
        data: notes
      })
    } catch (error) {
      console.error('Error fetching notes:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch notes'
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const input: CreateNoteInput = req.body

      // Validate required fields
      if (!input.title || !input.content || !input.userId) {
        return res.status(400).json({
          success: false,
          error: 'Title, content, and userId are required'
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

      // If eventId is provided, verify it exists and belongs to the user
      if (input.eventId) {
        const event = await prisma.event.findFirst({
          where: {
            id: input.eventId,
            userId: input.userId
          }
        })

        if (!event) {
          return res.status(404).json({
            success: false,
            error: 'Event not found or does not belong to user'
          })
        }
      }

      const note = await prisma.note.create({
        data: input
      })

      return res.status(201).json({
        success: true,
        data: note
      })
    } catch (error) {
      console.error('Error creating note:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create note'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 