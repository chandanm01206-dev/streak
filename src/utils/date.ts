// Date utility functions for the Streak habit tracker

/**
 * Format a date as YYYY-MM-DD string
 */
export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Parse a YYYY-MM-DD string into a Date (local timezone)
 */
export function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Get today's date string
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Get an array of 7 dates for the week containing the given date
 * @param date center date
 * @param firstDayOfWeek 0=Sunday, 1=Monday
 */
export function getWeekDates(date: Date, firstDayOfWeek: number = 1): Date[] {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day - firstDayOfWeek + 7) % 7;
  d.setDate(d.getDate() - diff);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const wd = new Date(d);
    wd.setDate(d.getDate() + i);
    week.push(wd);
  }
  return week;
}

/**
 * Short weekday name (MO, TU, WE, etc.)
 */
export function getShortWeekday(date: Date): string {
  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  return days[date.getDay()];
}

/**
 * Get the current time-of-day period
 */
export function getCurrentTimeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get difference in days between two dates
 */
export function daysBetween(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

/**
 * Check if two date strings represent the same day
 */
export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

/**
 * Get the number of days in a month
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Generate an array of date strings from startDate to endDate (inclusive)
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const dates: string[] = [];
  const current = new Date(start);
  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
