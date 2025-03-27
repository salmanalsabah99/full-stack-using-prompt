import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateTaskListRequest } from '@/types/api';

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
    return NextResponse.json({ error: 'Failed to fetch task lists' }, { status: 500 });
  }
}

// POST /api/task-lists - Create a new task list
export async function POST(request: Request) {
  try {
    const data: CreateTaskListRequest = await request.json();

    if (!data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const taskList = await prisma.taskList.create({
      data: {
        title: data.title,
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(taskList);
  } catch (error) {
    console.error('Error creating task list:', error);
    return NextResponse.json({ error: 'Failed to create task list' }, { status: 500 });
  }
} 