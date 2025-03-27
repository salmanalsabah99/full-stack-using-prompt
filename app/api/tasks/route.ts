import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to get date ranges for filtering
const getDateRanges = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(todayEnd);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  const upcomingStart = new Date(todayEnd);
  upcomingStart.setDate(upcomingStart.getDate() + 1);

  return {
    today: { start: todayStart, end: todayEnd },
    tomorrow: { start: tomorrowStart, end: tomorrowEnd },
    upcoming: { start: upcomingStart, end: null }
  };
};

// GET /api/tasks - Get all tasks
export async function GET(request: Request) {
  try {
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

    const tasks = await prisma.task.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { dueDate: 'asc' },
        { priority: 'desc' }
      ]
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, dueDate, description, priority, completed, listId, order } = body;

    // Validate required fields
    if (!title || !dueDate || !listId) {
      return NextResponse.json(
        { error: 'Title, due date, and listId are required' },
        { status: 400 }
      );
    }

    // Create new task
    const task = await prisma.task.create({
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

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/reorder - Reorder tasks within a list
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { listId, startIndex, endIndex } = data;

    if (!listId || typeof startIndex !== 'number' || typeof endIndex !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get all tasks in the list
    const tasks = await prisma.task.findMany({
      where: { listId },
      orderBy: { order: 'asc' }
    });

    // Reorder tasks
    const [movedTask] = tasks.splice(startIndex, 1);
    tasks.splice(endIndex, 0, movedTask);

    // Update order for all tasks
    await Promise.all(
      tasks.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: { order: index }
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
} 