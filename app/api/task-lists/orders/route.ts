import { NextResponse } from 'next/server';
import { updateTaskListOrders } from '@/lib/services/taskList';
import { UpdateTaskListOrdersRequest } from '@/types/api';

// PUT /api/task-lists/orders - Update multiple list orders and positions
export async function PUT(request: Request) {
  try {
    const data: UpdateTaskListOrdersRequest[] = await request.json();
    const lists = await updateTaskListOrders(data);
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error updating task list orders:', error);
    return NextResponse.json({ error: 'Failed to update task list orders' }, { status: 500 });
  }
} 