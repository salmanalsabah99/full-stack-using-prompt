import { useState } from 'react';
import { addDays, subDays } from 'date-fns';
import { getLocalNow } from '@/lib/date-utils';

export function useCalendarNavigation() {
  const [selectedDate, setSelectedDate] = useState(getLocalNow());

  const handlePreviousWeek = () => {
    setSelectedDate(prev => subDays(prev, 7));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addDays(prev, 7));
  };

  const handleToday = () => {
    setSelectedDate(getLocalNow());
  };

  return {
    selectedDate,
    handlePreviousWeek,
    handleNextWeek,
    handleToday
  };
} 