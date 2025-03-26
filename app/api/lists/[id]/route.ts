import { NextRequest, NextResponse } from 'next/server';
import { deleteTaskList } from '@/lib/services/taskList';

// DELETE /api/lists/:id - Delete a list and all its tasks
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const listId = parseInt(id);

    if (!listId || isNaN(listId)) {
      return NextResponse.json({ error: 'Invalid list ID' }, { status: 400 });
    }

    // Delete the list and all its tasks
    await deleteTaskList(listId);
    
    return NextResponse.json({ 
      success: true,
      deletedListId: listId
    });
  } catch (error) {
    console.error('Error deleting list:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to delete list' 
    }, { status: 500 });
  }
} 