import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { userId } = req.query

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'userId is required',
        })
      }

      const categories = await prisma.noteCategory.findMany({
        where: {
          userId: userId as string,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return res.status(200).json({
        success: true,
        data: categories,
      })
    } catch (error) {
      console.error('Error fetching note categories:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch note categories',
      })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, color, userId } = req.body

      if (!name || !color || !userId) {
        return res.status(400).json({
          success: false,
          error: 'name, color, and userId are required',
        })
      }

      const category = await prisma.noteCategory.create({
        data: {
          name,
          color,
          userId,
        },
      })

      return res.status(201).json({
        success: true,
        data: category,
      })
    } catch (error) {
      console.error('Error creating note category:', error)
      return res.status(500).json({
        success: false,
        error: 'Failed to create note category',
      })
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  })
} 