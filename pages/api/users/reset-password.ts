import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { hash } from 'bcryptjs'

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
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Token and password are required'
      })
    }

    // Find user by reset token and check if it's still valid
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    })

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      })
    }

    // Hash the new password
    const hashedPassword = await hash(password, 12)

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to reset password'
    })
  }
} 