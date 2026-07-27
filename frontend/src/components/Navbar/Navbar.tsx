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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 px-1 sm:px-2 select-none">
      {/* App Title */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide font-kalam text-[#E5DFD5]">
          📖 Daily Bullet Journal
        </h1>

        {/* Mobile Profile Quick Trigger if user is logged in */}
        {user && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="sm:hidden w-9 h-9 flex items-center justify-center bg-[#242424] hover:bg-[#363636] active:scale-95 transition-all rounded-xl cursor-pointer overflow-hidden border border-[#444] text-[#CCCCCC] font-bold text-xs shadow-md"
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

      {/* Sleek Mobile & Desktop Pill Navbar Container */}
      <div className="w-full sm:w-auto bg-[#242424] border border-[#3A3A3A] rounded-xl p-1.5 px-3 flex items-center justify-between sm:justify-start gap-3 shadow-lg text-white">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrevMonth}
          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center bg-[#363636] hover:bg-[#484848] active:scale-90 transition-all rounded-lg cursor-pointer text-[#CCCCCC] font-bold text-base sm:text-sm"
          title="Previous Month"
        >
          ‹
        </button>

        {/* Center Month Year text */}
        <span className="font-bold tracking-widest text-xs sm:text-sm text-[#EEEEEE] font-sans px-2 min-w-[120px] text-center flex-1 sm:flex-none">
          {monthNameUpper} {monthData.year}
        </span>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNextMonth}
          className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center bg-[#363636] hover:bg-[#484848] active:scale-90 transition-all rounded-lg cursor-pointer text-[#CCCCCC] font-bold text-base sm:text-sm"
          title="Next Month"
        >
          ›
        </button>

        {/* Desktop Profile Avatar Button */}
        {user && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="hidden sm:flex w-8 h-8 items-center justify-center bg-[#363636] hover:bg-[#484848] active:scale-95 transition-all rounded-lg cursor-pointer overflow-hidden border border-[#444] text-[#CCCCCC] font-bold text-xs shadow-xs"
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
