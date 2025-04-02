import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import cookie from 'cookie'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    })
  }

  try {
    const { email, password } = req.body

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Verify password
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }

    // Generate JWT token
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    // Set cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
    )

    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error during login:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to login'
    })
  }
} 