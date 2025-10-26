import { API_BASE_URL } from './api';

export async function getRecentActivity(limit = 10) {
  const response = await fetch(`${API_BASE_URL}/user/activity?limit=${limit}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch recent activity');
  return await response.json();
}
