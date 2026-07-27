import React from 'react';
import type { MoodEntry, MoodLabels, MonthData } from '../../types';
import { getDaysInMonth, formatDate, isCurrentMonth, getTodayDay } from '../../utils/dateHelpers';

interface MoodDayPickerProps {
  monthData: MonthData;
  moods: MoodEntry[];
  labels: MoodLabels;
  onSetMood: (date: string, level: number) => void;
  getMood: (date: string) => MoodEntry | undefined;
}

const MOOD_COLORS = [
  'var(--color-mood-0)',
  'var(--color-mood-1)',
  'var(--color-mood-2)',
  'var(--color-mood-3)',
  'var(--color-mood-4)',
  'var(--color-mood-5)',
];

const MOOD_EMOJIS = ['😊', '😐', '😢', '😰', '😴', '😵'];

export default function MoodDayPicker({ monthData, moods, labels, onSetMood, getMood }: MoodDayPickerProps) {
  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
  const today = isCurrentMonth(monthData) ? getTodayDay() : -1;

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 text-xs" style={{ color: 'var(--color-ink-secondary)' }}>
        {labels.labels.map((label, i) => (
          <span key={i} className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: MOOD_COLORS[i] }} />
            {label}
          </span>
        ))}
      </div>

      {/* Day row */}
      <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-2">
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = formatDate(monthData.year, monthData.month, day);
          const mood = getMood(date);
          const isToday = day === today;

          return (
            <div key={day} className="flex flex-col items-center gap-1 min-w-[36px]">
              <span
                className={`text-[10px] font-medium ${isToday ? 'text-[var(--color-accent)] font-semibold' : ''}`}
                style={{ color: isToday ? undefined : 'var(--color-ink-secondary)' }}
              >
                {day}
              </span>
              <div className="relative group">
                <button
                  onClick={() => {
                    // Show mood selector (simple: cycle through levels)
                    const currentLevel = mood?.level ?? -1;
                    const nextLevel = (currentLevel + 1) % 6;
                    onSetMood(date, nextLevel);
                  }}
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    text-sm transition-all duration-150
                    hover:scale-110 active:scale-95 cursor-pointer
                    ${isToday ? 'ring-2 ring-[var(--color-accent)] ring-offset-1' : ''}
                  `}
                  style={{
                    background: mood !== undefined ? `${MOOD_COLORS[mood.level]}20` : 'transparent',
                    border: mood !== undefined ? `2px solid ${MOOD_COLORS[mood.level]}` : '1px solid var(--color-border)',
                  }}
                  title={mood !== undefined ? `${labels.labels[mood.level]} — click to change` : 'Click to set mood'}
                >
                  {mood !== undefined ? (
                    <span className="animate-scale-in text-xs">{MOOD_EMOJIS[mood.level]}</span>
                  ) : null}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
