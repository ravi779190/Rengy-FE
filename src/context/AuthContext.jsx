import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { setAccessToken, registerLogoutHandler } from '../api/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const logout = useCallback(async () => {
    setUser(null);
    setAccessToken(null);
    try {
      await api.post('/api/auth/logout');
    } catch {
      // best effort — the cookie will expire anyway
    }
  }, []);

  useEffect(() => {
    registerLogoutHandler(() => setUser(null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    api
      .post('/api/auth/refresh')
      .then(async ({ data }) => {
        setAccessToken(data.accessToken);
        const me = await api.get('/api/auth/me');
        if (!cancelled) setUser(me.data.user);
      })
      .catch(() => {
        // no valid session
      })
      .finally(() => {
        if (!cancelled) setInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  const signup = useCallback(async (email, password, name) => {
    const { data } = await api.post('/api/auth/signup', { email, password, name });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }, []);

  return (
    <AuthContext.Provider value={{ user, initializing, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
