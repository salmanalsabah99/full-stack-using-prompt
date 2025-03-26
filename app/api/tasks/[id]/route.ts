import { NextRequest, NextResponse } from 'next/server';
import * as taskService from '@/lib/services/task';

// DELETE /api/tasks/:id - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const taskId = parseInt(id);

    if (!taskId || isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    // First check if the task exists
    const existingTask = await taskService.getTask(taskId);
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Delete the task and return the deleted task data
    const deletedTask = await taskService.deleteTask(taskId);
    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete task' 
    }, { status: 500 });
  }
} 