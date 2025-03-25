import { NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { ReorderTasksRequest } from '@/types/api';

// PUT /api/tasks/reorder - Reorder tasks within a list
export async function PUT(request: Request) {
  try {
    const updates: ReorderTasksRequest[] = await request.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Invalid updates array' }, { status: 400 });
    }

    const tasks = await taskService.reorderTasks(updates);
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json({ error: 'Failed to reorder tasks' }, { status: 500 });
  }
} 