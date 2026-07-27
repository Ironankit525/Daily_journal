import React, { useState, useRef, useEffect } from 'react';
import type { GoalNote } from '../../types';

interface GoalsNotesProps {
  data: GoalNote;
  loading: boolean;
  onAddGoal: (goal: string) => void;
  onRemoveGoal: (index: number) => void;
  onUpdateGoal: (index: number, text: string) => void;
  onUpdateNotes: (notes: string) => void;
}

export default function GoalsNotes({
  data,
  loading,
  onAddGoal,
  onRemoveGoal,
  onUpdateGoal,
  onUpdateNotes,
}: GoalsNotesProps) {
  const [newGoal, setNewGoal] = useState('');
  const [editingGoalIdx, setEditingGoalIdx] = useState<number | null>(null);
  const goalInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingGoalIdx !== null && goalInputRef.current) {
      goalInputRef.current.focus();
    }
  }, [editingGoalIdx]);

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse-soft" style={{ color: 'var(--color-ink-secondary)' }}>
          Loading…
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
      {/* Goals */}
      <section className="card p-4" id="goals-section">
        <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Recurring Goals
        </h2>

        {data.goals.length === 0 ? (
          <p className="text-xs mb-3" style={{ color: 'var(--color-ink-secondary)' }}>
            No goals yet. Add something you want to achieve this month.
          </p>
        ) : (
          <ul className="space-y-2 mb-3">
            {data.goals.map((goal, i) => (
              <li key={i} className="flex items-center gap-2 group">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: 'var(--color-accent)' }}
                />
                {editingGoalIdx === i ? (
                  <input
                    ref={goalInputRef}
                    className="input-clean text-sm flex-1 !py-0.5"
                    value={goal}
                    onChange={(e) => onUpdateGoal(i, e.target.value)}
                    onBlur={() => setEditingGoalIdx(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') setEditingGoalIdx(null);
                    }}
                  />
                ) : (
                  <span
                    className="text-sm flex-1 cursor-pointer hover:underline decoration-dotted underline-offset-2"
                    onClick={() => setEditingGoalIdx(i)}
                  >
                    {goal}
                  </span>
                )}
                <button
                  onClick={() => onRemoveGoal(i)}
                  className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity text-xs"
                  style={{ color: 'var(--color-missed)' }}
                  title="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            className="input-clean text-sm flex-1"
            placeholder="e.g. Visit temple once a week"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newGoal.trim()) {
                onAddGoal(newGoal.trim());
                setNewGoal('');
              }
            }}
          />
          <button
            onClick={() => {
              if (newGoal.trim()) {
                onAddGoal(newGoal.trim());
                setNewGoal('');
              }
            }}
            className="btn-primary text-xs"
          >
            Add
          </button>
        </div>
      </section>

      {/* Notes */}
      <section className="card p-4" id="notes-section">
        <h2 className="text-base font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          Notes & Reminders
        </h2>
        <textarea
          className="input-clean text-sm min-h-[120px] resize-y"
          placeholder="Personal mantras, things to remember…"
          value={data.notes}
          onChange={(e) => onUpdateNotes(e.target.value)}
        />
        <p className="text-[10px] mt-1" style={{ color: 'var(--color-ink-secondary)' }}>
          Auto-saves as you type
        </p>
      </section>
    </div>
  );
}
