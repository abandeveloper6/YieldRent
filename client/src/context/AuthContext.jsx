import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('yieldrent_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('yieldrent_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('yieldrent_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem('yieldrent_user', JSON.stringify(res.data.user));
        }
      } catch {
        // Token invalid or expired
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('yieldrent_token', receivedToken);
      localStorage.setItem('yieldrent_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    return { success: false, message: res.data?.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('yieldrent_token', receivedToken);
      localStorage.setItem('yieldrent_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser };
    }
    return { success: false, message: res.data?.message || 'Registration failed' };
  };

  const demoLogin = async (role = 'farmer') => {
    const res = await api.post(`/auth/demo-login/${role}`);
    if (res.data?.success) {
      const { token: receivedToken, user: receivedUser } = res.data;
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('yieldrent_token', receivedToken);
      localStorage.setItem('yieldrent_user', JSON.stringify(receivedUser));
      return { success: true, user: receivedUser, message: res.data.message };
    }
    return { success: false, message: res.data?.message || 'Demo login failed' };
  };

  const logout = () => {
    localStorage.removeItem('yieldrent_token');
    localStorage.removeItem('yieldrent_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        isOwner: user?.role === 'owner' || user?.role === 'admin',
        isFarmer: user?.role === 'farmer',
        isAdmin: user?.role === 'admin',
        login,
        register,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
