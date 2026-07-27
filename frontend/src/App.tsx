import React, { useState } from 'react';
import JournalSpread from './components/JournalSpread/JournalSpread';
import AuthModal from './components/Auth/AuthModal';
import SettingsModal from './components/Auth/SettingsModal';
import { useHabits } from './hooks/useHabits';
import { useAuth } from './hooks/useAuth';
import { getCurrentMonth } from './utils/dateHelpers';
import type { MonthData } from './types';

export default function App() {
  const [monthData, setMonthData] = useState<MonthData>(getCurrentMonth);
  const [showSettings, setShowSettings] = useState(false);
  const { user, avatar, login, register, logout, changePassword, updateAvatar } = useAuth();

  const {
    habits,
    entries,
    loading: habitsLoading,
    addHabit,
    renameHabit,
    deleteHabit,
    cycleEntry,
  } = useHabits(monthData, user?.id);

  return (
    <div className="min-h-screen pb-12 transition-colors dark bg-[#1C1B19]">
      {/* Show AuthModal if user is not logged in */}
      {!user && (
        <AuthModal
          onLogin={async (u, p) => { await login(u, p); }}
          onRegister={async (u, p) => { await register(u, p); }}
          dark={true}
        />
      )}

      {/* Show SettingsModal when requested by logged-in user */}
      {user && showSettings && (
        <SettingsModal
          user={user}
          avatar={avatar}
          onUpdateAvatar={updateAvatar}
          onChangePassword={changePassword}
          onLogout={logout}
          onClose={() => setShowSettings(false)}
          dark={true}
        />
      )}

      {/* Bullet Journal Spread Component */}
      <JournalSpread
        monthData={monthData}
        onMonthChange={setMonthData}
        habits={habits}
        entries={entries}
        loading={habitsLoading}
        onCycleEntry={cycleEntry}
        onAddHabit={addHabit}
        onRenameHabit={renameHabit}
        onDeleteHabit={deleteHabit}
        dark={true}
        toggleTheme={() => {}}
        user={user}
        avatar={avatar}
        onOpenSettings={() => setShowSettings(true)}
      />
    </div>
  );
}
