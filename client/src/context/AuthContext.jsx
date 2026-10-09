import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('festivo_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('festivo_token'));
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState(null);

  // Check current session & backend status
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Fetch backend health & database status
        const statusRes = await api.get('/status');
        setSystemStatus(statusRes.data);
      } catch (e) {
        console.warn('Backend server status check failed:', e.message);
      }

      const storedToken = localStorage.getItem('festivo_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('festivo_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.warn('Session expired or invalid:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('festivo_token', newToken);
      localStorage.setItem('festivo_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('festivo_token', newToken);
      localStorage.setItem('festivo_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('festivo_token');
    localStorage.removeItem('festivo_user');
  };

  const updateUserProfile = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('festivo_user', JSON.stringify(res.data.user));
      return { success: true, user: res.data.user };
    }
    return { success: false, message: res.data.message };
  };

  const changeUserPassword = async (currentPassword, newPassword) => {
    const res = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    systemStatus,
    login,
    register,
    logout,
    updateUserProfile,
    changeUserPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
