import React from 'react';
import type { MonthData } from '../types';
import { getMonthName, nextMonth, prevMonth } from '../utils/dateHelpers';

interface MonthSwitcherProps {
  monthData: MonthData;
  onChange: (data: MonthData) => void;
}

export default function MonthSwitcher({ monthData, onChange }: MonthSwitcherProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        id="month-prev"
        onClick={() => onChange(prevMonth(monthData))}
        className="btn-ghost w-9 h-9 flex items-center justify-center rounded-full !p-0"
        aria-label="Previous month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 4L6 8L10 12" />
        </svg>
      </button>

      <h2
        className="text-lg font-semibold min-w-[160px] text-center select-none"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {getMonthName(monthData.month)} {monthData.year}
      </h2>

      <button
        id="month-next"
        onClick={() => onChange(nextMonth(monthData))}
        className="btn-ghost w-9 h-9 flex items-center justify-center rounded-full !p-0"
        aria-label="Next month"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4L10 8L6 12" />
        </svg>
      </button>
    </div>
  );
}
