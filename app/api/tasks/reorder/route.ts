import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation } from '@/lib/api-utils';
import { validateTaskReorderData } from '@/lib/validation';

interface TaskReorderData {
  listId: string;
  tasks: Array<{
    id: string;
    order: number;
  }>;
}

// PUT /api/tasks/reorder - Reorder tasks within a list
export const PUT = withApiHandler(
  async (request: Request) => {
    const data = await request.json() as TaskReorderData;
    
    return withValidation(data, validateTaskReorderData, async (validatedData) => {
      const { listId, tasks } = validatedData;

      // Update the order of each task
      await Promise.all(
        tasks.map(({ id, order }) =>
          prisma.task.update({
            where: { id },
            data: { order },
          })
        )
      );

      // Fetch the updated tasks
      return prisma.task.findMany({
        where: { listId },
        orderBy: { order: 'asc' },
      });
    });
  },
  'reorder tasks'
); 