import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'
import { randomBytes } from 'crypto'

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
    const { email } = req.body
    console.log('Received password reset request for email:', email)

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      })
    }

    // Find user by email
    console.log('Looking up user by email...')
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log('User not found for email:', email)
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    console.log('User found, generating reset token...')
    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    console.log('Updating user with reset token...')
    // Save reset token to user
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      })
      console.log('Reset token saved successfully')
    } catch (updateError) {
      console.error('Error updating user with reset token:', updateError)
      throw updateError
    }

    // In a real application, you would send an email here with the reset link
    // For development, we'll just return the token
    console.log('Sending response with reset link...')
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      // Only include this in development
      resetToken,
      resetLink: `http://localhost:3001/reset-password?token=${resetToken}`
    })
  } catch (error) {
    console.error('Detailed error in password reset request:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to process password reset request',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
} 