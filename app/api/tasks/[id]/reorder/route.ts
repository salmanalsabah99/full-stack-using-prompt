import { NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { ReorderTasksRequest } from '@/types/api';

// PATCH /api/tasks/:id/reorder - Reorder a task within its list
export async function PATCH(request: Request) {
  try {
    const { id } = request.params;
    const { order } = await request.json();

    if (!id || typeof order !== 'number') {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }

    const task = await taskService.reorderTasks([{ id: parseInt(id), order }]);
    return NextResponse.json(task[0]);
  } catch (error) {
    console.error('Error reordering task:', error);
    return NextResponse.json({ error: 'Failed to reorder task' }, { status: 500 });
  }
} 