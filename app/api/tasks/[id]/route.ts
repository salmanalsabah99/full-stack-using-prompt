import { NextRequest, NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { UpdateTaskRequest, MoveTaskRequest } from '@/types/api';

// GET /api/tasks/[id] - Get a specific task
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const task = await taskService.getTask(params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { content, listId, order } = data;

    if (!content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await taskService.updateTask({
      id: params.id,
      content,
      listId,
      order,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const task = await taskService.deleteTask(params.id);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 