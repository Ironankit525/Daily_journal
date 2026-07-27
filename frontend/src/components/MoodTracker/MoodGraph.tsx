import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { MoodEntry, MoodLabels, MonthData } from '../../types';
import { getDaysInMonth } from '../../utils/dateHelpers';
import MoodDayPicker from './MoodDayPicker';

interface MoodGraphProps {
  monthData: MonthData;
  moods: MoodEntry[];
  labels: MoodLabels;
  loading: boolean;
  onSetMood: (date: string, level: number) => void;
  getMood: (date: string) => MoodEntry | undefined;
  onUpdateLabels: (labels: string[]) => void;
}

const MOOD_COLORS = [
  'var(--color-mood-0)',
  'var(--color-mood-1)',
  'var(--color-mood-2)',
  'var(--color-mood-3)',
  'var(--color-mood-4)',
  'var(--color-mood-5)',
];

interface ChartDataPoint {
  day: number;
  level: number | null;
  label: string;
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length && payload[0].value !== null) {
    return (
      <div
        className="card px-3 py-2 text-xs shadow-lg"
        style={{ border: '1px solid var(--color-border)' }}
      >
        <div className="font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Day {label}
        </div>
        <div style={{ color: 'var(--color-ink-secondary)' }}>
          {payload[0].payload.label}
        </div>
      </div>
    );
  }
  return null;
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  if (payload.level === null || cx === undefined || cy === undefined) return null;

  const colorIdx = payload.level;
  const colors = ['#6B9E78', '#7BA3B8', '#8E8EAA', '#D47B6A', '#B0956E', '#9B6B8E'];

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={colors[colorIdx] || '#2A7F6F'}
      stroke="white"
      strokeWidth={2}
    />
  );
}

export default function MoodGraph({
  monthData,
  moods,
  labels,
  loading,
  onSetMood,
  getMood,
  onUpdateLabels,
}: MoodGraphProps) {
  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);

  const chartData: ChartDataPoint[] = useMemo(() => {
    const monthStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}`;
    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
      const mood = moods.find((m) => m.date === dateStr);
      return {
        day,
        level: mood !== undefined ? mood.level : null,
        label: mood !== undefined ? (labels.labels[mood.level] || '?') : '—',
      };
    });
  }, [daysInMonth, moods, labels, monthData]);

  // Filter out null values for the line (Recharts connects only defined points)
  const hasData = chartData.some((d) => d.level !== null);

  if (loading) {
    return (
      <div className="card p-8 text-center">
        <div className="animate-pulse-soft" style={{ color: 'var(--color-ink-secondary)' }}>
          Loading mood data…
        </div>
      </div>
    );
  }

  return (
    <section className="card overflow-hidden animate-fade-in" id="mood-tracker">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
          Mood
        </h2>
        <EditLabelsButton labels={labels.labels} onSave={onUpdateLabels} />
      </div>

      {/* Graph */}
      <div className="px-2 pb-2" style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: 'var(--color-ink-secondary)' }}
              tickLine={false}
              axisLine={{ stroke: 'var(--color-border)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tickFormatter={(val: number) => labels.labels[val]?.[0] || ''}
              tick={{ fontSize: 10, fill: 'var(--color-ink-secondary)' }}
              tickLine={false}
              axisLine={false}
              width={24}
            />
            <Tooltip content={<CustomTooltip />} />
            {hasData && (
              <Line
                type="monotone"
                dataKey="level"
                stroke="#2A7F6F"
                strokeWidth={2.5}
                dot={<CustomDot />}
                activeDot={{ r: 7, stroke: '#2A7F6F', strokeWidth: 2, fill: 'white' }}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Day picker */}
      <div className="px-4 pb-4">
        <MoodDayPicker
          monthData={monthData}
          moods={moods}
          labels={labels}
          onSetMood={onSetMood}
          getMood={getMood}
        />
      </div>
    </section>
  );
}

// ─── Edit Labels Mini-Component ───
function EditLabelsButton({
  labels,
  onSave,
}: {
  labels: string[];
  onSave: (labels: string[]) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState(labels);

  React.useEffect(() => {
    setValues(labels);
  }, [labels]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost text-[11px] flex items-center gap-1"
      >
        <span>✎</span> Edit scale
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 animate-fade-in">
      <div className="flex gap-1 flex-wrap">
        {values.map((v, i) => (
          <input
            key={i}
            className="input-clean !py-0.5 !px-1.5 text-[11px] w-20"
            value={v}
            onChange={(e) => {
              const next = [...values];
              next[i] = e.target.value;
              setValues(next);
            }}
          />
        ))}
      </div>
      <button
        onClick={() => {
          onSave(values);
          setOpen(false);
        }}
        className="btn-primary text-[11px] !py-1 !px-2"
      >
        Save
      </button>
      <button onClick={() => setOpen(false)} className="btn-ghost text-[11px] !py-1 !px-2">
        ✕
      </button>
    </div>
  );
}
