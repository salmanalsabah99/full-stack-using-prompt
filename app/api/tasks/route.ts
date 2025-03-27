import { NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { CreateTaskRequest } from '@/types/api';

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

// PUT /api/tasks/reorder - Reorder tasks within a list
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { listId, startIndex, endIndex } = data;

    if (!listId || typeof startIndex !== 'number' || typeof endIndex !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await taskService.reorderTasks({ listId, startIndex, endIndex });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
} 