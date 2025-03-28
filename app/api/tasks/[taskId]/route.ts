import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, createErrorResponse } from '@/lib/api-utils';

// GET /api/tasks/[taskId] - Get a single task
export const GET = withApiHandler(
  async (request: Request, { params }: { params: { taskId: string } }) => {
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
    });

    if (!task) {
      return createErrorResponse('Task not found', 404);
    }

    return task;
  },
  'fetch task'
);

// PUT /api/tasks/[taskId] - Update a task
export const PUT = withApiHandler(
  async (request: Request, { params }: { params: { taskId: string } }) => {
    const updates = await request.json();
    return prisma.task.update({
      where: { id: params.taskId },
      data: updates,
    });
  },
  'update task'
);

// DELETE /api/tasks/[taskId] - Delete a task
export const DELETE = withApiHandler(
  async (request: Request, { params }: { params: { taskId: string } }) => {
    await prisma.task.delete({
      where: { id: params.taskId },
    });
    return { success: true };
  },
  'delete task'
); 