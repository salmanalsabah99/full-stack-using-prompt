import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function POST() {
  try {
    // Try to find existing user first
    let user = await prisma.user.findUnique({
      where: { id: 'test_user_123' },
    })

    // If user doesn't exist, create it
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: 'test_user_123',
          email: 'test@example.com',
          name: 'Test User',
        },
      })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error('Error creating test user:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create test user' },
      { status: 500 }
    )
  }
} 