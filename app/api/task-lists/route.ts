import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { CreateTaskListInput, TaskListResponse, TaskListsResponse } from '../../../types'

// GET /api/task-lists?userId=
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const taskLists = await prisma.taskList.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ success: true, data: taskLists })
  } catch (error) {
    console.error('Error fetching task lists:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch task lists' },
      { status: 500 }
    )
  }
}

// POST /api/task-lists
export async function POST(request: Request) {
  try {
    const body: CreateTaskListInput = await request.json()
    const { name, userId, order } = body

    if (!name || !userId) {
      return NextResponse.json(
        { success: false, error: 'Name and User ID are required' },
        { status: 400 }
      )
    }

    // Get the highest order value for the user's task lists
    const maxOrder = await prisma.taskList.findFirst({
      where: { userId },
      orderBy: { order: 'desc' },
    })

    // Use provided order or max + 1
    const newOrder = order ?? (maxOrder?.order ?? -1) + 1

    const taskList = await prisma.taskList.create({
      data: {
        name,
        userId,
        order: newOrder,
      },
    })

    return NextResponse.json({ success: true, data: taskList })
  } catch (error) {
    console.error('Error creating task list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create task list' },
      { status: 500 }
    )
  }
} 