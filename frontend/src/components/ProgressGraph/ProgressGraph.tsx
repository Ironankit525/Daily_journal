import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import type { MonthData, Habit, HabitEntry } from '../../types';
import { getDaysInMonth, getMonthName } from '../../utils/dateHelpers';

interface ProgressGraphProps {
  monthData: MonthData;
  habits: Habit[];
  entries: HabitEntry[];
}

export default function ProgressGraph({ monthData, habits, entries }: ProgressGraphProps) {
  const daysInMonth = getDaysInMonth(monthData.year, monthData.month);
  const monthStr = `${monthData.year}-${String(monthData.month + 1).padStart(2, '0')}`;
  const monthNameShort = getMonthName(monthData.month).substring(0, 3).toUpperCase();

  const getLabelForPercent = (pct: number) => {
    if (pct >= 90) return 'All Done';
    if (pct >= 70) return 'Great';
    if (pct >= 50) return 'Good';
    if (pct >= 30) return 'Moderate';
    if (pct > 0) return 'Low';
    return 'None';
  };

  const chartData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;

    if (habits.length === 0) {
      return { day, percent: 0, label: 'None', dateStr };
    }

    let hasData = false;
    let doneCount = 0;

    habits.forEach((h) => {
      const entry = entries.find((e) => e.habitId === h._id && e.date === dateStr);
      if (entry && entry.status !== 'none') {
        hasData = true;
        if (entry.status === 'done') doneCount += 1;
        if (entry.status === 'partial') doneCount += 0.5;
      }
    });

    const percent = hasData ? Math.min(100, Math.round((doneCount / habits.length) * 100)) : 0;
    return {
      day,
      percent,
      label: getLabelForPercent(percent),
      dateStr,
      hasData,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#23272E]/95 border border-[#454C59] p-2.5 sm:px-4 sm:py-2.5 rounded-xl shadow-2xl font-sans backdrop-blur-md text-white text-[11px] sm:text-xs z-50">
          <div className="text-gray-400 font-semibold mb-0.5 tracking-wider">
            DATE: <span className="text-white font-bold">{monthNameShort} {data.day}</span>
          </div>
          <div className="text-gray-300 font-medium">
            RATE: <span className="text-amber-400 font-bold">{data.percent}% ({data.label})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-6 sm:mt-8 bg-[#2A2E37] border border-[#3E4450] rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl font-sans text-white relative select-none">
      {/* Header Bar matching reference image */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-xs sm:text-base font-bold tracking-wider text-gray-200 uppercase truncate">
          DAILY PROGRESS GRAPH (AUTOMATICALLY GENERATED FROM TRACKER DATA)
        </h3>
      </div>

      {/* Responsive Graph Container Height */}
      <div className="w-full h-52 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#3A404D"
              vertical={false}
            />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={{ stroke: '#3A404D' }}
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
              interval="preserveStartEnd"
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(val) => `${val}%`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 500 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="percent"
              stroke="#F97316"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorGradient)"
              activeDot={{
                r: 6,
                fill: '#FFFFFF',
                stroke: '#F97316',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
