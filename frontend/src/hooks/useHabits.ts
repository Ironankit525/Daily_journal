import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Habit, HabitEntry, HabitStatus, MonthData } from '../types';
import { formatMonth } from '../utils/dateHelpers';

export function useHabits(monthData: MonthData, userId?: string | null) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [entries, setEntries] = useState<HabitEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const month = formatMonth(monthData);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setHabits([]);
      setEntries([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [h, e] = await Promise.all([
        api.getHabits(month),
        api.getHabitEntries(month),
      ]);
      setHabits(Array.isArray(h) ? h : []);
      setEntries(Array.isArray(e) ? e : []);
    } catch (err) {
      console.warn('Backend API error or unauthorized:', err);
      setHabits([]);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [month, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addHabit = useCallback(async (name: string) => {
    const tempId = `h-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newHabit: Habit = {
      _id: tempId,
      name,
      order: habits.length,
      month,
    };

    setHabits((prev) => [...prev, newHabit]);

    try {
      const created = await api.createHabit(name, month);
      if (created && created._id) {
        setHabits((prev) => prev.map((h) => (h._id === tempId ? created : h)));
      }
    } catch (err) {
      console.warn('Error saving habit:', err);
    }
  }, [month, habits.length]);

  const renameHabit = useCallback(async (id: string, name: string) => {
    setHabits((prev) => prev.map((h) => (h._id === id ? { ...h, name } : h)));

    try {
      if (!id.startsWith('h-')) {
        await api.updateHabit(id, { name });
      }
    } catch (err) {
      console.warn('Error renaming habit:', err);
    }
  }, []);

  const deleteHabit = useCallback(async (id: string) => {
    setHabits((prev) => prev.filter((h) => h._id !== id));
    setEntries((prev) => prev.filter((e) => e.habitId !== id));

    try {
      if (!id.startsWith('h-')) {
        await api.deleteHabit(id);
      }
    } catch (err) {
      console.warn('Error deleting habit:', err);
    }
  }, []);

  const cycleEntry = useCallback(async (habitId: string, date: string) => {
    const existing = entries.find((e) => e.habitId === habitId && e.date === date);
    const currentStatus: HabitStatus = existing?.status || 'none';

    const cycle: Record<HabitStatus, HabitStatus> = {
      none: 'done',
      done: 'missed',
      missed: 'partial',
      partial: 'none',
    };
    const newStatus = cycle[currentStatus];

    if (newStatus === 'none') {
      setEntries((prev) => prev.filter((e) => !(e.habitId === habitId && e.date === date)));
    } else if (existing) {
      setEntries((prev) =>
        prev.map((e) =>
          e.habitId === habitId && e.date === date
            ? { ...e, status: newStatus, note: '' }
            : e
        )
      );
    } else {
      setEntries((prev) => [...prev, { habitId, date, status: newStatus, note: '' }]);
    }

    try {
      if (!habitId.startsWith('h-')) {
        await api.upsertHabitEntry({ habitId, date, status: newStatus });
      }
    } catch (err) {
      console.warn('Error ticking entry:', err);
    }

    return newStatus;
  }, [entries]);

  const updateEntryNote = useCallback(async (habitId: string, date: string, note: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.habitId === habitId && e.date === date ? { ...e, note } : e
      )
    );
    try {
      if (!habitId.startsWith('h-')) {
        await api.upsertHabitEntry({ habitId, date, status: 'partial', note });
      }
    } catch (err) {
      console.warn('Error saving note:', err);
    }
  }, []);

  const getEntry = useCallback(
    (habitId: string, date: string): HabitEntry | undefined => {
      return entries.find((e) => e.habitId === habitId && e.date === date);
    },
    [entries]
  );

  return {
    habits,
    entries,
    loading,
    addHabit,
    renameHabit,
    deleteHabit,
    cycleEntry,
    updateEntryNote,
    getEntry,
  };
}
