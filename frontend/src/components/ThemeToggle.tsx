import React from 'react';

interface ThemeToggleProps {
  dark: boolean;
  toggle: () => void;
}

export default function ThemeToggle({ dark, toggle }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        background: dark ? 'var(--color-card-dark)' : 'var(--color-card)',
        border: `1px solid ${dark ? 'var(--color-border-dark)' : 'var(--color-border)'}`,
      }}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="text-lg transition-transform duration-300" style={{ transform: dark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        {dark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}
