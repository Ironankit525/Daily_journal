import React from 'react';
import type { MonthData } from '../types';
import MonthSwitcher from './MonthSwitcher';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  monthData: MonthData;
  onMonthChange: (data: MonthData) => void;
  dark: boolean;
  toggleTheme: () => void;
}

export default function Layout({ children, monthData, onMonthChange, dark, toggleTheme }: LayoutProps) {
  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: dark ? 'rgba(26,26,26,0.85)' : 'rgba(245,243,240,0.85)',
          borderColor: dark ? 'var(--color-border-dark)' : 'var(--color-border)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--color-accent)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13L9 17L19 7" />
              </svg>
            </div>
            <h1
              className="text-lg font-semibold tracking-tight hidden sm:block"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Track & Thrive
            </h1>
          </div>

          <MonthSwitcher monthData={monthData} onChange={onMonthChange} />

          <ThemeToggle dark={dark} toggle={toggleTheme} />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {children}
      </main>
    </div>
  );
}
