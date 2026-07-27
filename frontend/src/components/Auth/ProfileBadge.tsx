import React from 'react';
import type { User } from '../../hooks/useAuth';

interface ProfileBadgeProps {
  user: User;
  avatar: string | null;
  onOpenSettings: () => void;
}

export default function ProfileBadge({ user, avatar, onOpenSettings }: ProfileBadgeProps) {
  return (
    <div
      onClick={onOpenSettings}
      className="flex items-center gap-2 bg-black/5 dark:bg-white/10 px-3 py-1.5 rounded-xs border border-[#1A1A1A]/30 dark:border-white/30 font-kalam cursor-pointer hover:bg-black/10 dark:hover:bg-white/20 transition-colors shadow-xs"
      title="Click for Account Settings (Profile Pic, Change Password, Logout)"
    >
      <div className="w-7 h-7 rounded-full overflow-hidden border border-[#1A1A1A] dark:border-white flex items-center justify-center bg-amber-200 dark:bg-amber-800 text-xs font-bold shadow-xs">
        {avatar ? (
          <img src={avatar} alt={user.username} className="w-full h-full object-cover" />
        ) : (
          <span>{user.username.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <span className="font-bold text-sm truncate max-w-[120px]">
        {user.username}
      </span>

      <span className="text-base opacity-70 hover:opacity-100 ml-0.5">
        ⚙️
      </span>
    </div>
  );
}
