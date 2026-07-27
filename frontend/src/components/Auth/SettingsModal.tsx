import React, { useState, useRef } from 'react';
import type { User } from '../../hooks/useAuth';

interface SettingsModalProps {
  user: User;
  avatar: string | null;
  onUpdateAvatar: (base64: string | null) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onLogout: () => void;
  onClose: () => void;
  dark: boolean;
}

export default function SettingsModal({
  user,
  avatar,
  onUpdateAvatar,
  onChangePassword,
  onLogout,
  onClose,
  dark,
}: SettingsModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdateAvatar(result);
        setSuccess('✓ Profile picture updated in local cache!');
        setTimeout(() => setSuccess(''), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword.trim() || !newPassword.trim()) {
      setError('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await onChangePassword(currentPassword, newPassword);
      setSuccess('✓ Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-kalam"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF5EC] dark:bg-[#25221C] border-2 border-[#1A1A1A] dark:border-[#666] p-6 max-w-md w-full rounded-xs shadow-2xl text-[#1A1A1A] dark:text-[#E5DFD5] relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] dark:border-[#555] pb-2 mb-4">
          <h2 className="text-2xl font-bold">⚙️ Account Settings</h2>
          <button
            onClick={onClose}
            className="text-[#1A1A1A] dark:text-white font-bold hover:text-red-500 px-2"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/40 border border-red-500 text-red-700 dark:text-red-300 text-sm font-bold rounded">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="mb-3 p-2 bg-green-100 dark:bg-green-900/40 border border-green-500 text-green-700 dark:text-green-300 text-sm font-bold rounded">
            {success}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between p-3 bg-black/5 dark:bg-white/5 border border-[#1A1A1A]/20 dark:border-white/20 rounded-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#1A1A1A] dark:border-white flex items-center justify-center bg-amber-200 dark:bg-amber-800 text-xl font-bold shadow">
                {avatar ? (
                  <img src={avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span>{user.username.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div>
                <span className="font-bold text-lg block">{user.username}</span>
                <span className="text-xs opacity-60">Profile picture cached locally</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-[#1A1A1A] dark:bg-[#E5DFD5] text-[#FAF5EC] dark:text-[#1A1A1A] text-xs font-bold rounded-xs hover:opacity-90"
            >
              🖼️ Change Pic
            </button>
          </div>

          <div className="p-3 bg-black/5 dark:bg-white/5 border border-[#1A1A1A]/20 dark:border-white/20 rounded-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-base block">🔑 Security</span>
                <span className="text-xs opacity-60">Update your account password</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setError('');
                }}
                className="px-3 py-1 border border-[#1A1A1A] dark:border-white text-xs font-bold rounded-xs hover:bg-black/10"
              >
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordSubmit} className="mt-3 pt-3 border-t border-dashed border-[#1A1A1A]/30 dark:border-white/30 flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-[#1A1A1A] dark:border-[#555] px-2.5 py-1 outline-none text-xs rounded-xs font-kalam"
                  required
                />
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-[#1A1A1A] dark:border-[#555] px-2.5 py-1 outline-none text-xs rounded-xs font-kalam"
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white dark:bg-black/40 border border-[#1A1A1A] dark:border-[#555] px-2.5 py-1 outline-none text-xs rounded-xs font-kalam"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full py-1 bg-[#1A1A1A] dark:bg-[#E5DFD5] text-[#FAF5EC] dark:text-[#1A1A1A] text-xs font-bold rounded-xs hover:opacity-90"
                >
                  {loading ? 'Updating...' : 'Save New Password'}
                </button>
              </form>
            )}
          </div>

          <div className="pt-2 border-t border-dashed border-[#1A1A1A]/30 dark:border-white/30 flex justify-end">
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-sm font-bold rounded-xs shadow flex items-center gap-1"
            >
              <span>🚪 Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
