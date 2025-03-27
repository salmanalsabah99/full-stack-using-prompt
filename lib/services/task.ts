import { prisma } from '@/lib/prisma';
import { CreateTaskRequest, UpdateTaskRequest, MoveTaskRequest, ReorderTasksRequest } from '@/types/api';

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
  // First, get all tasks in the destination list
  const destinationTasks = await prisma.task.findMany({
    where: { listId: data.destinationListId },
    orderBy: { order: 'asc' },
  });

  // Calculate the new order for the moved task
  const newOrder = destinationTasks.length > 0
    ? destinationTasks[Math.min(data.destinationIndex, destinationTasks.length - 1)].order + 1
    : 0;

  // Update the task's list and order
  return prisma.task.update({
    where: { id: data.taskId },
    data: {
      listId: data.destinationListId,
      order: newOrder,
    },
    include: {
      list: true,
    },
  });
}

export async function reorderTasks(data: ReorderTasksRequest) {
  // Get all tasks in the list
  const tasks = await prisma.task.findMany({
    where: { listId: data.listId },
    orderBy: { order: 'asc' },
  });

  // Create a new array with the reordered tasks
  const reorderedTasks = [...tasks];
  const [movedTask] = reorderedTasks.splice(data.startIndex, 1);
  reorderedTasks.splice(data.endIndex, 0, movedTask);

  // Update all tasks with their new orders
  return prisma.$transaction(
    reorderedTasks.map((task, index) =>
      prisma.task.update({
        where: { id: task.id },
        data: { order: index },
        include: {
          list: true,
        },
      })
    )
  );
}

export async function getTask(id: string) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      list: true,
    },
  });
}

export async function deleteTask(id: string) {
  return prisma.task.delete({
    where: { id },
    include: {
      list: true,
    },
  });
} 