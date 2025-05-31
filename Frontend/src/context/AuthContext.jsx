import { createContext, useContext, useState } from 'react';
import { useApi } from '../hooks/useAPI';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { fetchData, loading, error } = useApi();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (credentials) => {
    const data = await fetchData('http://127.0.0.1:8000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    setUser(data);
    setIsAuthenticated(true);
    return data;
  };

  const signup = async (userData) => {
    const data = await fetchData('http://127.0.0.1:8000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    setUser(data);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    await fetchData('http://127.0.0.1:8000/api/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};