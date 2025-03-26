import { NextResponse } from 'next/server';
import { getAllTaskLists, createTaskList, updateTaskList, deleteTaskList } from '@/lib/services/taskList';
import { CreateTaskListRequest, UpdateTaskListRequest, TaskListResponse } from '@/types/api';

// GET /api/task-lists - Get all task lists with their tasks
export async function GET() {
  try {
    const lists = await getAllTaskLists();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching task lists:', error);
    return NextResponse.json({ error: 'Failed to fetch task lists' }, { status: 500 });
  }
}

// POST /api/task-lists - Create a new task list
export async function POST(request: Request) {
  try {
    const data: CreateTaskListRequest = await request.json();
    const list = await createTaskList(data);
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error creating task list:', error);
    return NextResponse.json({ error: 'Failed to create task list' }, { status: 500 });
  }
}

// PUT /api/task-lists - Update a task list
export async function PUT(request: Request) {
  try {
    const data: UpdateTaskListRequest = await request.json();
    const list = await updateTaskList(data);
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error updating task list:', error);
    return NextResponse.json({ error: 'Failed to update task list' }, { status: 500 });
  }
}

// DELETE /api/task-lists?id={id} - Delete a task list
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Task list ID is required' }, { status: 400 });
    }

    await deleteTaskList(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task list:', error);
    return NextResponse.json({ error: 'Failed to delete task list' }, { status: 500 });
  }
} 