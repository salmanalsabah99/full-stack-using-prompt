import { prisma } from '@/lib/prisma';
import { CreateTaskListRequest, UpdateTaskListRequest, UpdateTaskListOrdersRequest } from '@/types/api';
import { logger } from '@/lib/logger';

export async function getAllTaskLists() {
  try {
    logger.debug('Fetching all task lists');
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
    logger.debug(`Found ${lists.length} task lists`);
    return lists;
  } catch (error) {
    logger.error('Failed to fetch task lists:', error);
    throw error;
  }
}

export async function createTaskList(data: CreateTaskListRequest) {
  try {
    logger.debug('Creating new task list:', data);
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
    logger.debug('Created new task list:', list);
    return list;
  } catch (error) {
    logger.error('Failed to create task list:', error);
    throw error;
  }
}

export async function updateTaskList(data: UpdateTaskListRequest) {
  try {
    logger.debug('Updating task list:', data);
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
    logger.debug('Updated task list:', list);
    return list;
  } catch (error) {
    logger.error('Failed to update task list:', error);
    throw error;
  }
}

export async function updateTaskListOrders(updates: UpdateTaskListOrdersRequest[]) {
  try {
    logger.debug('Updating task list orders:', updates);
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
    logger.debug('Updated task list orders:', lists);
    return lists;
  } catch (error) {
    logger.error('Failed to update task list orders:', error);
    throw error;
  }
}

export async function deleteTaskList(id: number) {
  try {
    logger.debug('Deleting task list:', id);
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

    logger.debug('Successfully deleted task list:', id);
    return true;
  } catch (error) {
    logger.error('Failed to delete task list:', error);
    throw error;
  }
} 