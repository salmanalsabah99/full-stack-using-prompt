import { NextResponse } from 'next/server'
import { verifyAuth, JWTPayload } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch task lists
export async function GET(request: Request) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult || 'error' in authResult) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (authResult as JWTPayload).userId
    const { searchParams } = new URL(request.url)
    const isDefault = searchParams.get('default') === 'true'

    const taskList = await prisma.taskList.findFirst({
      where: {
        userId,
        ...(isDefault ? {} : { id: searchParams.get('taskListId') || undefined }),
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    if (!taskList) {
      return NextResponse.json(
        { success: false, error: 'Task list not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: taskList })
  } catch (error) {
    console.error('Error fetching task list:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new task list
export async function POST(request: Request) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult || 'error' in authResult) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (authResult as JWTPayload).userId
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const taskList = await prisma.taskList.create({
      data: {
        name,
        description,
        userId,
      },
    })

    return NextResponse.json({ success: true, data: taskList })
  } catch (error) {
    console.error('Error creating task list:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update task list
export async function PUT(request: Request) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult || 'error' in authResult) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (authResult as JWTPayload).userId
    const body = await request.json()
    const { id, name, description } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task list ID is required' },
        { status: 400 }
      )
    }

    // Verify that the task list belongs to the user
    const existingTaskList = await prisma.taskList.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTaskList) {
      return NextResponse.json(
        { success: false, error: 'Task list not found or does not belong to user' },
        { status: 404 }
      )
    }

    const taskList = await prisma.taskList.update({
      where: { id },
      data: {
        name,
        description,
      },
    })

    return NextResponse.json({ success: true, data: taskList })
  } catch (error) {
    console.error('Error updating task list:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete task list
export async function DELETE(request: Request) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult || 'error' in authResult) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (authResult as JWTPayload).userId
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Task list ID is required' },
        { status: 400 }
      )
    }

    // Verify that the task list belongs to the user
    const existingTaskList = await prisma.taskList.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!existingTaskList) {
      return NextResponse.json(
        { success: false, error: 'Task list not found or does not belong to user' },
        { status: 404 }
      )
    }

    await prisma.taskList.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting task list:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
} 