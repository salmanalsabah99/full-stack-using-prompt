import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation } from '@/lib/api-utils';
import { validateCalendarEntry } from '@/lib/validation';
import { ensureLocal, getLocalNow } from '@/lib/date-utils';

interface CalendarEntryData {
  title: string;
  date: string;
  notes?: string;
}

// GET /api/calendar - Get all calendar events
export const GET = withApiHandler(
  async () => {
    const events = await prisma.calendarEntry.findMany({
      orderBy: {
        date: 'asc',
      },
    });

    // Ensure all dates are in local timezone
    return events.map(event => ({
      ...event,
      date: ensureLocal(event.date),
      createdAt: ensureLocal(event.createdAt),
      updatedAt: ensureLocal(event.updatedAt),
    }));
  },
  'get calendar events'
);

// POST /api/calendar - Create a new calendar event
export const POST = withApiHandler(
  async (request: Request) => {
    const data = await request.json();
    
    return withValidation<CalendarEntryData>(data, validateCalendarEntry, async (validatedData) => {
      const { title, date, notes } = validatedData;
      
      return prisma.calendarEntry.create({
        data: {
          title,
          date: ensureLocal(new Date(date)),
          notes,
          createdAt: getLocalNow(),
          updatedAt: getLocalNow(),
        },
      });
    });
  },
  'create calendar event'
);

// PUT /api/calendar/:id - Update a calendar event
export const PUT = withApiHandler(
  async (request: Request, { params }: { params: { id: string } }) => {
    const data = await request.json();
    
    return withValidation<CalendarEntryData>(data, validateCalendarEntry, async (validatedData) => {
      const { title, date, notes } = validatedData;
      
      return prisma.calendarEntry.update({
        where: { id: parseInt(params.id) },
        data: {
          title,
          date: ensureLocal(new Date(date)),
          notes,
          updatedAt: getLocalNow(),
        },
      });
    });
  },
  'update calendar event'
);

// DELETE /api/calendar/:id - Delete a calendar event
export const DELETE = withApiHandler(
  async (request: Request, { params }: { params: { id: string } }) => {
    return prisma.calendarEntry.delete({
      where: { id: parseInt(params.id) },
    });
  },
  'delete calendar event'
);