import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../services/api.js';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem('findit_token')) apiRequest('/auth/me').then(data => setUser(data.user)).catch(() => localStorage.removeItem('findit_token')).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  async function login(email, password) { const data = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); localStorage.setItem('findit_token', data.token); setUser(data.user); }
  async function register(name, email, password) { const data = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }); localStorage.setItem('findit_token', data.token); setUser(data.user); }
  function logout() { localStorage.removeItem('findit_token'); setUser(null); }
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { return useContext(AuthContext); }
