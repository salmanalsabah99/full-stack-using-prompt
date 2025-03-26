import { PrismaClient } from '@prisma/client';
import { CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest, ReorderTasksRequest } from '@/types/api';

const prisma = new PrismaClient();

export async function getAllTasks() {
  return prisma.task.findMany({
    include: {
      list: true,
    },
    orderBy: {
      order: 'asc',
    },
  });
}

export async function createTask(data: CreateTaskRequest) {
  // Get the highest order in the list
  const lastTask = await prisma.task.findFirst({
    where: { listId: data.listId },
    orderBy: { order: 'desc' },
  });

  const order = lastTask ? lastTask.order + 1 : 0;

  return prisma.task.create({
    data: {
      content: data.content,
      listId: data.listId,
      order,
    },
    include: {
      list: true,
    },
  });
}

export async function updateTask(data: UpdateTaskRequest) {
  return prisma.task.update({
    where: { id: data.id },
    data: {
      content: data.content,
      listId: data.listId,
      order: data.order,
    },
    include: {
      list: true,
    },
  });
}

export async function moveTask(data: MoveTaskRequest) {
  return prisma.task.update({
    where: { id: data.taskId },
    data: {
      listId: data.targetListId,
      order: data.order,
    },
    include: {
      list: true,
    },
  });
}

export async function reorderTasks(updates: ReorderTasksRequest[]) {
  return prisma.$transaction(
    updates.map(({ id, order }) =>
      prisma.task.update({
        where: { id },
        data: { order },
        include: {
          list: true,
        },
      })
    )
  );
}

export async function getTask(id: number) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      list: true,
    },
  });
}

export async function deleteTask(id: number) {
  // Delete the task and return the deleted task data
  return prisma.task.delete({
    where: { id },
    include: {
      list: true,
    },
  });
} 