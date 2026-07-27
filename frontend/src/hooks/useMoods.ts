import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { MoodEntry, MoodLabels, MonthData } from '../types';
import { formatMonth } from '../utils/dateHelpers';

export function useMoods(monthData: MonthData) {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [labels, setLabels] = useState<MoodLabels>({
    labels: ['Happy', 'Neutral', 'Sad', 'Stressed', 'Tired', 'Overwhelmed'],
  });
  const [loading, setLoading] = useState(true);

  const month = formatMonth(monthData);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [m, l] = await Promise.all([
        api.getMoods(month),
        api.getMoodLabels(),
      ]);
      setMoods(m);
      setLabels(l);
    } catch (err) {
      console.error('Failed to fetch moods:', err);
    } finally {
      setLoading(false);
    }
  }, [month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const setMood = useCallback(async (date: string, level: number) => {
    const existing = moods.find((m) => m.date === date);

    // If clicking the same level, deselect
    if (existing && existing.level === level) {
      setMoods((prev) => prev.filter((m) => m.date !== date));
      try {
        await api.upsertMood({ date, level: -1 });
      } catch (err) {
        console.error('Failed to delete mood:', err);
        fetchData();
      }
      return;
    }

    // Optimistic update
    if (existing) {
      setMoods((prev) => prev.map((m) => (m.date === date ? { ...m, level } : m)));
    } else {
      setMoods((prev) => [...prev, { date, level }]);
    }

    try {
      await api.upsertMood({ date, level });
    } catch (err) {
      console.error('Failed to update mood:', err);
      fetchData();
    }
  }, [moods, fetchData]);

  const updateLabels = useCallback(async (newLabels: string[]) => {
    setLabels({ ...labels, labels: newLabels });
    try {
      await api.updateMoodLabels(newLabels);
    } catch (err) {
      console.error('Failed to update labels:', err);
      fetchData();
    }
  }, [labels, fetchData]);

  const getMood = useCallback(
    (date: string): MoodEntry | undefined => {
      return moods.find((m) => m.date === date);
    },
    [moods]
  );

  return { moods, labels, loading, setMood, getMood, updateLabels };
}
