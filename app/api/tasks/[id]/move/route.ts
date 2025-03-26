import { NextRequest, NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { MoveTaskRequest } from '@/types/api';

// PATCH /api/tasks/:id/move - Move a task to a different list
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { targetListId, order } = await request.json();

    if (!id || !targetListId || typeof order !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await taskService.moveTask({
      taskId: parseInt(id),
      targetListId,
      order,
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json({ error: 'Failed to move task' }, { status: 500 });
  }
} 