const API_BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('tt_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${url}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth
  register: (username: string, password: string) =>
    request<any>('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
  login: (username: string, password: string) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  getMe: () => request<any>('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<any>('/auth/change-password', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Habits
  getHabits: (month: string) => request<any[]>(`/habits?month=${month}`),
  createHabit: (name: string, month: string) =>
    request<any>('/habits', { method: 'POST', body: JSON.stringify({ name, month }) }),
  updateHabit: (id: string, data: { name?: string; order?: number }) =>
    request<any>(`/habits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteHabit: (id: string) =>
    request<any>(`/habits/${id}`, { method: 'DELETE' }),
  reorderHabits: (orderedIds: string[]) =>
    request<any>('/habits/reorder/bulk', { method: 'PUT', body: JSON.stringify({ orderedIds }) }),

  // Habit Entries
  getHabitEntries: (month: string) => request<any[]>(`/habit-entries?month=${month}`),
  upsertHabitEntry: (data: { habitId: string; date: string; status: string; note?: string }) =>
    request<any>('/habit-entries', { method: 'PUT', body: JSON.stringify(data) }),
};
