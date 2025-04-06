export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric',
    minute: '2-digit',
    hour12: true 
  });
};

export const getDayEvents = (events: any[], date: Date) => {
  return events.filter(event => {
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
};

export const generateTimeSlots = (startHour: number = 12, endHour: number = 20) => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour += 2) {
    slots.push(hour);
  }
  return slots;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getMonthDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  // Add padding days from previous month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const prevDate = new Date(year, month, -i);
    days.unshift({ date: prevDate, events: [] });
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push({ date: new Date(year, month, i), events: [] });
  }

  // Add padding days from next month
  const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
  for (let i = 1; i <= remainingDays; i++) {
    const nextDate = new Date(year, month + 1, i);
    days.push({ date: nextDate, events: [] });
  }

  return days;
}; 