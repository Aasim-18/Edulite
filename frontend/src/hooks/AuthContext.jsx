import { createContext, useContext, useMemo, useState } from 'react';
import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  saveSession,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  async function login(email, password) {
    const session = await loginUser(email, password);
    saveSession(session);
    setUser(session.user);
    return session.user;
  }

  function logout() {
    logoutUser();
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
