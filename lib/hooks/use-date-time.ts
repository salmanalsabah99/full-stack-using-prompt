import { useState, useEffect } from 'react';
import { getLocalNow } from '@/lib/date-utils';

interface DateTimeState {
  date: string;
  time: string;
}

export function useDateTime(defaultDate: Date = getLocalNow()) {
  const [dateTime, setDateTime] = useState<DateTimeState>(() => {
    const date = defaultDate instanceof Date && !isNaN(defaultDate.getTime()) 
      ? defaultDate 
      : getLocalNow();
    
    return {
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  });

  useEffect(() => {
    const date = defaultDate instanceof Date && !isNaN(defaultDate.getTime())
      ? defaultDate
      : getLocalNow();
    
    setDateTime({
      date: date.toISOString().split('T')[0],
      time: date.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      })
    });
  }, [defaultDate]);

  const setDate = (newDate: string) => {
    setDateTime(prev => ({ ...prev, date: newDate }));
  };

  const setTime = (newTime: string) => {
    setDateTime(prev => ({ ...prev, time: newTime }));
  };

  const getDateTime = () => {
    const [hours, minutes] = dateTime.time.split(':').map(Number);
    const date = new Date(dateTime.date);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return {
    date: dateTime.date,
    time: dateTime.time,
    setDate,
    setTime,
    getDateTime
  };
} 