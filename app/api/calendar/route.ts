import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withApiHandler, withValidation } from '@/lib/api-utils';
import { validateCalendarEntry } from '@/lib/validation';

// GET /api/calendar - Get all calendar events
export const GET = withApiHandler(
  async () => {
    return prisma.calendarEntry.findMany({
      orderBy: {
        date: 'asc',
      },
    });
  },
  'fetch calendar events'
);

// POST /api/calendar - Create a new calendar event
export const POST = withApiHandler(
  async (request: Request) => {
    const data = await request.json();
    
    return withValidation(data, validateCalendarEntry, async (validatedData) => {
      const { title, date, notes } = validatedData;
      
      return prisma.calendarEntry.create({
        data: {
          title,
          date: new Date(date),
          notes,
        },
      });
    });
  },
  'create calendar event'
);