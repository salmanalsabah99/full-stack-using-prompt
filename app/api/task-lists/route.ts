import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation, taskListIncludeOptions } from '@/lib/api-utils';
import { validateTaskListData } from '@/lib/validation';

// GET /api/task-lists - Get all task lists
export const GET = withApiHandler(
  async () => {
    return prisma.taskList.findMany({
      include: taskListIncludeOptions,
    });
  },
  'fetch task lists'
);

// POST /api/task-lists - Create a new task list
export const POST = withApiHandler(
  async (request: Request) => {
    const data = await request.json();
    
    return withValidation(data, validateTaskListData, async (validatedData) => {
      // Get the current maximum order to place the new list at the end
      const maxOrder = await prisma.taskList.findFirst({
        orderBy: {
          order: 'desc',
        },
      });

      return prisma.taskList.create({
        data: {
          title: validatedData.title.trim(),
          row: validatedData.row || 0,
          col: validatedData.col || 0,
          order: (maxOrder?.order ?? -1) + 1,
        },
        include: taskListIncludeOptions,
      });
    });
  },
  'create task list'
); 