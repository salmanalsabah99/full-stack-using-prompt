import { NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { CreateTaskRequest, UpdateTaskRequest } from '@/types/api';

// GET /api/tasks - Get all tasks
export async function GET() {
  try {
    const tasks = await taskService.getAllTasks();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const data: CreateTaskRequest = await request.json();

    if (!data.content || !data.listId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await taskService.createTask(data);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}

// PATCH /api/tasks/:id - Update a task
export async function PATCH(request: Request) {
  try {
    const data: UpdateTaskRequest = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const task = await taskService.updateTask(data);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0', 10);

    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    await taskService.deleteTask(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
} 