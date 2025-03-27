import { NextRequest, NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { UpdateTaskRequest, MoveTaskRequest } from '@/types/api';
import { PrismaClient, Prisma } from '@prisma/client';
import { TaskUpdateInput, TaskResponse } from '@/types/task';

const prisma = new PrismaClient();

// GET /api/tasks/[id] - Get a specific task
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const task = await prisma.task.findUnique({
      where: { id }
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, dueDate, description, priority, completed, order } = body;

    // Validate required fields
    if (!title || !dueDate) {
      return NextResponse.json(
        { error: 'Title and due date are required' },
        { status: 400 }
      );
    }

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        dueDate: new Date(dueDate),
        description,
        priority,
        completed,
        order
      } as Prisma.TaskUpdateInput
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 