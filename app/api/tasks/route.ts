import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation } from '@/lib/api-utils';
import { validateTaskData } from '@/lib/validation';
import { getDateRanges } from '@/lib/date-utils';

// GET /api/tasks - Get all tasks
export const GET = withApiHandler(
  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const listId = searchParams.get('listId');

    const where = {
      ...(listId ? { listId } : {}),
      ...(filter ? {
        dueDate: filter === 'today'
          ? { gte: getDateRanges().today.start, lte: getDateRanges().today.end }
          : filter === 'tomorrow'
          ? { gte: getDateRanges().tomorrow.start, lte: getDateRanges().tomorrow.end }
          : filter === 'upcoming'
          ? { gt: getDateRanges().upcoming.start }
          : undefined
      } : {})
    };

    return prisma.task.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' }
      ]
    });
  },
  'fetch tasks'
);

// POST /api/tasks - Create a new task
export const POST = withApiHandler(
  async (request: Request) => {
    const data = await request.json();
    
    return withValidation(data, validateTaskData, async (validatedData) => {
      const { title, dueDate, description, priority, completed, listId, order } = validatedData;

      return prisma.task.create({
        data: {
          title,
          dueDate: new Date(dueDate),
          description,
          priority: priority || 'MEDIUM',
          completed: completed || false,
          listId,
          order: order || 0
        }
      });
    });
  },
  'create task'
); 