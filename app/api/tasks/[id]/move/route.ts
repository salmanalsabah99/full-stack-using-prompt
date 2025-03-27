import { NextRequest, NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';
import { MoveTaskRequest } from '@/types/api';

// PUT /api/tasks/[id]/move - Move a task to a different list
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const { sourceListId, destinationListId, destinationIndex } = data;

    if (!sourceListId || !destinationListId || typeof destinationIndex !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await taskService.moveTask({
      taskId: params.id,
      sourceListId,
      destinationListId,
      destinationIndex,
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json({ error: 'Failed to move task' }, { status: 500 });
  }
} 