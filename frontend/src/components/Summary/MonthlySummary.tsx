import React from 'react';
import type { Habit, HabitEntry, MonthData } from '../../types';
import { getDaysInMonth, formatDate, isCurrentMonth, getTodayDay } from '../../utils/dateHelpers';

interface MonthlySummaryProps {
  habits: Habit[];
  entries: HabitEntry[];
  monthData: MonthData;
}

export default function MonthlySummary({ habits, entries, monthData }: MonthlySummaryProps) {
  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
  const today = isCurrentMonth(monthData) ? getTodayDay() : daysInMonth;
  // For current month, calculate based on days passed; for past months, full month
  const relevantDays = Math.min(today, daysInMonth);

  if (habits.length === 0) return null;

  const habitStats = habits.map((habit) => {
    const habitEntries = entries.filter((e) => e.habitId === habit._id);
    const done = habitEntries.filter((e) => e.status === 'done').length;
    const missed = habitEntries.filter((e) => e.status === 'missed').length;
    const partial = habitEntries.filter((e) => e.status === 'partial').length;
    const percentage = relevantDays > 0 ? Math.round((done / relevantDays) * 100) : 0;

    // Streak
    let streak = 0;
    for (let d = relevantDays; d >= 1; d--) {
      const date = formatDate(monthData.year, monthData.month, d);
      const entry = entries.find((e) => e.habitId === habit._id && e.date === date);
      if (entry?.status === 'done') streak++;
      else break;
    }

    return { habit, done, missed, partial, percentage, streak };
  });

  const overallScore = Math.round(
    habitStats.reduce((acc, s) => acc + s.percentage, 0) / habitStats.length
  );

  return (
    <section className="card p-4 animate-fade-in" id="monthly-summary">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Monthly Summary
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
            Overall
          </span>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-accent)' }}
          >
            {overallScore}%
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {habitStats.map(({ habit, done, percentage, streak }) => (
          <div key={habit._id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium truncate mr-2">{habit.name}</span>
              <div className="flex items-center gap-2 shrink-0">
                {streak > 1 && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}
                  >
                    🔥 {streak} day streak
                  </span>
                )}
                <span className="text-xs font-semibold" style={{ color: percentage >= 70 ? 'var(--color-done)' : percentage >= 40 ? 'var(--color-partial)' : 'var(--color-missed)' }}>
                  {percentage}%
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div
              className="h-1.5 rounded-full overflow-hidden"
              style={{ background: 'var(--color-border)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  background: percentage >= 70
                    ? 'var(--color-done)'
                    : percentage >= 40
                    ? 'var(--color-partial)'
                    : 'var(--color-missed)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
