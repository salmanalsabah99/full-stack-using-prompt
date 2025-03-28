export const getDateRanges = () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const tomorrowEnd = new Date(todayEnd);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  const upcomingStart = new Date(todayEnd);
  upcomingStart.setDate(upcomingStart.getDate() + 1);

  return {
    today: { start: todayStart, end: todayEnd },
    tomorrow: { start: tomorrowStart, end: tomorrowEnd },
    upcoming: { start: upcomingStart, end: null }
  };
}; 