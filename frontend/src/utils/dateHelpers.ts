import type { MonthData } from '../types';

/** Get the number of days in a given month */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Format MonthData as "2026-07" */
export function formatMonth(data: MonthData): string {
  return `${data.year}-${String(data.month + 1).padStart(2, '0')}`;
}

/** Format a specific day as "2026-07-15" */
export function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/** Get the display name for a month */
export function getMonthName(month: number): string {
  const names = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return names[month];
}

/** Go to the next month */
export function nextMonth(data: MonthData): MonthData {
  if (data.month === 11) return { year: data.year + 1, month: 0 };
  return { year: data.year, month: data.month + 1 };
}

/** Go to the previous month */
export function prevMonth(data: MonthData): MonthData {
  if (data.month === 0) return { year: data.year - 1, month: 11 };
  return { year: data.year, month: data.month - 1 };
}

/** Get today's MonthData */
export function getCurrentMonth(): MonthData {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
}

/** Get today's day number (1-indexed) */
export function getTodayDay(): number {
  return new Date().getDate();
}

/** Check if a given MonthData is the current month */
export function isCurrentMonth(data: MonthData): boolean {
  const now = new Date();
  return data.year === now.getFullYear() && data.month === now.getMonth();
}
