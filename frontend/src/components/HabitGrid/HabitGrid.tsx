import React from 'react';
import type { Habit, HabitEntry, HabitStatus, MonthData } from '../../types';
import { getDaysInMonth, isCurrentMonth, getTodayDay } from '../../utils/dateHelpers';
import HabitRow from './HabitRow';
import AddHabitRow from './AddHabitRow';

interface HabitGridProps {
  habits: Habit[];
  entries: HabitEntry[];
  monthData: MonthData;
  loading: boolean;
  getEntry: (habitId: string, date: string) => HabitEntry | undefined;
  onCycle: (habitId: string, date: string) => Promise<HabitStatus>;
  onNoteChange: (habitId: string, date: string, note: string) => void;
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}

export default function HabitGrid({
  habits,
  entries,
  monthData,
  loading,
  getEntry,
  onCycle,
  onNoteChange,
  onAdd,
  onRename,
  onDelete,
  onMove,
}: HabitGridProps) {
  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
  const today = isCurrentMonth(monthData) ? getTodayDay() : -1;

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse-soft" style={{ color: 'var(--color-ink-secondary)' }}>
          Loading habits…
        </div>
      </div>
    );
  }

  return (
    <section className="card overflow-hidden animate-fade-in" id="habit-grid">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-ink)' }}>
          Habits
        </h2>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse" style={{ minWidth: 'max-content' }}>
          <thead>
            <tr
              className="border-b text-xs"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-ink-secondary)',
              }}
            >
              <th className="sticky left-0 z-10 text-left px-3 py-2 font-medium min-w-[140px]" style={{ background: 'inherit' }}>
                <span className="sr-only">Habit</span>
              </th>
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                return (
                  <th
                    key={day}
                    className={`px-0.5 py-2 font-medium min-w-[40px] ${day === today ? 'text-[var(--color-accent)] font-semibold' : ''}`}
                  >
                    {day}
                  </th>
                );
              })}
              <th className="px-3 py-2 font-medium min-w-[80px]">Total</th>
            </tr>
          </thead>

          <tbody
            style={{
              background: 'var(--color-card)',
            }}
            className="dark:[&]:bg-[var(--color-card-dark)]"
          >
            {habits.length === 0 ? (
              <tr>
                <td
                  colSpan={daysInMonth + 2}
                  className="px-4 py-8 text-center text-sm"
                  style={{ color: 'var(--color-ink-secondary)' }}
                >
                  No habits yet. Add your first habit below.
                </td>
              </tr>
            ) : (
              habits.map((habit, index) => (
                <HabitRow
                  key={habit._id}
                  habit={habit}
                  monthData={monthData}
                  getEntry={getEntry}
                  onCycle={onCycle}
                  onNoteChange={onNoteChange}
                  onRename={onRename}
                  onDelete={onDelete}
                  onMove={onMove}
                  isFirst={index === 0}
                  isLast={index === habits.length - 1}
                  entries={entries}
                />
              ))
            )}

            <AddHabitRow onAdd={onAdd} daysInMonth={daysInMonth} />
          </tbody>
        </table>
      </div>
    </section>
  );
}
