import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { NoteResponse } from '../../../types'

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
      const input = req.body

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

      const updatedNote = await prisma.note.update({
        where: { id },
        data: {
          title: input.title,
          content: input.content
        }
      })

      // Format dates for response
      const formattedNote = {
        ...updatedNote,
        createdAt: updatedNote.createdAt.toISOString(),
        updatedAt: updatedNote.updatedAt.toISOString()
      }

      return res.status(200).json({
        success: true,
        data: formattedNote
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