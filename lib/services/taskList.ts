import { PrismaClient } from '@prisma/client';
import { CreateTaskListRequest, UpdateTaskListRequest, UpdateTaskListOrdersRequest } from '@/types/api';

const prisma = new PrismaClient();

export async function getAllTaskLists() {
  try {
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
    return lists;
  } catch (error) {
    console.error('Error in getAllTaskLists:', error);
    throw error;
  }
}

export async function createTaskList(data: CreateTaskListRequest) {
  try {
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

    return prisma.taskList.create({
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
  } catch (error) {
    console.error('Error in createTaskList:', error);
    throw error;
  }
}

export async function updateTaskList(data: UpdateTaskListRequest) {
  try {
    return prisma.taskList.update({
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
  } catch (error) {
    console.error('Error in updateTaskList:', error);
    throw error;
  }
}

export async function updateTaskListOrders(updates: UpdateTaskListOrdersRequest[]) {
  try {
    return Promise.all(
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
  } catch (error) {
    console.error('Error in updateTaskListOrders:', error);
    throw error;
  }
}

export async function deleteTaskList(id: number) {
  try {
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

    return true;
  } catch (error) {
    console.error('Error in deleteTaskList:', error);
    throw error;
  }
} 