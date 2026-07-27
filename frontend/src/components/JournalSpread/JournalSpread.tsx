import React, { useState } from 'react';
import type { MonthData, Habit, HabitEntry, HabitStatus } from '../../types';
import { getDaysInMonth, formatMonth, getTodayDay, getMonthName } from '../../utils/dateHelpers';

import Navbar from '../Navbar/Navbar';
import ProgressGraph from '../ProgressGraph/ProgressGraph';
import type { User } from '../../hooks/useAuth';

interface JournalSpreadProps {
  monthData: MonthData;
  onMonthChange: (data: MonthData) => void;
  habits: Habit[];
  entries: HabitEntry[];
  loading: boolean;
  onCycleEntry: (habitId: string, date: string) => Promise<HabitStatus>;
  onAddHabit: (name: string) => void;
  onRenameHabit: (id: string, name: string) => void;
  onDeleteHabit: (id: string) => void;
  dark: boolean;
  toggleTheme: () => void;
  user: User | null;
  avatar: string | null;
  onOpenSettings: () => void;
}

const PHOTO_DEFAULT_HABITS = [
  'Wake up before 6:00 AM',
  'Exercise / Meditation',
  'Study 5hr+',
  'No Junk / Sugar',
  '1 hr New Skill',
  "Read Author's book",
  'Drink 2-3 L H2O',
  'Bkp - 1 - Math video',
  'Bkp - 1 - Eng. video',
  'Read Eng. Editorial',
  'Current affairs.',
  'Feel gratitude',
  'No Phone B4 Bed (1/2 hr)',
  'Sleep Before 11:00 PM.',
];

export default function JournalSpread({
  monthData,
  onMonthChange,
  habits: initialHabits,
  entries,
  loading,
  onCycleEntry,
  onAddHabit,
  onRenameHabit,
  onDeleteHabit,
  dark,
  toggleTheme,
  user,
  avatar,
  onOpenSettings,
}: JournalSpreadProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingHabitName, setEditingHabitName] = useState('');
  const [habitToDelete, setHabitToDelete] = useState<{ id: string; name: string } | null>(null);

  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
  const monthStr = formatMonth(monthData);
  const todayDay = getTodayDay();
  const monthName = getMonthName(monthData.month);

  const habits = initialHabits.length > 0
    ? initialHabits
    : PHOTO_DEFAULT_HABITS.map((name, i) => ({ _id: `default-${i}`, name, order: i, month: monthStr }));

  const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    onAddHabit(newHabitName.trim());
    setNewHabitName('');
  };

  const handleRenameSubmit = (id: string) => {
    if (editingHabitName.trim()) {
      onRenameHabit(id, editingHabitName.trim());
    }
    setEditingHabitId(null);
  };

  const confirmDelete = () => {
    if (habitToDelete) {
      onDeleteHabit(habitToDelete.id);
      setHabitToDelete(null);
    }
  };

  const getEntryFor = (habitId: string, day: number) => {
    const dStr = `${monthStr}-${String(day).padStart(2, '0')}`;
    return entries.find((e) => e.habitId === habitId && e.date === dStr);
  };

  const getHabitTotals = (habitId: string) => {
    let done = 0;
    let missed = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const e = getEntryFor(habitId, day);
      if (e?.status === 'done') done++;
      if (e?.status === 'missed') missed++;
    }
    return { done, missed };
  };

  const isCellEditable = (day: number) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const todayDay = now.getDate();

    const targetDate = new Date(monthData.year, monthData.month, day);
    const todayDate = new Date(currentYear, currentMonth, todayDay);

    const diffInMs = todayDate.getTime() - targetDate.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    return diffInDays === 0 || diffInDays === 1;
  };

  const renderCellContent = (habitId: string, day: number) => {
    const entry = getEntryFor(habitId, day);
    if (!entry || entry.status === 'none') return null;

    if (entry.status === 'done') {
      return <span className="font-bold text-black dark:text-white text-[#1A1A1A] text-base">✓</span>;
    }
    if (entry.status === 'missed') {
      return <span className="font-bold text-black dark:text-white text-base">✕</span>;
    }
    if (entry.status === 'partial') {
      return (
        <span className="font-bold text-black dark:text-white text-xs leading-none">
          {entry.note || '½'}
        </span>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-[1450px] mx-auto p-1.5 sm:p-4 select-none font-kalam text-[#1A1A1A] dark:text-[#E5DFD5]">
      {/* Top Controls matching exact user screenshot UI */}
      <Navbar
        monthData={monthData}
        onMonthChange={onMonthChange}
        user={user}
        avatar={avatar}
        onOpenSettings={onOpenSettings}
      />

      {/* CONTINUOUS UNIFIED SPREAD CONTAINER WITH MOBILE RESPONSIVE WRAPPER */}
      <div className="bg-[#FAF5EC] dark:bg-[#1E1C19] border-2 border-[#1A1A1A]/60 dark:border-[#555]/60 rounded-xs shadow-2xl p-2 sm:p-4 w-full">

        {/* Unified Top Headers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-[#1A1A1A]/60 dark:border-[#555]/60 pb-3 mb-3 gap-2 sm:gap-0">
          <span className="text-xl sm:text-2xl font-bold underline decoration-wavy decoration-black/40">
            * "Being new version of Me challenge"
          </span>
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold underline">Progress Tracker ({daysInMonth} day)</span>
            <span className="text-xs sm:text-sm border border-black/40 dark:border-white/40 px-2 py-0.5 rounded">[{monthName} 1-{daysInMonth}]</span>
          </div>
          <div className="text-left sm:text-right w-full sm:w-auto">
            <span className="text-xs italic block">*Visit Temple once in a week</span>
            <span className="text-xs font-semibold">Date: {monthName} 1-{daysInMonth}</span>
          </div>
        </div>

        {/* SECTION TITLE & MOBILE SWIPE HINT */}
        <div className="border-b-2 border-[#1A1A1A]/60 dark:border-[#555]/60 mb-2 pb-1 flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wider">HABIT GRID</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs italic text-amber-600 dark:text-amber-400 font-sans sm:hidden">
              👉 Swipe table to view all days
            </span>
            <span className="text-xs italic text-black/60 dark:text-white/60 hidden sm:inline">Days 1 ➔ {daysInMonth}</span>
          </div>
        </div>

        {/* SCROLLABLE TABLE WRAPPER WITH STICKY HABIT NAME COLUMN */}
        <div className="overflow-x-auto overflow-y-hidden border-2 border-[#1A1A1A]/60 dark:border-[#555]/60 -mx-1 sm:mx-0 touch-pan-x">
          <table className="w-full text-center border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b-2 border-[#1A1A1A]/60 dark:border-[#555]/60 bg-black/5 dark:bg-white/5">
                <th className="sticky left-0 z-20 bg-[#FAF5EC] dark:bg-[#1E1C19] p-1 text-left min-w-[160px] sm:min-w-[210px] font-bold border-r-2 border-[#1A1A1A]/60 dark:border-[#555]/60 text-sm sm:text-base shadow-sm">
                  HABIT NAME
                </th>
                {allDays.map((day) => {
                  const editable = isCellEditable(day);
                  return (
                    <th
                      key={day}
                      className={`w-9 sm:w-8 p-1 border-r border-[#1A1A1A]/35 dark:border-[#444]/60 font-bold text-xs sm:text-sm ${day === todayDay ? 'bg-amber-200 dark:bg-amber-900/60' : ''
                        } ${!editable ? 'opacity-50' : ''}`}
                    >
                      {day}
                    </th>
                  );
                })}
                <th className="p-1 min-w-[60px] sm:min-w-[65px] font-bold border-l-2 border-[#1A1A1A]/60 dark:border-[#555]/60 text-xs bg-black/10 dark:bg-white/10">
                  Total <br /> ✓ / ✕
                </th>
              </tr>
            </thead>
            <tbody>
              {habits.map((habit, index) => {
                const totals = getHabitTotals(habit._id);
                return (
                  <tr key={habit._id || index} className="border-b border-[#1A1A1A]/35 dark:border-[#444]/60 h-9 sm:h-8 hover:bg-black/5 dark:hover:bg-white/5">
                    {/* STICKY HABIT NAME COLUMN FOR SMOOTH MOBILE SWIPING */}
                    <td className="sticky left-0 z-10 bg-[#FAF5EC] dark:bg-[#1E1C19] p-1 text-left border-r-2 border-[#1A1A1A]/60 dark:border-[#555]/60 font-semibold text-xs sm:text-sm leading-tight max-w-[170px] sm:max-w-[220px] truncate group shadow-xs">
                      {editingHabitId === habit._id ? (
                        <input
                          type="text"
                          value={editingHabitName}
                          onChange={(e) => setEditingHabitName(e.target.value)}
                          onBlur={() => handleRenameSubmit(habit._id)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit(habit._id)}
                          autoFocus
                          className="w-full bg-white dark:bg-black border px-1 outline-none font-kalam text-xs sm:text-sm"
                        />
                      ) : (
                        <div className="flex items-center justify-between gap-1">
                          <span
                            onClick={() => {
                              setEditingHabitId(habit._id);
                              setEditingHabitName(habit.name);
                            }}
                            className="cursor-pointer hover:underline flex-1 truncate"
                            title="Click to rename"
                          >
                            {index + 1}] {habit.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHabitToDelete({ id: habit._id, name: habit.name });
                            }}
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-xs text-red-500 hover:text-red-700 hover:bg-red-500/20 rounded font-bold px-1 py-0.5 transition-opacity"
                            title="Delete habit"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </td>

                    {allDays.map((day) => {
                      const editable = isCellEditable(day);
                      return (
                        <td
                          key={day}
                          onClick={() => {
                            if (editable) {
                              onCycleEntry(habit._id, `${monthStr}-${String(day).padStart(2, '0')}`);
                            }
                          }}
                          className={`w-9 h-9 sm:w-8 sm:h-8 p-0 border-r border-[#1A1A1A]/35 dark:border-[#444]/60 text-center align-middle ${editable
                              ? 'cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-transform'
                              : 'cursor-not-allowed opacity-40 bg-black/5 dark:bg-white/5'
                            } ${day === todayDay ? 'bg-amber-100 dark:bg-amber-900/40' : ''}`}
                          title={editable ? 'Click to cycle status' : 'Locked: Entry can only be changed for today or yesterday'}
                        >
                          {renderCellContent(habit._id, day)}
                        </td>
                      );
                    })}

                    <td className="p-1 font-bold text-xs sm:text-sm border-l-2 border-[#1A1A1A]/60 dark:border-[#555]/60 bg-black/5 dark:bg-white/5">
                      <span>{totals.done}✓</span> <span className="text-xs">/</span> <span>{totals.missed}✕</span>
                    </td>
                  </tr>
                );
              })}

              <tr className="bg-black/5 dark:bg-white/5 h-9 sm:h-8">
                <td colSpan={allDays.length + 2} className="p-1 text-left">
                  <form onSubmit={handleAddSubmit} className="flex flex-wrap items-center gap-2 px-1">
                    <span className="font-bold text-sm">+</span>
                    <input
                      type="text"
                      placeholder="Add new habit..."
                      value={newHabitName}
                      onChange={(e) => setNewHabitName(e.target.value)}
                      className="w-36 sm:w-48 bg-transparent border-b border-dashed border-black/40 dark:border-white/40 outline-none font-kalam text-xs px-1"
                    />
                    <button type="submit" className="text-xs font-bold px-2 py-0.5 border border-black/40 rounded hover:bg-black/10">
                      Add Habit
                    </button>
                    <span className="text-[11px] sm:text-xs italic text-black/50 dark:text-white/50 w-full sm:w-auto sm:ml-auto">
                      🔒 Ticks allowed for today & yesterday only | ✓ (Done) → ✕ (Missed) → ½ (Partial)
                    </span>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DYNAMIC PROGRESS GRAPH MATCHING REFERENCE IMAGE */}
        <ProgressGraph
          monthData={monthData}
          habits={habits}
          entries={entries}
        />

        <div className="mt-6 pt-2 border-t border-dashed border-[#1A1A1A]/40 dark:border-white/40 text-right">
          <span className="text-lg sm:text-xl font-bold italic tracking-wide">
            {user?.username || 'ankit'} remember "Reality is negotiable"
          </span>
        </div>

      </div>

      {/* HANDWRITTEN CUSTOM MODAL ALERT FOR HABIT DELETION */}
      {habitToDelete && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in"
          onClick={() => setHabitToDelete(null)}
        >
          <div
            className="bg-[#FAF5EC] dark:bg-[#25221C] border-2 border-[#1A1A1A] dark:border-[#666] p-5 sm:p-6 max-w-md w-full rounded-xs shadow-2xl text-[#1A1A1A] dark:text-[#E5DFD5] font-kalam relative animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3 text-red-600 dark:text-red-400 font-bold text-xl sm:text-2xl">
              <span>⚠️ Delete Habit</span>
            </div>

            <p className="text-base sm:text-lg leading-relaxed mb-6 font-medium">
              Are you sure you want to delete <span className="font-bold underline decoration-wavy">{habitToDelete.name}</span>? All tracked entries for this habit will be lost.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-dashed border-[#1A1A1A]/30 dark:border-white/30">
              <button
                type="button"
                onClick={() => setHabitToDelete(null)}
                className="px-4 py-1.5 border border-[#1A1A1A] dark:border-[#777] rounded-xs font-bold text-sm sm:text-base hover:bg-black/10 dark:hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xs font-bold text-sm sm:text-base shadow"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
