import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { CreateNoteInput, NotesResponse, NoteResponse } from '../../../types'
import { verifyAuth, JWTPayload } from '../../../lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NotesResponse | NoteResponse>
) {
  const authResult = await verifyAuth(req, res)
  
  if (!authResult || 'error' in authResult) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    })
  }

  const userId = authResult.userId

  if (req.method === 'GET') {
    try {
      const notes = await prisma.note.findMany({
        where: {
          userId: userId
        }
      })

      return res.status(200).json({
        success: true,
        data: notes.map(note => ({
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
          userId: note.userId,
          taskId: note.taskId,
          eventId: note.eventId
        }))
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
      if (!input.title || !input.content) {
        return res.status(400).json({
          success: false,
          error: 'Title and content are required'
        })
      }

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: userId }
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
            userId: userId
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
            userId: userId
          }
        })

        if (!event) {
          return res.status(404).json({
            success: false,
            error: 'Event not found or does not belong to user'
          })
        }
      }

      // Create note
      const note = await prisma.note.create({
        data: {
          title: input.title,
          content: input.content,
          userId: userId,
          taskId: input.taskId,
          eventId: input.eventId
        }
      })

      return res.status(201).json({
        success: true,
        data: {
          id: note.id,
          title: note.title,
          content: note.content,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
          userId: note.userId,
          taskId: note.taskId,
          eventId: note.eventId
        }
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