import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface User {
  id: string;
  username: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tt_user_data');
    return saved ? JSON.parse(saved) : null;
  });

  const [avatar, setAvatarState] = useState<string | null>(() => {
    return localStorage.getItem('tt_user_avatar');
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tt_auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then((res) => {
        if (res.user) {
          setUser(res.user);
          localStorage.setItem('tt_user_data', JSON.stringify(res.user));
        }
      })
      .catch(() => {
        localStorage.removeItem('tt_auth_token');
        localStorage.removeItem('tt_user_data');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const res = await api.login(username, password);
    localStorage.setItem('tt_auth_token', res.token);
    localStorage.setItem('tt_user_data', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const res = await api.register(username, password);
    localStorage.setItem('tt_auth_token', res.token);
    localStorage.setItem('tt_user_data', JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('tt_auth_token');
    localStorage.removeItem('tt_user_data');
    setUser(null);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    return api.changePassword(currentPassword, newPassword);
  }, []);

  const updateAvatar = useCallback((base64Image: string | null) => {
    if (base64Image) {
      localStorage.setItem('tt_user_avatar', base64Image);
      setAvatarState(base64Image);
    } else {
      localStorage.removeItem('tt_user_avatar');
      setAvatarState(null);
    }
  }, []);

  return {
    user,
    avatar,
    loading,
    login,
    register,
    logout,
    changePassword,
    updateAvatar,
  };
}
