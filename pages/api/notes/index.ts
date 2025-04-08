import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { Note, NoteCategory } from '@prisma/client'
import { CreateNoteInput, NotesResponse, NoteResponse } from '../../../types'
import { verifyAuth, JWTPayload } from '../../../lib/auth'

interface NoteWithRelations extends Note {
  category?: NoteCategory | null
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<NoteWithRelations | NoteWithRelations[]>>
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
    const { userId } = req.query

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ success: false, error: 'User ID is required' })
    }

    try {
      const notes = await prisma.note.findMany({
        where: { userId },
        include: {
          category: true,
          task: true,
          event: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })

      return res.status(200).json({ success: true, data: notes })
    } catch (error) {
      console.error('Error fetching notes:', error)
      return res.status(500).json({ success: false, error: 'Error fetching notes' })
    }
  }

  if (req.method === 'POST') {
    const { title, content, userId, categoryId } = req.body

    if (!title || !content || !userId) {
      return res.status(400).json({ success: false, error: 'Title, content, and userId are required' })
    }

    try {
      const note = await prisma.note.create({
        data: {
          title,
          content,
          userId,
          ...(categoryId && { categoryId })
        },
        include: {
          category: true
        }
      })

      return res.status(201).json({ success: true, data: note })
    } catch (error) {
      console.error('Error creating note:', error)
      return res.status(500).json({ success: false, error: 'Error creating note' })
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' })
} 