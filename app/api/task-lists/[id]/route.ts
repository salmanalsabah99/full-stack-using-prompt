import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { UpdateTaskListInput, TaskListResponse } from '../../../../types'

// PUT /api/task-lists/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body: UpdateTaskListInput = await request.json()
    const { name, order } = body

    // Check if task list exists
    const existingTaskList = await prisma.taskList.findUnique({
      where: { id },
    })

    if (!existingTaskList) {
      return NextResponse.json(
        { success: false, error: 'Task list not found' },
        { status: 404 }
      )
    }

    // If order is being updated, check for conflicts
    if (order !== undefined && order !== existingTaskList.order) {
      const conflictingTaskList = await prisma.taskList.findFirst({
        where: {
          userId: existingTaskList.userId,
          order,
        },
      })

      if (conflictingTaskList) {
        // Update the conflicting task list's order
        await prisma.taskList.update({
          where: { id: conflictingTaskList.id },
          data: { order: existingTaskList.order },
        })
      }
    }

    const updatedTaskList = await prisma.taskList.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(order !== undefined && { order }),
      },
    })

    return NextResponse.json({ success: true, data: updatedTaskList })
  } catch (error) {
    console.error('Error updating task list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update task list' },
      { status: 500 }
    )
  }
}

// DELETE /api/task-lists/:id
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if task list exists
    const existingTaskList = await prisma.taskList.findUnique({
      where: { id },
    })

    if (!existingTaskList) {
      return NextResponse.json(
        { success: false, error: 'Task list not found' },
        { status: 404 }
      )
    }

    // Delete the task list (cascading delete will handle associated tasks)
    await prisma.taskList.delete({
      where: { id },
    })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Error deleting task list:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete task list' },
      { status: 500 }
    )
  }
} 