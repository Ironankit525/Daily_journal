import React, { useState } from 'react';

interface ChangePasswordModalProps {
  onClose: () => void;
  onChangePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  dark: boolean;
}

export default function ChangePasswordModal({ onClose, onChangePassword, dark }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-kalam">
      <div
        className="bg-[#FAF5EC] dark:bg-[#25221C] border-2 border-[#1A1A1A] dark:border-[#666] p-6 max-w-md w-full rounded-xs shadow-2xl text-[#1A1A1A] dark:text-[#E5DFD5] relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] dark:border-[#555] pb-2 mb-4">
          <h2 className="text-2xl font-bold">🔑 Change Password</h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-bold mb-1">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password..."
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-[#1A1A1A] dark:border-[#555] px-3 py-1.5 outline-none font-kalam text-sm rounded-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-[#1A1A1A] dark:border-[#555] px-3 py-1.5 outline-none font-kalam text-sm rounded-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="Re-enter new password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border border-[#1A1A1A] dark:border-[#555] px-3 py-1.5 outline-none font-kalam text-sm rounded-xs"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-dashed border-[#1A1A1A]/30 dark:border-white/30">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border border-[#1A1A1A] dark:border-[#777] text-sm font-bold rounded-xs hover:bg-black/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1 bg-[#1A1A1A] dark:bg-[#E5DFD5] text-[#FAF5EC] dark:text-[#1A1A1A] text-sm font-bold rounded-xs hover:opacity-90"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
