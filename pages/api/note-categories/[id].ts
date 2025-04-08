import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid category ID',
    })
  }

  if (req.method === 'GET') {
    try {
      const category = await prisma.noteCategory.findUnique({
        where: { id },
        include: {
          notes: true,
        },
      })

      if (!category) {
        return res.status(404).json({
          success: false,
          error: 'Category not found',
        })
      }

      return res.status(200).json({
        success: true,
        data: category,
      })
    } catch (error) {
      console.error('Error fetching note category:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch note category',
      })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, color } = req.body

      if (!name || !color) {
        return res.status(400).json({
          success: false,
          error: 'name and color are required',
        })
      }

      const category = await prisma.noteCategory.update({
        where: { id },
        data: {
          name,
          color,
        },
      })

      return res.status(200).json({
        success: true,
        data: category,
      })
    } catch (error) {
      console.error('Error updating note category:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to update note category',
      })
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.noteCategory.delete({
        where: { id },
      })

      return res.status(200).json({
        success: true,
      })
    } catch (error) {
      console.error('Error deleting note category:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to delete note category',
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  })
} 