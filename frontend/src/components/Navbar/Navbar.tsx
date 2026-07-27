import React from 'react';
import type { MonthData } from '../../types';
import { getMonthName } from '../../utils/dateHelpers';
import type { User } from '../../hooks/useAuth';

interface NavbarProps {
  monthData: MonthData;
  onMonthChange: (data: MonthData) => void;
  user: User | null;
  avatar: string | null;
  onOpenSettings: () => void;
}

export default function Navbar({
  monthData,
  onMonthChange,
  user,
  avatar,
  onOpenSettings,
}: NavbarProps) {
  const monthNameUpper = getMonthName(monthData.month).toUpperCase();

  const handlePrevMonth = () => {
    let m = monthData.month - 1;
    let y = monthData.year;
    if (m < 0) {
      m = 11;
      y--;
    }
    onMonthChange({ year: y, month: m });
  };

  const handleNextMonth = () => {
    let m = monthData.month + 1;
    let y = monthData.year;
    if (m > 11) {
      m = 0;
      y++;
    }
    onMonthChange({ year: y, month: m });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 px-2 select-none">
      {/* App Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-wide font-kalam text-[#E5DFD5]">
          📖 Daily Bullet Journal
        </h1>
      </div>

      {/* Sleek Pill Navbar Container matching exact screenshot UI */}
      <div className="bg-[#242424] border border-[#3A3A3A] rounded-xl p-1.5 px-2.5 inline-flex items-center gap-3 shadow-lg text-white">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-8 h-8 flex items-center justify-center bg-[#363636] hover:bg-[#484848] active:scale-95 transition-all rounded-lg cursor-pointer text-[#CCCCCC] font-bold text-sm"
          title="Previous Month"
        >
          ‹
        </button>

        {/* Center Month Year text */}
        <span className="font-bold tracking-widest text-xs sm:text-sm text-[#EEEEEE] font-sans px-1 min-w-[120px] text-center">
          {monthNameUpper} {monthData.year}
        </span>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center bg-[#363636] hover:bg-[#484848] active:scale-95 transition-all rounded-lg cursor-pointer text-[#CCCCCC] font-bold text-sm"
          title="Next Month"
        >
          ›
        </button>

        {/* Profile Avatar Button following exact same UI (#363636 rounded-lg square) */}
        {user && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="w-8 h-8 flex items-center justify-center bg-[#363636] hover:bg-[#484848] active:scale-95 transition-all rounded-lg cursor-pointer overflow-hidden border border-[#444] text-[#CCCCCC] font-bold text-xs shadow-xs"
            title={`Account Settings (${user.username})`}
          >
            {avatar ? (
              <img src={avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <span>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
