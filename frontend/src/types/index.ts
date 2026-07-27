export type HabitStatus = 'done' | 'missed' | 'partial' | 'none';

export interface Habit {
  _id: string;
  name: string;
  order: number;
  month: string;
}

export interface HabitEntry {
  _id?: string;
  habitId: string;
  date: string;
  status: HabitStatus;
  note: string;
}

export interface MoodEntry {
  _id?: string;
  date: string;
  level: number;
}

export interface MoodLabels {
  _id?: string;
  labels: string[];
}

export interface GoalNote {
  _id?: string;
  month: string;
  goals: string[];
  notes: string;
}

export interface MonthData {
  year: number;
  month: number; // 0-indexed (JS Date style)
}
