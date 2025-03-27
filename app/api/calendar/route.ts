import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching all calendar events...');
    
    const events = await prisma.calendarEntry.findMany({
      orderBy: {
        date: 'asc',
      },
    });
    
    console.log('Found events:', events);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error in GET /api/calendar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calendar events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, date, notes } = body;

    if (!title || !date) {
      return NextResponse.json(
        { error: 'Title and date are required' },
        { status: 400 }
      );
    }

    console.log('Creating new event:', { title, date, notes });
    
    const event = await prisma.calendarEntry.create({
      data: {
        title,
        date: new Date(date),
        notes,
      },
    });

    console.log('Created event:', event);
    return NextResponse.json(event);
  } catch (error) {
    console.error('Error in POST /api/calendar:', error);
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}