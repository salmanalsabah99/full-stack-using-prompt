import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { UpdateNoteInput, NoteResponse } from '../../../types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<NoteResponse>
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Note ID is required'
    })
  }

  if (req.method === 'PUT') {
    try {
      const input: UpdateNoteInput = req.body

      // Verify note exists
      const existingNote = await prisma.note.findUnique({
        where: { id }
      })

      if (!existingNote) {
        return res.status(404).json({
          success: false,
          error: 'Note not found'
        })
      }

      // If taskId is provided, verify it exists and belongs to the user
      if (input.taskId) {
        const task = await prisma.task.findFirst({
          where: {
            id: input.taskId,
            userId: existingNote.userId
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
            userId: existingNote.userId
          }
        })

        if (!event) {
          return res.status(404).json({
            success: false,
            error: 'Event not found or does not belong to user'
          })
        }
      }

      const updatedNote = await prisma.note.update({
        where: { id },
        data: input
      })

      return res.status(200).json({
        success: true,
        data: updatedNote
      })
    } catch (error) {
      console.error('Error updating note:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update note'
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      // Delete the note
      await prisma.note.delete({
        where: { id }
      })

      return res.status(200).json({
        success: true,
        data: null
      })
    } catch (error) {
      console.error('Error deleting note:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete note'
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  })
} 