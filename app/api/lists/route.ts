import { NextResponse } from 'next/server';
import { getAllTaskLists, createTaskList, updateTaskList, deleteTaskList } from '@/lib/services/taskList';
import { CreateTaskListRequest, UpdateTaskListRequest } from '@/types/api';

// GET /api/lists - Get all lists with their tasks
export async function GET() {
  try {
    const lists = await getAllTaskLists();
    return NextResponse.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return NextResponse.json({ error: 'Failed to fetch lists' }, { status: 500 });
  }
}

// POST /api/lists - Create a new list
export async function POST(request: Request) {
  try {
    const data: CreateTaskListRequest = await request.json();
    
    // If no title is provided, use a default title
    const title = data.title?.trim() || 'Untitled List';
    
    // Create the list with the title
    const list = await createTaskList({
      ...data,
      title,
    });
    
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error creating list:', error);
    return NextResponse.json({ error: 'Failed to create list' }, { status: 500 });
  }
}

// PATCH /api/lists/:id - Update a list
export async function PATCH(request: Request) {
  try {
    const data: UpdateTaskListRequest = await request.json();
    const list = await updateTaskList(data);
    return NextResponse.json(list);
  } catch (error) {
    console.error('Error updating list:', error);
    return NextResponse.json({ error: 'Failed to update list' }, { status: 500 });
  }
}

// DELETE /api/lists/:id - Delete a list
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'List ID is required' }, { status: 400 });
    }

    await deleteTaskList(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json({ error: 'Failed to delete list' }, { status: 500 });
  }
} 