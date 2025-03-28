import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function PUT(
  request: Request,
  { params }: { params: { taskId: string } }
) {
  try {
    const { destinationListId, destinationIndex } = await request.json();

    if (!destinationListId || typeof destinationIndex !== 'number') {
      return NextResponse.json(
        { error: 'Destination list ID and index are required' },
        { status: 400 }
      );
    }

    // Get the task to move
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Get all tasks in the destination list
    const destinationTasks = await prisma.task.findMany({
      where: { listId: destinationListId },
      orderBy: { order: 'asc' },
    });

    // Update the order of tasks in the destination list
    await Promise.all(
      destinationTasks.map((t, index) =>
        prisma.task.update({
          where: { id: t.id },
          data: {
            order: index >= destinationIndex ? index + 1 : index,
          },
        })
      )
    );

    // Move the task to the new list
    const updatedTask = await prisma.task.update({
      where: { id: params.taskId },
      data: {
        listId: destinationListId,
        order: destinationIndex,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error moving task:', error);
    return NextResponse.json(
      { error: 'Failed to move task' },
      { status: 500 }
    );
  }
} 