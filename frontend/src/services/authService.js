import { apiClient } from './api';
import { USE_MOCK } from './config';
import { mockLoginResponse, mockUsers } from './mockData';

const TOKEN_KEY = 'eduflow_token';
const USER_KEY = 'eduflow_user';

export async function login(email, password) {
  if (USE_MOCK) {
    const user = mockUsers.find(
      (mockUser) => mockUser.email === email.trim().toLowerCase(),
    );

    if (!user || !password) {
      throw new Error('Invalid email or password.');
    }

    return mockLoginResponse(user);
  }

  const response = await apiClient.post('/auth/login', {
    email,
    password,
  });

  return response.data;
}

export function saveSession(session) {
  localStorage.setItem(TOKEN_KEY, session.token);
  localStorage.setItem(USER_KEY, JSON.stringify(session.user));
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getCurrentUser() {
  const user = localStorage.getItem(USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    logout();
    return null;
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
