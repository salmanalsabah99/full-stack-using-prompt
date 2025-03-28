import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation, createErrorResponse } from '@/lib/api-utils';
import { validateCalendarEntry } from '@/lib/validation';

// DELETE /api/calendar/[id] - Delete a calendar event
export const DELETE = withApiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse('Invalid event ID', 400);
    }

    // First check if the event exists
    const existingEvent = await prisma.calendarEntry.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return createErrorResponse('Event not found', 404);
    }

    // Delete the event
    await prisma.calendarEntry.delete({
      where: { id },
    });

    return { success: true, id };
  },
  'delete calendar event'
);

// PUT /api/calendar/[id] - Update a calendar event
export const PUT = withApiHandler(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return createErrorResponse('Invalid event ID', 400);
    }

    const data = await request.json();
    
    return withValidation(data, validateCalendarEntry, async (validatedData) => {
      const { title, date, notes } = validatedData;
      
      return prisma.calendarEntry.update({
        where: { id },
        data: {
          title,
          date: new Date(date),
          notes,
        },
      });
    });
  },
  'update calendar event'
); 