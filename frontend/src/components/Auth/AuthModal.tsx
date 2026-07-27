import React, { useState } from 'react';

interface AuthModalProps {
  onLogin: (username: string, password: string) => Promise<void>;
  onRegister: (username: string, password: string) => Promise<void>;
  dark: boolean;
}

export default function AuthModal({ onLogin, onRegister, dark }: AuthModalProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(username.trim(), password.trim());
      } else {
        await onLogin(username.trim(), password.trim());
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-kalam">
      <div className="bg-[#FAF5EC] dark:bg-[#25221C] border-2 border-[#1A1A1A] dark:border-[#666] p-6 sm:p-8 max-w-md w-full rounded-xs shadow-2xl text-[#1A1A1A] dark:text-[#E5DFD5]">
        
        <div className="text-center mb-6 border-b-2 border-[#1A1A1A] dark:border-[#555] pb-3">
          <h2 className="text-3xl font-bold tracking-wide">
            {isRegister ? '📝 Create Account' : '🔑 Sign In'}
          </h2>
          <p className="text-sm opacity-70 mt-1">
            Personal Bullet Journal Tracker
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/40 border border-red-500 text-red-700 dark:text-red-300 text-sm font-bold rounded">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Username</label>
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border-2 border-[#1A1A1A] dark:border-[#555] px-3 py-2 outline-none font-kalam text-base rounded-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-black/40 border-2 border-[#1A1A1A] dark:border-[#555] px-3 py-2 outline-none font-kalam text-base rounded-xs"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 bg-[#1A1A1A] dark:bg-[#E5DFD5] text-[#FAF5EC] dark:text-[#1A1A1A] font-bold text-lg rounded-xs hover:opacity-90 transition-opacity"
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm border-t border-dashed border-[#1A1A1A]/30 dark:border-white/30 pt-4">
          <span className="opacity-70">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
          </span>{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="font-bold underline hover:text-amber-700 dark:hover:text-amber-400 ml-1"
          >
            {isRegister ? 'Sign In' : 'Create One'}
          </button>
        </div>

      </div>
    </div>
  );
}
