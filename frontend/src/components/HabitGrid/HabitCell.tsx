import React, { useState } from 'react';
import type { HabitStatus } from '../../types';

interface HabitCellProps {
  status: HabitStatus;
  note: string;
  day: number;
  isToday: boolean;
  onCycle: () => Promise<HabitStatus>;
  onNoteChange: (note: string) => void;
}

export default function HabitCell({ status, note, day, isToday, onCycle, onNoteChange }: HabitCellProps) {
  const [showNote, setShowNote] = useState(false);
  const [noteValue, setNoteValue] = useState(note);

  const handleClick = async () => {
    const newStatus = await onCycle();
    if (newStatus === 'partial') {
      setShowNote(true);
    } else {
      setShowNote(false);
    }
  };

  const handleNoteBlur = () => {
    if (noteValue !== note) {
      onNoteChange(noteValue);
    }
    setShowNote(false);
  };

  const cellClass =
    status === 'done'
      ? 'cell-done'
      : status === 'missed'
      ? 'cell-missed'
      : status === 'partial'
      ? 'cell-partial'
      : '';

  const icon =
    status === 'done'
      ? '✓'
      : status === 'missed'
      ? '✕'
      : status === 'partial'
      ? '◐'
      : '';

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className={`
          w-9 h-9 min-w-[36px] rounded-lg flex items-center justify-center
          text-sm font-medium transition-all duration-150
          hover:scale-110 active:scale-95 select-none cursor-pointer
          ${cellClass}
          ${!status || status === 'none' ? 'hover:bg-black/5 dark:hover:bg-white/5' : ''}
          ${isToday ? 'ring-2 ring-[var(--color-accent)] ring-offset-1' : ''}
        `}
        style={{}}
        title={
          status === 'partial' && note
            ? note
            : `Day ${day}${isToday ? ' (today)' : ''}`
        }
      >
        {icon && <span className="animate-scale-in">{icon}</span>}
      </button>

      {/* Partial note popover */}
      {showNote && status === 'partial' && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-20 animate-fade-in"
          style={{ minWidth: '120px' }}
        >
          <input
            type="text"
            className="input-clean text-xs !py-1 !px-2 shadow-lg"
            placeholder="e.g. 30 min"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            onBlur={handleNoteBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleNoteBlur();
            }}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
