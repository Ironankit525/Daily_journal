import React, { useState, useRef, useEffect } from 'react';
import type { Habit, HabitEntry, HabitStatus, MonthData } from '../../types';
import { getDaysInMonth, formatDate, isCurrentMonth, getTodayDay } from '../../utils/dateHelpers';
import HabitCell from './HabitCell';

interface HabitRowProps {
  habit: Habit;
  monthData: MonthData;
  getEntry: (habitId: string, date: string) => HabitEntry | undefined;
  onCycle: (habitId: string, date: string) => Promise<HabitStatus>;
  onNoteChange: (habitId: string, date: string, note: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  entries: HabitEntry[];
}

export default function HabitRow({
  habit,
  monthData,
  getEntry,
  onCycle,
  onNoteChange,
  onRename,
  onDelete,
  onMove,
  isFirst,
  isLast,
  entries,
}: HabitRowProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(habit.name);
  const [showActions, setShowActions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
  const today = isCurrentMonth(monthData) ? getTodayDay() : -1;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleRename = () => {
    if (name.trim() && name !== habit.name) {
      onRename(habit._id, name.trim());
    } else {
      setName(habit.name);
    }
    setEditing(false);
  };

  // Count totals
  const habitEntries = entries.filter((e) => e.habitId === habit._id);
  const done = habitEntries.filter((e) => e.status === 'done').length;
  const missed = habitEntries.filter((e) => e.status === 'missed').length;
  const partial = habitEntries.filter((e) => e.status === 'partial').length;

  // Streak calculation — consecutive "done" days ending at today (or end of month)
  let streak = 0;
  const checkUntil = today > 0 ? today : daysInMonth;
  for (let d = checkUntil; d >= 1; d--) {
    const date = formatDate(monthData.year, monthData.month, d);
    const entry = getEntry(habit._id, date);
    if (entry?.status === 'done') {
      streak++;
    } else {
      break;
    }
  }

  return (
    <tr className="group border-b" style={{ borderColor: 'var(--color-border)' }}>
      {/* Habit name — sticky first column */}
      <td
        className="sticky left-0 z-10 px-3 py-2 min-w-[140px] max-w-[180px]"
        style={{
          background: 'inherit',
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-center gap-1">
          {editing ? (
            <input
              ref={inputRef}
              className="input-clean !py-0.5 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') {
                  setName(habit.name);
                  setEditing(false);
                }
              }}
            />
          ) : (
            <span
              className="text-sm font-medium truncate cursor-pointer hover:underline decoration-dotted underline-offset-2"
              onClick={() => setEditing(true)}
              title="Click to rename"
            >
              {habit.name}
            </span>
          )}

          {/* Action buttons — visible on hover */}
          {showActions && !editing && (
            <div className="flex items-center gap-0.5 ml-auto animate-fade-in">
              {!isFirst && (
                <button
                  onClick={() => onMove(habit._id, 'up')}
                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] opacity-50 hover:opacity-100 transition-opacity"
                  title="Move up"
                >
                  ▲
                </button>
              )}
              {!isLast && (
                <button
                  onClick={() => onMove(habit._id, 'down')}
                  className="w-5 h-5 rounded flex items-center justify-center text-[10px] opacity-50 hover:opacity-100 transition-opacity"
                  title="Move down"
                >
                  ▼
                </button>
              )}
              <button
                onClick={() => {
                  if (confirm(`Delete "${habit.name}"?`)) onDelete(habit._id);
                }}
                className="w-5 h-5 rounded flex items-center justify-center text-[10px] opacity-50 hover:opacity-100 transition-opacity hover:text-[var(--color-missed)]"
                title="Delete habit"
              >
                🗑
              </button>
            </div>
          )}
        </div>
      </td>

      {/* Day cells */}
      {Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = formatDate(monthData.year, monthData.month, day);
        const entry = getEntry(habit._id, date);
        const status: HabitStatus = entry?.status || 'none';
        const note = entry?.note || '';

        return (
          <td key={day} className="px-0.5 py-1.5 text-center">
            <HabitCell
              status={status}
              note={note}
              day={day}
              isToday={day === today}
              onCycle={() => onCycle(habit._id, date)}
              onNoteChange={(n) => onNoteChange(habit._id, date, n)}
            />
          </td>
        );
      })}

      {/* Totals column */}
      <td className="px-3 py-2 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium">
          {done > 0 && <span style={{ color: 'var(--color-done)' }}>{done}✓</span>}
          {missed > 0 && <span style={{ color: 'var(--color-missed)' }}>{missed}✕</span>}
          {partial > 0 && <span style={{ color: 'var(--color-partial)' }}>{partial}◐</span>}
          {streak > 1 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)' }}>
              🔥{streak}
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}
