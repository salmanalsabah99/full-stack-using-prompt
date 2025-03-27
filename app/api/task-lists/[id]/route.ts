import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateTaskListRequest } from '@/types/api';

// GET /api/task-lists/[id] - Get a specific task list
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskList = await prisma.taskList.findUnique({
      where: { id: params.id },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!taskList) {
      return NextResponse.json({ error: 'Task list not found' }, { status: 404 });
    }

    return NextResponse.json(taskList);
  } catch (error) {
    console.error('Error fetching task list:', error);
    return NextResponse.json({ error: 'Failed to fetch task list' }, { status: 500 });
  }
}

// PUT /api/task-lists/[id] - Update a task list
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data: UpdateTaskListRequest = await request.json();

    if (!data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const taskList = await prisma.taskList.update({
      where: { id: params.id },
      data: {
        title: data.title,
      },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(taskList);
  } catch (error) {
    console.error('Error updating task list:', error);
    return NextResponse.json({ error: 'Failed to update task list' }, { status: 500 });
  }
}

// DELETE /api/task-lists/[id] - Delete a task list
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const taskList = await prisma.taskList.delete({
      where: { id: params.id },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json(taskList);
  } catch (error) {
    console.error('Error deleting task list:', error);
    return NextResponse.json({ error: 'Failed to delete task list' }, { status: 500 });
  }
} 