import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation, createErrorResponse } from '@/lib/api-utils';
import { validateTaskMoveData } from '@/lib/validation';

interface TaskMoveData {
  taskId: string;
  targetListId: string;
  order: number;
}

// PUT /api/tasks/move - Move a task to a different list
export const PUT = withApiHandler(
  async (request: Request) => {
    const data = await request.json() as TaskMoveData;
    
    return withValidation(data, validateTaskMoveData, async (validatedData) => {
      const { taskId, targetListId, order } = validatedData;

      // Get the task to move
      const task = await prisma.task.findUnique({
        where: { id: taskId }
      });

      if (!task) {
        return createErrorResponse('Task not found', 404);
      }

      // Update the task with new list ID and order
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          listId: targetListId,
          order
        }
      });

      // Reorder other tasks in the target list
      await prisma.task.updateMany({
        where: {
          listId: targetListId,
          id: { not: taskId },
          order: { gte: order }
        },
        data: {
          order: { increment: 1 }
        }
      });

      return updatedTask;
    });
  },
  'move task'
); 