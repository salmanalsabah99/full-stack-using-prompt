import { prisma } from '@/lib/prisma';
import { CreateTaskListRequest, UpdateTaskListRequest, UpdateTaskListOrdersRequest } from '@/types/api';

export async function getAllTaskLists() {
  try {
    console.log('Fetching all task lists...');
    const lists = await prisma.taskList.findMany({
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: [
        { row: 'asc' },
        { col: 'asc' },
        { order: 'asc' },
      ],
    });
    console.log(`Found ${lists.length} task lists`);
    return lists;
  } catch (error) {
    console.error('Error in getAllTaskLists:', error);
    throw new Error('Failed to fetch task lists: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function createTaskList(data: CreateTaskListRequest) {
  try {
    console.log('Creating new task list:', data);
    // Get the maximum order value for the current row and column
    const maxOrder = await prisma.taskList.aggregate({
      where: {
        row: data.row,
        col: data.col,
      },
      _max: {
        order: true,
      },
    });

    const list = await prisma.taskList.create({
      data: {
        title: data.title,
        row: data.row,
        col: data.col,
        order: (maxOrder._max.order ?? -1) + 1,
      },
      include: {
        tasks: true,
      },
    });
    console.log('Created new task list:', list);
    return list;
  } catch (error) {
    console.error('Error in createTaskList:', error);
    throw new Error('Failed to create task list: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function updateTaskList(data: UpdateTaskListRequest) {
  try {
    console.log('Updating task list:', data);
    const list = await prisma.taskList.update({
      where: { id: data.id },
      data: {
        title: data.title,
        row: data.row,
        col: data.col,
      },
      include: {
        tasks: true,
      },
    });
    console.log('Updated task list:', list);
    return list;
  } catch (error) {
    console.error('Error in updateTaskList:', error);
    throw new Error('Failed to update task list: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function updateTaskListOrders(updates: UpdateTaskListOrdersRequest[]) {
  try {
    console.log('Updating task list orders:', updates);
    const lists = await Promise.all(
      updates.map((update) =>
        prisma.taskList.update({
          where: { id: update.id },
          data: {
            order: update.order,
            row: update.row,
            col: update.col,
          },
          include: {
            tasks: true,
          },
        })
      )
    );
    console.log('Updated task list orders:', lists);
    return lists;
  } catch (error) {
    console.error('Error in updateTaskListOrders:', error);
    throw new Error('Failed to update task list orders: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export async function deleteTaskList(id: number) {
  try {
    console.log('Deleting task list:', id);
    // First check if the list exists
    const list = await prisma.taskList.findUnique({
      where: { id },
    });

    if (!list) {
      throw new Error('Task list not found');
    }

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Delete all tasks in the list first
      await tx.task.deleteMany({
        where: { listId: id },
      });

      // Then delete the list
      await tx.taskList.delete({
        where: { id },
      });
    });

    console.log('Successfully deleted task list:', id);
    return true;
  } catch (error) {
    console.error('Error in deleteTaskList:', error);
    throw new Error('Failed to delete task list: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
} 