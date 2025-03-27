'use client';

import { CalendarEventProps } from '@/types/calendar';
import { MouseEvent } from 'react';

export default function CalendarEvent({ event, onClick }: CalendarEventProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClick(event);
  };

  return (
    <div
      onClick={handleClick}
      className="w-1 h-1 rounded-full bg-blue-500 hover:bg-blue-600 cursor-pointer"
      title={event.title}
    />
  );
} 