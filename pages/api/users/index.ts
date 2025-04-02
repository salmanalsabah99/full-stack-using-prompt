import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { CreateUserInput, UserResponse } from '../../../types/user'
import { ensureDefaultTaskList } from '../../../lib/task-list'
import { hash } from 'bcryptjs'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UserResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const body: CreateUserInput = req.body
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    // Create default task list for the new user
    await ensureDefaultTaskList(user.id)

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create user'
    })
  }
} 