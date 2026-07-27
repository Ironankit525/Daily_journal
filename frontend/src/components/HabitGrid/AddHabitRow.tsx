import React, { useState, useRef, useEffect } from 'react';

interface AddHabitRowProps {
  onAdd: (name: string) => void;
  daysInMonth: number;
}

export default function AddHabitRow({ onAdd, daysInMonth }: AddHabitRowProps) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [adding]);

  const handleSubmit = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
      // Keep the input open for rapid adding
    }
  };

  if (!adding) {
    return (
      <tr>
        <td colSpan={daysInMonth + 2} className="px-3 py-2">
          <button
            id="add-habit-btn"
            onClick={() => setAdding(true)}
            className="btn-ghost text-xs flex items-center gap-1.5"
          >
            <span className="text-base leading-none">+</span> Add habit
          </button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={daysInMonth + 2} className="px-3 py-2">
        <div className="flex items-center gap-2 max-w-xs">
          <input
            ref={inputRef}
            className="input-clean text-sm flex-1"
            placeholder="Habit name…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
              if (e.key === 'Escape') {
                setAdding(false);
                setName('');
              }
            }}
          />
          <button onClick={handleSubmit} className="btn-primary text-xs">
            Add
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setName('');
            }}
            className="btn-ghost text-xs"
          >
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );
}
