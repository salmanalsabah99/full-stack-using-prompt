export interface CalendarEvent {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  color?: string;
  description?: string;
}

export interface TimeSlot {
  hour: number;
  events: CalendarEvent[];
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

export interface CalendarViewProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export interface TimeGridProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
}

export interface CalendarSidebarProps {
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

export interface MiniCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export interface AgendaListProps {
  events: CalendarEvent[];
  selectedDate: Date;
  onEventClick?: (event: CalendarEvent) => void;
} 