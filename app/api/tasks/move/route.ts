import { NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { MoveTaskRequest } from '@/types/api';

// PUT /api/tasks/move - Move a task to a different list
export async function PUT(request: Request) {
  try {
    const data: MoveTaskRequest = await request.json();

    if (!data.taskId || !data.targetListId || typeof data.order !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await taskService.moveTask(data);
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json({ error: 'Failed to move task' }, { status: 500 });
  }
} 