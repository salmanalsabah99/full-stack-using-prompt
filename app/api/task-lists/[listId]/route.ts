import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError, createSuccessResponse, createErrorResponse } from '@/lib/api-utils';
import { validateTaskListData } from '@/lib/validation';

// GET /api/task-lists/[listId] - Get a specific task list
export async function GET(
  request: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const taskList = await prisma.taskList.findUnique({
      where: { id: params.listId },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!taskList) {
      return createErrorResponse('Task list not found', 404);
    }

    return createSuccessResponse(taskList);
  } catch (error) {
    return handleApiError(error, 'fetch task list');
  }
}

// PUT /api/task-lists/[listId] - Update a task list
export async function PUT(
  request: Request,
  { params }: { params: { listId: string } }
) {
  try {
    const updates = await request.json();
    const validationError = validateTaskListData(updates);
    if (validationError) return validationError;

    const taskList = await prisma.taskList.update({
      where: { id: params.listId },
      data: {
        title: updates.title.trim(),
        row: updates.row,
        col: updates.col,
        order: updates.order,
      },
      include: {
        tasks: true,
      },
    });

    return createSuccessResponse(taskList);
  } catch (error) {
    return handleApiError(error, 'update task list');
  }
}

// DELETE /api/task-lists/[listId] - Delete a task list
export async function DELETE(
  request: Request,
  { params }: { params: { listId: string } }
) {
  try {
    // Delete all tasks in the list first
    await prisma.task.deleteMany({
      where: {
        listId: params.listId,
      },
    });

    // Then delete the list
    await prisma.taskList.delete({
      where: {
        id: params.listId,
      },
    });

    return createSuccessResponse({ success: true });
  } catch (error) {
    return handleApiError(error, 'delete task list');
  }
} 