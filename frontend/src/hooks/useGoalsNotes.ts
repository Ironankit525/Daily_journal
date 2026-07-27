import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../api/client';
import type { GoalNote, MonthData } from '../types';
import { formatMonth } from '../utils/dateHelpers';

export function useGoalsNotes(monthData: MonthData) {
  const [data, setData] = useState<GoalNote>({ month: '', goals: [], notes: '' });
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const month = formatMonth(monthData);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const d = await api.getGoalsNotes(month);
        setData({ ...d, month });
      } catch (err) {
        console.error('Failed to fetch goals/notes:', err);
        setData({ month, goals: [], notes: '' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month]);

  const save = useCallback(
    (updated: Partial<GoalNote>) => {
      const newData = { ...data, ...updated, month };
      setData(newData);

      // Debounced save
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        try {
          await api.upsertGoalsNotes({
            month,
            goals: newData.goals,
            notes: newData.notes,
          });
        } catch (err) {
          console.error('Failed to save goals/notes:', err);
        }
      }, 500);
    },
    [data, month]
  );

  const addGoal = useCallback(
    (goal: string) => {
      save({ goals: [...data.goals, goal] });
    },
    [data.goals, save]
  );

  const removeGoal = useCallback(
    (index: number) => {
      save({ goals: data.goals.filter((_, i) => i !== index) });
    },
    [data.goals, save]
  );

  const updateGoal = useCallback(
    (index: number, text: string) => {
      const newGoals = [...data.goals];
      newGoals[index] = text;
      save({ goals: newGoals });
    },
    [data.goals, save]
  );

  const updateNotes = useCallback(
    (notes: string) => {
      save({ notes });
    },
    [save]
  );

  return { data, loading, addGoal, removeGoal, updateGoal, updateNotes };
}
