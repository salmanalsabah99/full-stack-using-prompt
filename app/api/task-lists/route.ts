import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a single PrismaClient instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// GET /api/task-lists - Get all task lists
export async function GET() {
  try {
    const taskLists = await prisma.taskList.findMany({
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    return NextResponse.json(taskLists);
  } catch (error) {
    console.error('Error fetching task lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task lists' },
      { status: 500 }
    );
  }
}

// POST /api/task-lists - Create a new task list
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || typeof data.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }

    // Get the current maximum order to place the new list at the end
    const maxOrder = await prisma.taskList.findFirst({
      orderBy: {
        order: 'desc',
      },
    });

    const taskList = await prisma.taskList.create({
      data: {
        title: data.title.trim(),
        row: data.row || 0,
        col: data.col || 0,
        order: (maxOrder?.order ?? -1) + 1,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(taskList);
  } catch (error) {
    console.error('Error creating task list:', error);
    return NextResponse.json(
      { error: 'Failed to create task list' },
      { status: 500 }
    );
  }
}

// DELETE /api/task-lists/[id] - Delete a task list
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'List ID is required' },
        { status: 400 }
      );
    }

    // Delete all tasks in the list first
    await prisma.task.deleteMany({
      where: {
        listId: id,
      },
    });

    // Then delete the list
    await prisma.taskList.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task list:', error);
    return NextResponse.json(
      { error: 'Failed to delete task list' },
      { status: 500 }
    );
  }
} 